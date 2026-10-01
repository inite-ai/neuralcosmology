"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Reset, StepIcon, useCanvasSize, useLoop, usePalette, useVisible, prefersReducedMotion, type Dict, type WidgetProps } from "./kit";

// «Жизнь» Конвея. Четыре правила из главы, клетки рисуются пальцем. Поле считается
// с невидимым полем вокруг, внешняя кромка которого каждый шаг очищается: улетевшие
// глайдеры исчезают, а не врезаются в ружьё с другой стороны.

const COLS = 80;
const ROWS = 50;
const M = 6;
const SW = COLS + 2 * M;
const SH = ROWS + 2 * M;

const T: Dict<{ play: string; pause: string; step: string; clear: string; gen: string; pop: string; hint: string; presets: Record<string, string> }> = {
  ru: { play: "Пуск", pause: "Пауза", step: "Шаг", clear: "Очистить", gen: "поколение", pop: "живых", hint: "Рисуйте клетки прямо на поле. Глайдер — пять клеток, которые ползут по диагонали; ружьё Госпера выпускает их без конца.", presets: { gun: "Ружьё Госпера", glider: "Глайдеры", r: "R-пентамино", random: "Случайно" } },
  en: { play: "Play", pause: "Pause", step: "Step", clear: "Clear", gen: "generation", pop: "alive", hint: "Draw cells right on the grid. A glider is five cells that crawl diagonally; Gosper’s gun fires them forever.", presets: { gun: "Gosper gun", glider: "Gliders", r: "R-pentomino", random: "Random" } },
  pt: { play: "Iniciar", pause: "Pausar", step: "Passo", clear: "Limpar", gen: "geração", pop: "vivas", hint: "Desenhe células direto na grade. Um planador são cinco células que rastejam na diagonal; o canhão de Gosper os dispara sem fim.", presets: { gun: "Canhão de Gosper", glider: "Planadores", r: "R-pentominó", random: "Ao acaso" } },
  es: { play: "Iniciar", pause: "Pausa", step: "Paso", clear: "Limpiar", gen: "generación", pop: "vivas", hint: "Dibuje células sobre la cuadrícula. Un planeador son cinco células que reptan en diagonal; el cañón de Gosper los dispara sin fin.", presets: { gun: "Cañón de Gosper", glider: "Planeadores", r: "R-pentominó", random: "Al azar" } },
};

const GUN = [
  "........................O...........",
  "......................O.O...........",
  "............OO......OO............OO",
  "...........O...O....OO............OO",
  "OO........O.....O...OO..............",
  "OO........O...O.OO....O.O...........",
  "..........O.....O.......O...........",
  "...........O...O....................",
  "............OO......................",
];
const GLIDER = [".O.", "..O", "OOO"];
const R = [".OO", "OO.", ".O."];

const at = (x: number, y: number) => (y + M) * SW + x + M;

function stamp(g: Uint8Array, pat: string[], x0: number, y0: number) {
  pat.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === "O" && x0 + x < COLS && y0 + y < ROWS) g[at(x0 + x, y0 + y)] = 1; }));
}

function preset(name: string): Uint8Array {
  const g = new Uint8Array(SW * SH);
  if (name === "gun") stamp(g, GUN, 2, 2);
  else if (name === "glider") for (let i = 0; i < 6; i++) stamp(g, GLIDER, 6 + i * 12, 4 + ((i * 7) % 30));
  else if (name === "r") stamp(g, R, COLS / 2, ROWS / 2);
  else for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) g[at(x, y)] = Math.random() < 0.22 ? 1 : 0;
  return g;
}

function next(g: Uint8Array): Uint8Array {
  const n = new Uint8Array(g.length);
  for (let y = 2; y < SH - 2; y++) {
    const ym = (y - 1) * SW, y0 = y * SW, yp = (y + 1) * SW;
    for (let x = 2; x < SW - 2; x++) {
      const s = g[ym + x - 1] + g[ym + x] + g[ym + x + 1] + g[y0 + x - 1] + g[y0 + x + 1] + g[yp + x - 1] + g[yp + x] + g[yp + x + 1];
      n[y0 + x] = s === 3 || (s === 2 && g[y0 + x]) ? 1 : 0;
    }
  }
  return n;
}

