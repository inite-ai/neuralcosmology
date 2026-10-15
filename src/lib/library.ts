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

// Главы, которые сайт открывает сверх флага free из экспорта (content/free-chapters.json).
let extraFree: Record<string, string[]> | null = null;
function freeOverrides(): Record<string, string[]> {
  if (extraFree) return extraFree;
  try {
    const raw = JSON.parse(readFileSync(join(process.cwd(), "content/free-chapters.json"), "utf8")) as Record<string, unknown>;
    extraFree = Object.fromEntries(Object.entries(raw).filter(([k, v]) => !k.startsWith("_") && Array.isArray(v))) as Record<string, string[]>;
  } catch {
    extraFree = {};
  }
  return extraFree;
}

export function getManifest(slug: string, lang: SupportedLocale): LibraryManifest | null {
  if (!CHAPTER_ID.test(slug)) return null;
  return readCached(join(libraryDir(), slug, lang, "manifest.json"), (raw) => {
    const m = JSON.parse(raw) as LibraryManifest;
    const open = freeOverrides()[slug];
    if (open?.length) m.chapters = m.chapters.map((c) => (open.includes(c.id) ? { ...c, free: true } : c));
    return m;
  });
}

export function getChapterHtml(slug: string, lang: SupportedLocale, id: string): string | null {
  if (!CHAPTER_ID.test(slug) || !CHAPTER_ID.test(id)) return null;
  return readCached(join(libraryDir(), slug, lang, `${id}.html`), (raw) => raw);
}

export function libraryGeneratedAt(): string | null {
  return getIndex()?.generatedAt ?? null;
}

// Открытое начало платной главы — его видят гости и поиск (Google: lead-in при
// разметке isAccessibleForFree). Режем по разрыву сцены, если первая сцена занимает
// 15–30 % главы, иначе после абзаца ближе всего к 22 %. Короткие главы не открываем.
export const LEAD_IN_SHARE = 0.22;
const LEAD_IN_MIN = 6000;

/** Позиция стоит вне цитаты, списка или вставки — разрез там не рвёт тег. */
export function topLevelAt(html: string, i: number): boolean {
  const head = html.slice(0, i);
  return ["blockquote", "ul", "ol", "figure", "aside", "div", "table"].every(
    (tag) => (head.match(new RegExp(`<${tag}\\b`, "g")) ?? []).length === (head.match(new RegExp(`</${tag}>`, "g")) ?? []).length,
  );
}

export function leadIn(html: string | null): string | null {
  if (!html || html.length < LEAD_IN_MIN) return null;
  const n = html.length;
  const scene = [...html.matchAll(/<hr class="scene"\s*\/?>/g)].map((m) => m.index!).find((i) => i > n * 0.15 && i < n * 0.3);
  if (scene !== undefined) return html.slice(0, scene);
  const ends = [...html.matchAll(/<\/p>/g)].map((m) => m.index! + 4).filter((i) => i > n * 0.15 && i < n * 0.3 && topLevelAt(html, i));
  if (!ends.length) return null;
  const at = ends.reduce((best, i) => (Math.abs(i - n * LEAD_IN_SHARE) < Math.abs(best - n * LEAD_IN_SHARE) ? i : best));
  return html.slice(0, at);
}

/** Глава видна поиску: бесплатная целиком или платная с открытым началом. */
export function chapterIndexable(slug: string, lang: SupportedLocale, c: LibraryChapter): boolean {
  return c.free || leadIn(getChapterHtml(slug, lang, c.id)) !== null;
}
