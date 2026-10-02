"use client";

import { useState } from "react";
import { Reset, type Dict, type WidgetProps } from "./kit";

// Кубит в сечении сферы Блоха. Каждый прогон: приготовить состояние с углом θ,
// измерить — выпадает 0 с вероятностью cos²(θ/2), 1 — с sin²(θ/2), и после
// измерения от суперпозиции ничего не остаётся. Серии считаются, как у Ильи в главе.

const T: Dict<{ theta: string; measure: string; hundred: string; clear: string; runs: string; streak: string; longest: string; chance: (p: string) => string; presets: string[]; hint: string; after: string }> = {
  ru: { theta: "Угол θ", measure: "Измерить", hundred: "Измерить 100 раз", clear: "Сбросить", runs: "прогонов", streak: "серия сейчас", longest: "самая длинная", chance: (p) => `Четырнадцать единиц подряд при этом θ: ${p}`, presets: ["|0⟩", "поровну", "|1⟩"], after: "После измерения суперпозиции нет: стрелка на полюсе. Следующий прогон готовит состояние заново.", hint: "При θ = 90° кубит выпадает нулём и единицей поровну. Нажмите «100 раз» несколько раз и посмотрите, какие серии случаются сами собой." },
  en: { theta: "Angle θ", measure: "Measure", hundred: "Measure 100 times", clear: "Reset", runs: "runs", streak: "current streak", longest: "longest", chance: (p) => `Fourteen ones in a row at this θ: ${p}`, presets: ["|0⟩", "even", "|1⟩"], after: "After measurement the superposition is gone: the arrow sits on a pole. The next run prepares the state afresh.", hint: "At θ = 90° the qubit comes out zero and one equally often. Press “100 times” a few times and see what streaks happen on their own." },
  pt: { theta: "Ângulo θ", measure: "Medir", hundred: "Medir 100 vezes", clear: "Zerar", runs: "rodadas", streak: "série atual", longest: "mais longa", chance: (p) => `Catorze uns seguidos com este θ: ${p}`, presets: ["|0⟩", "meio a meio", "|1⟩"], after: "Depois da medição não há superposição: a seta fica num polo. A rodada seguinte prepara o estado de novo.", hint: "Com θ = 90° o qubit dá zero e um na mesma proporção. Aperte “100 vezes” algumas vezes e veja que séries acontecem sozinhas." },
  es: { theta: "Ángulo θ", measure: "Medir", hundred: "Medir 100 veces", clear: "Reiniciar", runs: "rondas", streak: "racha actual", longest: "la más larga", chance: (p) => `Catorce unos seguidos con este θ: ${p}`, presets: ["|0⟩", "a partes iguales", "|1⟩"], after: "Tras la medición no queda superposición: la flecha está en un polo. La ronda siguiente prepara el estado de nuevo.", hint: "Con θ = 90° el cúbit sale cero y uno por igual. Pulse «100 veces» varias veces y vea qué rachas aparecen solas." },
};

export default function Qubit({ lang }: WidgetProps) {
  const t = T[lang];
  const [theta, setTheta] = useState(90);
  const [hist, setHist] = useState<number[]>([]);
  const [last, setLast] = useState<number | null>(null);
  const p1 = Math.sin(((theta / 180) * Math.PI) / 2) ** 2;

  const measure = (n: number) => {
    const out: number[] = [];
    for (let i = 0; i < n; i++) out.push(Math.random() < p1 ? 1 : 0);
    setHist((h) => [...h, ...out].slice(-2000));
    setLast(out[out.length - 1]);
  };

  let longest = 0, run = 0;
  for (let i = 0; i < hist.length; i++) {
    run = i && hist[i] === hist[i - 1] ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  const cur = run;
  const ones = hist.filter((x) => x).length;
  const chance = p1 ** 14;
  const angle = last === null ? theta : last ? 180 : 0;
  const ax = 110 + Math.sin((angle / 180) * Math.PI) * 78, ay = 110 - Math.cos((angle / 180) * Math.PI) * 78;
  const shown = hist.slice(-120);

  return (
    <div>
      <div className="nc-qb">
        <svg viewBox="0 0 220 220" aria-hidden>
          <circle cx={110} cy={110} r={78} fill="none" stroke="var(--r-line)" />
          <ellipse cx={110} cy={110} rx={78} ry={18} fill="none" stroke="var(--r-faint)" />
          <line x1={110} y1={26} x2={110} y2={194} stroke="var(--r-faint)" />
          <text x={110} y={18} textAnchor="middle" fill="var(--r-soft)" style={{ font: "12px var(--font-mono)" }}>|0⟩</text>
          <text x={110} y={212} textAnchor="middle" fill="var(--r-soft)" style={{ font: "12px var(--font-mono)" }}>|1⟩</text>
          <line x1={110} y1={110} x2={ax} y2={ay} stroke="var(--r-accent)" strokeWidth={3} strokeLinecap="round" style={{ transition: "all .25s ease" }} />
          <circle cx={ax} cy={ay} r={6} fill="var(--r-accent)" style={{ transition: "all .25s ease" }} />
        </svg>
        <div>
          <label className="nc-x-stat" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {t.theta}
            <input type="range" min={0} max={180} value={theta} onChange={(e) => { setTheta(Number(e.target.value)); setLast(null); }} />
            <b>{theta}°</b>
          </label>
          <div className="nc-x-seg" style={{ marginTop: "0.5rem" }}>
            {[0, 90, 180].map((v, i) => (
              <button key={v} type="button" className="nc-x-btn" aria-pressed={theta === v} onClick={() => { setTheta(v); setLast(null); }}>{t.presets[i]}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "1.2rem", marginTop: "0.9rem" }}>
            <div><div className="nc-x-num">{Math.round((1 - p1) * 100)}%</div><div className="nc-x-stat">P(0)</div></div>
            <div><div className="nc-x-num">{Math.round(p1 * 100)}%</div><div className="nc-x-stat">P(1)</div></div>
          </div>
          <div className="nc-x-stat" style={{ marginTop: "0.6rem" }}>{t.chance(chance > 0 ? (chance > 1e-3 ? `${(chance * 100).toLocaleString(lang, { maximumSignificantDigits: 2 })} %` : `1 / ${Math.round(1 / chance).toLocaleString(lang)}`) : "0")}</div>
        </div>
      </div>
      <div className="nc-x-bar">
        <button type="button" className="nc-x-btn nc-x-btn--primary" onClick={() => measure(1)}>{t.measure}</button>
        <button type="button" className="nc-x-btn" onClick={() => measure(100)}>{t.hundred}</button>
        <button type="button" className="nc-x-btn" onClick={() => { setHist([]); setLast(null); }}><Reset /> {t.clear}</button>
      </div>
      {hist.length > 0 && (
        <>
          <div className="nc-qb-run" aria-label={shown.join("")}>
            {shown.map((v, i) => <i key={hist.length - shown.length + i} className={v ? "one" : undefined} />)}
          </div>
          <div className="nc-x-bar">
            <span className="nc-x-stat"><b>{hist.length.toLocaleString(lang)}</b> {t.runs} · 0: <b>{hist.length - ones}</b> · 1: <b>{ones}</b></span>
            <span className="nc-x-spacer" />
            <span className="nc-x-stat">{t.streak}: <b>{cur}</b> · {t.longest}: <b>{longest}</b></span>
          </div>
          {last !== null && <div className="nc-x-hint">{t.after}</div>}
        </>
      )}
      <div className="nc-x-hint">{t.hint}</div>
    </div>
  );
}

