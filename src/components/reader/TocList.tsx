"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadProgress, type BookProgress } from "./progress";

export interface TocItem {
  id: string;
  title: string;
  number: number | null;
  part: string | null;
  minutes: number;
  free: boolean;
  gate: "open" | "login" | "purchase";
}

export interface TocLabels {
  free: string;
  afterSignIn: string;
  afterPurchase: string;
  statusRead: string;
  statusReading: string;
  minutes: string;
}

export default function TocList({
  items,
  slug,
  lang,
  hrefBase,
  currentId,
  labels,
  variant = "reader",
  onNavigate,
}: {
  items: TocItem[];
  slug: string;
  lang: string;
  hrefBase: string;
  currentId?: string;
  labels: TocLabels;
  variant?: "reader" | "page";
  onNavigate?: () => void;
}) {
  const [progress, setProgress] = useState<BookProgress>({ chapters: {} });

  useEffect(() => {
    const sync = () => setProgress(loadProgress(slug, lang));
    sync();
    window.addEventListener("nc-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("nc-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug, lang]);

  const status = (it: TocItem) => {
    if (it.gate === "login") return { text: labels.afterSignIn, tone: "locked" };
    if (it.gate === "purchase") return { text: labels.afterPurchase, tone: "locked" };
    const p = progress.chapters[it.id];
    if (p === "read") return { text: labels.statusRead, tone: "done" };
    if (p === "reading") return { text: labels.statusReading, tone: "active" };
    if (it.free) return { text: labels.free, tone: "free" };
    return null;
  };

  let lastPart: string | null = null;

  return (
    <ol className={cn("space-y-0.5", variant === "page" && "space-y-1")}>
      {items.map((it) => {
        const s = status(it);
        const showPart = it.part && it.part !== lastPart;
        lastPart = it.part;
        const current = it.id === currentId;
        return (
          <li key={it.id}>
            {showPart && (
              <div
                className={cn(
                  "text-[11px] uppercase tracking-[0.16em] pt-4 pb-1.5 px-3",
                  variant === "reader" ? "text-[var(--r-muted)]" : "text-white/45",
                )}
              >
                {it.part}
              </div>
            )}
            <Link
              href={`${hrefBase}/${it.id}`}
              onClick={onNavigate}
              aria-current={current ? "page" : undefined}
              className={cn(
                "group flex items-baseline gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                variant === "reader"
                  ? current
                    ? "bg-[var(--r-faint)] text-[var(--r-fg)]"
                    : "text-[var(--r-fg)]/80 hover:bg-[var(--r-faint)]"
                  : "text-white/80 hover:text-white hover:bg-white/5",
              )}
            >
              <span
                className={cn(
                  "w-6 shrink-0 text-right tabular-nums text-xs",
                  variant === "reader" ? "text-[var(--r-muted)]" : "text-white/40",
                )}
              >
                {it.number ?? "·"}
              </span>
              <span className={cn("flex-1 min-w-0", it.gate !== "open" && "opacity-60")}>
                {it.title}
              </span>
              {s && (
                <span
                  className={cn(
                    "shrink-0 text-[11px] whitespace-nowrap",
                    s.tone === "locked" && (variant === "reader" ? "text-[var(--r-muted)]" : "text-white/40"),
                    s.tone === "free" && (variant === "reader" ? "text-[var(--r-accent)]" : "text-emerald-300/80"),
                    s.tone === "active" && (variant === "reader" ? "text-[var(--r-accent)]" : "text-indigo-300"),
                    s.tone === "done" && (variant === "reader" ? "text-[var(--r-muted)]" : "text-white/45"),
                  )}
                >
                  {s.tone === "locked" && <Lock className="inline h-3 w-3 mr-1 -mt-0.5" aria-hidden />}
                  {s.text}
                </span>
              )}
              {!s && (
                <span
                  className={cn(
                    "shrink-0 text-[11px] tabular-nums",
                    variant === "reader" ? "text-[var(--r-muted)]" : "text-white/35",
                  )}
                >
                  {it.minutes} {labels.minutes}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
