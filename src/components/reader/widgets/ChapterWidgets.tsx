"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import type { Lang, WidgetProps } from "./kit";

// Оживляет рамки опытов, которые сервер поставил в главу (src/lib/interactive.ts):
// код опыта грузится, только когда рамка подходит к экрану.

const WIDGETS: Record<string, ComponentType<WidgetProps>> = {
  physarum: dynamic(() => import("./Physarum"), { ssr: false }),
  "double-slit": dynamic(() => import("./DoubleSlit"), { ssr: false }),
  landauer: dynamic(() => import("./Landauer"), { ssr: false }),
  life: dynamic(() => import("./Life"), { ssr: false }),
  rule110: dynamic(() => import("./Rule110"), { ssr: false }),
  yarbus: dynamic(() => import("./Yarbus"), { ssr: false }),
  "blind-spot": dynamic(() => import("./BlindSpot"), { ssr: false }),
  murmuration: dynamic(() => import("./Murmuration"), { ssr: false }),
  planaria: dynamic(() => import("./Planaria"), { ssr: false }),
  sixth: dynamic(() => import("./SixthRepl"), { ssr: false }),
  loftus: dynamic(() => import("./Loftus"), { ssr: false }),
  assembly: dynamic(() => import("./Assembly"), { ssr: false }),
  envelope: dynamic(() => import("./Envelope"), { ssr: false }),
  qubit: dynamic(() => import("./Qubit"), { ssr: false }),
  synth: dynamic(() => import("./Synth"), { ssr: false }),
  wow: dynamic(() => import("./Wow"), { ssr: false }),
  youtube: dynamic(() => import("./YouTube"), { ssr: false }),
};

type Slot = { id: string; el: HTMLElement; widget: string; lang: Lang; props?: Record<string, unknown> };

export default function ChapterWidgets() {
  const [slots, setSlots] = useState<Slot[]>([]);
  useEffect(() => {
    const figs = [...document.querySelectorAll<HTMLElement>(".reader-prose figure.nc-x[data-w]")];
    const io = new IntersectionObserver(
      (entries) => {
        const ready: Slot[] = [];
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const f = e.target as HTMLElement;
          io.unobserve(f);
          const el = f.querySelector<HTMLElement>(".nc-x-mount");
          const widget = f.dataset.w!;
          if (!el || !WIDGETS[widget]) continue;
          let props: Record<string, unknown> | undefined;
          try {
            props = f.dataset.props ? JSON.parse(f.dataset.props) : undefined;
          } catch {}
          ready.push({ id: f.dataset.x!, el, widget, lang: (f.dataset.lang as Lang) || "en", props });
        }
        if (ready.length) setSlots((s) => [...s, ...ready.filter((r) => !s.some((x) => x.id === r.id))]);
      },
      { rootMargin: "800px 0px" },
    );
    figs.forEach((f) => io.observe(f));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {slots.map((s) => {
        const W = WIDGETS[s.widget];
        return createPortal(<W lang={s.lang} props={s.props} />, s.el, s.id);
      })}
    </>
  );
}
