import type { SupportedLocale } from "@/lib/get-locale";

export interface ReadableEntry {
  slug: string;
  kind: "preprint" | "book-demo";
  relatedSlug?: string;
  titles: Partial<Record<SupportedLocale, string>> & { en: string };
  paths: Partial<Record<SupportedLocale, string>> & { en: string };
}

export const readables: ReadableEntry[] = [
  {
    slug: "pointer-architecture",
    kind: "preprint",
    titles: {
      en: "Pointer Architecture — preprint",
      ru: "Pointer Architecture — препринт",
      pt: "Pointer Architecture — preprint",
      es: "Pointer Architecture — preprint",
    },
    paths: {
      en: "/pdfs/pointer-architecture-v2.pdf",
      ru: "/pdfs/pointer-architecture-v2.pdf",
      pt: "/pdfs/pointer-architecture-v2.pdf",
      es: "/pdfs/pointer-architecture-v2.pdf",
    },
  },
  {
    slug: "celestial-code-demo",
    kind: "book-demo",
    relatedSlug: "celestial-code",
    titles: {
      en: "The Celestial Code — demo",
      ru: "Небесный Код — демо",
      pt: "O Código Celestial — demo",
      es: "El Código Celestial — demo",
    },
    paths: {
      en: "/pdfs/celestial-code-demo-en.pdf",
      ru: "/pdfs/celestial-code-demo-ru.pdf",
      pt: "/pdfs/celestial-code-demo-pt.pdf",
    },
  },
  {
    slug: "bugs-academy-demo",
    kind: "book-demo",
    relatedSlug: "bugs-academy",
    titles: {
      en: "Bugs Academy — demo",
      ru: "Академия Багов — демо",
      pt: "Academia dos Bugs — demo",
      es: "Academia de los Bugs — demo",
    },
    paths: {
      en: "/pdfs/bugs-academy-demo-en.pdf",
      ru: "/pdfs/bugs-academy-demo-ru.pdf",
      pt: "/pdfs/bugs-academy-demo-pt.pdf",
    },
  },
  {
    slug: "era-of-architects-demo",
    kind: "book-demo",
    relatedSlug: "era-of-architects",
    titles: {
      en: "Era of Architects — demo",
      ru: "Эра Архитекторов — демо",
      pt: "Era dos Arquitetos — demo",
      es: "Era de los Arquitectos — demo",
    },
    paths: {
      en: "/pdfs/era-of-architects-demo-en.pdf",
      ru: "/pdfs/era-of-architects-demo-ru.pdf",
      pt: "/pdfs/era-of-architects-demo-pt.pdf",
    },
  },
];

export function getReadable(slug: string): ReadableEntry | undefined {
  return readables.find((r) => r.slug === slug);
}

export function resolveReadablePath(
  entry: ReadableEntry,
  locale: SupportedLocale,
): { path: string; locale: SupportedLocale } {
  if (entry.paths[locale]) return { path: entry.paths[locale]!, locale };
  if (entry.paths.en) return { path: entry.paths.en, locale: "en" };
  const first = (Object.entries(entry.paths).find(([, v]) => v) ?? [])[0] as
    | SupportedLocale
    | undefined;
  if (first) return { path: entry.paths[first]!, locale: first };
  return { path: "", locale };
}

export function resolveReadableTitle(
  entry: ReadableEntry,
  locale: SupportedLocale,
): string {
  return entry.titles[locale] ?? entry.titles.en;
}
