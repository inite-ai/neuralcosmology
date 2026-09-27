import type { NextRequest } from "next/server";
import { chapterContext } from "@/lib/reader/context";
import { json, fail, noDb, clip } from "@/lib/reader/http";
import { plainQuote } from "@/lib/reader/quote";
import { QUOTE_MAX, quoteInChapter, saveShare } from "@/lib/reader/share";

export const dynamic = "force-dynamic";

const BASE = "https://neuralcosmology.com";

// POST {book, lang, chapter, anchor, quote} → {id, url}
// Цитату может отправить любой, кому глава открыта, в том числе гость на бесплатной главе.
export async function POST(req: NextRequest) {
  const blocked = noDb();
  if (blocked) return blocked;
  const b = await req.json().catch(() => null);
  if (!b) return fail("bad_request", 400);
  const ctx = await chapterContext(clip(b.book, 80), clip(b.lang, 8), clip(b.chapter, 80));
  if (!ctx) return fail("not_found", 404);
  if (!ctx.canRead) return fail("forbidden", 403);
  const anchor = clip(b.anchor, 40);
  let quote = plainQuote(typeof b.quote === "string" ? b.quote : "");
  // Длинное выделение обрезается по слову; проверка ниже снимает многоточие.
  if (quote.length > QUOTE_MAX) quote = `${quote.slice(0, quote.lastIndexOf(" ", QUOTE_MAX)).replace(/[\s,;:—–-]+$/, "")}…`;
  if (!anchor || quote.length < 2) return fail("bad_request", 400);
  if (!quoteInChapter(ctx.book, ctx.lang, ctx.chapter.id, anchor, quote)) return fail("quote_mismatch", 422);
  const id = await saveShare({ book: ctx.book, lang: ctx.lang, chapter: ctx.chapter.id, anchor, quote });
  return json({ id, url: `${BASE}/${ctx.lang}/q/${id}` }, 201);
}
