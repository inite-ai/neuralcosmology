import type { SupportedLocale } from "@/lib/get-locale";

export interface ReadableEntry {
  slug: string;
  kind: "preprint";
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
