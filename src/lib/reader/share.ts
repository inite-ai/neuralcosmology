import "server-only";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { getChapterHtml } from "@/lib/library";
import { stripMarks } from "@/lib/protect";
import type { SupportedLocale } from "@/lib/get-locale";

// Цитаты «Поделиться». Ссылка короткая (/ru/q/Ab3dE9xk), цитата хранится в базе
// и принимается, только если дословно есть в главе: чужой текст под именем автора
// и названием книги на карточку не попадёт.

export type Share = { id: string; book: string; lang: SupportedLocale; chapter: string; anchor: string; quote: string };

export const QUOTE_MAX = 600;

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

/** Сплошной текст: без тегов, сущностей, водяных знаков и мягких переносов, пробелы схлопнуты. */
export function plain(s: string): string {
  return stripMarks(
    s
      .replace(/<[^>]+>/g, "")
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
      .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m),
  )
    .replace(/[­⁠]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Цитата (абзацы через пустую строку) дословно есть в главе, начиная с абзаца anchor. */
export function quoteInChapter(book: string, lang: SupportedLocale, chapter: string, anchor: string, quote: string): boolean {
  const html = getChapterHtml(book, lang, chapter);
  if (!html) return false;
  const paras = [...html.matchAll(/<p\b[^>]*data-a="([^"]+)"[^>]*>([\s\S]*?)<\/p>/g)];
  const from = paras.findIndex((m) => m[1] === anchor);
  if (from < 0) return false;
  const pieces = quote.split(/\n\s*\n/).map(plain).filter(Boolean);
  if (!pieces.length) return false;
  return pieces.every((piece, i) => {
    const text = paras[from + i] ? plain(paras[from + i][2]) : "";
    // Последний кусок мог быть обрезан по длине — его ищем как начало фрагмента.
    return text.includes(piece.replace(/…$/, ""));
  });
}

const B62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function shareId(key: string): string {
  const h = createHash("sha256").update(key).digest();
  let out = "";
  for (let i = 0; i < 8; i++) out += B62[h[i] % 62];
  return out;
}

/** Одна и та же цитата из того же места даёт ту же ссылку. */
export async function saveShare(s: Omit<Share, "id">): Promise<string> {
  const id = shareId([s.book, s.lang, s.chapter, s.anchor, s.quote].join("\u0000"));
  const sql = await db();
  await sql`INSERT INTO shares (id, book, lang, chapter, anchor, quote)
    VALUES (${id}, ${s.book}, ${s.lang}, ${s.chapter}, ${s.anchor}, ${s.quote})
    ON CONFLICT (id) DO NOTHING`;
  return id;
}

export async function getShare(id: string): Promise<Share | null> {
  if (!/^[0-9A-Za-z]{8}$/.test(id)) return null;
  const sql = await db();
  const [row] = await sql<Share[]>`SELECT id, book, lang, chapter, anchor, quote FROM shares WHERE id = ${id}`;
  return row ?? null;
}
