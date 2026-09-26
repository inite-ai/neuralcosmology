import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { SupportedLocale } from "@/lib/get-locale";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/get-locale";

// Страницы-ответы: один вопрос, прямой ответ в первых строках, разбор, FAQ,
// ссылки на эссе, препринт и книги. content/answers/<locale>/<slug>.mdx

export type AnswerMeta = {
  slug: string;
  locale: SupportedLocale;
  title: string;
  description: string;
  question: string;
  answer: string;
  date: string;
  updated: string;
  image?: string;
  order: number;
  keywords: string[];
  essays: string[];
  books: string[];
  paper: boolean;
  faq: { question: string; answer: string }[];
  availableLocales: SupportedLocale[];
};

export type Answer = AnswerMeta & { content: string };

const DIR = path.join(process.cwd(), "content", "answers");

const file = (locale: SupportedLocale, slug: string) => path.join(DIR, locale, `${slug}.mdx`);

export function getAllAnswerSlugs(): string[] {
  const all = new Set<string>();
  for (const l of SUPPORTED_LOCALES) {
    const dir = path.join(DIR, l);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) if (f.endsWith(".mdx")) all.add(f.replace(/\.mdx$/, ""));
  }
  return [...all];
}

const day = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? "").slice(0, 10));
const list = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);

export function getAnswer(slug: string, locale: SupportedLocale): Answer | null {
  const available = SUPPORTED_LOCALES.filter((l) => fs.existsSync(file(l, slug)));
  if (!available.length) return null;
  const use = available.includes(locale) ? locale : available.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : available[0];
  const { data, content } = matter(fs.readFileSync(file(use, slug), "utf8"));
  return {
    slug,
    locale: use,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    question: String(data.question ?? data.title ?? slug),
    answer: String(data.answer ?? ""),
    date: day(data.date),
    updated: day(data.updated ?? data.date),
    image: data.image ? String(data.image) : undefined,
    order: typeof data.order === "number" ? data.order : 99,
    keywords: list(data.keywords),
    essays: list(data.essays),
    books: list(data.books),
    paper: Boolean(data.paper),
    faq: Array.isArray(data.faq)
      ? data.faq.map((f: { q?: unknown; a?: unknown }) => ({ question: String(f.q ?? ""), answer: String(f.a ?? "") }))
      : [],
    availableLocales: available,
    content,
  };
}

export function listAnswers(locale: SupportedLocale): AnswerMeta[] {
  return getAllAnswerSlugs()
    .map((s) => getAnswer(s, locale))
    .filter((a): a is Answer => a !== null)
    .map(({ content: _c, ...meta }) => meta)
    .sort((a, b) => a.order - b.order);
}

// Ответы, которые ссылаются на это эссе, — для обратных ссылок из эссе.
export function answersForEssay(essaySlug: string, locale: SupportedLocale): AnswerMeta[] {
  return listAnswers(locale).filter((a) => a.essays.includes(essaySlug));
}
