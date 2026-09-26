import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { stripMarks } from "@/lib/protect";
import { getPrefs } from "@/lib/account";
import { chapterContext, isAuthor, displayName } from "@/lib/reader/context";
import { moderate } from "@/lib/reader/ai";
import { json, fail, noDb, clip } from "@/lib/reader/http";

export const dynamic = "force-dynamic";

// GET  ?book&lang&chapter → опубликованные обсуждения главы (видят все, у кого есть доступ к главе)
// POST {book, lang, chapter, anchor?, parentId?, quote?, body} → новый комментарий (вошедшие, с премодерацией ИИ)
export async function GET(req: NextRequest) {
  const blocked = noDb();
  if (blocked) return blocked;
  const q = req.nextUrl.searchParams;
  const ctx = await chapterContext(clip(q.get("book"), 80), clip(q.get("lang"), 8), clip(q.get("chapter"), 80));
  if (!ctx) return fail("not_found", 404);
  if (!ctx.canRead) return json({ comments: [], locked: true });
  const sql = await db();
  const me = ctx.session?.sub ?? "";
  const author = isAuthor(ctx.session);
  const rows = await sql`SELECT c.id, c.anchor, c.parent_id, c.author_name, c.is_author, c.quote, c.body, c.status, c.pinned, c.created_at,
      (c.user_id = ${me}) AS mine,
      (SELECT count(*)::int FROM comment_reactions r WHERE r.comment_id = c.id) AS likes,
      EXISTS (SELECT 1 FROM comment_reactions r WHERE r.comment_id = c.id AND r.user_id = ${me}) AS liked
    FROM comments c
    WHERE c.book = ${ctx.book} AND c.lang = ${ctx.lang} AND c.chapter = ${ctx.chapter.id}
      AND (c.status = 'published' OR (${author} AND c.status = 'hidden'))
    ORDER BY c.pinned DESC, c.created_at ASC`;
  return json({ comments: rows, canModerate: author });
}

export async function POST(req: NextRequest) {
  const blocked = noDb();
  if (blocked) return blocked;
  const b = await req.json().catch(() => null);
  if (!b) return fail("bad_request", 400);
  const ctx = await chapterContext(clip(b.book, 80), clip(b.lang, 8), clip(b.chapter, 80));
  if (!ctx) return fail("not_found", 404);
  if (!ctx.session) return fail("unauthorized", 401);
  if (!ctx.canRead) return fail("forbidden", 403);
  const body = clip(b.body, 4000);
  if (body.length < 2) return fail("empty", 400);
  const sql = await db();
  // Не больше 20 сообщений в час от одного читателя.
  const [{ n }] = await sql`SELECT count(*)::int AS n FROM comments WHERE user_id = ${ctx.session.sub} AND created_at > now() - interval '1 hour'`;
  if (n >= 20) return fail("rate_limited", 429);
  const ok = await moderate(body);
  const parentId = typeof b.parentId === "string" && b.parentId ? b.parentId : null;
  // Имя из настроек кабинета, если задано.
  const name = (await getPrefs(ctx.session.sub)).displayName ?? displayName(ctx.session);
  const [row] = await sql`INSERT INTO comments (book, lang, chapter, anchor, parent_id, user_id, author_name, is_author, quote, body, status)
    VALUES (${ctx.book}, ${ctx.lang}, ${ctx.chapter.id}, ${clip(b.anchor, 40) || null}, ${parentId}, ${ctx.session.sub},
      ${name}, ${isAuthor(ctx.session)}, ${stripMarks(clip(b.quote, 600)) || null}, ${body}, ${ok ? "published" : "rejected"})
    RETURNING id, anchor, parent_id, author_name, is_author, quote, body, status, pinned, created_at`;
  if (!ok) return fail("rejected", 422);
  return json({ ...row, mine: true, likes: 0, liked: false }, 201);
}
