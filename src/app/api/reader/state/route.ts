import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { json, fail, noDb, clip } from "@/lib/reader/http";

export const dynamic = "force-dynamic";

// GET  ?book&lang  → прогресс и пометки читателя по книге
// PUT  {book, lang, chapter, anchor, chapters} → сохранить прогресс (слияние статусов глав)
export async function GET(req: NextRequest) {
  const blocked = noDb();
  if (blocked) return blocked;
  const session = await getSession();
  if (!session) return fail("unauthorized", 401);
  const book = clip(req.nextUrl.searchParams.get("book"), 80);
  const lang = clip(req.nextUrl.searchParams.get("lang"), 8);
  const sql = await db();
  const [progress] = await sql`SELECT chapter, anchor, chapters, updated_at FROM reading_progress
    WHERE user_id = ${session.sub} AND book = ${book} AND lang = ${lang}`;
  const annotations = await sql`SELECT id, chapter, anchor, kind, quote, start_off, end_off, color, note, created_at
    FROM annotations WHERE user_id = ${session.sub} AND book = ${book} AND lang = ${lang} ORDER BY created_at`;
  return json({ progress: progress ?? null, annotations });
}

export async function PUT(req: NextRequest) {
  const blocked = noDb();
  if (blocked) return blocked;
  const session = await getSession();
  if (!session) return fail("unauthorized", 401);
  const b = await req.json().catch(() => null);
  if (!b) return fail("bad_request", 400);
  const book = clip(b.book, 80), lang = clip(b.lang, 8), chapter = clip(b.chapter, 80);
  if (!book || !lang || !chapter) return fail("bad_request", 400);
  const chapters: Record<string, string> = {};
  for (const [k, v] of Object.entries(b.chapters ?? {})) {
    if (v === "read" || v === "reading") chapters[clip(k, 80)] = v;
  }
  const sql = await db();
  // «read» не откатывается в «reading»: сливаем с сохранённым, прочитанное главнее.
  const [prev] = await sql`SELECT chapters FROM reading_progress WHERE user_id = ${session.sub} AND book = ${book} AND lang = ${lang}`;
  const merged: Record<string, string> = { ...((prev?.chapters as Record<string, string>) ?? {}) };
  for (const [k, v] of Object.entries(chapters)) if (merged[k] !== "read") merged[k] = v;
  await sql`INSERT INTO reading_progress (user_id, book, lang, chapter, anchor, chapters)
    VALUES (${session.sub}, ${book}, ${lang}, ${chapter}, ${clip(b.anchor, 40) || null}, ${sql.json(merged)})
    ON CONFLICT (user_id, book, lang) DO UPDATE SET
      chapter = EXCLUDED.chapter, anchor = EXCLUDED.anchor, chapters = EXCLUDED.chapters, updated_at = now()`;
  return json({ ok: true });
}
