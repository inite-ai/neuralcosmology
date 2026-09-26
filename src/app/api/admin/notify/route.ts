import type { NextRequest } from "next/server";
import { db, dbConfigured } from "@/lib/db";
import { books } from "@/content/books";
import { getManifest, libraryLangs, resolveBookLang } from "@/lib/library";
import { pickLocalized } from "@/lib/i18n";
import { mailConfigured, sendMail } from "@/lib/mail";
import { fail, json } from "@/lib/reader/http";
import type { SupportedLocale } from "@/lib/get-locale";

export const dynamic = "force-dynamic";

// POST, заголовок x-notify-secret = NOTIFY_SECRET. Вызывается после выкладки новой
// версии библиотеки (godacademy → reader-sync). Сравнивает главы с журналом notify_log
// и пишет подписчикам о новых. Первый запуск только заполняет журнал, ничего не шлёт.
const COPY: Record<string, { subject: (b: string) => string; lead: string; cta: string; unsub: string }> = {
  ru: { subject: (b) => `Новые главы: ${b}`, lead: "В книге вышли новые главы:", cta: "Читать", unsub: "Отписаться можно в кабинете" },
  en: { subject: (b) => `New chapters: ${b}`, lead: "New chapters are out:", cta: "Read", unsub: "Unsubscribe in your account" },
  pt: { subject: (b) => `Novos capítulos: ${b}`, lead: "Saíram novos capítulos:", cta: "Ler", unsub: "Cancele a inscrição na sua conta" },
  es: { subject: (b) => `Nuevos capítulos: ${b}`, lead: "Hay capítulos nuevos:", cta: "Leer", unsub: "Cancela la suscripción en tu cuenta" },
};

export async function POST(req: NextRequest) {
  const secret = process.env.NOTIFY_SECRET;
  if (!secret || req.headers.get("x-notify-secret") !== secret) return fail("forbidden", 403);
  if (!dbConfigured()) return fail("storage_unavailable", 503);
  const sql = await db();
  const site = "https://neuralcosmology.com";

  // Новые главы по книге и языку.
  const fresh = new Map<string, { id: string; title: string }[]>();
  for (const b of books) {
    for (const lang of libraryLangs(b.slug)) {
      const chapters = getManifest(b.slug, lang)?.chapters ?? [];
      const logged = new Set((await sql`SELECT chapter FROM notify_log WHERE book = ${b.slug} AND lang = ${lang}`).map((r) => r.chapter as string));
      const firstRun = logged.size === 0;
      const added = chapters.filter((c) => !logged.has(c.id));
      for (const c of added) await sql`INSERT INTO notify_log (book, lang, chapter) VALUES (${b.slug}, ${lang}, ${c.id}) ON CONFLICT DO NOTHING`;
      if (!firstRun && added.length) fresh.set(`${b.slug}|${lang}`, added.map((c) => ({ id: c.id, title: c.title })));
    }
  }
  if (!fresh.size) return json({ sent: 0, newChapters: 0 });

  const subs = await sql`SELECT email, notify_books, lang FROM reader_prefs WHERE notify AND email IS NOT NULL`;
  let sent = 0;
  for (const s of subs) {
    const ui = (s.lang as string) || "ru";
    const c = COPY[ui] ?? COPY.en;
    for (const b of books) {
      if ((s.notify_books as string[]).length && !(s.notify_books as string[]).includes(b.slug)) continue;
      const lang = resolveBookLang(b.slug, ui as SupportedLocale);
      const list = lang ? fresh.get(`${b.slug}|${lang}`) : undefined;
      if (!list) continue;
      const title = pickLocalized(b.titles, ui as SupportedLocale);
      const lines = list.map((ch) => `• ${ch.title} — ${site}/${lang}/read/${b.slug}/${ch.id}`).join("\n");
      const text = `${c.lead}\n\n${lines}\n\n${c.unsub}: ${site}/${ui}/account`;
      if (await sendMail(s.email as string, c.subject(title), text)) sent++;
    }
  }
  return json({ sent, subscribers: subs.length, newChapters: [...fresh.values()].reduce((n, l) => n + l.length, 0), mail: mailConfigured() });
}
