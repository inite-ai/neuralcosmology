import "server-only";
import { db, dbConfigured } from "@/lib/db";

// Доступ к книге, выданный автором: рецензенту, издателю, другу. Почта засчитывается,
// только если INITE её подтвердила, иначе доступ забрал бы любой, кто её впишет.

type Who = { sub: string; email?: string; emailVerified?: boolean };

const TTL = 30_000;
const g = globalThis as unknown as { __ncGrants?: Map<string, { at: number; books: Set<string> }> };
const cache = (g.__ncGrants ??= new Map());

export async function hasGrant(who: Who | null, book: string): Promise<boolean> {
  if (!who || !dbConfigured()) return false;
  const email = who.emailVerified && who.email ? who.email.toLowerCase() : null;
  const key = `${who.sub}|${email ?? ""}`;
  let hit = cache.get(key);
  if (!hit || Date.now() - hit.at > TTL) {
    try {
      const sql = await db();
      const rows = await sql<{ book: string }[]>`SELECT book FROM book_grants WHERE revoked_at IS NULL
        AND (user_id = ${who.sub} OR (${email}::text IS NOT NULL AND lower(email) = ${email}))`;
      hit = { at: Date.now(), books: new Set(rows.map((r) => r.book)) };
      if (cache.size > 5000) cache.clear();
      cache.set(key, hit);
    } catch (err) {
      // База недоступна: выданное не открываем, но и отказ не запоминаем.
      console.error("[grants]", err instanceof Error ? err.message : err);
      return hit?.books.has(book) ?? false;
    }
  }
  return hit.books.has(book) || hit.books.has("library");
}

export const forgetGrants = () => cache.clear();
