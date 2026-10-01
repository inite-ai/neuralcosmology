"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Reset, rgb, useCanvasSize, useLoop, usePalette, useVisible, prefersReducedMotion, type Dict, type WidgetProps } from "./kit";

// Элементарные клеточные автоматы Вольфрама: строка клеток, каждая смотрит на себя
// и двух соседей. Восемь случаев, на каждый ответ 0 или 1 — номер правила от 0 до 255.

const W = 200;
const H = 120;

const T: Dict<{ rule: string; cases: string; play: string; pause: string; one: string; random: string; hint: string; names: Record<number, string> }> = {
  ru: { rule: "Правило", cases: "Восемь случаев: нажмите, чтобы поменять ответ", play: "Пуск", pause: "Пауза", one: "Одна клетка", random: "Случайная строка", hint: "Каждая новая строка — следующий шаг времени. Правило 110 умещается в восемь клеток и при этом способно вычислить всё, что вычислимо.", names: { 110: "110 · универсальное", 30: "30 · хаос", 90: "90 · треугольник Серпинского", 184: "184 · пробка", 4: "4 · скука" } },
  en: { rule: "Rule", cases: "The eight cases: tap to flip an answer", play: "Play", pause: "Pause", one: "Single cell", random: "Random row", hint: "Each new row is the next step in time. Rule 110 fits in eight cells and can still compute anything computable.", names: { 110: "110 · universal", 30: "30 · chaos", 90: "90 · Sierpiński", 184: "184 · traffic", 4: "4 · boring" } },
  pt: { rule: "Regra", cases: "Os oito casos: toque para trocar a resposta", play: "Iniciar", pause: "Pausar", one: "Uma célula", random: "Linha ao acaso", hint: "Cada nova linha é o passo seguinte do tempo. A Regra 110 cabe em oito células e ainda assim calcula tudo o que é calculável.", names: { 110: "110 · universal", 30: "30 · caos", 90: "90 · Sierpiński", 184: "184 · trânsito", 4: "4 · tédio" } },
  es: { rule: "Regla", cases: "Los ocho casos: toque para cambiar la respuesta", play: "Iniciar", pause: "Pausa", one: "Una célula", random: "Fila al azar", hint: "Cada fila nueva es el siguiente paso del tiempo. La Regla 110 cabe en ocho celdas y aun así calcula todo lo calculable.", names: { 110: "110 · universal", 30: "30 · caos", 90: "90 · Sierpiński", 184: "184 · tráfico", 4: "4 · aburrimiento" } },
};

const PRESETS = [110, 30, 90, 184, 4];

