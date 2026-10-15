import "server-only";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/get-locale";
import { listAnswers } from "@/lib/answers";
import { listEssays } from "@/lib/essays";
import { experiments } from "@/lib/interactive";
import { experimentView } from "@/lib/experiments";
import { books } from "@/content/books";
import { getManifest, libraryLangs } from "@/lib/library";
import { siteUrl } from "@/lib/auth";

// Поиск по сайту для агентов: ответы, эссе, опыты, книги и главы. Простой
// подсчёт совпадений слов — материалов сотни, индекс не нужен.

export type Hit = { type: string; title: string; url: string; markdown: string; snippet: string; locale: SupportedLocale };
type Doc = Hit & { title_: string; text: string };

const words = (s: string) => s.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").match(/[\p{L}\p{N}]+/gu) ?? [];

function docs(locale: SupportedLocale): Doc[] {
  const site = siteUrl();
  const mk = (type: string, path: string, title: string, snippet: string, text: string): Doc => ({
    type,
    title,
    url: `${site}${path}`,
    markdown: `${site}${path}.md`,
    snippet,
    locale,
    title_: title,
    text: `${title} ${snippet} ${text}`,
  });
  const out: Doc[] = [];
  for (const a of listAnswers(locale)) out.push(mk("answer", `/${locale}/answers/${a.slug}`, a.question, a.answer, `${a.title} ${a.keywords.join(" ")}`));
  for (const e of listEssays(locale)) out.push(mk("essay", `/${locale}/essays/${e.slug}`, e.title, e.description, (e.tags ?? []).join(" ")));
  for (const it of experiments()) {
    const v = experimentView(it, locale);
    if (v) out.push(mk("experiment", `/${locale}/experiments/${v.id}`, v.seo?.title ?? v.title, v.seo?.description ?? v.caption, `${v.title} ${v.caption}`));
  }
  for (const b of books) {
    const title = b.titles[locale] ?? b.titles.en;
    out.push(mk("book", `/${locale}/books/${b.slug}`, title, b.hook[locale] ?? b.hook.en, b.synopsis[locale] ?? b.synopsis.en));
    if (!libraryLangs(b.slug).includes(locale)) continue;
    for (const c of getManifest(b.slug, locale)?.chapters ?? []) {
      out.push(mk("chapter", `/${locale}/read/${b.slug}/${c.id}`, `${c.title} · ${title}`, c.excerpt, ""));
    }
  }
  return out;
}

export function search(query: string, locale?: SupportedLocale, limit = 10): Hit[] {
  const q = [...new Set(words(query))].filter((w) => w.length > 1);
  if (q.length === 0) return [];
  const locales = locale ? [locale] : /[Ѐ-ӿ]/.test(query) ? (["ru"] as SupportedLocale[]) : SUPPORTED_LOCALES;
  const scored = locales.flatMap(docs).map((d) => {
    const t = words(d.title_);
    const all = words(d.text);
    let score = 0;
    for (const w of q) {
      score += t.filter((x) => x.startsWith(w)).length * 3;
      score += all.filter((x) => x.startsWith(w)).length;
    }
    return { d, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, Math.min(limit, 25)))
    .map(({ d }) => ({ type: d.type, title: d.title, url: d.url, markdown: d.markdown, snippet: d.snippet, locale: d.locale }));
}
