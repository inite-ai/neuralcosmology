import "server-only";
import { createAudience, fromPostgresJs, type Audience } from "@inite/audience";
import { db, dbConfigured } from "@/lib/db";

// Адресная книга сайта (@inite/audience, в базе сайта). Цель одна: new-chapters,
// то, на что соглашается подписчик («буду писать, когда выходят новые главы и опыты»).
// Стоп-лист общий: кто отписался где угодно (ссылка, кабинет, один клик, Mailgun),
// тому не уходит ни одна рассылка. AUDIENCE_SECRET подписывает ссылки и ключует
// стоп-лист; менять его нельзя, запасного нет: без него книга выключена.

export const PURPOSE = "new-chapters";
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://neuralcosmology.com").replace(/\/$/, "");
const g = globalThis as unknown as { __ncAudience?: Promise<Audience | null> };

export function audience(): Promise<Audience | null> {
  const secret = (process.env.AUDIENCE_SECRET ?? "").trim();
  if (!dbConfigured() || secret.length < 32) return Promise.resolve(null);
  g.__ncAudience ??= db().then((sql) =>
    createAudience({ sql: fromPostgresJs(sql), secret, unsubscribeUrl: (t) => `${SITE}/api/audience/unsubscribe?t=${t}` }),
  ).catch(() => {
    g.__ncAudience = undefined;
    return null;
  });
  return g.__ncAudience;
}

const quiet = (what: string) => (e: unknown) => console.error(`[audience] ${what}:`, e instanceof Error ? e.message : e);

/** Адрес из формы: контакт, но ещё не тот, кому можно рассылать. */
export async function rememberContact(c: { email: string; name?: string | null; lang?: string | null; source: string }): Promise<void> {
  const a = await audience();
  await a?.upsertContact({ email: c.email, name: c.name, lang: c.lang, source: c.source, tags: [c.source] }).catch(quiet("contact"));
}

/** Подписчик нажал «подтвердить»: согласие с тем текстом, который он прочёл в письме. */
export async function grantChapters(email: string, lang: string, wording: string, source: string): Promise<void> {
  const a = await audience();
  if (!a) return;
  try {
    const { token } = await a.askConsent({ email, purpose: PURPOSE, wording, source, lang });
    await a.confirm(token);
  } catch (e) {
    quiet("consent")(e);
  }
}

/** Отписка откуда угодно: в общий стоп-лист, по всем целям. */
export async function stopAll(email: string, source: string): Promise<void> {
  const a = await audience();
  await a?.withdraw(email, source).catch(quiet("withdraw"));
}

/** Перед каждым письмом рассылки: адрес в стоп-листе (отписка, отказ, жалоба)? */
export async function stopped(email: string): Promise<boolean> {
  const a = await audience();
  return a ? Boolean(await a.suppression(email).catch(() => null)) : false;
}
