import "server-only";
import type { Session } from "@/lib/auth";

// Кто автор книги: модерация, кабинет автора, цитаты в соцсетях.
// Читалка (@inite/reader) узнаёт автора так же: src/lib/reader/reader.server.ts.

export const AUTHOR_EMAILS = () =>
  (process.env.AUTHOR_EMAILS || "mikefluff@mikefluff.com").split(",").map((s) => s.trim().toLowerCase());

export function isAuthor(s: Session | null): boolean {
  return Boolean(s?.email && AUTHOR_EMAILS().includes(s.email.toLowerCase()));
}
