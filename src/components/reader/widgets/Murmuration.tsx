"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, useCanvasSize, useLoop, usePalette, useVisible, prefersReducedMotion, type Dict, type WidgetProps } from "./kit";

// Стая по Рейнольдсу (1987): каждая птица знает только соседей и следует трём
// правилам — не толкаться, лететь как соседи, держаться к ним ближе. Курсор — сокол.

const N = 700;
const R = 0.06; // радиус соседства в долях ширины

const T: Dict<{ sep: string; ali: string; coh: string; play: string; pause: string; hint: string; birds: string }> = {
  ru: { sep: "Не толкаться", ali: "Лететь как соседи", coh: "Держаться ближе", play: "Пуск", pause: "Пауза", hint: "Ведите курсором или пальцем по небу: это сокол. Стая обходит его волной, хотя ни одна птица не видит дальше соседей.", birds: "птиц" },
  en: { sep: "Don’t crowd", ali: "Fly like neighbours", coh: "Stay close", play: "Play", pause: "Pause", hint: "Move the cursor or your finger across the sky: that’s a falcon. The flock parts around it in a wave, though no bird sees beyond its neighbours.", birds: "birds" },
  pt: { sep: "Não se apertar", ali: "Voar como os vizinhos", coh: "Ficar perto", play: "Iniciar", pause: "Pausar", hint: "Passe o cursor ou o dedo pelo céu: é um falcão. O bando se abre em onda à volta dele, embora nenhum pássaro veja além dos vizinhos.", birds: "pássaros" },
  es: { sep: "No apretarse", ali: "Volar como los vecinos", coh: "Mantenerse cerca", play: "Iniciar", pause: "Pausa", hint: "Pase el cursor o el dedo por el cielo: es un halcón. La bandada se abre en ola a su alrededor, aunque ningún pájaro ve más allá de sus vecinos.", birds: "pájaros" },
};

