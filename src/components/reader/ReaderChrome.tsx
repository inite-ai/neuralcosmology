"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { X, LogIn, LogOut } from "lucide-react";
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
  const home = "/" + hrefBase.split("/").filter(Boolean)[0];
  const iconBtn =
    "inline-flex h-11 min-w-11 items-center justify-center gap-2 px-2 label text-[var(--r-soft)] transition-colors hover:text-[var(--r-fg)]";

  return (
    <div
      id="reader"
      className={cn("reader relative z-10 min-h-screen", fontClass)}
      data-theme={theme}
      data-size={size}
      suppressHydrationWarning
    >
      {bootstrap}
      <header className="sticky top-0 z-40 r-rule-b bg-[var(--r-bg)]/95 backdrop-blur-xl">
        <div className="flex h-14 items-center gap-1 px-2 md:px-4">
          <button type="button" onClick={() => setTocOpen(true)} className={cn(iconBtn, "lg:hidden")} aria-label={labels.openContents}>
            <span aria-hidden className="flex flex-col gap-[5px]">
              <span className="block h-px w-5 bg-current" />
              <span className="block h-px w-3.5 bg-current" />
              <span className="block h-px w-5 bg-current" />
            </span>
          </button>
          <Link href={home} className="hidden px-2 font-display text-xl leading-none text-[var(--r-fg)] hover:text-[var(--r-accent)] lg:block">
            Neural <em className="italic text-[var(--r-soft)]">Cosmology</em>
          </Link>
          <span aria-hidden className="mx-2 hidden h-6 w-px bg-[var(--r-line)] lg:block" />
          <div className="min-w-0 flex-1 px-1">
            <Link href={bookHref} title={labels.backToBook} className="block truncate font-display text-lg leading-tight italic text-[var(--r-fg)] hover:text-[var(--r-accent)]">
              {bookTitle}
            </Link>
            <p className="truncate text-[0.8125rem] leading-tight text-[var(--r-muted)]">{chapterLabel}</p>
          </div>

          <div className="relative" ref={prefsRef}>
            <button type="button" onClick={() => setPrefsOpen((v) => !v)} className={iconBtn} aria-label={labels.textSize} aria-expanded={prefsOpen}>
              <span className="font-display text-xl normal-case tracking-normal">Aa</span>
            </button>
            {prefsOpen && (
              <div className="absolute right-0 top-12 w-72 r-hair bg-[var(--r-panel)] p-5 shadow-[0_24px_60px_-24px_rgb(0_0_0/.6)]">
                <p className="label text-[var(--r-muted)] mb-3">{labels.textSize}</p>
                <div className="grid grid-cols-4 gap-[0.5px] r-hair bg-[var(--r-line)] mb-5">
                  {SIZES.map((sz, i) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => updatePrefs({ size: sz })}
                      className={cn(
                        "h-12 bg-[var(--r-panel)] font-display transition-colors",
                        (size ?? "m") === sz ? "text-[var(--r-accent)]" : "text-[var(--r-soft)] hover:text-[var(--r-fg)]",
                      )}
                      style={{ fontSize: `${1 + i * 0.18}rem` }}
                      aria-pressed={(size ?? "m") === sz}
                    >
                      A
                    </button>
                  ))}
                </div>
                <p className="label text-[var(--r-muted)] mb-3">{labels.theme}</p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ["dark", labels.themeDark, "#0a0b10", "#eceae4"],
                      ["light", labels.themeLight, "#f6f4ee", "#15161b"],
                      ["sepia", labels.themeSepia, "#f1e7d0", "#36291a"],
                    ] as const
                  ).map(([t, label, bg, fg]) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updatePrefs({ theme: t })}
                      aria-pressed={(theme ?? "dark") === t}
                      className={cn(
                        "h-12 text-sm outline-offset-2",
                        (theme ?? "dark") === t ? "outline outline-1 outline-[var(--r-accent)]" : "border-[0.5px] border-[var(--r-line)]",
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
              <a href={account.logoutHref} className={iconBtn} title={account.email}>
                <LogOut className="h-4 w-4" strokeWidth={1.25} />
                <span className="hidden sm:inline">{labels.signOut}</span>
              </a>
            ) : (
              <a href={account.loginHref} className={cn(iconBtn, "text-[var(--r-fg)]")}>
                <LogIn className="h-4 w-4" strokeWidth={1.25} />
                <span className="hidden sm:inline">{labels.signIn}</span>
              </a>
            ))}
        </div>
        <div className="absolute inset-x-0 -bottom-px h-px">
          <div className="h-full bg-[var(--r-accent)] transition-[width] duration-150" style={{ width: `${Math.round(ratio * 100)}%` }} />
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[21rem_minmax(0,1fr)]">
        <aside className="hidden lg:block r-rule-r">
          <nav aria-label={labels.contents} className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto pb-10">
            <p className="label px-4 pt-6 pb-3 text-[var(--r-muted)]">{labels.contents}</p>
            <div className="r-rule-t">{tocList()}</div>
          </nav>
        </aside>
        <div ref={articleRef} className="min-w-0 px-5 pb-24 sm:px-8">
          {children}
        </div>
      </div>

      {tocOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[var(--r-bg)] lg:hidden" role="dialog" aria-modal="true" aria-label={labels.contents}>
          <div className="flex h-14 shrink-0 items-center justify-between r-rule-b px-4">
            <span className="label text-[var(--r-muted)]">{labels.contents}</span>
            <button type="button" onClick={() => setTocOpen(false)} className={iconBtn} aria-label={labels.closeContents}>
              <X className="h-5 w-5" strokeWidth={1.25} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pb-10">{tocList(() => setTocOpen(false))}</div>
        </div>
      )}
    </div>
  );
}
