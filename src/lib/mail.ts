import "server-only";
import nodemailer from "nodemailer";

// Почта сайта (SMTP из окружения: MAILGUN_SMTP_*). Без настроек письма не уходят,
// а функции честно возвращают false.

export function mailConfigured(): boolean {
  return Boolean(process.env.MAILGUN_SMTP_USERNAME && process.env.MAILGUN_SMTP_PASSWORD);
}

let transport: nodemailer.Transporter | null = null;

export async function sendMail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
  if (!mailConfigured()) return false;
  transport ??= nodemailer.createTransport({
    host: process.env.MAILGUN_SMTP_HOST || "smtp.mailgun.org",
    port: parseInt(process.env.MAILGUN_SMTP_PORT || "587"),
    secure: process.env.MAILGUN_SMTP_PORT === "465",
    auth: { user: process.env.MAILGUN_SMTP_USERNAME, pass: process.env.MAILGUN_SMTP_PASSWORD },
  });
  try {
    await transport.sendMail({ from: `Neural Cosmology <${process.env.MAILGUN_FROM_EMAIL || "info@neuralcosmology.com"}>`, to, subject, text, html });
    return true;
  } catch (err) {
    console.error("[mail]", err instanceof Error ? err.message : err);
    return false;
  }
}