export default function Rule110({ lang, props }: WidgetProps) {
  const t = T[lang];
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const size = useCanvasSize(cv, W / H, 1);
  const pal = usePalette(box);
  const visible = useVisible(box);
  const [rule, setRule] = useState(() => Number(props?.rule ?? 110));
  const [seed, setSeed] = useState<"one" | "random">("one");
  const [running, setRunning] = useState(true);
  const st = useRef({ row: new Uint8Array(W), rows: 0, img: null as ImageData | null, off: null as HTMLCanvasElement | null, acc: 0 });

  const restart = () => {
    const s = st.current;
    s.row = new Uint8Array(W);
    if (seed === "one") s.row[rule === 110 || rule === 137 ? W - 2 : Math.floor(W / 2)] = 1; // 110 растёт влево
    else for (let i = 0; i < W; i++) s.row[i] = Math.random() < 0.5 ? 1 : 0;
    s.rows = 0;
    if (s.img) s.img.data.fill(0);
    push();
    if (prefersReducedMotion()) {
      for (let i = 1; i < H; i++) advance();
    }
    draw();
  };

  const colors = () => (pal ? { on: rgb(pal.fg), off: rgb(pal.bg) } : { on: [0, 0, 0], off: [255, 255, 255] });

  const push = () => {
    const s = st.current;
    if (!s.off) {
      s.off = document.createElement("canvas");
      s.off.width = W;
      s.off.height = H;
      s.img = s.off.getContext("2d")!.createImageData(W, H);
    }
    const d = s.img!.data;
    let y = s.rows;
    if (y >= H) {
      d.copyWithin(0, W * 4); // строка уходит вверх
      y = H - 1;
    }
    const { on, off } = colors();
    for (let x = 0; x < W; x++) {
      const c = s.row[x] ? on : off, i = (y * W + x) * 4;
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
    }
    s.rows++;
  };

  const advance = () => {
    const s = st.current, r = s.row, n = new Uint8Array(W);
    for (let x = 0; x < W; x++) {
      const k = (r[(x + W - 1) % W] << 2) | (r[x] << 1) | r[(x + 1) % W];
      n[x] = (rule >> k) & 1;
    }
    s.row = n;
    push();
  };

  const draw = () => {
    const c = cv.current, s = st.current;
    if (!c || !s.off || !pal) return;
    s.off.getContext("2d")!.putImageData(s.img!, 0, 0);
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(s.off, 0, 0, c.width, c.height);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(restart, [rule, seed, pal]);

  useLoop((dt) => {
    const s = st.current;
    s.acc += dt * 45;
    let k = 0;
    while (s.acc >= 1 && k < 8) {
      s.acc -= 1;
      advance();
      k++;
    }
    if (k) draw();
  }, running && visible && size.w > 0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(draw, [size.w]);

  return (
    <div ref={box}>
      <div className="nc-x-stat" style={{ marginBottom: "0.5rem" }}>{t.cases}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, minmax(0, 1fr))", gap: 6, marginBottom: "0.9rem" }}>
        {[7, 6, 5, 4, 3, 2, 1, 0].map((k) => {
          const out = (rule >> k) & 1;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setRule((r) => r ^ (1 << k))}
              aria-label={`${(k >> 2) & 1}${(k >> 1) & 1}${k & 1} → ${out}`}
              aria-pressed={!!out}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 0", border: "0.5px solid var(--r-line)", borderRadius: 2, background: "transparent", cursor: "pointer" }}
            >
              <span style={{ display: "flex", gap: 1 }}>
                {[2, 1, 0].map((b) => (
                  <i key={b} style={{ width: 9, height: 9, border: "0.5px solid var(--r-line)", background: (k >> b) & 1 ? "var(--r-fg)" : "var(--r-bg)" }} />
                ))}
              </span>
              <i style={{ width: 9, height: 9, border: "0.5px solid var(--r-accent)", background: out ? "var(--r-accent)" : "var(--r-bg)" }} />
              <span className="nc-x-stat" style={{ fontSize: "0.62rem" }}>{out}</span>
            </button>
          );
        })}
      </div>
      <canvas ref={cv} aria-label={`${t.rule} ${rule}`} />
      <div className="nc-x-bar">
        <label className="nc-x-stat" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {t.rule}
          <input
            type="number"
            min={0}
            max={255}
            value={rule}
            onChange={(e) => setRule(Math.max(0, Math.min(255, Number(e.target.value) | 0)))}
            style={{ width: "4.2rem", minHeight: "2.25rem", padding: "0 0.5rem", border: "0.5px solid var(--r-line)", borderRadius: 2, background: "var(--r-bg)", color: "var(--r-fg)", fontFamily: "var(--font-mono)" }}
          />
        </label>
        <button type="button" className="nc-x-btn" onClick={() => setRunning((r) => !r)}>
          {running ? <Pause /> : <Play />} {running ? t.pause : t.play}
        </button>
        <span className="nc-x-seg" role="group">
          <button type="button" className="nc-x-btn" aria-pressed={seed === "one"} onClick={() => setSeed("one")}>{t.one}</button>
          <button type="button" className="nc-x-btn" aria-pressed={seed === "random"} onClick={() => (seed === "random" ? restart() : setSeed("random"))}>
            {seed === "random" && <Reset />} {t.random}
          </button>
        </span>
      </div>
      <div className="nc-x-bar">
        <span className="nc-x-seg" role="group">
          {PRESETS.map((r) => (
            <button key={r} type="button" className="nc-x-btn" aria-pressed={rule === r} onClick={() => setRule(r)}>{t.names[r]}</button>
          ))}
        </span>
      </div>
      <div className="nc-x-hint">{t.hint}</div>
    </div>
  );
}
