"use client";

import { useEffect, useRef, useState } from "react";
import { aha, Pause, Play, prefersReducedMotion, Reset, useCanvasSize, useLoop, usePalette, useVisible, type Dict, type WidgetProps } from "./kit";

// Клетки места (О’Киф, Достровский) и решётки (Мозеры): читатель водит крысу по полу,
// нейрон оставляет точку там, где вспыхнул. Карта поля проступает сама, по обойдённому полу.

type Kind = "place" | "grid";
type Rec = { spikes: number[]; trail: number[]; seen: Uint8Array; found: boolean; cx: number; cy: number; rot: number };

const BINS = 20;
const ENOUGH = 0.9; // доля обойдённого пола, после которой можно говорить о рисунке
const SPEED = 0.55; // долей пола в секунду под рукой читателя
const WANDER = 1.1; // и когда крыса бродит сама
const SPACING = 0.36;
const SIGMA = 0.085;
const GRID_SIGMA = 0.048;
const ROW = (SPACING * Math.sqrt(3)) / 2;

const T: Dict<{
  kinds: Record<Kind, string>; label: string; hint: string; walk: string; stop: string; clear: string; spikes: string; floor: string;
  found: Record<Kind, string>; next: string; map: string;
}> = {
  ru: {
    kinds: { place: "Клетка места", grid: "Клетка решётки" }, label: "Пол под крысой. Крысу ведут стрелки.",
    hint: "Ведите крысу: нажмите на пол, тяните или возьмите стрелки клавиатуры. Точка остаётся там, где нейрон вспыхнул.",
    walk: "Пусть бродит сама", stop: "Остановить", clear: "Стереть", spikes: "вспышек", floor: "пола пройдено",
    found: { place: "Нейрон отзывается в одном месте пола и молчит во всех остальных.", grid: "Вспышки легли в узлы шестиугольной решётки. На полу её никто не чертил." },
    next: "Теперь послушайте клетку решётки.", map: "Показать карту",
  },
  en: {
    kinds: { place: "Place cell", grid: "Grid cell" }, label: "The floor under the rat. Arrow keys move the rat.",
    hint: "Lead the rat: press on the floor, drag, or use the arrow keys. A dot stays where the neuron fired.",
    walk: "Let it wander", stop: "Stop", clear: "Clear", spikes: "spikes", floor: "of the floor covered",
    found: { place: "The neuron responds in one spot on the floor and is silent everywhere else.", grid: "The spikes have settled at the nodes of a hexagonal grid. Nobody drew it on the floor." },
    next: "Now listen to a grid cell.", map: "Show the map",
  },
  pt: {
    kinds: { place: "Célula de lugar", grid: "Célula de grade" }, label: "O chão debaixo do rato. As setas movem o rato.",
    hint: "Guie o rato: toque no chão, arraste ou use as setas do teclado. Fica um ponto onde o neurônio disparou.",
    walk: "Deixar andar sozinho", stop: "Parar", clear: "Apagar", spikes: "disparos", floor: "do chão percorrido",
    found: { place: "O neurônio responde num ponto do chão e fica calado em todos os outros.", grid: "Os disparos caíram nos nós de uma grade hexagonal. Ninguém a riscou no chão." },
    next: "Agora escute uma célula de grade.", map: "Mostrar o mapa",
  },
  es: {
    kinds: { place: "Célula de lugar", grid: "Célula de red" }, label: "El suelo bajo la rata. Las flechas mueven la rata.",
    hint: "Guíe a la rata: pulse en el suelo, arrastre o use las flechas del teclado. Queda un punto donde la neurona se disparó.",
    walk: "Que ande sola", stop: "Parar", clear: "Borrar", spikes: "disparos", floor: "del suelo recorrido",
    found: { place: "La neurona responde en un punto del suelo y calla en todos los demás.", grid: "Los disparos cayeron en los nodos de una red hexagonal. Nadie la trazó en el suelo." },
    next: "Ahora escuche una célula de red.", map: "Mostrar el mapa",
  },
};

const fresh = (): Rec => ({
  spikes: [], trail: [], seen: new Uint8Array(BINS * BINS), found: false,
  cx: 0.22 + Math.random() * 0.56, cy: 0.22 + Math.random() * 0.56, rot: Math.random() * (Math.PI / 3),
});

/** Узлы шестиугольной решётки, попавшие на пол. */
function nodes(r: Rec): [number, number][] {
  const out: [number, number][] = [];
  for (let j = -6; j <= 6; j++)
    for (let i = -8; i <= 8; i++) {
      const u = (i + (j & 1 ? 0.5 : 0)) * SPACING, v = j * ROW;
      const x = r.cx + u * Math.cos(r.rot) - v * Math.sin(r.rot), y = r.cy + u * Math.sin(r.rot) + v * Math.cos(r.rot);
      if (x > -0.1 && x < 1.1 && y > -0.1 && y < 1.1) out.push([x, y]);
    }
  return out;
}