export default function Life({ lang }: WidgetProps) {
  const t = T[lang];
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const size = useCanvasSize(cv, COLS / ROWS, 2);
  const pal = usePalette(box);
  const visible = useVisible(box);
  const [running, setRunning] = useState(() => !prefersReducedMotion());
  const [gen, setGen] = useState(0);
  const [pop, setPop] = useState(0);
  const grid = useRef<Uint8Array>(preset("gun"));
  const acc = useRef(0);
  const paint = useRef<0 | 1 | null>(null);

  const draw = () => {
    const c = cv.current;
    if (!c || !pal) return;
    const ctx = c.getContext("2d")!;
    const cw = c.width / COLS, ch = c.height / ROWS;
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 1; x < COLS; x++) { ctx.moveTo(Math.round(x * cw) + 0.5, 0); ctx.lineTo(Math.round(x * cw) + 0.5, c.height); }
    for (let y = 1; y < ROWS; y++) { ctx.moveTo(0, Math.round(y * ch) + 0.5); ctx.lineTo(c.width, Math.round(y * ch) + 0.5); }
    ctx.stroke();
    ctx.fillStyle = pal.fg;
    const g = grid.current;
    let p = 0;
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++)
        if (g[at(x, y)]) {
          p++;
          ctx.fillRect(Math.round(x * cw) + 1, Math.round(y * ch) + 1, Math.ceil(cw) - 1, Math.ceil(ch) - 1);
        }
    setPop(p);
  };

  const tick = () => {
    grid.current = next(grid.current);
    setGen((g) => g + 1);
  };

  useLoop((dt) => {
    acc.current += dt;
    if (acc.current < 1 / 14) return;
    acc.current = 0;
    tick();
    draw();
  }, running && visible && size.w > 0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(draw, [pal, size.w]);

  const load = (name: string) => {
    grid.current = preset(name);
    setGen(0);
    draw();
  };

  const cell = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - r.left) / r.width) * COLS), y = Math.floor(((e.clientY - r.top) / r.height) * ROWS);
    return x >= 0 && y >= 0 && x < COLS && y < ROWS ? at(x, y) : -1;
  };

  return (
    <div ref={box}>
      <canvas
        ref={cv}
        aria-label={t.hint}
        style={{ cursor: "cell" }}
        onPointerDown={(e) => {
          const i = cell(e);
          if (i < 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          paint.current = grid.current[i] ? 0 : 1;
          grid.current[i] = paint.current;
          draw();
        }}
        onPointerMove={(e) => {
          if (paint.current === null) return;
          const i = cell(e);
          if (i >= 0 && grid.current[i] !== paint.current) {
            grid.current[i] = paint.current;
            draw();
          }
        }}
        onPointerUp={() => (paint.current = null)}
        onPointerCancel={() => (paint.current = null)}
      />
      <div className="nc-x-bar">
        <button type="button" className="nc-x-btn" onClick={() => setRunning((r) => !r)}>
          {running ? <Pause /> : <Play />} {running ? t.pause : t.play}
        </button>
        <button type="button" className="nc-x-btn" onClick={() => { tick(); draw(); }} disabled={running}>
          <StepIcon /> {t.step}
        </button>
        <button type="button" className="nc-x-btn" onClick={() => { grid.current = new Uint8Array(SW * SH); setGen(0); draw(); }}>
          <Reset /> {t.clear}
        </button>
        <span className="nc-x-spacer" />
        <span className="nc-x-stat"><b>{gen.toLocaleString(lang)}</b> {t.gen} · <b>{pop.toLocaleString(lang)}</b> {t.pop}</span>
      </div>
      <div className="nc-x-bar">
        <span className="nc-x-seg" role="group">
          {(["gun", "glider", "r", "random"] as const).map((k) => (
            <button key={k} type="button" className="nc-x-btn" onClick={() => load(k)}>{t.presets[k]}</button>
          ))}
        </span>
      </div>
      <div className="nc-x-hint">{t.hint}</div>
    </div>
  );
}
