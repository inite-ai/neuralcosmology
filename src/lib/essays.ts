import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { SupportedLocale } from "@/lib/get-locale";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/get-locale";

const ESSAYS_DIR = path.join(process.cwd(), "content", "essays");

export interface EssayMeta {
  slug: string;
  locale: SupportedLocale;
  title: string;
  description: string;
  date: string;
  author?: string;
  cover?: string;
  tags?: string[];
  readingTime?: number;
  availableLocales: SupportedLocale[];
}

export interface Essay extends EssayMeta {
  content: string;
}

function localeDir(locale: SupportedLocale) {
  return path.join(ESSAYS_DIR, locale);
}

function listSlugsInLocale(locale: SupportedLocale): string[] {
  const dir = localeDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

function readRawBySlug(locale: SupportedLocale, slug: string): string | null {
  const mdx = path.join(localeDir(locale), `${slug}.mdx`);
  const md = path.join(localeDir(locale), `${slug}.md`);
  const file = fs.existsSync(mdx) ? mdx : fs.existsSync(md) ? md : null;
  if (!file) return null;
  return fs.readFileSync(file, "utf8");
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function parse(
  slug: string,
  locale: SupportedLocale,
  raw: string,
  available: SupportedLocale[],
): Essay {
  const { data, content } = matter(raw);
  return {
    slug,
    locale,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    author: data.author ? String(data.author) : undefined,
    cover: data.cover ? String(data.cover) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    readingTime:
      typeof data.readingTime === "number"
        ? data.readingTime
        : estimateReadingTime(content),
    availableLocales: available,
    content,
  };
}

export function getAllSlugs(): string[] {
  const set = new Set<string>();
  SUPPORTED_LOCALES.forEach((l) => listSlugsInLocale(l).forEach((s) => set.add(s)));
  return Array.from(set);
}

function getAvailableLocales(slug: string): SupportedLocale[] {
  return SUPPORTED_LOCALES.filter(
    (l) =>
      fs.existsSync(path.join(localeDir(l), `${slug}.mdx`)) ||
      fs.existsSync(path.join(localeDir(l), `${slug}.md`)),
  );
}

export function getEssayBySlug(slug: string, locale: SupportedLocale): Essay | null {
  const available = getAvailableLocales(slug);
  if (available.length === 0) return null;
  const useLocale: SupportedLocale = available.includes(locale)
    ? locale
    : available.includes(DEFAULT_LOCALE)
      ? DEFAULT_LOCALE
      : available[0];
  const raw = readRawBySlug(useLocale, slug);
  if (!raw) return null;
  return parse(slug, useLocale, raw, available);
}

export function listEssays(locale: SupportedLocale): EssayMeta[] {
  const slugs = getAllSlugs();
  const items = slugs
    .map((slug) => getEssayBySlug(slug, locale))
    .filter((e): e is Essay => e !== null)
    .map(({ content: _ignored, ...meta }) => meta);
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}
