import "server-only";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { SupportedLocale } from "@/lib/get-locale";

// Экспорт книг из LaTeX-исходников (godacademy/scripts/reader-export.mjs).
// На сервере лежит в /opt/projects/neurocosmology/library/current и
// подменяется GitHub Action'ом — поэтому читаем с диска на каждый запрос,
// кэшируя по mtime, а не импортируем на этапе сборки.

export interface LibraryChapter {
  id: string;
  title: string;
  number: number | null;
  part: string | null;
  free: boolean;
  words: number;
  minutes: number;
  excerpt: string;
  teaser: string;
  hash: string;
}

export interface LibraryManifest {
  slug: string;
  lang: SupportedLocale;
  title: string | null;
  version: string | null;
  chapters: LibraryChapter[];
  words: number;
  hash: string;
}

interface LibraryIndex {
  generatedAt: string;
  commit: string | null;
  books: { slug: string; version: string | null; langs: { lang: SupportedLocale }[] }[];
}

const CHAPTER_ID = /^[A-Za-z0-9_-]+$/;
// Порядок, в котором ищем язык, если книги нет на языке интерфейса.
const LANG_FALLBACK: SupportedLocale[] = ["en", "ru", "pt"];

function libraryDir(): string {
  return process.env.LIBRARY_DIR || "/app/library/current";
}

const cache = new Map<string, { mtime: number; value: unknown }>();

function readCached<T>(path: string, parse: (raw: string) => T): T | null {
  let mtime: number;
  try {
    mtime = statSync(path).mtimeMs;
  } catch {
    return null;
  }
  const hit = cache.get(path);
  if (hit && hit.mtime === mtime) return hit.value as T;
  const value = parse(readFileSync(path, "utf8"));
  cache.set(path, { mtime, value });
  return value;
}

function getIndex(): LibraryIndex | null {
  return readCached(join(libraryDir(), "index.json"), JSON.parse);
}

export function libraryLangs(slug: string): SupportedLocale[] {
  return getIndex()?.books.find((b) => b.slug === slug)?.langs.map((l) => l.lang) ?? [];
}

export function isInLibrary(slug: string): boolean {
  return libraryLangs(slug).length > 0;
}

/** Язык, на котором показываем книгу: язык интерфейса или ближайший доступный. */
export function resolveBookLang(slug: string, locale: SupportedLocale): SupportedLocale | null {
  const langs = libraryLangs(slug);
  if (langs.includes(locale)) return locale;
  return LANG_FALLBACK.find((l) => langs.includes(l)) ?? langs[0] ?? null;
}

export function getManifest(slug: string, lang: SupportedLocale): LibraryManifest | null {
  if (!CHAPTER_ID.test(slug)) return null;
  return readCached(join(libraryDir(), slug, lang, "manifest.json"), JSON.parse);
}

export function getChapterHtml(slug: string, lang: SupportedLocale, id: string): string | null {
  if (!CHAPTER_ID.test(slug) || !CHAPTER_ID.test(id)) return null;
  return readCached(join(libraryDir(), slug, lang, `${id}.html`), (raw) => raw);
}

export function libraryGeneratedAt(): string | null {
  return getIndex()?.generatedAt ?? null;
}
