import "server-only";
import { db } from "@/lib/db";
import { books, getBookBySlug } from "@/content/books";
import { getManifest, libraryLangs } from "@/lib/library";
import type { SupportedLocale } from "@/lib/get-locale";

// Чтение для бэкофиса. Страница сначала проходит owner() (src/lib/admin/guard.ts).

export const PAGE = 40;
const like = (q: string) => `%${q.trim().toLowerCase().replace(/[\\%_]/g, "\\$&")}%`;

export async function inbox() {
  const sql = await db();
  const [r] = await sql<{ inquiries: number; held: number; notes: number }[]>`SELECT
    (SELECT count(*)::int FROM inquiries WHERE status = 'new') AS inquiries,
    (SELECT count(*)::int FROM comments WHERE status = 'hidden' AND user_id <> '' AND author_name <> '—') AS held,
    (SELECT count(*)::int FROM annotations WHERE sent_at > now() - interval '7 days') AS notes`;
  return r;
}

export async function week() {
  const sql = await db();
  const [r] = await sql<Record<"readers" | "readersWas" | "subs" | "subsWas" | "sales" | "salesWas" | "comments" | "commentsWas", number>[]>`SELECT
    (SELECT count(DISTINCT user_id)::int FROM reading_progress WHERE updated_at > now() - interval '7 days') AS readers,
    (SELECT count(*)::int FROM readers WHERE first_seen > now() - interval '7 days') AS "readersWas",
    (SELECT count(*)::int FROM subscribers WHERE confirmed_at > now() - interval '7 days') AS subs,
    (SELECT count(*)::int FROM subscribers WHERE confirmed_at BETWEEN now() - interval '14 days' AND now() - interval '7 days') AS "subsWas",
    (SELECT count(*)::int FROM purchases_tracked WHERE at > now() - interval '7 days') AS sales,
    (SELECT count(*)::int FROM purchases_tracked WHERE at BETWEEN now() - interval '14 days' AND now() - interval '7 days') AS "salesWas",
    (SELECT count(*)::int FROM comments WHERE created_at > now() - interval '7 days') AS comments,
    (SELECT count(*)::int FROM comments WHERE created_at BETWEEN now() - interval '14 days' AND now() - interval '7 days') AS "commentsWas"`;
  return r;
}

export const STATUSES = ["new", "answered", "in_talks", "won", "lost", "spam"] as const;
export type Status = (typeof STATUSES)[number];
export type Inquiry = { id: string; kind: string; name: string; email: string; message: string; book: string | null; lang: string | null; status: Status; note: string | null; created_at: Date };

export async function inquiries(f: { status?: string; kind?: string; page: number }) {
  const sql = await db();
  const where = sql`WHERE (${f.status ?? null}::text IS NULL OR status = ${f.status ?? null}) AND (${f.kind ?? null}::text IS NULL OR kind = ${f.kind ?? null})`;
  const rows = await sql<Inquiry[]>`SELECT id, kind, name, email, message, book, lang, status, note, created_at FROM inquiries ${where}
    ORDER BY (status = 'new') DESC, created_at DESC LIMIT ${PAGE} OFFSET ${(f.page - 1) * PAGE}`;
  const [{ n }] = await sql<{ n: number }[]>`SELECT count(*)::int AS n FROM inquiries ${where}`;
  const counts = await sql<{ status: Status; n: number }[]>`SELECT status, count(*)::int AS n FROM inquiries GROUP BY 1`;
  return { rows, total: n, counts: Object.fromEntries(counts.map((c) => [c.status, c.n])) as Partial<Record<Status, number>> };
}

export type ReaderRow = { user_id: string; email: string | null; name: string | null; seen: Date | null; books: string[] | null };

/** Все, кто оставил след: входил, читал, настраивал кабинет или открывал платную главу. */
export async function readers(f: { q?: string; page: number }) {
  const sql = await db();
  const q = f.q ? like(f.q) : null;
  const all = sql`WITH ids AS (
      SELECT user_id FROM readers UNION SELECT user_id FROM reading_progress UNION SELECT user_id FROM reader_prefs UNION SELECT user_id FROM watermarks),
    people AS (SELECT i.user_id, COALESCE(r.email, p.email, w.email) AS email, COALESCE(p.display_name, r.name) AS name,
      GREATEST(r.last_seen, (SELECT max(updated_at) FROM reading_progress x WHERE x.user_id = i.user_id)) AS seen,
      (SELECT array_agg(DISTINCT book) FROM reading_progress x WHERE x.user_id = i.user_id) AS books
      FROM ids i LEFT JOIN readers r USING (user_id) LEFT JOIN reader_prefs p USING (user_id)
      LEFT JOIN LATERAL (SELECT email FROM watermarks wm WHERE wm.user_id = i.user_id LIMIT 1) w ON true)`;
  const where = sql`WHERE (${q}::text IS NULL OR lower(coalesce(email,'')) LIKE ${q} OR lower(coalesce(name,'')) LIKE ${q} OR lower(user_id) LIKE ${q})`;
  const rows = await sql<ReaderRow[]>`${all} SELECT * FROM people ${where} ORDER BY seen DESC NULLS LAST, user_id LIMIT ${PAGE} OFFSET ${(f.page - 1) * PAGE}`;
  const [{ n }] = await sql<{ n: number }[]>`${all} SELECT count(*)::int AS n FROM people ${where}`;
  return { rows, total: n };
}

