import { NextResponse } from "next/server";
import { audience } from "@/lib/audience.server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { purchases } from "@/lib/account";
import { fail, noDb } from "@/lib/reader/http";

export const dynamic = "force-dynamic";

// Выгрузка всего, что сайт хранит о читателе, одним JSON-файлом.
export async function GET() {
  const session = await getSession();
  if (!session) return fail("unauthorized", 401);
  const bad = noDb();
  if (bad) return bad;
  const sql = await db();
  const me = session.sub;
  const email = session.email && session.emailVerified ? session.email.toLowerCase() : null;
  const data = {
    exportedAt: new Date().toISOString(),
    account: { id: me, email: session.email, name: session.name },
    prefs: await sql`SELECT display_name, currency, notify, notify_books, updated_at FROM reader_prefs WHERE user_id = ${me}`,
    progress: await sql`SELECT book, lang, chapter, anchor, chapters, updated_at FROM reading_progress WHERE user_id = ${me}`,
    annotations: await sql`SELECT book, lang, chapter, anchor, kind, quote, note, color, created_at FROM annotations WHERE user_id = ${me} ORDER BY created_at`,
    comments: await sql`SELECT book, lang, chapter, anchor, quote, body, status, created_at FROM comments WHERE user_id = ${me} ORDER BY created_at`,
    reactions: await sql`SELECT comment_id FROM comment_reactions WHERE user_id = ${me}`,
    aiUsage: await sql`SELECT day, count FROM ai_usage WHERE user_id = ${me} ORDER BY day`,
    watermark: await sql`SELECT mark, email, created_at FROM watermarks WHERE user_id = ${me}`,
    addressBook: email ? await (await audience())?.exportPerson(email).catch(() => null) ?? null : null,
    subscription: email ? await sql`SELECT email, lang, book, source, status, created_at, confirmed_at FROM subscribers WHERE lower(email) = ${email}` : [],
    inquiries: email ? await sql`SELECT kind, name, message, book, lang, created_at FROM inquiries WHERE lower(email) = ${email}` : [],
    reader: await sql`SELECT email, email_verified, name, first_seen, last_seen FROM readers WHERE user_id = ${me}`,
    grants: await sql`SELECT book, created_at, revoked_at FROM book_grants WHERE user_id = ${me} OR (${email}::text IS NOT NULL AND lower(email) = ${email})`,
    purchases: await purchases(me),
  };
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="neuralcosmology-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}
