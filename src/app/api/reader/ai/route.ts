import type { NextRequest } from "next/server";
import { db, dbConfigured } from "@/lib/db";
import { chapterContext, bookTextUpTo } from "@/lib/reader/context";
import { aiConfigured, streamAnswer, chapterRecap } from "@/lib/reader/ai";
import { ownsBook, paywallEnabled } from "@/lib/access";
import { getChapterHtml } from "@/lib/library";
import { json, fail, clip } from "@/lib/reader/http";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// Лимиты: купившим книгу — 30 вопросов в день, вошедшим без покупки — 3 на пробу.
const LIMIT_OWNER = Number(process.env.AI_DAILY_LIMIT_OWNER || 30);
const LIMIT_TRIAL = Number(process.env.AI_DAILY_LIMIT_TRIAL || 3);

// POST {mode: "ask"|"explain", book, lang, chapter, ui, question?, selection?, history?} → text/plain stream
// POST {mode: "recap", book, lang, chapter, ui} → {recap: [{title, text}]} — бесплатно, из кэша
export async function POST(req: NextRequest) {
  if (!aiConfigured() || !dbConfigured()) return fail("ai_unavailable", 503);
  const b = await req.json().catch(() => null);
  if (!b) return fail("bad_request", 400);
  const ctx = await chapterContext(clip(b.book, 80), clip(b.lang, 8), clip(b.chapter, 80));
  if (!ctx) return fail("not_found", 404);
  if (!ctx.canRead) return fail("forbidden", 403);
  const ui = clip(b.ui, 8) || ctx.lang;

  if (b.mode === "recap") {
    // Пересказ глав, прочитанных до текущей (последние три), каждая кэшируется отдельно.
    const prev = ctx.manifest.chapters.slice(Math.max(0, ctx.index - 3), ctx.index);
    const owns = await ownsBook(ctx.session, ctx.book);
    const recap = [];
    for (const c of prev) {
      if (!c.free && !owns) continue;
      const html = getChapterHtml(ctx.book, ctx.lang, c.id);
      if (!html) continue;
      const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
      const value = await chapterRecap(`recap:${ctx.book}:${ctx.lang}:${c.id}:${c.hash}:${ui}`, c.title, text, ui);
      if (value) recap.push({ id: c.id, title: c.title, text: value });
    }
    return json({ recap });
  }

  if (b.mode !== "ask" && b.mode !== "explain") return fail("bad_request", 400);
  if (!ctx.session) return fail("unauthorized", 401);
  const limit = !paywallEnabled() || (await ownsBook(ctx.session, ctx.book)) ? LIMIT_OWNER : LIMIT_TRIAL;
  const sql = await db();
  const [usage] = await sql`INSERT INTO ai_usage (user_id, day, count) VALUES (${ctx.session.sub}, current_date, 1)
    ON CONFLICT (user_id, day) DO UPDATE SET count = ai_usage.count + 1 RETURNING count`;
  if (usage.count > limit) return fail("limit", 429);

  const selection = clip(b.selection, 1200);
  const question =
    b.mode === "explain"
      ? `Explain this fragment in the context of the book, briefly (what it means, why it matters here; for scientific terms — the precise meaning and source):\n\n"${selection}"`
      : clip(b.question, 1500);
  if (!question) return fail("empty", 400);
  const history = Array.isArray(b.history)
    ? b.history
        .filter((m: { role?: string; content?: unknown }) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .map((m: { role: "user" | "assistant"; content: string }) => ({ role: m.role, content: m.content.slice(0, 4000) }))
    : [];

  const stream = streamAnswer({ ctx, uiLang: ui, bookText: await bookTextUpTo(ctx), history, question });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-AI-Remaining": String(Math.max(0, limit - usage.count)),
    },
  });
}
