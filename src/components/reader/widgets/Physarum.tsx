"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Reset, rgb, useCanvasSize, useLoop, usePalette, useVisible, prefersReducedMotion, type Dict, type WidgetProps } from "./kit";

// Модель слизевика Джонса (2010), та же, что легла в основу Monte Carlo Physarum
// Machine у Бёрчетта и Элека: тысячи частиц нюхают след впереди, поворачивают к
// самому сильному, оставляют свой; след расплывается и выветривается. Еда —
// постоянный источник следа. Сеть между источниками складывается сама.

const T: Dict<{ hint: string; play: string; pause: string; scatter: string; clear: string; agents: string; food: string }> = {
  ru: { hint: "Нажмите на поле, чтобы положить еду: сеть перестроится к новой точке.", play: "Пуск", pause: "Пауза", scatter: "Рассыпать еду", clear: "Убрать еду", agents: "частиц", food: "источников" },
  en: { hint: "Tap the field to drop food: the network will reroute to the new point.", play: "Play", pause: "Pause", scatter: "Scatter food", clear: "Clear food", agents: "particles", food: "sources" },
  pt: { hint: "Toque no campo para pôr comida: a rede se refaz até o novo ponto.", play: "Iniciar", pause: "Pausar", scatter: "Espalhar comida", clear: "Tirar comida", agents: "partículas", food: "fontes" },
  es: { hint: "Toque el campo para dejar comida: la red se rehace hacia el nuevo punto.", play: "Iniciar", pause: "Pausa", scatter: "Esparcir comida", clear: "Quitar comida", agents: "partículas", food: "fuentes" },
};

const W = 320;
const H = 200;
const SO = 9; // насколько далеко нюхает
const SA = 0.6; // угол сенсоров
const RA = 0.35; // поворот за шаг
const DEP = 5;
const MIX = 0.55; // доля размытия за шаг
const DECAY = 0.9;
const FOOD = 10;

type Food = { x: number; y: number };

function scatter(n: number): Food[] {
  // Сгустки, как у гало: несколько центров, вокруг них точки.
  const out: Food[] = [];
  const centers = Array.from({ length: 4 }, () => ({ x: 40 + Math.random() * (W - 80), y: 30 + Math.random() * (H - 60) }));
  for (let i = 0; i < n; i++) {
    const c = centers[i % centers.length];
    const r = Math.random() < 0.35 ? 70 : 28;
    out.push({ x: Math.min(W - 6, Math.max(6, c.x + (Math.random() - 0.5) * r * 2)), y: Math.min(H - 6, Math.max(6, c.y + (Math.random() - 0.5) * r * 1.4)) });
  }
  return out;
}

