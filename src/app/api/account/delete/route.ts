import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { USER_TABLES } from "@/lib/account";
import { sameOrigin } from "@/lib/guard";
import { fail, json, noDb } from "@/lib/reader/http";

export const dynamic = "force-dynamic";

// Удаляет данные читателя на сайте: прогресс, пометки, настройки, лимиты ИИ.
// Комментарии обезличиваются (текст убирается, ветки обсуждений не рвутся).
// Покупки и сам аккаунт живут в INITE Billing / Auth и этим не удаляются.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("forbidden", 403);
  const session = await getSession();
  if (!session) return fail("unauthorized", 401);
  const bad = noDb();
  if (bad) return bad;
  const sql = await db();
  const me = session.sub;
  for (const t of USER_TABLES) await sql`DELETE FROM ${sql(t)} WHERE user_id = ${me}`;
  await sql`UPDATE comments SET body = '[удалено автором]', quote = NULL, author_name = '—', status = 'hidden' WHERE user_id = ${me}`;
  // Метка водяного знака остаётся (без адреса): по ней ищут утечку купленного текста.
  await sql`UPDATE watermarks SET email = NULL WHERE user_id = ${me}`;
  // Подписка и обращения лежат по адресу: удаляем, только если INITE его подтвердила.
  if (session.email && session.emailVerified) {
    const email = session.email.toLowerCase();
    await sql`DELETE FROM subscribers WHERE lower(email) = ${email}`;
    await sql`DELETE FROM inquiries WHERE lower(email) = ${email}`;
  }
  return json({ ok: true });
}
