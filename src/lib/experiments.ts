import "server-only";
import { getBookBySlug } from "@/content/books";
import { illustrations } from "@/lib/illustrations";
import { getManifest, resolveBookLang } from "@/lib/library";
import { pickLocalized } from "@/lib/i18n";
import type { SupportedLocale } from "@/lib/get-locale";
import type { InteractiveItem } from "@/lib/interactive";

// Опыт как самостоятельная страница: книга, глава, ссылка прямо на место в тексте
// и картинка — иллюстрация той же главы, ближайшая к сцене опыта.

export type ExperimentView = {
  id: string;
  widget: string;
  props?: Record<string, unknown>;
  title: string;
  caption: string;
  bookSlug: string;
  bookTitle: string;
  lang: SupportedLocale;
  chapter: { id: string; title: string; number: number | null; free: boolean; excerpt: string } | null;
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
    bookSlug: it.book,
    bookTitle: pickLocalized(book.titles, locale),
    lang,
    chapter: ch ? { id: ch.id, title: ch.title, number: ch.number, free: ch.free, excerpt: ch.excerpt } : null,
    href: `/${lang}/read/${it.book}/${it.chapter}#x-${it.id}`,
    image: ill ? `/book/ill/${ill.id}.webp` : null,
    ogImage: ill ? `/book/ill/${ill.id}.og.jpg` : null,
  };
}