export default function Murmuration({ lang }: WidgetProps) {
  const t = T[lang];
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const size = useCanvasSize(cv, 16 / 9, 2);
  const pal = usePalette(box);
  const visible = useVisible(box);
  const [running, setRunning] = useState(() => !prefersReducedMotion());
  const [w, setW] = useState({ sep: 1, ali: 1, coh: 1 });
  const hawk = useRef<{ x: number; y: number; t: number } | null>(null);
  const st = useRef<{ x: Float32Array; y: Float32Array; vx: Float32Array; vy: Float32Array } | null>(null);
  if (!st.current) {
    const x = new Float32Array(N), y = new Float32Array(N), vx = new Float32Array(N), vy = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      x[i] = Math.random();
      y[i] = Math.random() * 0.55;
      const a = Math.random() * 0.6 - 0.3;
      vx[i] = Math.cos(a) * 0.12;
      vy[i] = Math.sin(a) * 0.12;
    }
    st.current = { x, y, vx, vy };
  }

  const frame = (dt: number) => {
    const s = st.current!, c = cv.current;
    if (!c || !pal) return;
    const H = c.height / c.width; // высота неба в долях ширины
    const { x, y, vx, vy } = s;
    // Сетка соседства.
    const G = Math.ceil(1 / R), GH = Math.ceil(H / R);
    const cells: number[][] = Array.from({ length: G * GH }, () => []);
    for (let i = 0; i < N; i++) cells[Math.min(GH - 1, Math.max(0, (y[i] / R) | 0)) * G + Math.min(G - 1, Math.max(0, (x[i] / R) | 0))].push(i);
    const hk = hawk.current && performance.now() - hawk.current.t < 1500 ? hawk.current : null;
    for (let i = 0; i < N; i++) {
      let sx = 0, sy = 0, ax = 0, ay = 0, cx = 0, cy = 0, n = 0;
      const gx = (x[i] / R) | 0, gy = (y[i] / R) | 0;
      for (let oy = -1; oy <= 1; oy++)
        for (let ox = -1; ox <= 1; ox++) {
          const qx = gx + ox, qy = gy + oy;
          if (qx < 0 || qy < 0 || qx >= G || qy >= GH) continue;
          for (const j of cells[qy * G + qx]) {
            if (j === i) continue;
            const dx = x[j] - x[i], dy = y[j] - y[i], d2 = dx * dx + dy * dy;
            if (d2 > R * R) continue;
            n++;
            ax += vx[j];
            ay += vy[j];
            cx += dx;
            cy += dy;
            if (d2 < (R * 0.25) ** 2) {
              sx -= dx / (d2 + 1e-5);
              sy -= dy / (d2 + 1e-5);
            }
          }
        }
      let fx = 0, fy = 0;
      if (n) {
        fx += (ax / n - vx[i]) * 1.6 * w.ali + (cx / n) * 0.9 * w.coh + sx * 0.0006 * w.sep;
        fy += (ay / n - vy[i]) * 1.6 * w.ali + (cy / n) * 0.9 * w.coh + sy * 0.0006 * w.sep;
      }
      if (hk) {
        const dx = x[i] - hk.x, dy = y[i] - hk.y, d2 = dx * dx + dy * dy;
        if (d2 < 0.04) {
          fx += (dx / (d2 + 0.002)) * 0.02;
          fy += (dy / (d2 + 0.002)) * 0.02;
        }
      }
      // Немного случайности: живые птицы не идеальны.
      fx += (Math.random() - 0.5) * 0.25;
      fy += (Math.random() - 0.5) * 0.25;
      vx[i] += fx * dt * 2;
      vy[i] += fy * dt * 2;
      const sp = Math.hypot(vx[i], vy[i]);
      const k = sp > 0.22 ? 0.22 / sp : sp < 0.08 ? 0.08 / sp : 1;
      vx[i] *= k;
      vy[i] *= k;
      // Небо замкнуто: улетевшая за край птица возвращается с другой стороны.
      x[i] = (x[i] + vx[i] * dt + 1) % 1;
      y[i] = (y[i] + vy[i] * dt + H) % H;
    }
    // Рисуем.
    const ctx = c.getContext("2d")!;
    const S = c.width;
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = pal.fg;
    ctx.lineWidth = 1.6 * size.dpr;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const sp = Math.hypot(vx[i], vy[i]) || 1;
      const l = 0.006;
      ctx.moveTo(x[i] * S, y[i] * S);
      ctx.lineTo((x[i] - (vx[i] / sp) * l) * S, (y[i] - (vy[i] / sp) * l) * S);
    }
    ctx.stroke();
    if (hk) {
      ctx.fillStyle = pal.accent;
      ctx.beginPath();
      ctx.arc(hk.x * S, hk.y * S, 4 * size.dpr, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  useLoop(frame, running && visible && size.w > 0);
  // Без анимации — стоп-кадр.
  useEffect(() => {
    if (!running) frame(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pal, size.w]);

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    hawk.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.width, t: performance.now() };
  };

  const slider = (k: "sep" | "ali" | "coh", label: string) => (
    <label className="nc-x-stat" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {label}
      <input type="range" min={0} max={3} step={0.1} value={w[k]} onChange={(e) => setW((o) => ({ ...o, [k]: Number(e.target.value) }))} />
    </label>
  );

  return (
    <div ref={box}>
      <canvas ref={cv} onPointerMove={move} onPointerDown={move} style={{ cursor: "none" }} aria-label={t.hint} />
      <div className="nc-x-bar">
        <button type="button" className="nc-x-btn" onClick={() => setRunning((r) => !r)}>
          {running ? <Pause /> : <Play />} {running ? t.pause : t.play}
        </button>
        <span className="nc-x-spacer" />
        <span className="nc-x-stat"><b>{N}</b> {t.birds}</span>
      </div>
      <div className="nc-x-bar" style={{ gap: "0.4rem 1.2rem" }}>
        {slider("sep", t.sep)}
        {slider("ali", t.ali)}
        {slider("coh", t.coh)}
      </div>
      <div className="nc-x-hint">{t.hint}</div>
    </div>
  );
}
