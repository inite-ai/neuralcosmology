import "server-only";
import { books, getBookBySlug } from "@/content/books";
import { db } from "@/lib/db";
import { getChapterHtml, getManifest, libraryLangs } from "@/lib/library";
import { pickLocalized } from "@/lib/i18n";
import { aiConfigured, complete } from "@/lib/reader/ai";
import { excerpt, signed } from "@/lib/reader/quote";
import { getShare, plain, quoteInChapter, saveShare, type Share } from "@/lib/reader/share";
import type { SupportedLocale } from "@/lib/get-locale";
import type { Post } from "@/lib/social/networks";

// Очередь цитат для автопостинга. Claude выбирает из главы фразы, которые понятны
// без контекста; каждая сверяется с текстом главы дословно и сохраняется как обычная
// цитата «Поделиться» (/q/{id} и карточка PNG). Выдуманная фраза в очередь не попадёт.

const LANG_NAME: Record<string, string> = { ru: "Russian", en: "English", pt: "Brazilian Portuguese", es: "Spanish" };
const MIN_QUEUE = 5;
const MIN_WORDS = 800;

/** Цитаты языка, не снятые автором и ещё не вышедшие в этом аккаунте (без аккаунта — нигде). */
export async function queued(lang: string, limit = 20, accountId?: string) {
  const sql = await db();
  return sql<{ share_id: string; book: string; chapter: string; quote: string }[]>`
    SELECT q.share_id, q.book, q.chapter, s.quote FROM social_quotes q JOIN shares s ON s.id = q.share_id
    WHERE q.lang = ${lang} AND NOT q.skipped
      AND NOT EXISTS (SELECT 1 FROM social_posts p WHERE p.share_id = q.share_id ${accountId ? sql`AND p.account_id = ${accountId}` : sql``})
    ORDER BY q.created_at LIMIT ${limit}`;
}

