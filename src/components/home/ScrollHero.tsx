"use client";
import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";

// Scroll-hero (DESIGN.md → Motion): высокая секция, внутри липкий кадр.
// По мере прокрутки кадр «уходит вдаль»: отъезжает (scale 1.12 → 1) и
// сжимается в 0.5px-рамку листа; стеклянная карточка становится сплошной.
// Телефон — тот же эффект, но короче и с меньшими полями.

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function ScrollHero({ card, pills }: { card: ReactNode; pills?: ReactNode }) {
  const wrap = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mobile = innerWidth < 768;
      const r = el.getBoundingClientRect();
      const span = r.height - innerHeight;
      const p = reduce || span <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / span));
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--e", (p ** 1.7).toFixed(4));
      el.style.setProperty("--ix", mobile ? "5vw" : "22vw");
      el.style.setProperty("--iy", mobile ? "7vh" : "12vh");
      el.style.setProperty("--glass", (1 - smooth(0.2, 0.55, p)).toFixed(4));
      el.style.setProperty("--glass-fg", (1 - smooth(0.3, 0.5, p)).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={wrap} aria-label="Introduction" data-hero className="relative h-[165svh] md:h-[210vh]">
      <div className="sticky top-[calc(3.5rem+var(--banner-h))] h-[calc(100svh-3.5rem-var(--banner-h))] overflow-hidden md:top-(--banner-h) md:h-[calc(100svh-var(--banner-h))]">
        {/* Кадр. Поля растут с прокруткой, масштаб падает — картинка уходит вглубь. */}
        <div
          className="absolute overflow-hidden"
          style={{ inset: "calc(var(--e, 0) * var(--iy, 12vh)) calc(var(--e, 0) * var(--ix, 22vw))" }}
        >
          <div
            className="absolute inset-0 origin-[65%_45%] will-change-transform"
            style={{ transform: "scale(calc(1.12 - var(--e, 0) * 0.12))" }}
          >
            <Image
              src="/media/hero-web.jpg"
              alt="Cosmic web filaments resembling neural tissue"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[72%_50%] md:object-center"
            />
          </div>
          {/* Виньетка гаснет по мере сжатия, рамка проявляется */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              opacity: "calc(1 - var(--p, 0))",
              background:
                "linear-gradient(90deg, rgb(10 11 16 / .78), rgb(10 11 16 / .15) 55%, transparent), linear-gradient(transparent 55%, rgb(10 11 16 / .7))",
            }}
          />
          <div aria-hidden className="absolute inset-0 hairline" style={{ opacity: "min(1, calc(var(--p, 0) * 8))" }} />
          <span
            aria-hidden
            className="absolute right-4 bottom-3 label text-fg/60"
            style={{ opacity: "calc(1 - var(--p, 0) * 2)" }}
          >
            PL. 01 · cosmic web
          </span>
        </div>

        {/* Карточка и «таблетки» навигации поверх кадра */}
        <div className="relative z-10 mx-auto flex h-full max-w-[calc(var(--container-sheet)+5rem)] flex-col justify-end gap-6 px-4 pb-5 md:flex-row md:items-center md:justify-between md:px-10 md:pb-0">
          {card}
          {pills && <div className="hidden md:block">{pills}</div>}
        </div>
      </div>
    </section>
  );
}
