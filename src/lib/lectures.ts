import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { SupportedLocale } from "@/lib/get-locale";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/get-locale";

const LECTURES_DIR = path.join(process.cwd(), "content", "lectures");

export interface LectureMeta {
  slug: string;
  locale: SupportedLocale;
  title: string;
  description: string;
  date: string;
  videoUrl?: string;
  cover?: string;
  durationMinutes?: number;
  tags?: string[];
  availableLocales: SupportedLocale[];
}

export interface Lecture extends LectureMeta {
  content: string;
}

function localeDir(locale: SupportedLocale) {
  return path.join(LECTURES_DIR, locale);
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

function parse(
  slug: string,
  locale: SupportedLocale,
  raw: string,
  available: SupportedLocale[],
): Lecture {
  const { data, content } = matter(raw);
  return {
    slug,
    locale,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    videoUrl: data.videoUrl ? String(data.videoUrl) : undefined,
    cover: data.cover ? String(data.cover) : undefined,
    durationMinutes:
      typeof data.durationMinutes === "number" ? data.durationMinutes : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
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

export function getLectureBySlug(
  slug: string,
  locale: SupportedLocale,
): Lecture | null {
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

export function listLectures(locale: SupportedLocale): LectureMeta[] {
  const slugs = getAllSlugs();
  const items = slugs
    .map((slug) => getLectureBySlug(slug, locale))
    .filter((l): l is Lecture => l !== null)
    .map(({ content: _ignored, ...meta }) => meta);
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function getEmbedUrl(videoUrl: string): string | null {
  const yt = getYoutubeId(videoUrl);
  if (yt) return `https://www.youtube.com/embed/${yt}`;
  if (/vimeo\.com\/(\d+)/.test(videoUrl)) {
    const id = videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}

export function getThumbnail(videoUrl?: string, cover?: string): string | null {
  if (cover) return cover;
  if (!videoUrl) return null;
  const yt = getYoutubeId(videoUrl);
  if (yt) return `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`;
  return null;
}
