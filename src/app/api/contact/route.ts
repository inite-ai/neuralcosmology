import { getBookBySlug } from "@/content/books";
import { rememberContact } from "@/lib/audience.server";
import type { NextRequest } from "next/server";
import { db, dbConfigured } from "@/lib/db";
import { emailHtml } from "@/lib/email-layout";
import { isSupportedLocale } from "@/lib/get-locale";
import { ipOf, limiter, sameOrigin } from "@/lib/guard";
import { sendMail } from "@/lib/mail";
import { clip, fail, json } from "@/lib/reader/http";
import { validEmail } from "@/lib/subscribe";

export const dynamic = "force-dynamic";

// POST { name, email, message, kind?, book?, lang? } — обращение автору. Сначала строка
// в inquiries, потом письмо: потерянное письмо больше не значит потерянное обращение.
// «Отправлено» говорим, только если сохранилось или ушло. company — ловушка для ботов.
const KINDS = ["contact", "rights", "press"] as const;
const allow = limiter(5, 600_000);
const CONTACT_EMAIL = () => process.env.CONTACT_EMAIL || "info@neuralcosmology.com";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("forbidden", 403);
  if (!allow(ipOf(req))) return fail("rate_limited", 429);
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (clip(b.company, 100)) return json({ success: true });
  const name = clip(b.name, 120).replace(/[\r\n]+/g, " ");
  const email = clip(b.email, 254).toLowerCase();
  const kind = KINDS.find((k) => k === b.kind) ?? "contact";
  // Запрос прав (/[locale]/rights): издательство и территория ложатся в начало
  // сообщения, отдельных колонок для них нет. Само сообщение там необязательно.
  const extra = kind === "rights"
    ? [["Publisher", clip(b.publisher, 120)], ["Territory", clip(b.territory, 120)]].filter(([, v]) => v).map(([k, v]) => `${k}: ${v.replace(/[\r\n]+/g, " ")}`)
    : [];
  const message = [extra.join("\n"), clip(b.message, 8000)].filter(Boolean).join("\n\n") || (kind === "rights" ? "Rights inquiry" : "");
  if (!name || !message) return fail("fields_required", 400);
  if (!validEmail(email)) return fail("invalid_email", 400);
  const book = getBookBySlug(clip(b.book, 60)) ? clip(b.book, 60) : null;
  const lang = isSupportedLocale(String(b.lang)) ? String(b.lang) : null;

  let stored = false;
  if (dbConfigured()) {
    try {
      const sql = await db();
      await sql`INSERT INTO inquiries (kind, name, email, message, book, lang) VALUES (${kind}, ${name}, ${email}, ${message}, ${book}, ${lang})`;
      stored = true;
      void rememberContact({ email, name, lang, source: `enquiry:${kind}` });
    } catch (err) {
      console.error("[contact] not stored:", err instanceof Error ? err.message : err);
    }
  }
  const text = `${name} <${email}>\n${[kind, book, lang].filter(Boolean).join(" · ")}\n\n${message}`;
  const html = emailHtml({
    lang: "ru",
    preheader: message.slice(0, 140),
    title: `${kind}: ${name}`,
    blocks: [{ kind: "p", text: [email, book, lang].filter(Boolean).join(" · ") }, ...message.split(/\n{2,}/).map((p) => ({ kind: "p" as const, text: p }))],
    footer: { text: "neuralcosmology.com" },
  });
  const sent = await sendMail(CONTACT_EMAIL(), `Neural Cosmology · ${kind}: ${name}`, text, html, { replyTo: email, fromName: `${name} via neuralcosmology.com` });
  return stored || sent ? json({ success: true }) : fail("not_delivered", 503);
}
