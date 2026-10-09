import type { NextRequest } from "next/server";
import { db, dbConfigured } from "@/lib/db";
import { mailConfigured } from "@/lib/mail";
import { fail, json } from "@/lib/reader/http";
import { sendConfirmation } from "@/lib/subscribe";
import type { SupportedLocale } from "@/lib/get-locale";

export const dynamic = "force-dynamic";

// GET — сводка по подписчикам; POST — разослать подтверждения тем, кто в pending
// (нужно, когда почта заработала позже, чем начали собирать адреса).
// Заголовок x-notify-secret = NOTIFY_SECRET.
function allowed(req: NextRequest) {
  const s = process.env.NOTIFY_SECRET;
  return Boolean(s) && req.headers.get("x-notify-secret") === s;
}

export async function GET(req: NextRequest) {
  if (!allowed(req)) return fail("forbidden", 403);
  if (!dbConfigured()) return fail("storage_unavailable", 503);
  const sql = await db();
  const rows = await sql`SELECT status, lang, source, count(*)::int AS n FROM subscribers GROUP BY 1, 2, 3 ORDER BY 4 DESC`;
  return json({ mail: mailConfigured(), rows });
}

export async function POST(req: NextRequest) {
  if (!allowed(req)) return fail("forbidden", 403);
  if (!dbConfigured()) return fail("storage_unavailable", 503);
  if (!mailConfigured()) return fail("mail_not_configured", 503);
  const sql = await db();
  const pending = await sql`SELECT email, lang, token FROM subscribers WHERE status = 'pending' ORDER BY created_at LIMIT 500`;
  let sent = 0;
  for (const p of pending) if (await sendConfirmation(p.email as string, p.lang as SupportedLocale, p.token as string)) sent++;
  return json({ pending: pending.length, sent });
}
