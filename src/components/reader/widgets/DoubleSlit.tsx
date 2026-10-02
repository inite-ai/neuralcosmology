"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Reset, useCanvasSize, useLoop, usePalette, useVisible, prefersReducedMotion, type Dict, type WidgetProps } from "./kit";

// Двухщелевой опыт по одному фотону. Без детектора точка попадания берётся из
// |ψ₁ + ψ₂|² (полосы), с детектором у щелей — из |ψ₁|² + |ψ₂|² (две размытые
// полосы без интерференции). Каждый фотон — одна точка; картина складывается сама.
// Режим heat (опыт Хакермюллер и др., 2004): вместо детектора — нагрев молекул C₇₀.
// Видность полос V(T) — схема по описанию опыта: до ~1500 K цела, к ~3000 K гаснет.

const T: Dict<{ off: string; on: string; detector: string; play: string; pause: string; clear: string; photons: string; hint: string }> = {
  ru: { off: "не смотрим", on: "смотрим", detector: "Детектор у щелей", play: "Пуск", pause: "Пауза", clear: "Очистить экран", photons: "фотонов", hint: "Фотоны летят по одному. Включите детектор: полосы исчезнут, хотя сами фотоны и щели остались прежними." },
  en: { off: "not looking", on: "looking", detector: "Detector at the slits", play: "Play", pause: "Pause", clear: "Clear screen", photons: "photons", hint: "Photons go one at a time. Turn the detector on and the fringes vanish, though the photons and slits are unchanged." },
  pt: { off: "sem olhar", on: "olhando", detector: "Detector nas fendas", play: "Iniciar", pause: "Pausar", clear: "Limpar a tela", photons: "fótons", hint: "Os fótons passam um de cada vez. Ligue o detector e as franjas somem, embora fótons e fendas sejam os mesmos." },
  es: { off: "sin mirar", on: "mirando", detector: "Detector en las rendijas", play: "Iniciar", pause: "Pausa", clear: "Limpiar la pantalla", photons: "fotones", hint: "Los fotones pasan de uno en uno. Encienda el detector y las franjas desaparecen, aunque fotones y rendijas sigan iguales." },
};

const H: Dict<{ temp: string; molecules: string; hint: string }> = {
  ru: { temp: "Нагрев молекул", molecules: "молекул C₇₀", hint: "Грейте молекулы. Пока они тёплые, полосы целы; раскалённая молекула светится, её фотоны выдают путь — и полосы гаснут, хотя этих фотонов никто не ловит." },
  en: { temp: "Heating the molecules", molecules: "C₇₀ molecules", hint: "Heat the molecules. While they are warm the fringes survive; a red-hot molecule glows, its photons give away the path, and the fringes fade, though nobody catches those photons." },
  pt: { temp: "Aquecimento das moléculas", molecules: "moléculas de C₇₀", hint: "Aqueça as moléculas. Enquanto estão mornas, as franjas resistem; a molécula em brasa brilha, seus fótons revelam o caminho e as franjas se apagam, embora ninguém capture esses fótons." },
  es: { temp: "Calentamiento de las moléculas", molecules: "moléculas de C₇₀", hint: "Caliente las moléculas. Mientras están tibias, las franjas resisten; la molécula al rojo brilla, sus fotones delatan el camino y las franjas se apagan, aunque nadie atrape esos fotones." },
};

/** Видность полос от температуры молекулы, 0…1. */
const visibility = (T: number) => (T <= 1500 ? 1 : Math.exp(-(((T - 1500) / 600) ** 2)));

/** Цвет раскалённого тела, грубо: тёмно-красный → оранжевый → белый. */
function glow(T: number): string {
  const k = Math.max(0, Math.min(1, (T - 1000) / 2000));
  const r = 255, g = Math.round(60 + 190 * k), b = Math.round(30 + 200 * Math.max(0, k - 0.4) / 0.6);
  return `rgb(${r},${g},${b})`;
}

const BINS = 150;
const S = 0.2; // смещение щели (в долях полувысоты экрана)
const SIG = 0.3; // ширина пучка от одной щели
const K = 34; // частота полос

