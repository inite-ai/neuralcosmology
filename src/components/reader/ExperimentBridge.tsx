"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/components/analytics/Analytics";

// Плашка внизу экрана на странице опыта: в момент, когда опыт «сработал» (виджет шлёт
// nc:aha — у двух щелей полосы исчезли при включённом детекторе), а если такого
// сигнала нет — через 20 с после первого касания, показывает строчку из книги и ведёт
// в главу. Без касания не появляется, после закрытия — больше не показывается.
const DELAY = 20_000;

export default function ExperimentBridge({ id, quote, text, cta, href, close }: { id: string; quote?: string; text: string; cta: string; href: string; close: string }) {
  const [shown, setShown] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;
    let done = false;
    const mine = (e: Event) => !!(e.target as HTMLElement | null)?.closest(`figure.nc-x[data-x="${id}"]`);
    const show = (trigger: "aha" | "timer") => {
      if (done) return;
      done = true;
      if (t) clearTimeout(t);
      setShown(true);
      track("bridge_view", { item_id: id, trigger });
    };
    const touch = (e: Event) => {
      if (t || done || !mine(e)) return;
      t = setTimeout(() => show("timer"), DELAY);
    };
    const onAha = (e: Event) => {
      if (!mine(e)) return;
      track("experiment_aha", { item_id: id });
      show("aha");
    };
    document.addEventListener("pointerdown", touch, true);
    document.addEventListener("keydown", touch, true);
    document.addEventListener("nc:aha", onAha);
    return () => {
      document.removeEventListener("pointerdown", touch, true);
      document.removeEventListener("keydown", touch, true);
      document.removeEventListener("nc:aha", onAha);
      if (t) clearTimeout(t);
    };
  }, [id]);

  if (!shown || closed) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]" role="region" aria-live="polite">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-3 border border-line bg-bg-raised/95 px-4 py-3 shadow-lg backdrop-blur md:flex-nowrap md:px-6">
        <div className="min-w-0 flex-1 basis-[calc(100%-2.5rem)] md:basis-auto">
          {quote && <p className="font-display text-base leading-snug md:text-lg">{quote}</p>}
          <p className={quote ? "mt-1 text-xs leading-snug text-muted" : "text-sm leading-snug text-fg-secondary"}>{text}</p>
        </div>
        <Link
          href={href}
          onClick={() => track("bridge_click", { item_id: id })}
          className="label shrink-0 bg-fg px-4 py-2.5 text-bg transition-opacity hover:opacity-85"
        >
          {cta} →
        </Link>
        <button type="button" onClick={() => setClosed(true)} aria-label={close} className="shrink-0 text-xl leading-none text-muted hover:text-fg">
          ×
        </button>
      </div>
    </div>
  );
}
