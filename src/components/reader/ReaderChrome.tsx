"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { List, X, Type, LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import TocList, { type TocItem, type TocLabels } from "./TocList";
import {
  loadPrefs,
  savePrefs,
  markChapter,
  type ReaderSize,
  type ReaderTheme,
} from "./progress";

export interface ReaderChromeLabels extends TocLabels {
  contents: string;
  openContents: string;
  closeContents: string;
  textSize: string;
  theme: string;
  themeDark: string;
  themeLight: string;
  themeSepia: string;
  signIn: string;
  signOut: string;
  backToBook: string;
}

const SIZES: ReaderSize[] = ["s", "m", "l", "xl"];

export default function ReaderChrome({
  fontClass,
  slug,
  lang,
  hrefBase,
  currentId,
  bookTitle,
  bookHref,
  chapterLabel,
  toc,
  labels,
  account,
  trackProgress,
  bootstrap,
  children,
}: {
  fontClass: string;
  slug: string;
  lang: string;
  hrefBase: string;
  currentId: string;
  bookTitle: string;
  bookHref: string;
  chapterLabel: string;
  toc: TocItem[];
  labels: ReaderChromeLabels;
  account: { signedIn: boolean; email?: string; loginHref: string; logoutHref: string } | null;
  trackProgress: boolean;
  /** Inline-скрипт настроек: должен оказаться сразу внутри #reader. */
  bootstrap?: ReactNode;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<ReaderTheme | undefined>();
  const [size, setSize] = useState<ReaderSize | undefined>();
  const [tocOpen, setTocOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [ratio, setRatio] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);
  const prefsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = loadPrefs();
    setTheme(p.theme);
    setSize(p.size);
  }, []);

  const updatePrefs = useCallback(
    (next: { theme?: ReaderTheme; size?: ReaderSize }) => {
      const t = next.theme ?? theme ?? "dark";
      const s = next.size ?? size ?? "m";
      setTheme(t);
      setSize(s);
      savePrefs({ theme: t, size: s });
    },
    [theme, size],
  );

  // Прогресс: глава «читаю» при открытии, «прочитано» — когда дочитали до конца.
  useEffect(() => {
    if (trackProgress) markChapter(slug, lang, currentId, "reading");
  }, [trackProgress, slug, lang, currentId]);

  useEffect(() => {
    let done = false;
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const r = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      setRatio(r);
      if (trackProgress && !done && r > 0.97) {
        done = true;
        markChapter(slug, lang, currentId, "read");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [trackProgress, slug, lang, currentId]);

  useEffect(() => {
    if (!prefsOpen) return;
    const close = (e: MouseEvent) => {
      if (!prefsRef.current?.contains(e.target as Node)) setPrefsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [prefsOpen]);

  useEffect(() => {
    if (!tocOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTocOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [tocOpen]);

  const tocList = (onNavigate?: () => void) => (
    <TocList
      items={toc}
      slug={slug}
      lang={lang}
      hrefBase={hrefBase}
      currentId={currentId}
      labels={labels}
      onNavigate={onNavigate}
    />
  );

  return (
    <div
      id="reader"
      className={cn("reader relative z-10 min-h-screen pt-14", fontClass)}
      data-theme={theme}
      data-size={size}
      suppressHydrationWarning
    >
      {bootstrap}
      {/* Панель читалки под шапкой сайта */}
      <div className="sticky top-14 z-30 border-b border-[var(--r-faint)] bg-[var(--r-bg)]/95 backdrop-blur">
        <div className="flex h-12 items-center gap-2 px-3 sm:px-5">
          <button
            type="button"
            onClick={() => setTocOpen(true)}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--r-faint)]"
            aria-label={labels.openContents}
          >
            <List className="h-5 w-5" />
          </button>
          <Link
            href={bookHref}
            className="min-w-0 truncate text-sm text-[var(--r-muted)] hover:text-[var(--r-fg)]"
            title={labels.backToBook}
          >
            {bookTitle}
          </Link>
          <span className="hidden sm:inline text-[var(--r-muted)]">·</span>
          <span className="hidden sm:block min-w-0 truncate text-sm">{chapterLabel}</span>

          <div className="ml-auto flex items-center gap-1">
            <div className="relative" ref={prefsRef}>
              <button
                type="button"
                onClick={() => setPrefsOpen((v) => !v)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--r-faint)]"
                aria-label={labels.textSize}
                aria-expanded={prefsOpen}
              >
                <Type className="h-4 w-4" />
              </button>
              {prefsOpen && (
                <div className="absolute right-0 top-11 w-64 rounded-lg border border-[var(--r-faint)] bg-[var(--r-panel)] p-4 shadow-xl">
                  <div className="text-xs text-[var(--r-muted)] mb-2">{labels.textSize}</div>
                  <div className="flex gap-1 mb-4">
                    {SIZES.map((s, i) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updatePrefs({ size: s })}
                        className={cn(
                          "flex-1 rounded-md border py-1.5 font-serif",
                          (size ?? "m") === s
                            ? "border-[var(--r-accent)] text-[var(--r-accent)]"
                            : "border-[var(--r-faint)] hover:border-[var(--r-muted)]",
                        )}
                        style={{ fontSize: `${0.8 + i * 0.12}rem` }}
                      >
                        A
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-[var(--r-muted)] mb-2">{labels.theme}</div>
                  <div className="flex gap-1">
                    {(
                      [
                        ["dark", labels.themeDark, "#0b0f1c", "#e7e7ec"],
                        ["light", labels.themeLight, "#fbfaf7", "#1d1d24"],
                        ["sepia", labels.themeSepia, "#f4ecd8", "#3b2f1e"],
                      ] as const
                    ).map(([t, label, bg, fg]) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => updatePrefs({ theme: t })}
                        className={cn(
                          "flex-1 rounded-md border py-1.5 text-xs",
                          (theme ?? "dark") === t
                            ? "border-[var(--r-accent)]"
                            : "border-[var(--r-faint)]",
                        )}
                        style={{ background: bg, color: fg }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {account &&
              (account.signedIn ? (
                <a
                  href={account.logoutHref}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-xs text-[var(--r-muted)] hover:bg-[var(--r-faint)] hover:text-[var(--r-fg)]"
                  title={account.email}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{labels.signOut}</span>
                </a>
              ) : (
                <a
                  href={account.loginHref}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-xs hover:bg-[var(--r-faint)]"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">{labels.signIn}</span>
                </a>
              ))}
          </div>
        </div>
        <div className="h-0.5 bg-transparent">
          <div
            className="h-full bg-[var(--r-accent-strong)] transition-[width] duration-150"
            style={{ width: `${Math.round(ratio * 100)}%` }}
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl">
        <aside className="hidden lg:block w-72 shrink-0">
          <nav
            aria-label={labels.contents}
            className="sticky top-[6.6rem] max-h-[calc(100vh-6.6rem)] overflow-y-auto py-6 pr-2"
          >
            <div className="px-3 pb-2 text-xs uppercase tracking-[0.16em] text-[var(--r-muted)]">
              {labels.contents}
            </div>
            {tocList()}
          </nav>
        </aside>
        <div ref={articleRef} className="min-w-0 flex-1 px-5 sm:px-8 pb-24">
          {children}
        </div>
      </div>

      {/* Мобильное оглавление */}
      {tocOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label={labels.closeContents}
            onClick={() => setTocOpen(false)}
          />
          <nav className="absolute inset-y-0 left-0 w-[88%] max-w-sm overflow-y-auto bg-[var(--r-panel)] text-[var(--r-fg)] py-4 pr-2 shadow-2xl">
            <div className="flex items-center justify-between px-3 pb-3">
              <span className="text-xs uppercase tracking-[0.16em] text-[var(--r-muted)]">
                {labels.contents}
              </span>
              <button
                type="button"
                onClick={() => setTocOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--r-faint)]"
                aria-label={labels.closeContents}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {tocList(() => setTocOpen(false))}
          </nav>
        </div>
      )}
    </div>
  );
}
