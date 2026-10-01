"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

// Общее для опытов в главах: язык, цвета текущей темы читалки, пауза за экраном.

export type Lang = "ru" | "en" | "pt" | "es";
export type WidgetProps = { lang: Lang; props?: Record<string, unknown> };
export type Dict<T> = Record<Lang, T>;

export type Palette = { bg: string; panel: string; fg: string; soft: string; muted: string; line: string; faint: string; accent: string };
const KEYS: (keyof Palette)[] = ["bg", "panel", "fg", "soft", "muted", "line", "faint", "accent"];
const VAR: Record<keyof Palette, string> = {
  bg: "--r-bg", panel: "--r-panel", fg: "--r-fg", soft: "--r-soft", muted: "--r-muted", line: "--r-line", faint: "--r-faint", accent: "--r-accent",
};

function read(el: Element): Palette {
  const cs = getComputedStyle(el);
  return Object.fromEntries(KEYS.map((k) => [k, cs.getPropertyValue(VAR[k]).trim() || "#888"])) as Palette;
}

/** Цвета темы читалки; обновляются, когда читатель меняет тему или система — схему. */
export function usePalette(ref: RefObject<Element | null>): Palette | null {
  const [p, setP] = useState<Palette | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setP(read(el));
    update();
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);
    const mo = new MutationObserver(update);
    const reader = document.getElementById("reader");
    if (reader) mo.observe(reader, { attributes: true, attributeFilter: ["data-theme"] });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => {
      mq.removeEventListener("change", update);
      mo.disconnect();
    };
  }, [ref]);
  return p;
}

let probe: CanvasRenderingContext2D | null = null;
/** Любой CSS-цвет (в том числе oklch) → [r, g, b]. */
export function rgb(color: string): [number, number, number] {
  probe ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!probe) return [128, 128, 128];
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = color;
  probe.fillRect(0, 0, 1, 1);
  const d = probe.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

/** На экране ли элемент (анимации за экраном стоят). */
export function useVisible(ref: RefObject<Element | null>, margin = "0px"): boolean {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return v;
}

/** requestAnimationFrame-цикл, пока running и вкладка видима. */
export function useLoop(step: (dt: number) => void, running: boolean) {
  const cb = useRef(step);
  cb.current = step;
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (!document.hidden) cb.current(dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}

export const prefersReducedMotion = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Канвас под ширину рамки с учётом плотности пикселей; возвращает размер в CSS-пикселях. */
export function useCanvasSize(ref: RefObject<HTMLCanvasElement | null>, aspect: number, maxDpr = 2): { w: number; h: number; dpr: number } {
  const [s, setS] = useState({ w: 0, h: 0, dpr: 1 });
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const fit = () => {
      const w = c.clientWidth;
      const h = Math.round(w / aspect);
      const dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
      c.style.height = `${h}px`;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      setS({ w, h, dpr });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    return () => ro.disconnect();
  }, [ref, aspect, maxDpr]);
  return s;
}

export const Play = () => (
  <svg viewBox="0 0 16 16" aria-hidden>
    <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
  </svg>
);
export const Pause = () => (
  <svg viewBox="0 0 16 16" aria-hidden>
    <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" />
  </svg>
);
export const Reset = () => (
  <svg viewBox="0 0 16 16" aria-hidden>
    <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const StepIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden>
    <path d="M3 2.5v11l7-5.5zM11 2.5h2v11h-2z" fill="currentColor" />
  </svg>
);

/** Число в научной записи: 2,87 × 10⁻²¹. */
export function sci(x: number, lang: Lang, digits = 2): string {
  if (x === 0) return "0";
  const e = Math.floor(Math.log10(Math.abs(x)));
  const m = x / 10 ** e;
  const sup = String(e).replace(/-/g, "⁻").replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]);
  const ms = m.toLocaleString(lang, { maximumFractionDigits: digits, minimumFractionDigits: 0 });
  return e === 0 ? ms : `${ms} × 10${sup}`;
}
