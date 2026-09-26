import { NextResponse } from "next/server";
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
  const data = {
    exportedAt: new Date().toISOString(),
    account: { id: me, email: session.email, name: session.name },
    prefs: await sql`SELECT display_name, currency, notify, notify_books, updated_at FROM reader_prefs WHERE user_id = ${me}`,
    progress: await sql`SELECT book, lang, chapter, anchor, chapters, updated_at FROM reading_progress WHERE user_id = ${me}`,
    annotations: await sql`SELECT book, lang, chapter, anchor, kind, quote, note, color, created_at FROM annotations WHERE user_id = ${me} ORDER BY created_at`,
    comments: await sql`SELECT book, lang, chapter, anchor, quote, body, status, created_at FROM comments WHERE user_id = ${me} ORDER BY created_at`,
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
