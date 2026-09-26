import "server-only";
import { getBookBySlug } from "@/content/books";
import { getSession, type Session } from "@/lib/auth";
import { chapterGate, ownsBook } from "@/lib/access";
import { getManifest, getChapterHtml, type LibraryChapter, type LibraryManifest } from "@/lib/library";
import { isSupportedLocale, type SupportedLocale } from "@/lib/get-locale";
import { pickLocalized } from "@/lib/i18n";

// Общая проверка для API читалки: книга, язык, глава и доступ текущего читателя.

export interface ChapterContext {
  session: Session | null;
  book: string;
  lang: SupportedLocale;
  manifest: LibraryManifest;
  chapter: LibraryChapter;
  index: number;
  bookTitle: string;
  canRead: boolean;
}

export async function chapterContext(book: string, lang: string, chapterId: string): Promise<ChapterContext | null> {
  const b = getBookBySlug(book);
  if (!b || !isSupportedLocale(lang)) return null;
  const manifest = getManifest(book, lang);
  if (!manifest) return null;
  const index = manifest.chapters.findIndex((c) => c.id === chapterId);
  if (index < 0) return null;
  const chapter = manifest.chapters[index];
  const session = await getSession();
  const canRead = (await chapterGate(chapter, book, session)) === "open";
  return { session, book, lang, manifest, chapter, index, bookTitle: pickLocalized(b.titles, lang), canRead };
}

export const AUTHOR_EMAILS = () =>
  (process.env.AUTHOR_EMAILS || "mikefluff@mikefluff.com").split(",").map((s) => s.trim().toLowerCase());

export function isAuthor(s: Session | null): boolean {
  return Boolean(s?.email && AUTHOR_EMAILS().includes(s.email.toLowerCase()));
}

export function displayName(s: Session): string {
  return s.name?.trim() || s.email?.split("@")[0] || "reader";
}

/** Текст глав для ИИ: абзацы с якорями, только прочитанное и доступное (без спойлеров). */
export async function bookTextUpTo(ctx: ChapterContext): Promise<string> {
  const owns = await ownsBook(ctx.session, ctx.book);
  const parts: string[] = [];
  for (const c of ctx.manifest.chapters.slice(0, ctx.index + 1)) {
    if (!c.free && !owns) continue;
    const html = getChapterHtml(ctx.book, ctx.lang, c.id);
    if (!html) continue;
    const paras = [...html.matchAll(/<p[^>]*data-a="([^"]+)"[^>]*>([\s\S]*?)<\/p>/g)].map(
      (m) => `[${m[1]}] ${m[2].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim()}`,
    );
    parts.push(`## ${c.number ? `${c.number}. ` : ""}${c.title} {chapter:${c.id}}\n${paras.join("\n")}`);
  }
  return parts.join("\n\n");
}
