"use client";

import { useEffect } from "react";
import { track } from "@/components/analytics/Analytics";

// События вовлечения: первое касание опыта или видео (experiment_start / video_play,
// по разу на вставку) и дочитанная глава (последний абзац показался на экране).
// Ставится на страницы глав и опытов.
export default function ChapterTracker({ book, chapter }: { book?: string; chapter?: string }) {
  useEffect(() => {
    const seen = new Set<string>();
    const touch = (e: Event) => {
      const fig = (e.target as HTMLElement | null)?.closest<HTMLElement>("figure.nc-x[data-x]");
      if (!fig?.dataset.x || seen.has(fig.dataset.x)) return;
      // Кнопка «показать/скрыть» и ссылки в подписи не считаются запуском.
      if ((e.target as HTMLElement).closest("figcaption")) return;
      seen.add(fig.dataset.x);
      const video = fig.dataset.w === "youtube";
      track(video ? "video_play" : "experiment_start", { item_id: fig.dataset.x, widget: fig.dataset.w, book, chapter });
    };
    document.addEventListener("pointerdown", touch, true);
    document.addEventListener("keydown", touch, true);

    let io: IntersectionObserver | null = null;
    if (book && chapter) {
      const ps = document.querySelectorAll<HTMLElement>(".reader-prose p[data-a]");
      const last = ps[ps.length - 1];
      if (last) {
        io = new IntersectionObserver(([en]) => {
          if (!en.isIntersecting) return;
          track("chapter_complete", { book, chapter });
          io?.disconnect();
        });
        io.observe(last);
      }
    }
    return () => {
      document.removeEventListener("pointerdown", touch, true);
      document.removeEventListener("keydown", touch, true);
      io?.disconnect();
    };
  }, [book, chapter]);
  return null;
}
