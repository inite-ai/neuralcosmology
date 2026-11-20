import "server-only";
import type { Annotation, Comment, CommentWithReactions, Progress, QuoteShare, ReaderStore } from "@inite/reader";
import { db } from "@/lib/db";
import { stripMarks } from "@/lib/protect";

// Таблицы читалки (src/lib/db.ts) под контракт @inite/reader: один простой запрос
// на метод, все правила — в пакете. Читатель — user_id.

type AnnotationRow = {
  id: string; user_id: string; book: string; lang: string; chapter: string; anchor: string;
  kind: Annotation["kind"]; quote: string; start_off: number | null; end_off: number | null;
  color: string | null; note: string | null; sent_at: Date | null; created_at: Date;
};
type CommentRow = {
  id: string; book: string; lang: string; chapter: string; anchor: string | null; parent_id: string | null;
  user_id: string; author_name: string; is_author: boolean; quote: string | null; body: string;
  status: string; pinned: boolean; created_at: Date;
};

const A_COLS = "id, user_id, book, lang, chapter, anchor, kind, quote, start_off, end_off, color, note, sent_at, created_at";
const C_COLS = "id, book, lang, chapter, anchor, parent_id, user_id, author_name, is_author, quote, body, status, pinned, created_at";

const annotation = (r: AnnotationRow): Annotation => ({
  id: r.id, sub: r.user_id, book: r.book, lang: r.lang, chapter: r.chapter, anchor: r.anchor, kind: r.kind,
  quote: r.quote, startOff: r.start_off, endOff: r.end_off, color: r.color, note: r.note, sentAt: r.sent_at, createdAt: r.created_at,
});
const comment = (r: CommentRow): Comment => ({
  id: r.id, book: r.book, lang: r.lang, chapter: r.chapter, anchor: r.anchor, parentId: r.parent_id, sub: r.user_id,
  authorName: r.author_name, isAuthor: r.is_author, quote: r.quote, body: r.body,
  // Старое 'rejected' схема переводит в 'hidden'; на всякий случай всё неопубликованное — скрытое.
  status: r.status === "published" ? "published" : "hidden",
  pinned: r.pinned, createdAt: r.created_at,
});

