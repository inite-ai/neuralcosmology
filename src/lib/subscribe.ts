import "server-only";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { emailHtml } from "@/lib/email-layout";
import { mailConfigured, sendMail } from "@/lib/mail";
import type { SupportedLocale } from "@/lib/get-locale";

// Подписка на новые главы и опыты без аккаунта. Двойное подтверждение: письмо со
// ссылкой, адрес становится confirmed только после неё. Пока почта не настроена,
// адрес лежит в pending; POST /api/admin/subscribers рассылает подтверждения позже.

const SITE = "https://neuralcosmology.com";

type Copy = { subject: string; preheader: string; title: string; lead: string; cta: string; notYou: string; footer: string; unsub: string; signature: string };

const COPY: Record<SupportedLocale, Copy> = {
  ru: {
    subject: "Подтвердите подписку на Нейронную космологию",
    preheader: "Одно нажатие, и письма о новых главах и опытах будут приходить сюда.",
    title: "Подтвердите подписку",
    lead: "Вы оставили этот адрес на neuralcosmology.com. Подтвердите его, и я буду писать, когда выходят новые главы и опыты, не чаще раза в неделю.",
    cta: "Подтвердить подписку",
    notYou: "Если это были не вы, просто ничего не делайте: без подтверждения писем не будет.",
    footer: "Письмо пришло, потому что этот адрес оставили на сайте.",
    unsub: "Отписаться",
    signature: "Михаил Савченко",
  },
  en: {
    subject: "Confirm your Neural Cosmology subscription",
    preheader: "One click, and emails about new chapters and experiments will come here.",
    title: "Confirm your subscription",
    lead: "You left this address on neuralcosmology.com. Confirm it and I will write when new chapters and experiments come out, at most once a week.",
    cta: "Confirm subscription",
    notYou: "If this wasn’t you, do nothing: without confirmation no emails will follow.",
    footer: "You’re getting this because the address was entered on the site.",
    unsub: "Unsubscribe",
    signature: "Mikhail Savchenko",
  },
  pt: {
    subject: "Confirme a sua inscrição na Cosmologia Neural",
    preheader: "Um clique, e os e-mails sobre novos capítulos e experimentos chegarão aqui.",
    title: "Confirme a sua inscrição",
    lead: "Você deixou este endereço em neuralcosmology.com. Confirme e eu escreverei quando saírem novos capítulos e experimentos, no máximo uma vez por semana.",
    cta: "Confirmar inscrição",
    notYou: "Se não foi você, não faça nada: sem confirmação, nenhum e-mail será enviado.",
    footer: "Você recebeu este e-mail porque o endereço foi informado no site.",
    unsub: "Cancelar inscrição",
    signature: "Mikhail Savchenko",
  },
  es: {
    subject: "Confirme su suscripción a Cosmología Neural",
    preheader: "Un clic, y los correos sobre capítulos y experimentos nuevos llegarán aquí.",
    title: "Confirme su suscripción",
    lead: "Dejó esta dirección en neuralcosmology.com. Confírmela y le escribiré cuando salgan capítulos y experimentos nuevos, como mucho una vez por semana.",
    cta: "Confirmar suscripción",
    notYou: "Si no fue usted, no haga nada: sin confirmación no llegará ningún correo.",
    footer: "Recibe este correo porque la dirección se introdujo en el sitio.",
    unsub: "Darse de baja",
    signature: "Mikhail Savchenko",
  },
};

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
export const validEmail = (e: string) => EMAIL.test(e);

export async function sendConfirmation(email: string, lang: SupportedLocale, token: string): Promise<boolean> {
  const c = COPY[lang] ?? COPY.en;
  const confirm = `${SITE}/api/subscribe/confirm?t=${token}`;
  const unsub = `${SITE}/api/subscribe/unsubscribe?t=${token}`;
  const text = `${c.title}\n\n${c.lead}\n\n${c.cta}: ${confirm}\n\n${c.notYou}\n\n${c.signature}\n\n${c.footer} ${c.unsub}: ${unsub}`;
  const html = emailHtml({
    lang,
    preheader: c.preheader,
    title: c.title,
    blocks: [
      { kind: "p", text: c.lead },
      { kind: "button", label: c.cta, href: confirm },
      { kind: "p", text: c.notYou },
    ],
    signature: c.signature,
    footer: { text: c.footer, link: { label: c.unsub, href: unsub } },
  });
  return sendMail(email, c.subject, text, html);
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
