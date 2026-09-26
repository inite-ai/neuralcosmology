import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { USER_TABLES } from "@/lib/account";
import { fail, json, noDb } from "@/lib/reader/http";

export const dynamic = "force-dynamic";

// Удаляет данные читателя на сайте: прогресс, пометки, настройки, лимиты ИИ.
// Комментарии обезличиваются (текст убирается, ветки обсуждений не рвутся).
// Покупки и сам аккаунт живут в INITE Billing / Auth и этим не удаляются.
export async function POST() {
  const session = await getSession();
  if (!session) return fail("unauthorized", 401);
  const bad = noDb();
  if (bad) return bad;
  const sql = await db();
  const me = session.sub;
  for (const t of USER_TABLES) await sql`DELETE FROM ${sql(t)} WHERE user_id = ${me}`;
  await sql`UPDATE comments SET body = '[удалено автором]', quote = NULL, author_name = '—', status = 'hidden' WHERE user_id = ${me}`;
  return json({ ok: true });
}