export const sqlReaderStore: ReaderStore = {
  async getProgress(sub, book, lang) {
    const sql = await db();
    const [r] = await sql<{ chapter: string; anchor: string | null; chapters: Progress["chapters"]; updated_at: Date }[]>`
      SELECT chapter, anchor, chapters, updated_at FROM reading_progress WHERE user_id = ${sub} AND book = ${book} AND lang = ${lang}`;
    // Доли главы сайт не хранит.
    return r ? { chapter: r.chapter, anchor: r.anchor, chapters: r.chapters ?? {}, fraction: null, updatedAt: r.updated_at } : null;
  },
  async putProgress(sub, book, lang, p) {
    const sql = await db();
    await sql`INSERT INTO reading_progress (user_id, book, lang, chapter, anchor, chapters)
      VALUES (${sub}, ${book}, ${lang}, ${p.chapter}, ${p.anchor}, ${sql.json(p.chapters)})
      ON CONFLICT (user_id, book, lang) DO UPDATE SET
        chapter = EXCLUDED.chapter, anchor = EXCLUDED.anchor, chapters = EXCLUDED.chapters, updated_at = now()`;
  },

  async listAnnotations(sub, book, lang) {
    const sql = await db();
    const rows = await sql<AnnotationRow[]>`SELECT ${sql.unsafe(A_COLS)} FROM annotations
      WHERE user_id = ${sub} AND book = ${book} AND lang = ${lang} ORDER BY created_at`;
    return rows.map(annotation);
  },
  async createAnnotation(a) {
    const sql = await db();
    const [r] = await sql<AnnotationRow[]>`INSERT INTO annotations (user_id, book, lang, chapter, anchor, kind, quote, start_off, end_off, color, note)
      VALUES (${a.sub}, ${a.book}, ${a.lang}, ${a.chapter}, ${a.anchor}, ${a.kind}, ${a.quote}, ${a.startOff}, ${a.endOff}, ${a.color}, ${a.note})
      RETURNING ${sql.unsafe(A_COLS)}`;
    return annotation(r);
  },
  async getAnnotation(id, sub) {
    const sql = await db();
    const [r] = await sql<AnnotationRow[]>`SELECT ${sql.unsafe(A_COLS)} FROM annotations WHERE id = ${id} AND user_id = ${sub}`;
    return r ? annotation(r) : null;
  },
  async updateAnnotation(id, patch) {
    const sql = await db();
    const set: Record<string, string | Date | null> = {};
    if (patch.color !== undefined) set.color = patch.color;
    if (patch.note !== undefined) set.note = patch.note;
    if (patch.kind !== undefined) set.kind = patch.kind;
    if (patch.sentAt !== undefined) set.sent_at = patch.sentAt;
    const [r] = Object.keys(set).length
      ? await sql<AnnotationRow[]>`UPDATE annotations SET ${sql(set)}, updated_at = now() WHERE id = ${id} RETURNING ${sql.unsafe(A_COLS)}`
      : await sql<AnnotationRow[]>`SELECT ${sql.unsafe(A_COLS)} FROM annotations WHERE id = ${id}`;
    if (!r) throw new Error(`no annotation ${id}`);
    return annotation(r);
  },
  async deleteAnnotation(id, sub) {
    const sql = await db();
    await sql`DELETE FROM annotations WHERE id = ${id} AND user_id = ${sub}`;
  },
  async countSent(sub, since) {
    const sql = await db();
    const [{ n }] = await sql<{ n: number }[]>`SELECT count(*)::int AS n FROM annotations WHERE user_id = ${sub} AND sent_at > ${since}`;
    return n;
  },
  async listSent(since, limit) {
    const sql = await db();
    const rows = await sql<AnnotationRow[]>`SELECT ${sql.unsafe(A_COLS)} FROM annotations
      WHERE sent_at > ${since} ORDER BY sent_at DESC LIMIT ${limit}`;
    return rows.map(annotation);
  },

  async listComments(scope, { withHidden, me }) {
    const sql = await db();
    const who = me ?? "";
    const rows = await sql<(CommentRow & { likes: number; liked: boolean })[]>`
      SELECT ${sql.unsafe(C_COLS.split(", ").map((c) => `c.${c}`).join(", "))},
        (SELECT count(*)::int FROM comment_reactions r WHERE r.comment_id = c.id) AS likes,
        EXISTS (SELECT 1 FROM comment_reactions r WHERE r.comment_id = c.id AND r.user_id = ${who}) AS liked
      FROM comments c
      WHERE c.book = ${scope.book} AND c.lang = ${scope.lang} AND c.chapter = ${scope.chapter}
        AND (c.status = 'published' OR ${withHidden})
      ORDER BY c.pinned DESC, c.created_at ASC`;
    return rows.map((r): CommentWithReactions => ({ ...comment(r), likes: r.likes, liked: Boolean(me) && r.liked }));
  },
  async getComment(id) {
    const sql = await db();
    const [r] = await sql<CommentRow[]>`SELECT ${sql.unsafe(C_COLS)} FROM comments WHERE id = ${id}`;
    return r ? comment(r) : null;
  },
  async createComment(c) {
    const sql = await db();
    // Цитата из платной главы несёт невидимый водяной знак читателя: в общее обсуждение он не идёт.
    const quote = c.quote ? stripMarks(c.quote) || null : null;
    const [r] = await sql<CommentRow[]>`INSERT INTO comments (book, lang, chapter, anchor, parent_id, user_id, author_name, is_author, quote, body, status)
      VALUES (${c.book}, ${c.lang}, ${c.chapter}, ${c.anchor}, ${c.parentId}, ${c.sub}, ${c.authorName}, ${c.isAuthor}, ${quote}, ${c.body}, ${c.status})
      RETURNING ${sql.unsafe(C_COLS)}`;
    return comment(r);
  },
  async updateComment(id, patch) {
    const sql = await db();
    const set: Record<string, string | boolean> = {};
    if (patch.status !== undefined) set.status = patch.status;
    if (patch.pinned !== undefined) set.pinned = patch.pinned;
    if (!Object.keys(set).length) return Boolean(await sqlReaderStore.getComment(id));
    const rows = await sql`UPDATE comments SET ${sql(set)} WHERE id = ${id} RETURNING id`;
    return rows.length > 0;
  },
  async deleteComment(id) {
    const sql = await db();
    // Ответы и лайки уходят каскадом (ON DELETE CASCADE).
    await sql`DELETE FROM comments WHERE id = ${id}`;
  },
  async countCommentsBy(sub, since) {
    const sql = await db();
    const [{ n }] = await sql<{ n: number }[]>`SELECT count(*)::int AS n FROM comments WHERE user_id = ${sub} AND created_at > ${since}`;
    return n;
  },
  async listHidden(since, limit) {
    const sql = await db();
    const rows = await sql<CommentRow[]>`SELECT ${sql.unsafe(C_COLS)} FROM comments
      WHERE status = 'hidden' AND created_at > ${since} ORDER BY created_at DESC LIMIT ${limit}`;
    return rows.map(comment);
  },
  async react(commentId, sub, like) {
    const sql = await db();
    if (like) await sql`INSERT INTO comment_reactions (comment_id, user_id) VALUES (${commentId}, ${sub}) ON CONFLICT DO NOTHING`;
    else await sql`DELETE FROM comment_reactions WHERE comment_id = ${commentId} AND user_id = ${sub}`;
  },

  async putShare(s) {
    const sql = await db();
    await sql`INSERT INTO shares (id, book, lang, chapter, anchor, quote)
      VALUES (${s.id}, ${s.book}, ${s.lang}, ${s.chapter}, ${s.anchor}, ${s.quote}) ON CONFLICT (id) DO NOTHING`;
  },
  async getShare(id) {
    const sql = await db();
    const [r] = await sql<QuoteShare[]>`SELECT id, book, lang, chapter, anchor, quote FROM shares WHERE id = ${id}`;
    return r ?? null;
  },

  async bumpAiUsage(sub, day) {
    const sql = await db();
    const [r] = await sql<{ count: number }[]>`INSERT INTO ai_usage (user_id, day, count) VALUES (${sub}, ${day}::date, 1)
      ON CONFLICT (user_id, day) DO UPDATE SET count = ai_usage.count + 1 RETURNING count`;
    return r.count;
  },
  async getAiCache(key) {
    const sql = await db();
    const [r] = await sql<{ value: string }[]>`SELECT value FROM ai_cache WHERE key = ${key}`;
    return r?.value ?? null;
  },
  async putAiCache(key, value) {
    const sql = await db();
    await sql`INSERT INTO ai_cache (key, value) VALUES (${key}, ${value}) ON CONFLICT (key) DO NOTHING`;
  },

  async displayName(sub) {
    const sql = await db();
    const [r] = await sql<{ display_name: string | null }[]>`SELECT display_name FROM reader_prefs WHERE user_id = ${sub}`;
    return r?.display_name?.trim() || null;
  },
};
