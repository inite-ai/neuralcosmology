import "server-only";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { mailConfigured, sendMail } from "@/lib/mail";
import type { SupportedLocale } from "@/lib/get-locale";

// Подписка на новые главы и опыты без аккаунта. Двойное подтверждение: письмо со
// ссылкой, адрес становится confirmed только после неё. Пока почта не настроена,
// адрес лежит в pending; POST /api/admin/subscribers рассылает подтверждения позже.

const SITE = "https://neuralcosmology.com";

const COPY: Record<SupportedLocale, { subject: string; body: (confirm: string, unsub: string) => string }> = {
  ru: {
    subject: "Подтвердите подписку на Нейронную космологию",
    body: (c, u) => `Здравствуйте!\n\nВы оставили этот адрес на neuralcosmology.com. Подтвердите подписку, и я буду писать, когда выходят новые главы и опыты, не чаще раза в неделю:\n\n${c}\n\nЕсли это были не вы, просто не отвечайте. Отписаться можно в любой момент: ${u}\n\nМихаил Савченко`,
  },
  en: {
    subject: "Confirm your Neural Cosmology subscription",
    body: (c, u) => `Hello,\n\nYou left this address on neuralcosmology.com. Confirm the subscription and I will write when new chapters and experiments come out, at most once a week:\n\n${c}\n\nIf this wasn’t you, just ignore this email. Unsubscribe any time: ${u}\n\nMikhail Savchenko`,
  },
  pt: {
    subject: "Confirme a sua inscrição na Cosmologia Neural",
    body: (c, u) => `Olá!\n\nVocê deixou este endereço em neuralcosmology.com. Confirme a inscrição e eu escreverei quando saírem novos capítulos e experimentos, no máximo uma vez por semana:\n\n${c}\n\nSe não foi você, ignore este e-mail. Cancele quando quiser: ${u}\n\nMikhail Savchenko`,
  },
  es: {
    subject: "Confirme su suscripción a Cosmología Neural",
    body: (c, u) => `¡Hola!\n\nDejó esta dirección en neuralcosmology.com. Confirme la suscripción y le escribiré cuando salgan capítulos y experimentos nuevos, como mucho una vez por semana:\n\n${c}\n\nSi no fue usted, ignore este correo. Puede darse de baja cuando quiera: ${u}\n\nMikhail Savchenko`,
  },
};

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
export const validEmail = (e: string) => EMAIL.test(e);

export async function sendConfirmation(email: string, lang: SupportedLocale, token: string): Promise<boolean> {
  const c = COPY[lang] ?? COPY.en;
  const confirm = `${SITE}/api/subscribe/confirm?t=${token}`;
  const unsub = `${SITE}/api/subscribe/unsubscribe?t=${token}`;
  return sendMail(email, c.subject, c.body(confirm, unsub));
}

/** Новая или повторная подписка. Возвращает статус, который видит читатель. */
export async function subscribe(email: string, lang: SupportedLocale, book: string | null, source: string | null): Promise<"sent" | "saved" | "already"> {
  const sql = await db();
  const token = randomBytes(18).toString("base64url");
  const [row] = await sql`
    INSERT INTO subscribers (email, lang, book, source, token)
    VALUES (${email}, ${lang}, ${book}, ${source}, ${token})
    ON CONFLICT (email) DO UPDATE SET
      status = CASE WHEN subscribers.status = 'unsubscribed' THEN 'pending' ELSE subscribers.status END,
      lang = EXCLUDED.lang
    RETURNING status, token`;
  if (row.status === "confirmed") return "already";
  if (!mailConfigured()) return "saved";
  return (await sendConfirmation(email, lang, row.token as string)) ? "sent" : "saved";
}

export async function setStatus(token: string, status: "confirmed" | "unsubscribed"): Promise<{ lang: string } | null> {
  const sql = await db();
  const [row] =
    status === "confirmed"
      ? await sql`UPDATE subscribers SET status = 'confirmed', confirmed_at = now() WHERE token = ${token} AND status <> 'unsubscribed' RETURNING lang`
      : await sql`UPDATE subscribers SET status = 'unsubscribed' WHERE token = ${token} RETURNING lang`;
  return row ? { lang: row.lang as string } : null;
}
