"use client";

import { useMemo, useState } from "react";
import { Reset, type Dict, type WidgetProps } from "./kit";

// Сигнал Wow! (Big Ear, 15 августа 1977). Каждый знак распечатки — сила сигнала
// за 12 секунд в единицах шума: пробел — меньше единицы, 1–9 — как есть, дальше
// буквы: A = 10, B = 11 … Z = 35. Колонка 6EQUJ5 подлинная, фон распечатки — схема.

const WOW = "6EQUJ5";
const val = (c: string) => (/\d/.test(c) ? Number(c) : c.charCodeAt(0) - 55);

const T: Dict<{ tap: string; decode: string; reset: string; sigma: string; seconds: string; hint: string; letters: string }> = {
  ru: { tap: "Нажимайте на знаки обведённой колонки", decode: "Расшифровать всё", reset: "Сначала", sigma: "сила, в единицах шума", seconds: "секунд", letters: "пробел < 1 · 1–9 · A = 10 … Z = 35", hint: "Шесть знаков — 72 секунды: столько звезда проходит через неподвижный луч антенны, пока Земля вращается. Сигнал вырос, достиг пика и угас ровно так, как должен источник на небе. Больше его никто не слышал." },
  en: { tap: "Tap the characters in the circled column", decode: "Decode all", reset: "Start over", sigma: "strength, in units of noise", seconds: "seconds", letters: "space < 1 · 1–9 · A = 10 … Z = 35", hint: "Six characters make 72 seconds: the time a point in the sky takes to cross the antenna’s fixed beam as the Earth turns. The signal rose, peaked and faded exactly as a source in the sky should. No one has heard it since." },
  pt: { tap: "Toque nos caracteres da coluna circulada", decode: "Decifrar tudo", reset: "Recomeçar", sigma: "intensidade, em unidades de ruído", seconds: "segundos", letters: "espaço < 1 · 1–9 · A = 10 … Z = 35", hint: "Seis caracteres são 72 segundos: o tempo que um ponto do céu leva para cruzar o feixe fixo da antena enquanto a Terra gira. O sinal subiu, chegou ao pico e se apagou exatamente como uma fonte no céu deveria. Ninguém o ouviu de novo." },
  es: { tap: "Toque los caracteres de la columna rodeada", decode: "Descifrar todo", reset: "Empezar de nuevo", sigma: "intensidad, en unidades de ruido", seconds: "segundos", letters: "espacio < 1 · 1–9 · A = 10 … Z = 35", hint: "Seis caracteres son 72 segundos: lo que tarda un punto del cielo en cruzar el haz fijo de la antena mientras gira la Tierra. La señal subió, llegó al pico y se apagó tal como debe hacerlo una fuente en el cielo. Nadie volvió a oírla." },
};

const ROWS = 14, COLS = 22, WC = 2, WR = 5;

export default function Wow({ lang }: WidgetProps) {
  const t = T[lang];
  const [open, setOpen] = useState<boolean[]>(() => WOW.split("").map(() => false));
  const sheet = useMemo(() => {
    const g: string[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: string[] = [];
      for (let c = 0; c < COLS; c++) {
        const x = Math.random();
        row.push(x < 0.55 ? " " : x < 0.9 ? "1" : x < 0.97 ? "2" : "3");
      }
      g.push(row);
    }
    return g;
  }, []);
  const shown = WOW.split("").filter((_, i) => open[i]).length;

  return (
    <div>
      <div className="nc-x-stat" style={{ marginBottom: "0.5rem" }}>{t.tap}</div>
      <div className="nc-wow">
        <div className="nc-wow-sheet" aria-hidden={false}>
          {sheet.map((row, r) => (
            <div key={r}>
              {row.map((ch, c) => {
                const k = r - WR;
                if (c === WC && k >= 0 && k < WOW.length)
                  return (
                    <button key={c} type="button" className={`nc-wow-c${open[k] ? " is-open" : ""}${k === 0 ? " top" : ""}${k === WOW.length - 1 ? " bottom" : ""}`} onClick={() => setOpen((o) => o.map((x, i) => (i === k ? true : x)))} aria-label={`${WOW[k]} = ${val(WOW[k])}`}>
                      {WOW[k]}
                    </button>
                  );
                return <span key={c}>{ch === " " ? " " : ch}</span>;
              })}
            </div>
          ))}
        </div>
        <svg viewBox="0 0 300 200" className="nc-wow-plot" aria-label={t.sigma}>
          {[0, 10, 20, 30].map((y) => (
            <g key={y}>
              <line x1={30} x2={295} y1={180 - y * 5} y2={180 - y * 5} stroke="var(--r-faint)" />
              <text x={24} y={184 - y * 5} textAnchor="end" fill="var(--r-muted)" style={{ font: "10px var(--font-mono)" }}>{y}</text>
            </g>
          ))}
          {WOW.split("").map((c, i) => {
            const v = val(c);
            const x = 40 + i * 43;
            return (
              <g key={i}>
                <rect x={x} y={open[i] ? 180 - v * 5 : 180} width={30} height={open[i] ? v * 5 : 0} fill="var(--r-accent)" style={{ transition: "all .5s cubic-bezier(.2,.8,.2,1)" }} />
                <text x={x + 15} y={196} textAnchor="middle" fill="var(--r-fg)" style={{ font: "12px var(--font-mono)" }}>{c}</text>
                {open[i] && <text x={x + 15} y={174 - v * 5} textAnchor="middle" fill="var(--r-fg)" style={{ font: "11px var(--font-mono)" }}>{v}</text>}
              </g>
            );
          })}
          {shown === WOW.length && (
            <path
              d={(() => {
                // Профиль луча — гауссиана через пик.
                const pts: string[] = [];
                for (let s = 0; s <= 1; s += 0.02) {
                  const x = 40 + 15 + s * 5 * 43, u = (s * 5 - 2.6) / 1.2;
                  pts.push(`${x},${180 - 31 * Math.exp(-u * u / 2) * 5}`);
                }
                return `M${pts.join(" L")}`;
              })()}
              fill="none"
              stroke="var(--r-fg)"
              strokeDasharray="3 3"
            />
          )}
        </svg>
      </div>
      <div className="nc-x-bar">
        <button type="button" className="nc-x-btn nc-x-btn--primary" onClick={() => setOpen(WOW.split("").map(() => true))}>{t.decode}</button>
        <button type="button" className="nc-x-btn" onClick={() => setOpen(WOW.split("").map(() => false))}><Reset /> {t.reset}</button>
        <span className="nc-x-spacer" />
        <span className="nc-x-stat">{t.letters}</span>
      </div>
      <div className="nc-x-hint">{t.hint}</div>
    </div>
  );
}
