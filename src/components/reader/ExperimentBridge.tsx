"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/components/analytics/Analytics";

// Плашка внизу экрана на странице опыта: через несколько секунд после первого касания
// опыта напоминает, из какой он главы, и ведёт в текст. Без касания не появляется,
// после закрытия — больше не показывается на этой странице.
const DELAY = 10_000;

export default function ExperimentBridge({ id, text, cta, href, close }: { id: string; text: string; cta: string; href: string; close: string }) {
  const [shown, setShown] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;
    const touch = (e: Event) => {
      if (t || !(e.target as HTMLElement | null)?.closest(`figure.nc-x[data-x="${id}"]`)) return;
      t = setTimeout(() => {
        setShown(true);
        track("bridge_view", { item_id: id });
      }, DELAY);
    };
    document.addEventListener("pointerdown", touch, true);
    document.addEventListener("keydown", touch, true);
    return () => {
      document.removeEventListener("pointerdown", touch, true);
      document.removeEventListener("keydown", touch, true);
      if (t) clearTimeout(t);
    };
  }, [id]);

  if (!shown || closed) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]" role="region" aria-live="polite">
      <div className="mx-auto flex max-w-3xl items-center gap-4 border border-line bg-bg-raised/95 px-4 py-3 shadow-lg backdrop-blur md:px-6">
        <p className="flex-1 text-sm leading-snug text-fg-secondary">{text}</p>
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