function pdf(v: number): Float64Array {
  const p = new Float64Array(BINS);
  for (let i = 0; i < BINS; i++) {
    const y = (i + 0.5) / BINS * 2 - 1;
    const g1 = Math.exp(-((y - S) ** 2) / (2 * SIG * SIG));
    const g2 = Math.exp(-((y + S) ** 2) / (2 * SIG * SIG));
    p[i] = g1 * g1 + g2 * g2 + v * 2 * g1 * g2 * Math.cos(K * y);
  }
  let sum = 0;
  for (let i = 0; i < BINS; i++) sum += p[i];
  let acc = 0;
  for (let i = 0; i < BINS; i++) p[i] = acc += p[i] / sum;
  return p;
}
const CDF = { off: pdf(1), on: pdf(0) };

function sample(cdf: Float64Array): number {
  const r = Math.random();
  let lo = 0, hi = BINS - 1;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (cdf[m] < r) lo = m + 1;
    else hi = m;
  }
  return ((lo + Math.random()) / BINS) * 2 - 1;
}

type Photon = { t: number; y: number; slit: 0 | 1; observed: boolean };

export default function DoubleSlit({ lang, props }: WidgetProps) {
  const t = T[lang];
  const heat = props?.mode === "heat";
  const h = H[lang];
  const [temp, setTemp] = useState(1000);
  const cdf = useMemo(() => (heat ? pdf(visibility(temp)) : null), [heat, temp]);
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const size = useCanvasSize(cv, 16 / 9, 2);
  const pal = usePalette(box);
  const visible = useVisible(box);
  const [observed, setObserved] = useState(false);
  const [running, setRunning] = useState(true);
  const [count, setCount] = useState(0);
  const st = useRef({ flying: [] as Photon[], hits: [] as { y: number; x: number; observed: boolean }[], hist: new Float32Array(BINS), clock: 0, flash: [0, 0] });

  const clear = () => {
    st.current.hits = [];
    st.current.hist = new Float32Array(BINS);
    setCount(0);
  };
  useEffect(clear, [observed, temp]);

  useLoop((dt) => {
    const s = st.current;
    const rate = prefersReducedMotion() ? 400 : 110; // фотонов в секунду
    s.clock += dt * rate;
    while (s.clock >= 1) {
      s.clock -= 1;
      const y = sample(cdf ?? (observed ? CDF.on : CDF.off));
      s.flying.push({ t: 0, y, slit: Math.random() < 0.5 ? 0 : 1, observed });
    }
    for (const p of s.flying) p.t += dt * 1.6;
    const landed = s.flying.filter((p) => p.t >= 1);
    s.flying = s.flying.filter((p) => p.t < 1);
    for (const p of landed) {
      s.hits.push({ y: p.y, x: Math.random(), observed: p.observed });
      s.hist[Math.min(BINS - 1, Math.max(0, Math.floor(((p.y + 1) / 2) * BINS)))]++;
    }
    if (landed.length) setCount((c) => c + landed.length);
    s.flash[0] *= 0.9;
    s.flash[1] *= 0.9;
    for (const p of s.flying) if (p.observed && p.t > 0.45 && p.t < 0.5) s.flash[p.slit] = 1;
    draw();
  }, running && visible && size.w > 0);

  const draw = () => {
    const c = cv.current, s = st.current;
    if (!c || !pal) return;
    const ctx = c.getContext("2d")!;
    const w = c.width, h = c.height, d = size.dpr;
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, w, h);
    const src = { x: w * 0.06, y: h / 2 };
    const bar = w * 0.36;
    const scr = w * 0.78;
    const half = h * 0.42;
    const slitY = [h / 2 - S * half, h / 2 + S * half];
    const gap = h * 0.035;
    // Источник.
    ctx.fillStyle = pal.accent;
    ctx.beginPath();
    ctx.arc(src.x, src.y, 4 * d, 0, Math.PI * 2);
    ctx.fill();
    // Перегородка со щелями.
    ctx.strokeStyle = pal.fg;
    ctx.lineWidth = 2 * d;
    ctx.beginPath();
    ctx.moveTo(bar, h * 0.04);
    ctx.lineTo(bar, slitY[0] - gap);
    ctx.moveTo(bar, slitY[0] + gap);
    ctx.lineTo(bar, slitY[1] - gap);
    ctx.moveTo(bar, slitY[1] + gap);
    ctx.lineTo(bar, h * 0.96);
    ctx.stroke();
    // Детектор: глаз у каждой щели, вспыхивает, когда через неё прошёл фотон.
    if (observed) {
      for (let k = 0; k < 2; k++) {
        ctx.globalAlpha = 0.35 + 0.65 * s.flash[k];
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 1.5 * d;
        const ex = bar + 16 * d, ey = slitY[k];
        ctx.beginPath();
        ctx.ellipse(ex, ey, 8 * d, 4.5 * d, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = pal.accent;
        ctx.beginPath();
        ctx.arc(ex, ey, 2 * d, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    // Экран.
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1 * d;
    ctx.beginPath();
    ctx.moveTo(scr, h * 0.04);
    ctx.lineTo(scr, h * 0.96);
    ctx.stroke();
    // Попадания: полоса шириной 6% справа от экрана.
    ctx.fillStyle = pal.fg;
    const band = w * 0.05;
    const recent = s.hits.length > 6000 ? s.hits.slice(-6000) : s.hits;
    for (const p of recent) ctx.fillRect(scr + 2 * d + p.x * band, h / 2 + p.y * half, 1.2 * d, 1.2 * d);
    // Гистограмма.
    let max = 1;
    for (let i = 0; i < BINS; i++) max = Math.max(max, s.hist[i]);
    ctx.fillStyle = pal.accent;
    const hx = scr + band + 8 * d, hw = w - hx - 6 * d;
    for (let i = 0; i < BINS; i++) {
      const v = s.hist[i] / max;
      if (!v) continue;
      const y = h / 2 + ((i / BINS) * 2 - 1) * half;
      ctx.fillRect(hx, y, v * hw, Math.max(1, ((2 * half) / BINS)));
    }
    // Летящие фотоны: до перегородки — к щели, после — к точке на экране.
    for (const p of s.flying) {
      const sy = slitY[p.slit];
      let x: number, y: number;
      if (p.t < 0.45) {
        const k = p.t / 0.45;
        x = src.x + (bar - src.x) * k;
        y = src.y + ((p.observed ? sy : h / 2) - src.y) * k;
      } else {
        const k = (p.t - 0.45) / 0.55;
        const from = p.observed ? sy : h / 2;
        x = bar + (scr - bar) * k;
        y = from + (h / 2 + p.y * half - from) * k;
        if (!p.observed && k < 0.5) {
          // Волна из обеих щелей.
          ctx.strokeStyle = pal.accent;
          ctx.globalAlpha = 0.18 * (1 - k * 2);
          ctx.lineWidth = 1 * d;
          for (const yy of slitY) {
            ctx.beginPath();
            ctx.arc(bar, yy, (scr - bar) * k, -1.2, 1.2);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          continue;
        }
      }
      ctx.fillStyle = heat ? glow(temp) : pal.accent;
      ctx.beginPath();
      ctx.arc(x, y, (heat ? 3.2 : 2.4) * d, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  useEffect(() => {
    if (!running) draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pal, size.w, running, observed]);

  return (
    <div ref={box}>
      <canvas ref={cv} aria-label={heat ? h.hint : t.hint} />
      <div className="nc-x-bar">
        {heat ? (
          <label className="nc-x-stat" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {h.temp}
            <input type="range" min={900} max={3000} step={50} value={temp} onChange={(e) => setTemp(Number(e.target.value))} />
            <b style={{ minWidth: "4.5em" }}>{temp.toLocaleString(lang)} K</b>
          </label>
        ) : (
          <>
            <span className="nc-x-stat">{t.detector}</span>
            <span className="nc-x-seg" role="group" aria-label={t.detector}>
              <button type="button" className="nc-x-btn" aria-pressed={!observed} onClick={() => setObserved(false)}>{t.off}</button>
              <button type="button" className="nc-x-btn" aria-pressed={observed} onClick={() => setObserved(true)}>{t.on}</button>
            </span>
          </>
        )}
        <button type="button" className="nc-x-btn" onClick={() => setRunning((r) => !r)}>
          {running ? <Pause /> : <Play />} {running ? t.pause : t.play}
        </button>
        <button type="button" className="nc-x-btn" onClick={clear}>
          <Reset /> {t.clear}
        </button>
        <span className="nc-x-spacer" />
        <span className="nc-x-stat"><b>{count.toLocaleString(lang)}</b> {heat ? h.molecules : t.photons}</span>
      </div>
      <div className="nc-x-hint">{heat ? h.hint : t.hint}</div>
    </div>
  );
}
