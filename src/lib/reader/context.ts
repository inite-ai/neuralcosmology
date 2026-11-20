import "server-only";
import type { Session } from "@/lib/auth";

// Кто автор книги: модерация, кабинет автора, цитаты в соцсетях.
// Читалка (@inite/reader) узнаёт автора так же: src/lib/reader/reader.server.ts.

export const AUTHOR_EMAILS = () =>
  (process.env.AUTHOR_EMAILS || "mike@inite.ai,mikefluff@mikefluff.com").split(",").map((s) => s.trim().toLowerCase());

/**
 * Автор — админ INITE или подтверждённый адрес из AUTHOR_EMAILS; одно правило для
 * сессии сайта и для токена агента (как на mikefluff.com).
 */
export function authorBy(p: { email?: string | null; emailVerified?: boolean; admin?: boolean } | null): boolean {
  if (!p) return false;
  if (p.admin) return true;
  return Boolean(p.email && p.emailVerified && AUTHOR_EMAILS().includes(p.email.toLowerCase()));
}

export function isAuthor(s: Session | null): boolean {
  return authorBy(s);
}
