// Прогресс чтения живёт в браузере: какие главы начаты/прочитаны и где
// читатель остановился. Всё в try/catch — приватный режим и заблокированное
// хранилище не должны ломать читалку.

export type ChapterStatus = "reading" | "read";

export interface BookProgress {
  last?: string;
  chapters: Record<string, ChapterStatus>;
}

const key = (slug: string, lang: string) => `nc-progress:${slug}:${lang}`;

export function loadProgress(slug: string, lang: string): BookProgress {
  try {
    const raw = localStorage.getItem(key(slug, lang));
    if (raw) {
      const parsed = JSON.parse(raw) as BookProgress;
      return { last: parsed.last, chapters: parsed.chapters ?? {} };
    }
  } catch {}
  return { chapters: {} };
}

export function saveProgress(slug: string, lang: string, p: BookProgress) {
  try {
    localStorage.setItem(key(slug, lang), JSON.stringify(p));
    window.dispatchEvent(new CustomEvent("nc-progress", { detail: { slug, lang } }));
  } catch {}
}

export function markChapter(slug: string, lang: string, id: string, status: ChapterStatus) {
  const p = loadProgress(slug, lang);
  if (p.chapters[id] === "read" && status === "reading") {
    p.last = id;
  } else {
    p.chapters[id] = status;
    p.last = id;
  }
  saveProgress(slug, lang, p);
}

// ---------- reader prefs ----------

export type ReaderTheme = "dark" | "light" | "sepia";
export type ReaderSize = "s" | "m" | "l" | "xl";

export const PREFS_KEY = "nc-reader-prefs";

export function loadPrefs(): { theme: ReaderTheme; size: ReaderSize } {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return { theme: p.theme ?? "dark", size: p.size ?? "m" };
    }
  } catch {}
  return { theme: "dark", size: "m" };
}

export function savePrefs(prefs: { theme: ReaderTheme; size: ReaderSize }) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {}
}