const coverage = (r: Rec) => r.seen.reduce((a, b) => a + b, 0) / r.seen.length;

export default function PlaceCells({ lang }: WidgetProps) {
  const t = T[lang];
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const size = useCanvasSize(cv, 1, 2);
  const pal = usePalette(box);
  const visible = useVisible(box);
  const [kind, setKind] = useState<Kind>("place");
  const [auto, setAuto] = useState(false);
  const [map, setMap] = useState(false);
  const [stat, setStat] = useState({ n: 0, cover: 0, found: false });
  const recs = useRef<Record<Kind, Rec> | null>(null);
  recs.current ??= { place: fresh(), grid: fresh() };
  const rat = useRef({ x: 0.5, y: 0.5, a: 0, flash: 0 });
  const target = useRef<{ x: number; y: number } | null>(null);
  const keys = useRef(new Set<string>());
  const sent = useRef(false);
  const told = useRef(0);

  // Один шаг: крыса идёт к цели, нейрон вспыхивает с вероятностью своего поля.
  const advance = (dt: number, wander: boolean) => {
    const r = recs.current![kind], q = rat.current;
    const K = keys.current;
    const kx = (K.has("ArrowRight") ? 1 : 0) - (K.has("ArrowLeft") ? 1 : 0), ky = (K.has("ArrowDown") ? 1 : 0) - (K.has("ArrowUp") ? 1 : 0);
    let dx: number, dy: number;
    if (kx || ky) {
      target.current = null;
      dx = kx;
      dy = ky;
    } else {
      if (!target.current && wander) {
        // Бродит туда, где ещё не была; всё обойдено — куда угодно.
        const free: number[] = [];
        for (let i = 0; i < r.seen.length; i++) if (!r.seen[i]) free.push(i);
        // Ближайшая из нескольких случайных: обходит пол быстро, но без строчек.
        const gap = (i: number) => Math.hypot(((i % BINS) + 0.5) / BINS - q.x, (Math.floor(i / BINS) + 0.5) / BINS - q.y);
        let b = Math.floor(Math.random() * r.seen.length);
        for (let n = 0; n < 4 && free.length; n++) {
          const f = free[Math.floor(Math.random() * free.length)];
          if (!n || gap(f) < gap(b)) b = f;
        }
        target.current = { x: ((b % BINS) + 0.5) / BINS, y: (Math.floor(b / BINS) + 0.5) / BINS };
      }
      if (!target.current) return false;
      dx = target.current.x - q.x;
      dy = target.current.y - q.y;
    }
    const d = Math.hypot(dx, dy), step = (wander ? WANDER : SPEED) * dt;
    if (target.current && d <= step) {
      q.x = target.current.x;
      q.y = target.current.y;
      target.current = null;
    } else {
      q.x = Math.min(0.97, Math.max(0.03, q.x + (dx / d) * step));
      q.y = Math.min(0.97, Math.max(0.03, q.y + (dy / d) * step));
    }
    if (d > 0) q.a = Math.atan2(dy, dx);
    r.trail.push(q.x, q.y);
    if (r.trail.length > 12000) r.trail.splice(0, 2);
    for (let by = 0; by < BINS; by++)
      for (let bx = 0; bx < BINS; bx++)
        if (Math.hypot((bx + 0.5) / BINS - q.x, (by + 0.5) / BINS - q.y) < 0.042) r.seen[by * BINS + bx] = 1;
    const centres: [number, number][] = kind === "place" ? [[r.cx, r.cy]] : nodes(r);
    const s = kind === "place" ? SIGMA : GRID_SIGMA;
    let rate = 0;
    for (const [x, y] of centres) rate += Math.exp(-((x - q.x) ** 2 + (y - q.y) ** 2) / (2 * s * s));
    if (Math.random() < Math.min(1, rate) * 110 * dt) {
      r.spikes.push(q.x, q.y);
      if (r.spikes.length > 8000) r.spikes.splice(0, 2);
      q.flash = 1;
    }
    if (!r.found && coverage(r) >= ENOUGH) {
      r.found = true;
      if (kind === "grid" && !sent.current) {
        sent.current = true;
        aha(box.current);
      }
    }
    return true;
  };

  const tell = () => {
    const r = recs.current![kind];
    setStat({ n: r.spikes.length / 2, cover: coverage(r), found: r.found });
  };

  const draw = () => {
    const c = cv.current;
    if (!c || !pal) return;
    const ctx = c.getContext("2d")!, S = c.width, r = recs.current![kind], q = rat.current, D = size.dpr;
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, S, S);
    if (map && r.found) {
      const pts: [number, number][] = kind === "place" ? [[r.cx, r.cy]] : nodes(r);
      ctx.strokeStyle = pal.fg;
      ctx.lineWidth = 1.5 * D;
      ctx.beginPath();
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++)
          if (Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) < SPACING * 1.05) {
            ctx.moveTo(pts[i][0] * S, pts[i][1] * S);
            ctx.lineTo(pts[j][0] * S, pts[j][1] * S);
          }
      ctx.stroke();
      for (const [x, y] of pts) {
        ctx.beginPath();
        ctx.arc(x * S, y * S, (kind === "place" ? 2 * SIGMA : 2 * GRID_SIGMA) * S, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = pal.line;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = D;
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let i = 0; i < r.trail.length; i += 2) (i ? ctx.lineTo : ctx.moveTo).call(ctx, r.trail[i] * S, r.trail[i + 1] * S);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = pal.accent;
    for (let i = 0; i < r.spikes.length; i += 2) {
      ctx.beginPath();
      ctx.arc(r.spikes[i] * S, r.spikes[i + 1] * S, 2.2 * D, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.save();
    ctx.translate(q.x * S, q.y * S);
    ctx.rotate(q.a);
    ctx.fillStyle = ctx.strokeStyle = pal.fg;
    ctx.lineWidth = 1.5 * D;
    ctx.beginPath();
    ctx.moveTo(-8 * D, 0);
    ctx.quadraticCurveTo(-15 * D, 5 * D, -20 * D, -1 * D);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, 9 * D, 5.5 * D, 0, 0, Math.PI * 2);
    ctx.moveTo(14 * D, 0);
    ctx.lineTo(5 * D, 4 * D);
    ctx.lineTo(5 * D, -4 * D);
    ctx.fill();
    ctx.restore();
    if (q.flash > 0.05) {
      ctx.strokeStyle = pal.accent;
      ctx.globalAlpha = q.flash;
      ctx.lineWidth = 2 * D;
      ctx.beginPath();
      ctx.arc(q.x * S, q.y * S, 16 * D, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  };

  useLoop((dt) => {
    const moved = advance(dt, auto);
    const q = rat.current;
    if (!moved && q.flash <= 0) return;
    q.flash = q.flash > 0.05 ? q.flash * Math.exp(-dt * 8) : 0;
    draw();
    if (moved && performance.now() - told.current > 200) {
      told.current = performance.now();
      tell();
    }
  }, visible && size.w > 0);

  useEffect(() => {
    draw();
    tell();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pal, size.w, kind, map]);

  const wander = () => {
    if (!prefersReducedMotion()) return setAuto((a) => !a);
    // Без анимации — сразу итог прогулки.
    for (let i = 0; i < 6000 && coverage(recs.current![kind]) < 1; i++) advance(1 / 60, true);
    target.current = null;
    rat.current.flash = 0;
    draw();
    tell();
  };
  const clear = () => {
    recs.current![kind] = fresh();
    target.current = null;
    setMap(false);
    setAuto(false);
    draw();
    tell();
  };
  const aim = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    const f = (v: number) => Math.min(0.97, Math.max(0.03, v));
    target.current = { x: f((e.clientX - b.left) / b.width), y: f((e.clientY - b.top) / b.height) };
  };
  const arrow = (k: string) => k.startsWith("Arrow");

  return (
    <div ref={box}>
      <div className="nc-x-seg" role="group" style={{ marginBottom: "0.8rem" }}>
        {(Object.keys(t.kinds) as Kind[]).map((k) => (
          <button key={k} type="button" className="nc-x-btn" aria-pressed={kind === k} onClick={() => { setKind(k); setMap(false); setAuto(false); target.current = null; }}>{t.kinds[k]}</button>
        ))}
      </div>
      <div style={{ maxWidth: "26rem", margin: "0 auto" }}>
        <canvas
          ref={cv}
          tabIndex={0}
          role="application"
          aria-label={t.label}
          onPointerDown={(e) => {
            // Ведёт рука: автопрогулка уступает.
            setAuto(false);
            aim(e);
          }}
          onPointerMove={(e) => e.buttons && aim(e)}
          onKeyDown={(e) => {
            if (!arrow(e.key)) return;
            e.preventDefault();
            setAuto(false);
            keys.current.add(e.key);
          }}
          onKeyUp={(e) => keys.current.delete(e.key)}
          onBlur={() => keys.current.clear()}
          style={{ touchAction: "pan-y", cursor: "crosshair" }}
        />
      </div>
      <div className="nc-x-bar">
        <button type="button" className="nc-x-btn" onClick={wander}>{auto ? <Pause /> : <Play />} {auto ? t.stop : t.walk}</button>
        <button type="button" className="nc-x-btn" onClick={clear}><Reset /> {t.clear}</button>
        {stat.found && <button type="button" className="nc-x-btn" aria-pressed={map} onClick={() => setMap((m) => !m)}>{t.map}</button>}
      </div>
      <div className="nc-x-bar" style={{ gap: "0.3rem 1.2rem" }}>
        <span className="nc-x-stat"><b>{stat.n}</b> {t.spikes}</span>
        <span className="nc-x-stat"><b>{Math.round(stat.cover * 100)}%</b> {t.floor}</span>
      </div>
      <div className="nc-x-hint" aria-live="polite">{stat.found ? `${t.found[kind]}${kind === "place" ? ` ${t.next}` : ""}` : t.hint}</div>
    </div>
  );
}
