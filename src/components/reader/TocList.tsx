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
  const reader = variant === "reader";
  // Цвета: в читалке — переменные темы читалки, на сайте — токены сайта.
  const c = reader
    ? { muted: "text-[var(--r-muted)]", accent: "text-[var(--r-accent)]", rule: "border-[var(--r-line)]", hover: "hover:bg-[var(--r-faint)]", current: "bg-[var(--r-faint)]" }
    : { muted: "text-muted", accent: "text-primary", rule: "border-line", hover: "hover:bg-bg-raised", current: "bg-bg-raised" };

  return (
    <ol>
      {items.map((it) => {
        const st = status(it);
        const showPart = it.part && it.part !== lastPart;
        lastPart = it.part;
        const current = it.id === currentId;
        return (
          <li key={it.id}>
            {showPart && (
              <div className={cn("label pt-7 pb-3 px-4", c.accent)}>{it.part}</div>
            )}
            <Link
              href={`${hrefBase}/${it.id}`}
              onClick={onNavigate}
              aria-current={current ? "page" : undefined}
              className={cn(
                "group grid min-h-14 grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-3 border-b-[0.5px] px-4 py-3.5 transition-colors",
                c.rule,
                c.hover,
                current && c.current,
              )}
            >
              <span className={cn("label", current ? c.accent : c.muted)}>
                {it.number ? String(it.number).padStart(2, "0") : "·"}
              </span>
              <span
                className={cn(
                  "font-display text-[1.1875rem] leading-snug",
                  it.gate !== "open" && "opacity-55",
                  current && c.accent,
                )}
              >
                {it.title}
              </span>
              <span
                className={cn(
                  "label whitespace-nowrap",
                  st?.tone === "free" || st?.tone === "active" ? c.accent : c.muted,
                )}
              >
                {/* Закрытые главы — только замок (надпись для экранных чтецов и подсказки): «после покупки» не влезает рядом с длинным названием. */}
                {st?.tone === "locked" ? (
                  <span title={st.text}>
                    <Lock className="-mt-0.5 inline h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                    <span className="sr-only">{st.text}</span>
                  </span>
                ) : st ? (
                  st.text
                ) : (
                  `${it.minutes} ${labels.minutes}`
                )}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
