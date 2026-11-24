import "server-only";
import { notFound, redirect } from "next/navigation";
import { authConfigured, getSession, type Session } from "@/lib/auth";
import { db, dbConfigured } from "@/lib/db";
import { isAuthor } from "@/lib/reader/context";

/** Каждая страница и каждое действие бэкофиса начинается с этого: layout сам по себе не замок. */
export async function owner(path = "/ru/admin"): Promise<Session> {
  const s = await getSession();
  if (!s) {
    if (!authConfigured()) notFound();
    redirect(`/api/auth/login?returnTo=${encodeURIComponent(path)}`);
  }
  if (!isAuthor(s)) notFound();
  return s;
}

/** Запись в журнал идёт вместе с действием: нет журнала — нет действия. */
export async function act(action: string, target: string, detail: Record<string, unknown> = {}): Promise<Session> {
  const s = await owner();
  if (!dbConfigured()) throw new Error("База не подключена");
  const sql = await db();
  await sql`INSERT INTO admin_log (actor, action, target, detail) VALUES (${s.email ?? s.sub}, ${action}, ${target}, ${sql.json(detail as never)})`;
  return s;
}
