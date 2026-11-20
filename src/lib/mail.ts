import "server-only";
import nodemailer from "nodemailer";

// Почта сайта: HTTP API Mailgun (MAILGUN_API_KEY + MAILGUN_DOMAIN, MAILGUN_REGION=eu
// для европейского аккаунта) или SMTP (MAILGUN_SMTP_*). Без настроек письма не уходят,
// а функции честно возвращают false.

const apiConfigured = () => Boolean(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN);
const smtpConfigured = () => Boolean(process.env.MAILGUN_SMTP_USERNAME && process.env.MAILGUN_SMTP_PASSWORD);

export function mailConfigured(): boolean {
  return apiConfigured() || smtpConfigured();
}

const FROM_EMAIL = () => process.env.MAILGUN_FROM_EMAIL || "info@neuralcosmology.com";
const FROM = (name = "Neural Cosmology") => `"${name.replace(/["\\\r\n<>]/g, "")}" <${FROM_EMAIL()}>`;
// Ответы читателей — на общий ящик (MAILGUN_REPLY_TO), как у остальной почты inite.
const REPLY_TO = () => process.env.MAILGUN_REPLY_TO || undefined;

/** Письмо от имени (fromName) с ответом на адрес читателя (replyTo), как у заметок автору. */
export type MailOptions = { replyTo?: string | null; fromName?: string };

async function sendViaApi(to: string, subject: string, text: string, html?: string, o: MailOptions = {}): Promise<boolean> {
  const host = process.env.MAILGUN_REGION === "eu" ? "api.eu.mailgun.net" : "api.mailgun.net";
  const body = new URLSearchParams({ from: FROM(o.fromName), to, subject, text });
  if (html) body.set("html", html);
  const replyTo = o.replyTo || REPLY_TO();
  if (replyTo) body.set("h:Reply-To", replyTo);
  try {
    const r = await fetch(`https://${host}/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString("base64")}` },
      body,
    });
    if (!r.ok) console.error("[mail] mailgun api", r.status, (await r.text()).slice(0, 200));
    return r.ok;
  } catch (err) {
    console.error("[mail]", err instanceof Error ? err.message : err);
    return false;
  }
}

let transport: nodemailer.Transporter | null = null;

export async function sendMail(to: string, subject: string, text: string, html?: string, o: MailOptions = {}): Promise<boolean> {
  if (apiConfigured()) return sendViaApi(to, subject, text, html, o);
  if (!smtpConfigured()) return false;
  transport ??= nodemailer.createTransport({
    host: process.env.MAILGUN_SMTP_HOST || "smtp.mailgun.org",
    port: parseInt(process.env.MAILGUN_SMTP_PORT || "587"),
    secure: process.env.MAILGUN_SMTP_PORT === "465",
    auth: { user: process.env.MAILGUN_SMTP_USERNAME, pass: process.env.MAILGUN_SMTP_PASSWORD },
  });
  try {
    await transport.sendMail({ from: FROM(o.fromName), to, subject, text, html, replyTo: o.replyTo || REPLY_TO() });
    return true;
  } catch (err) {
    console.error("[mail]", err instanceof Error ? err.message : err);
    return false;
  }
}
