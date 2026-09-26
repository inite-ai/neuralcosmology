import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import type { ChapterContext } from "@/lib/reader/context";

// ИИ читалки на Claude. Модель по умолчанию — claude-opus-5 (переопределяется AI_MODEL).
// Серверный fallback на отказы (fallbacks: "default") включён для всех запросов.

const MODEL = () => process.env.AI_MODEL || "claude-opus-5";
const BETAS = ["server-side-fallback-2026-07-01"];

let client: Anthropic | null = null;
export const aiConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY);
const anthropic = () => (client ??= new Anthropic());

const LANG_NAME: Record<string, string> = { ru: "Russian", en: "English", pt: "Brazilian Portuguese", es: "Spanish" };

function system(ctx: ChapterContext, uiLang: string) {
  return [
    `You are the reading companion inside the online edition of "${ctx.bookTitle}" by Mikhail Savchenko (neuralcosmology.com).`,
    `The reader is currently in chapter "${ctx.chapter.title}". Below is the full text of the book UP TO AND INCLUDING that chapter — nothing later.`,
    "Rules:",
    "- Answer only from this text and general knowledge needed to explain it. Never reveal or guess what happens later in the book; if asked, say it will become clear further on.",
    "- When you rely on a passage, cite it inline as [[anchor]] using the paragraph id shown in square brackets at the start of each paragraph, e.g. [[8fb83d00]]. Cite 1–3 passages, not more.",
    "- Be concise and concrete: 2–6 short paragraphs, no headings, no bullet lists unless the question asks for a list.",
    `- Write in ${LANG_NAME[uiLang] ?? "the reader's language"}.`,
  ].join("\n");
}

function bookBlock(bookText: string): Anthropic.Beta.BetaTextBlockParam {
  // Текст книги до текущей главы — стабильный префикс, кэшируется на час.
  return { type: "text", text: `<book>\n${bookText}\n</book>`, cache_control: { type: "ephemeral", ttl: "1h" } };
}

/** Потоковый ответ «Спросить книгу» / «Объясни»: отдаёт ReadableStream текста. */
export function streamAnswer(opts: {
  ctx: ChapterContext;
  uiLang: string;
  bookText: string;
  history: { role: "user" | "assistant"; content: string }[];
  question: string;
}): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    { role: "user", content: [bookBlock(opts.bookText), { type: "text", text: "This is the book so far. My questions follow." }] },
    { role: "assistant", content: "Understood. Ask away." },
    ...opts.history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: opts.question },
  ];
  return new ReadableStream({
    async start(controller) {
      try {
        const stream = anthropic().beta.messages.stream({
          model: MODEL(),
          max_tokens: 4000,
          betas: BETAS,
          fallbacks: "default",
          thinking: { type: "adaptive" },
          output_config: { effort: "medium" },
          system: system(opts.ctx, opts.uiLang),
          messages,
        });
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(enc.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") controller.enqueue(enc.encode("\n\n—"));
      } catch (err) {
        console.error("[ai] stream failed:", err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err);
        controller.enqueue(enc.encode("\n\n[error]"));
      } finally {
        controller.close();
      }
    },
  });
}

async function complete(systemText: string, user: string, maxTokens: number, effort: "low" | "medium"): Promise<string> {
  const res = await anthropic().beta.messages.create({
    model: MODEL(),
    max_tokens: maxTokens,
    betas: BETAS,
    fallbacks: "default",
    output_config: { effort },
    system: systemText,
    messages: [{ role: "user", content: user }],
  });
  if (res.stop_reason === "refusal") return "";
  return res.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("").trim();
}

/** Короткий пересказ одной главы; кэшируется в БД по хешу главы — генерируется один раз. */
export async function chapterRecap(key: string, chapterTitle: string, chapterText: string, uiLang: string): Promise<string> {
  const sql = await db();
  const [hit] = await sql`SELECT value FROM ai_cache WHERE key = ${key}`;
  if (hit) return hit.value as string;
  const text = await complete(
    `You write spoiler-safe "previously on" recaps for readers returning to a book. Write in ${LANG_NAME[uiLang] ?? "the book's language"}. 2–3 sentences, plain prose, present tense, no quotes, no judgement, no mention of "this chapter".`,
    `Chapter "${chapterTitle}":\n\n${chapterText.slice(0, 60000)}`,
    600,
    "low",
  );
  if (text) await sql`INSERT INTO ai_cache (key, value) VALUES (${key}, ${text}) ON CONFLICT (key) DO NOTHING`;
  return text;
}

/** Премодерация комментария. true — публиковать. При сбое ИИ пропускаем (автор может скрыть). */
export async function moderate(body: string): Promise<boolean> {
  if (!aiConfigured()) return true;
  try {
    const verdict = await complete(
      "You moderate reader comments on a book website. Reply with exactly one word: ALLOW or REJECT. REJECT only spam, advertising, scams, harassment, hate, sexual content, or doxxing. Criticism of the book or author, disagreement, and strong language used without targeting a person are ALLOW.",
      body,
      16,
      "low",
    );
    return !/REJECT/i.test(verdict);
  } catch (err) {
    console.error("[ai] moderation failed:", err instanceof Anthropic.APIError ? err.status : err);
    return true;
  }
}