/** Глава, из которой цитат взято меньше всего и которую ИИ ещё не разбирал. */
async function nextChapter(lang: SupportedLocale): Promise<{ book: string; chapter: string; hash: string } | null> {
  const sql = await db();
  const used = new Map(
    (await sql`SELECT book, chapter, count(*)::int AS n FROM social_quotes WHERE lang = ${lang} GROUP BY book, chapter`).map((r) => [`${r.book}/${r.chapter}`, r.n as number]),
  );
  const tried = new Set((await sql`SELECT key FROM ai_cache WHERE key LIKE ${`social-quotes:${lang}:%`}`).map((r) => r.key as string));
  const options = books
    .filter((b) => libraryLangs(b.slug).includes(lang))
    .flatMap((b) => (getManifest(b.slug, lang)?.chapters ?? []).filter((c) => c.words >= MIN_WORDS).map((c) => ({ book: b.slug, chapter: c.id, hash: c.hash })))
    .filter((c) => !tried.has(`social-quotes:${lang}:${c.book}:${c.chapter}:${c.hash}`));
  if (!options.length) return null;
  const least = Math.min(...options.map((c) => used.get(`${c.book}/${c.chapter}`) ?? 0));
  const pool = options.filter((c) => (used.get(`${c.book}/${c.chapter}`) ?? 0) === least);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Достаёт из главы 3–6 цитат и кладёт в очередь те, что дословно есть в тексте. */
async function harvest(lang: SupportedLocale, book: string, chapter: string, hash: string): Promise<number> {
  const sql = await db();
  const html = getChapterHtml(book, lang, chapter);
  if (!html) return 0;
  const paras = [...html.matchAll(/<p\b[^>]*data-a="([^"]+)"[^>]*>([\s\S]*?)<\/p>/g)].map((m) => `[${m[1]}] ${plain(m[2])}`).filter((p) => p.length > 60);
  const title = pickLocalized(getBookBySlug(book)!.titles, lang);
  const answer = await complete(
    [
      `You pick quotes from the book "${title}" by Mikhail Savchenko for the author's social media (Telegram, Threads, Facebook).`,
      "Each quote must:",
      "- be copied VERBATIM from ONE paragraph: same words, same punctuation, nothing added, removed or reordered;",
      "- be 1–3 consecutive whole sentences, 80–280 characters;",
      "- make sense on its own, with no context, no pronouns pointing outside the quote, no 'as shown above';",
      "- carry a striking idea or image a reader would want to share; skip formulas, numbers-only statements, citations, footnote markers and dialogue tags.",
      `The text is in ${LANG_NAME[lang] ?? lang}; do not translate.`,
      'Reply with JSON only: [{"anchor": "<paragraph id from the square brackets>", "quote": "<text>"}], 3 to 6 items, best first. Reply [] if nothing fits.',
    ].join("\n"),
    paras.join("\n").slice(0, 80_000),
    3000,
    "medium",
  );
  await sql`INSERT INTO ai_cache (key, value) VALUES (${`social-quotes:${lang}:${book}:${chapter}:${hash}`}, ${answer || "[]"}) ON CONFLICT (key) DO NOTHING`;
  let items: { anchor?: unknown; quote?: unknown }[] = [];
  try {
    const parsed = JSON.parse(answer.slice(answer.indexOf("["), answer.lastIndexOf("]") + 1));
    if (Array.isArray(parsed)) items = parsed;
  } catch {
    return 0;
  }
  let added = 0;
  for (const it of items.slice(0, 6)) {
    if (typeof it.anchor !== "string" || typeof it.quote !== "string") continue;
    const quote = it.quote.replace(/\s+/g, " ").trim();
    if (quote.length < 40 || quote.length > 300 || /…$/.test(quote)) continue;
    if (!quoteInChapter(book, lang, chapter, it.anchor, quote)) continue;
    const id = await saveShare({ book, lang, chapter, anchor: it.anchor, quote });
    const r = await sql`INSERT INTO social_quotes (share_id, lang, book, chapter) VALUES (${id}, ${lang}, ${book}, ${chapter}) ON CONFLICT DO NOTHING RETURNING share_id`;
    added += r.length;
  }
  return added;
}

/** Доливает очередь, пока у каждого аккаунта языка не будет MIN_QUEUE цитат; за вызов — до трёх глав. */
export async function refill(lang: SupportedLocale, accountIds: string[]): Promise<number> {
  if (!aiConfigured()) return 0;
  const short = async () => {
    for (const id of accountIds.length ? accountIds : [undefined]) if ((await queued(lang, MIN_QUEUE, id)).length < MIN_QUEUE) return true;
    return false;
  };
  let added = 0;
  for (let i = 0; i < 3 && (await short()); i++) {
    const next = await nextChapter(lang);
    if (!next) break;
    added += await harvest(lang, next.book, next.chapter, next.hash);
  }
  return added;
}

const CTA: Record<string, string> = { ru: "Читать с этого места", en: "Read from here", pt: "Ler a partir daqui", es: "Leer desde aquí" };
const SITE = () => process.env.NEXT_PUBLIC_SITE_URL || "https://neuralcosmology.com";

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Текст поста: цитата с подписью и ссылка на то место в книге, откуда она взята. */
export function postFor(s: Share, network: string): Post {
  const b = getBookBySlug(s.book);
  const title = b ? pickLocalized(b.titles, s.lang) : s.book;
  const link = `${SITE()}/${s.lang}/q/${s.id}?${new URLSearchParams({ utm_source: network, utm_medium: "social", utm_campaign: "quotes" })}`;
  // Threads — 500 знаков на весь пост, Telegram — 1024 на подпись к фото.
  const line = signed(excerpt(s.quote, 300), title, s.lang);
  const cta = CTA[s.lang] ?? CTA.en;
  return {
    text: `${line}\n\n${cta}: ${link}`,
    html: `${escapeHtml(line)}\n\n<a href="${escapeHtml(link)}">${cta}</a>`,
    image: `${SITE()}/api/quote-card?id=${s.id}`,
    link,
  };
}

export { getShare };
