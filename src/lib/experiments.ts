import "server-only";
import { getBookBySlug } from "@/content/books";
import { countScenes, illustrations, placeAtScenes } from "@/lib/illustrations";
import { getChapterHtml, getManifest, resolveBookLang } from "@/lib/library";
import { pickLocalized } from "@/lib/i18n";
import type { SupportedLocale } from "@/lib/get-locale";
import type { InteractiveItem } from "@/lib/interactive";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Опыт как самостоятельная страница: книга, глава, ссылка прямо на место в тексте
// и картинка — иллюстрация той же главы, ближайшая к сцене опыта.

export type ExperimentView = {
  id: string;
  widget: string;
  props?: Record<string, unknown>;
  title: string;
  caption: string;
  /** Как явление ищут (content/interactive-seo.json): для <title>, description и подзаголовка. */
  seo: { title: string; description: string } | null;
  bookSlug: string;
  bookTitle: string;
  lang: SupportedLocale;
  chapter: { id: string; title: string; number: number | null; free: boolean; excerpt: string } | null;
  /** Абзацы главы, между которыми опыт стоит в книге: что книга говорит о нём. */
  passage: string[];
  href: string;
  image: string | null;
  ogImage: string | null;
};

export function experimentView(it: InteractiveItem, locale: SupportedLocale): ExperimentView | null {
  const book = getBookBySlug(it.book);
  if (!book) return null;
  const lang = resolveBookLang(it.book, locale) ?? locale;
  const ch = getManifest(it.book, lang)?.chapters.find((c) => c.id === it.chapter) ?? null;
  const ills = illustrations(it.book, it.chapter);
  const ill = [...ills].filter((x) => x.scene <= it.scene).sort((a, b) => b.scene - a.scene)[0] ?? ills[0] ?? null;
  return {
    id: it.id,
    widget: it.widget,
    props: it.props,
    title: it.title[locale] ?? it.title.en,
    caption: it.caption[locale] ?? it.caption.en,
    seo: seoFor(it.id, locale),
    bookSlug: it.book,
    bookTitle: pickLocalized(book.titles, locale),
    lang,
    chapter: ch ? { id: ch.id, title: ch.title, number: ch.number, free: ch.free, excerpt: ch.excerpt } : null,
    passage: ch ? bookPassage(it, lang) : [],
    href: `/${lang}/read/${it.book}/${it.chapter}#x-${it.id}`,
    image: ill ? `/book/ill/${ill.id}.webp` : null,
    ogImage: ill ? `/book/ill/${ill.id}.og.jpg` : null,
  };
}

type SeoEntry = { title: Record<string, string>; description: Record<string, string> };
let seoCache: Record<string, SeoEntry> | null = null;
function seoFor(id: string, locale: SupportedLocale): ExperimentView["seo"] {
  if (!seoCache || process.env.NODE_ENV !== "production") {
    try {
      seoCache = JSON.parse(readFileSync(join(process.cwd(), "content/interactive-seo.json"), "utf8")) as Record<string, SeoEntry>;
    } catch {
      seoCache = {};
    }
  }
  const e = seoCache[id];
  const title = e?.title?.[locale];
  const description = e?.description?.[locale];
  return title && description ? { title, description } : null;
}

const MARK = "<!--nc-x-here-->";
const PARA = /<p\b[^>]*>([\s\S]*?)<\/p>/g;
const ENT: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const text = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e: string) =>
      e[0] === "#" ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : (ENT[e] ?? m),
    )
    .replace(/\s+/g, " ")
    .trim();

// Длинный абзац режем по концу предложения, чтобы цитата не превращалась в главу.
function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  return (end > max / 3 ? cut.slice(0, end + 1) : cut.slice(0, cut.lastIndexOf(" "))) + " …";
}

/**
 * Что книга говорит рядом с опытом: абзацы перед местом вставки (если опыт стоит в конце
 * сцены) или после него (в начале сцены), около 450 знаков. Место ищется так же, как
 * в читалке, — по сценам русского оригинала.
 */
function bookPassage(it: InteractiveItem, lang: SupportedLocale): string[] {
  const html = getChapterHtml(it.book, lang, it.chapter);
  if (!html) return [];
  const scenes = countScenes(lang === "ru" ? html : getChapterHtml(it.book, "ru", it.chapter));
  const marked = placeAtScenes(html, [{ scene: it.scene, at: it.at ?? "end", html: MARK }], scenes);
  const at = marked.indexOf(MARK);
  if (at < 0) return [];
  const before = (it.at ?? "end") === "end";
  const paras = [...(before ? marked.slice(0, at) : marked.slice(at)).matchAll(PARA)].map((m) => text(m[1])).filter(Boolean);
  if (before) paras.reverse();
  const out: string[] = [];
  let n = 0;
  for (const p of paras) {
    out.push(clip(p, 600));
    n += p.length;
    if (n > 450 || out.length >= 3) break;
  }
  return before ? out.reverse() : out;
}