export type Grant = { id: string; email: string | null; user_id: string | null; book: string; note: string | null; granted_by: string; created_at: Date; revoked_at: Date | null };

export async function reader(id: string) {
  const sql = await db();
  const [p] = await sql<{ email: string | null; email_verified: boolean | null; name: string | null; first_seen: Date | null; last_seen: Date | null; notify: boolean | null; known: boolean }[]>`
    SELECT COALESCE(r.email, p.email, (SELECT email FROM watermarks WHERE user_id = ${id} LIMIT 1)) AS email, r.email_verified,
      COALESCE(p.display_name, r.name) AS name, r.first_seen, r.last_seen, p.notify,
      (r.user_id IS NOT NULL OR p.user_id IS NOT NULL OR EXISTS (SELECT 1 FROM reading_progress WHERE user_id = ${id}) OR EXISTS (SELECT 1 FROM watermarks WHERE user_id = ${id})) AS known
    FROM (SELECT ${id}::text AS user_id) i LEFT JOIN readers r USING (user_id) LEFT JOIN reader_prefs p USING (user_id)`;
  if (!p.known) return null;
  const email = p.email?.toLowerCase() ?? null;
  const [progress, grants, comments, [n], subs, asked] = await Promise.all([
    sql<{ book: string; lang: string; chapter: string; chapters: Record<string, string>; updated_at: Date }[]>`SELECT book, lang, chapter, chapters, updated_at FROM reading_progress WHERE user_id = ${id} ORDER BY updated_at DESC`,
    sql<Grant[]>`SELECT * FROM book_grants WHERE user_id = ${id} OR (${email}::text IS NOT NULL AND lower(email) = ${email}) ORDER BY created_at DESC`,
    sql<{ id: string; book: string; lang: string; chapter: string; body: string; status: string; created_at: Date }[]>`SELECT id, book, lang, chapter, body, status, created_at FROM comments WHERE user_id = ${id} ORDER BY created_at DESC LIMIT 20`,
    sql<{ notes: number; sent: number }[]>`SELECT count(*)::int AS notes, count(sent_at)::int AS sent FROM annotations WHERE user_id = ${id}`,
    sql<{ status: string; source: string | null; created_at: Date }[]>`SELECT status, source, created_at FROM subscribers WHERE ${email}::text IS NOT NULL AND lower(email) = ${email}`,
    sql<{ id: string; kind: string; message: string; status: Status; created_at: Date }[]>`SELECT id, kind, message, status, created_at FROM inquiries WHERE ${email}::text IS NOT NULL AND lower(email) = ${email} ORDER BY created_at DESC LIMIT 10`,
  ]);
  return { id, ...p, progress, grants, comments, notes: n.notes, sent: n.sent, subscription: subs[0] ?? null, inquiries: asked };
}

export async function grants() {
  const sql = await db();
  return sql<Grant[]>`SELECT * FROM book_grants ORDER BY (revoked_at IS NULL) DESC, created_at DESC LIMIT 300`;
}

export type Sub = { email: string; lang: string; book: string | null; source: string | null; status: string; created_at: Date; confirmed_at: Date | null };

export async function subscribers(f: { q?: string; status?: string; page: number }) {
  const sql = await db();
  const q = f.q ? like(f.q) : null;
  const where = sql`WHERE (${q}::text IS NULL OR lower(email) LIKE ${q}) AND (${f.status ?? null}::text IS NULL OR status = ${f.status ?? null})`;
  const rows = await sql<Sub[]>`SELECT email, lang, book, source, status, created_at, confirmed_at FROM subscribers ${where} ORDER BY created_at DESC LIMIT ${PAGE} OFFSET ${(f.page - 1) * PAGE}`;
  const [{ n }] = await sql<{ n: number }[]>`SELECT count(*)::int AS n FROM subscribers ${where}`;
  const counts = await sql<{ status: string; n: number }[]>`SELECT status, count(*)::int AS n FROM subscribers GROUP BY 1`;
  const sources = await sql<{ source: string; n: number; confirmed: number }[]>`SELECT COALESCE(source, 'не указано') AS source, count(*)::int AS n,
    count(*) FILTER (WHERE status = 'confirmed')::int AS confirmed FROM subscribers GROUP BY 1 ORDER BY 2 DESC LIMIT 12`;
  return { rows, total: n, counts: Object.fromEntries(counts.map((c) => [c.status, c.n])) as Record<string, number>, sources };
}

export type Talk = { id: string; book: string; lang: string; chapter: string; anchor: string | null; user_id: string; author_name: string; is_author: boolean; quote: string | null; body: string; status: string; pinned: boolean; created_at: Date };

