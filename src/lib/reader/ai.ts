import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// ИИ сайта на Claude. Модель по умолчанию — claude-opus-5 (переопределяется AI_MODEL).
// Серверный fallback на отказы (fallbacks: "default") включён для всех запросов.
// Компаньон читалки идёт через @inite/reader (src/lib/reader/reader.server.ts) с теми же
// моделью и настройками; здесь — короткие ответы: пересказы, модерация, подписи цитат.

export const AI_MODEL = () => process.env.AI_MODEL || "claude-opus-5";
export const AI_BETAS = ["server-side-fallback-2026-07-01"];

let client: Anthropic | null = null;
export const aiConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY);
const anthropic = () => (client ??= new Anthropic());

export async function complete(systemText: string, user: string, maxTokens: number, effort: "low" | "medium"): Promise<string> {
  const res = await anthropic().beta.messages.create({
    model: AI_MODEL(),
    max_tokens: maxTokens,
    betas: AI_BETAS,
    fallbacks: "default",
    output_config: { effort },
    system: systemText,
    messages: [{ role: "user", content: user }],
  });
  if (res.stop_reason === "refusal") return "";
  return res.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("").trim();
}
