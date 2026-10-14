import type { NextRequest } from "next/server";
import { db, dbConfigured } from "@/lib/db";
import { books } from "@/content/books";
import { getManifest, libraryLangs, resolveBookLang } from "@/lib/library";
import { pickLocalized } from "@/lib/i18n";
import { emailHtml } from "@/lib/email-layout";
import { mailConfigured, sendMail } from "@/lib/mail";
import { fail, json } from "@/lib/reader/http";
import type { SupportedLocale } from "@/lib/get-locale";

export const dynamic = "force-dynamic";

// POST, заголовок x-notify-secret = NOTIFY_SECRET. Вызывается после выкладки новой
// версии библиотеки (godacademy → reader-sync). Сравнивает главы с журналом notify_log
// и пишет подписчикам о новых. Первый запуск только заполняет журнал, ничего не шлёт.
const COPY: Record<string, { subject: (b: string) => string; lead: string; cta: string; unsub: string; title: string; footer: string; unsubLink: string; chapter: string }> = {
  ru: { subject: (b) => `Новые главы: ${b}`, lead: "В книге вышли новые главы:", cta: "Читать", unsub: "Отписаться можно в кабинете", title: "Новые главы", footer: "Письмо пришло, потому что вы подписаны на новые главы.", unsubLink: "Отписаться", chapter: "Глава" },
  en: { subject: (b) => `New chapters: ${b}`, lead: "New chapters are out:", cta: "Read", unsub: "Unsubscribe in your account", title: "New chapters", footer: "You’re getting this because you subscribed to new chapters.", unsubLink: "Unsubscribe", chapter: "Chapter" },
  pt: { subject: (b) => `Novos capítulos: ${b}`, lead: "Saíram novos capítulos:", cta: "Ler", unsub: "Cancele a inscrição na sua conta", title: "Novos capítulos", footer: "Você recebeu este e-mail porque se inscreveu para novos capítulos.", unsubLink: "Cancelar inscrição", chapter: "Capítulo" },
  es: { subject: (b) => `Nuevos capítulos: ${b}`, lead: "Hay capítulos nuevos:", cta: "Leer", unsub: "Cancela la suscripción en tu cuenta", title: "Capítulos nuevos", footer: "Recibe este correo porque se suscribió a capítulos nuevos.", unsubLink: "Darse de baja", chapter: "Capítulo" },
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
      const html = chaptersEmail(c, ui, title, list.map((ch) => ({ title: ch.title, href: `${site}/${lang}/read/${b.slug}/${ch.id}` })), `${site}/${ui}/account`);
      if (await sendMail(s.email as string, c.subject(title), text, html)) sent++;
    }
  }
  // Подписчики без аккаунта (подтверждённые): все книги на их языке, отписка по токену.
  const list = await sql`SELECT email, lang, token FROM subscribers WHERE status = 'confirmed'`;
  for (const s of list) {
    const ui = (s.lang as string) || "en";
    const c = COPY[ui] ?? COPY.en;
    for (const b of books) {
      const lang = resolveBookLang(b.slug, ui as SupportedLocale);
      const added = lang ? fresh.get(`${b.slug}|${lang}`) : undefined;
      if (!added) continue;
      const title = pickLocalized(b.titles, ui as SupportedLocale);
      const lines = added.map((ch) => `• ${ch.title} — ${site}/${lang}/read/${b.slug}/${ch.id}`).join("\n");
      const unsub = `${site}/api/subscribe/unsubscribe?t=${s.token}`;
      const text = `${c.lead}\n\n${lines}\n\n${c.unsubLink}: ${unsub}`;
      const html = chaptersEmail(c, ui, title, added.map((ch) => ({ title: ch.title, href: `${site}/${lang}/read/${b.slug}/${ch.id}` })), unsub);
      if (await sendMail(s.email as string, c.subject(title), text, html)) sent++;
    }
  }
  return json({ sent, subscribers: subs.length + list.length, newChapters: [...fresh.values()].reduce((n, l) => n + l.length, 0), mail: mailConfigured() });
}

/** HTML письма о новых главах: заголовок книги, главы ссылками, кнопка на первую. */
function chaptersEmail(c: (typeof COPY)[string], lang: string, book: string, chapters: { title: string; href: string }[], unsub: string): string {
  return emailHtml({
    lang,
    preheader: `${c.lead} ${chapters.map((ch) => ch.title).join(", ")}`.slice(0, 140),
    title: `${c.title}: ${book}`,
    blocks: [
      { kind: "p", text: c.lead },
      { kind: "links", items: chapters.map((ch) => ({ title: ch.title, href: ch.href, meta: book })) },
      { kind: "button", label: c.cta, href: chapters[0].href },
    ],
    footer: { text: c.footer, link: { label: c.unsubLink, href: unsub } },
  });
}