export default function Physarum({ lang }: WidgetProps) {
  const t = T[lang];
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const size = useCanvasSize(cv, W / H, 2);
  const pal = usePalette(box);
  const visible = useVisible(box);
  const [running, setRunning] = useState(() => !prefersReducedMotion());
  const [foodCount, setFoodCount] = useState(0);

  const sim = useRef<{
    n: number; x: Float32Array; y: Float32Array; a: Float32Array;
    trail: Float32Array; next: Float32Array; occ: Uint8Array; food: Food[];
    img: ImageData | null; off: HTMLCanvasElement | null; lut: Uint8ClampedArray;
  } | null>(null);

  if (!sim.current) {
    const n = 9000;
    const x = new Float32Array(n), y = new Float32Array(n), a = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      x[i] = 1 + Math.random() * (W - 2);
      y[i] = 1 + Math.random() * (H - 2);
      a[i] = Math.random() * Math.PI * 2;
    }
    sim.current = { n, x, y, a, trail: new Float32Array(W * H), next: new Float32Array(W * H), occ: new Uint8Array(W * H), food: scatter(14), img: null, off: null, lut: new Uint8ClampedArray(256 * 3) };
  }

  useEffect(() => setFoodCount(sim.current!.food.length), []);

  // Палитра: фон → акцент → цвет текста.
  useEffect(() => {
    if (!pal || !sim.current) return;
    const [b, a, f] = [rgb(pal.bg), rgb(pal.accent), rgb(pal.fg)];
    const lut = sim.current.lut;
    for (let i = 0; i < 256; i++) {
      const v = i / 255;
      const [p, q, k] = v < 0.55 ? [b, a, v / 0.55] : [a, f, (v - 0.55) / 0.45];
      const e = k * k * (3 - 2 * k);
      for (let c = 0; c < 3; c++) lut[i * 3 + c] = p[c] + (q[c] - p[c]) * e;
    }
  }, [pal]);

  const step = () => {
    const s = sim.current!;
    const { n, x, y, a, trail, occ } = s;
    const at = (px: number, py: number) => {
      const ix = px | 0, iy = py | 0;
      return ix < 0 || iy < 0 || ix >= W || iy >= H ? 0 : trail[iy * W + ix];
    };
    for (let i = 0; i < n; i++) {
      const ang = a[i];
      const f = at(x[i] + Math.cos(ang) * SO, y[i] + Math.sin(ang) * SO);
      const fl = at(x[i] + Math.cos(ang - SA) * SO, y[i] + Math.sin(ang - SA) * SO);
      const fr = at(x[i] + Math.cos(ang + SA) * SO, y[i] + Math.sin(ang + SA) * SO);
      if (f > fl && f > fr) {
        /* прямо */
      } else if (f < fl && f < fr) a[i] += (Math.random() < 0.5 ? -1 : 1) * RA;
      else if (fl < fr) a[i] += RA;
      else if (fr < fl) a[i] -= RA;
      let nx = x[i] + Math.cos(a[i]), ny = y[i] + Math.sin(a[i]);
      // От стенки отражается, как бильярдный шар, — иначе частицы липнут к краям.
      if (nx < 1 || nx >= W - 1) {
        a[i] = Math.PI - a[i];
        nx = Math.min(W - 2, Math.max(1, nx));
      }
      if (ny < 1 || ny >= H - 1) {
        a[i] = -a[i];
        ny = Math.min(H - 2, Math.max(1, ny));
      }
      // Одна частица на клетку (как у Джонса): занято — стоит, поворачивается
      // наугад и не метит. Без этого вся масса стекается в одну трассу.
      const from = (y[i] | 0) * W + (x[i] | 0), to = (ny | 0) * W + (nx | 0);
      if (to !== from && occ[to]) {
        a[i] = Math.random() * Math.PI * 2;
        continue;
      }
      occ[from] = 0;
      occ[to] = 1;
      x[i] = nx;
      y[i] = ny;
      trail[to] += DEP;
    }
    for (const fd of s.food) {
      for (let dy = -2; dy <= 2; dy++)
        for (let dx = -2; dx <= 2; dx++) {
          const ix = (fd.x | 0) + dx, iy = (fd.y | 0) + dy;
          if (ix >= 0 && iy >= 0 && ix < W && iy < H) trail[iy * W + ix] += FOOD;
        }
    }
    // Диффузия 3×3 и выветривание.
    const nx = s.next;
    for (let yy = 0; yy < H; yy++) {
      const y0 = yy > 0 ? yy - 1 : yy, y1 = yy < H - 1 ? yy + 1 : yy;
      for (let xx = 0; xx < W; xx++) {
        const x0 = xx > 0 ? xx - 1 : xx, x1 = xx < W - 1 ? xx + 1 : xx;
        const sum =
          trail[y0 * W + x0] + trail[y0 * W + xx] + trail[y0 * W + x1] +
          trail[yy * W + x0] + trail[yy * W + xx] + trail[yy * W + x1] +
          trail[y1 * W + x0] + trail[y1 * W + xx] + trail[y1 * W + x1];
        nx[yy * W + xx] = (trail[yy * W + xx] * (1 - MIX) + (sum / 9) * MIX) * DECAY;
      }
    }
    s.next = trail;
    s.trail = nx;
  };

  const draw = () => {
    const c = cv.current, s = sim.current;
    if (!c || !s || !pal) return;
    const ctx = c.getContext("2d")!;
    if (!s.off) {
      s.off = document.createElement("canvas");
      s.off.width = W;
      s.off.height = H;
      s.img = s.off.getContext("2d")!.createImageData(W, H);
    }
    const d = s.img!.data, tr = s.trail, lut = s.lut;
    for (let i = 0; i < W * H; i++) {
      const v = ((1 - Math.exp(-tr[i] / 40)) * 255) | 0;
      d[i * 4] = lut[v * 3];
      d[i * 4 + 1] = lut[v * 3 + 1];
      d[i * 4 + 2] = lut[v * 3 + 2];
      d[i * 4 + 3] = 255;
    }
    s.off.getContext("2d")!.putImageData(s.img!, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(s.off, 0, 0, c.width, c.height);
    const k = c.width / W;
    ctx.fillStyle = pal.fg;
    ctx.strokeStyle = pal.bg;
    ctx.lineWidth = 1.5 * size.dpr;
    for (const fd of s.food) {
      ctx.beginPath();
      ctx.arc(fd.x * k, fd.y * k, 3.2 * size.dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  };

  useLoop(() => {
    step();
    step();
    draw();
  }, running && visible && size.w > 0);

  // Без анимации — один кадр после нескольких сотен шагов.
  useEffect(() => {
    if (running || !pal || !size.w) return;
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, pal, size.w]);

  useEffect(() => {
    if (!prefersReducedMotion() || !pal || !size.w) return;
    for (let i = 0; i < 400; i++) step();
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pal, size.w]);

  const drop = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const s = sim.current!;
    s.food.push({ x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H });
    if (s.food.length > 40) s.food.shift();
    setFoodCount(s.food.length);
    if (!running) draw();
  };

  return (
    <div ref={box}>
      <canvas ref={cv} onPointerDown={drop} style={{ cursor: "crosshair" }} aria-label={t.hint} />
      <div className="nc-x-bar">
        <button type="button" className="nc-x-btn" onClick={() => setRunning((r) => !r)}>
          {running ? <Pause /> : <Play />} {running ? t.pause : t.play}
        </button>
        <button type="button" className="nc-x-btn" onClick={() => { sim.current!.food = scatter(14); setFoodCount(14); }}>
          <Reset /> {t.scatter}
        </button>
        <button type="button" className="nc-x-btn" onClick={() => { sim.current!.food = []; setFoodCount(0); }}>
          {t.clear}
        </button>
        <span className="nc-x-spacer" />
        <span className="nc-x-stat">
          <b>{(9000).toLocaleString(lang)}</b> {t.agents} · <b>{foodCount}</b> {t.food}
        </span>
      </div>
      <div className="nc-x-hint">{t.hint}</div>
    </div>
  );
}