export async function discussions(f: { held: boolean; page: number }) {
  const sql = await db();
  // Стёртое читателем («[удалено автором]», имя «—») разбирать незачем.
  const where = sql`WHERE author_name <> '—' AND ${f.held ? sql`status = 'hidden'` : sql`true`}`;
  const rows = await sql<Talk[]>`SELECT id, book, lang, chapter, anchor, user_id, author_name, is_author, quote, body, status, pinned, created_at FROM comments ${where} ORDER BY created_at DESC LIMIT ${PAGE} OFFSET ${(f.page - 1) * PAGE}`;
  const [{ n }] = await sql<{ n: number }[]>`SELECT count(*)::int AS n FROM comments ${where}`;
  return { rows, total: n };
}

export async function sentNotes(limit = 30) {
  const sql = await db();
  return sql<{ id: string; user_id: string; book: string; lang: string; chapter: string; anchor: string; quote: string; note: string | null; sent_at: Date; name: string | null; email: string | null }[]>`
    SELECT a.id, a.user_id, a.book, a.lang, a.chapter, a.anchor, a.quote, a.note, a.sent_at, r.name, r.email
    FROM annotations a LEFT JOIN readers r USING (user_id) WHERE a.sent_at IS NOT NULL ORDER BY a.sent_at DESC LIMIT ${limit}`;
}

export type BookStat = {
  slug: string; title: string; lang: SupportedLocale; langs: { lang: SupportedLocale; readers: number }[]; readers: number; finished: number;
  chapters: { id: string; title: string; number: number | null; free: boolean; opened: number; read: number }[];
  sold: number; shares: number; comments: number;
};

/** Срез книги по главам: сколько вошедших читателей открыли и дочитали каждую. */
export async function bookStats(only?: { slug: string; lang?: string }): Promise<BookStat[]> {
  const sql = await db();
  const [marks, people, sold, shares, talk] = await Promise.all([
    sql<{ book: string; lang: string; chapter: string; opened: number; read: number }[]>`SELECT book, lang, k AS chapter, count(*)::int AS opened, count(*) FILTER (WHERE v = 'read')::int AS read
      FROM reading_progress, jsonb_each_text(CASE WHEN jsonb_typeof(chapters) = 'object' THEN chapters ELSE '{}'::jsonb END) AS e(k, v) GROUP BY 1, 2, 3`,
    sql<{ book: string; lang: string; n: number }[]>`SELECT book, lang, count(*)::int AS n FROM reading_progress GROUP BY 1, 2`,
    sql<{ item: string; n: number }[]>`SELECT item, count(*)::int AS n FROM purchases_tracked GROUP BY 1`,
    sql<{ book: string; n: number }[]>`SELECT book, count(*)::int AS n FROM shares GROUP BY 1`,
    sql<{ book: string; n: number }[]>`SELECT book, count(*)::int AS n FROM comments WHERE author_name <> '—' GROUP BY 1`,
  ]);
  return books
    .filter((b) => !only || b.slug === only.slug)
    .map((b) => {
      const langs = libraryLangs(b.slug).map((lang) => ({ lang, readers: people.find((p) => p.book === b.slug && p.lang === lang)?.n ?? 0 })).sort((x, y) => y.readers - x.readers);
      const lang = (langs.find((l) => l.lang === only?.lang) ?? langs[0])?.lang ?? "ru";
      const list = getManifest(b.slug, lang)?.chapters ?? [];
      const chapters = list.map((c) => {
        const m = marks.find((x) => x.book === b.slug && x.lang === lang && x.chapter === c.id);
        return { id: c.id, title: c.title, number: c.number ?? null, free: c.free, opened: m?.opened ?? 0, read: m?.read ?? 0 };
      });
      return {
        slug: b.slug, title: b.titles.ru ?? b.titles.en, lang, langs, readers: langs.reduce((s, l) => s + l.readers, 0), finished: chapters.at(-1)?.read ?? 0, chapters,
        sold: sold.find((s) => s.item === b.slug)?.n ?? 0, shares: shares.find((s) => s.book === b.slug)?.n ?? 0, comments: talk.find((t) => t.book === b.slug)?.n ?? 0,
      };
    });
}

export async function log(page: number) {
  const sql = await db();
  const rows = await sql<{ id: string; actor: string; action: string; target: string; detail: Record<string, unknown>; at: Date }[]>`SELECT id::text AS id, actor, action, target, detail, at FROM admin_log ORDER BY id DESC LIMIT ${PAGE} OFFSET ${(page - 1) * PAGE}`;
  const [{ n }] = await sql<{ n: number }[]>`SELECT count(*)::int AS n FROM admin_log`;
  return { rows, total: n };
}

export const bookTitle = (slug: string) => (slug === "library" ? "Вся библиотека" : (getBookBySlug(slug)?.titles.ru ?? slug));
export const chapterTitle = (book: string, lang: string, id: string) => getManifest(book, lang as SupportedLocale)?.chapters.find((c) => c.id === id)?.title ?? id;
