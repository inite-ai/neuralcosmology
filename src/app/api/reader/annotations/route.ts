import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { chapterContext } from "@/lib/reader/context";
import { getSession } from "@/lib/auth";
import { json, fail, noDb, clip } from "@/lib/reader/http";

export const dynamic = "force-dynamic";

const KINDS = new Set(["bookmark", "highlight", "note"]);
const COLORS = new Set(["accent", "yellow", "green", "rose"]);

// POST   {book, lang, chapter, anchor, kind, quote, start, end, color, note}
// PATCH  {id, color?, note?}
// DELETE ?id
export async function POST(req: NextRequest) {
  const blocked = noDb();
  if (blocked) return blocked;
  const b = await req.json().catch(() => null);
  if (!b || !KINDS.has(b.kind)) return fail("bad_request", 400);
  const ctx = await chapterContext(clip(b.book, 80), clip(b.lang, 8), clip(b.chapter, 80));
  if (!ctx) return fail("not_found", 404);
  if (!ctx.session) return fail("unauthorized", 401);
  if (!ctx.canRead) return fail("forbidden", 403);
  const anchor = clip(b.anchor, 40);
  if (!anchor) return fail("bad_request", 400);
  const sql = await db();
  const [row] = await sql`INSERT INTO annotations (user_id, book, lang, chapter, anchor, kind, quote, start_off, end_off, color, note)
    VALUES (${ctx.session.sub}, ${ctx.book}, ${ctx.lang}, ${ctx.chapter.id}, ${anchor}, ${b.kind}, ${clip(b.quote, 2000)},
      ${Number.isInteger(b.start) ? b.start : null}, ${Number.isInteger(b.end) ? b.end : null},
      ${COLORS.has(b.color) ? b.color : null}, ${clip(b.note, 4000) || null})
    RETURNING id, chapter, anchor, kind, quote, start_off, end_off, color, note, created_at`;
  return json(row, 201);
}

export async function PATCH(req: NextRequest) {
  const blocked = noDb();
  if (blocked) return blocked;
  const session = await getSession();
  if (!session) return fail("unauthorized", 401);
  const b = await req.json().catch(() => null);
  if (!b?.id) return fail("bad_request", 400);
  const sql = await db();
  const [row] = await sql`UPDATE annotations SET
      color = COALESCE(${COLORS.has(b.color) ? b.color : null}, color),
      note = CASE WHEN ${typeof b.note === "string"} THEN ${clip(b.note, 4000) || null} ELSE note END,
      kind = CASE WHEN ${typeof b.note === "string" && clip(b.note, 4000) !== ""} THEN 'note' ELSE kind END,
      updated_at = now()
    WHERE id = ${b.id} AND user_id = ${session.sub}
    RETURNING id, chapter, anchor, kind, quote, start_off, end_off, color, note, created_at`;
  return row ? json(row) : fail("not_found", 404);
}

export async function DELETE(req: NextRequest) {
  const blocked = noDb();
  if (blocked) return blocked;
  const session = await getSession();
  if (!session) return fail("unauthorized", 401);
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return fail("bad_request", 400);
  const sql = await db();
  await sql`DELETE FROM annotations WHERE id = ${id} AND user_id = ${session.sub}`;
  return json({ ok: true });
}
