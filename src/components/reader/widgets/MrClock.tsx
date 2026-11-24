"use client";

import { useRef, useState } from "react";
import { aha, prefersReducedMotion, useLoop, useVisible, type Dict, type WidgetProps } from "./kit";

// Хафеле и Китинг (1971): часы летят вокруг Земли на восток или на запад. Итоги из главы:
// −59 и +273 нс против часов в Вашингтоне. По пути разница растёт условно, равномерно.

type Dir = "east" | "west";
const NS: Record<Dir, number> = { east: -59, west: 273 };
const FLIGHT = 6; // секунд на оборот
const MIN = -100, MAX = 300;
const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;

const T: Dict<{
  go: Record<Dir, string>; row: Record<Dir, string>; pole: string; home: string; ns: string; hint: string; flying: string;
  landed: Record<Dir, string>; other: Record<Dir, string>; both: string; axis: string; behind: string; ahead: string;
}> = {
  ru: {
    go: { east: "Лететь на восток", west: "Лететь на запад" }, row: { east: "восток", west: "запад" }, pole: "вид со стороны Северного полюса", home: "Вашингтон", ns: "нс",
    hint: "Выберите, куда полетит мистер Часы.", flying: "Мистер Часы в полёте.",
    landed: { east: "Часы вернулись с востока и отстали от оставшихся на земле на 59 миллиардных секунды.", west: "Часы вернулись с запада и ушли вперёд на 273 миллиардные секунды." },
    other: { east: "Теперь отправьте их на восток.", west: "Теперь отправьте их на запад." },
    both: "Вокруг одной и той же Земли: на восток отстали, на запад ушли вперёд. Обе цифры совпали с тем, что предсказывал Эйнштейн.",
    axis: "Разница с часами в Вашингтоне, наносекунды", behind: "отстают", ahead: "спешат",
  },
  en: {
    go: { east: "Fly east", west: "Fly west" }, row: { east: "east", west: "west" }, pole: "seen from above the North Pole", home: "Washington", ns: "ns",
    hint: "Choose which way Mr Clock will fly.", flying: "Mr Clock is in the air.",
    landed: { east: "Back from the eastward trip, the clocks have lost 59 billionths of a second against those on the ground.", west: "Back from the westward trip, the clocks have gained 273 billionths of a second." },
    other: { east: "Now send them east.", west: "Now send them west." },
    both: "Around the same Earth: eastward they lost time, westward they gained it. Both figures matched what Einstein had predicted.",
    axis: "Difference from the clocks in Washington, nanoseconds", behind: "behind", ahead: "ahead",
  },
  pt: {
    go: { east: "Voar para o leste", west: "Voar para o oeste" }, row: { east: "leste", west: "oeste" }, pole: "visto de cima do Polo Norte", home: "Washington", ns: "ns",
    hint: "Escolha para onde o senhor Relógio vai voar.", flying: "O senhor Relógio está no ar.",
    landed: { east: "Na volta do leste, os relógios atrasaram 59 bilionésimos de segundo em relação aos que ficaram em terra.", west: "Na volta do oeste, os relógios adiantaram 273 bilionésimos de segundo." },
    other: { east: "Agora mande-os para o leste.", west: "Agora mande-os para o oeste." },
    both: "Em volta da mesma Terra: para o leste atrasaram, para o oeste adiantaram. Os dois números coincidiram com o que Einstein tinha previsto.",
    axis: "Diferença em relação aos relógios de Washington, nanossegundos", behind: "atrasados", ahead: "adiantados",
  },
  es: {
    go: { east: "Volar al este", west: "Volar al oeste" }, row: { east: "este", west: "oeste" }, pole: "visto desde encima del Polo Norte", home: "Washington", ns: "ns",
    hint: "Elija hacia dónde volará el señor Reloj.", flying: "El señor Reloj está en el aire.",
    landed: { east: "Al volver del este, los relojes se habían atrasado 59 milmillonésimas de segundo respecto a los que quedaron en tierra.", west: "Al volver del oeste, los relojes se habían adelantado 273 milmillonésimas de segundo." },
    other: { east: "Ahora envíelos al este.", west: "Ahora envíelos al oeste." },
    both: "Alrededor de la misma Tierra: hacia el este se atrasaron, hacia el oeste se adelantaron. Las dos cifras coincidieron con lo que había predicho Einstein.",
    axis: "Diferencia con los relojes de Washington, nanosegundos", behind: "atrasados", ahead: "adelantados",
  },
};

const signed = (v: number) => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : "0");
const CX = 160, CY = 160, R = 92, RP = 116;
// Вашингтон внизу диска; на восток, если смотреть с полюса, — против часовой стрелки.
const at = (dir: Dir, k: number, r: number): [number, number] => {
  const a = Math.PI / 2 + (dir === "east" ? -1 : 1) * k * Math.PI * 2;
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
};

export default function MrClock({ lang }: WidgetProps) {
  const t = T[lang];
  const box = useRef<HTMLDivElement>(null);
  const visible = useVisible(box);
  const sent = useRef(false);
  const [dir, setDir] = useState<Dir | null>(null);
  const [k, setK] = useState(0);
  const [done, setDone] = useState<Record<Dir, boolean>>({ east: false, west: false });
  const pos = useRef(0);
  const flying = dir !== null && k < 1;

  const land = (d: Dir) => {
    pos.current = 1;
    setK(1);
    const next = { ...done, [d]: true };
    setDone(next);
    if (next.east && next.west && !sent.current) {
      sent.current = true;
      aha(box.current);
    }
  };
  useLoop((dt) => {
    if (!dir) return;
    pos.current = Math.min(1, pos.current + dt / FLIGHT);
    if (pos.current >= 1) land(dir);
    else setK(pos.current);
  }, flying && visible);

  const start = (d: Dir) => {
    setDir(d);
    pos.current = 0;
    if (prefersReducedMotion()) return land(d);
    setK(0);
  };

  const [px, py] = at(dir ?? "east", dir ? k : 0, RP);
  const heading = dir ? (Math.atan2(py - CY, px - CX) * 180) / Math.PI + (dir === "east" ? -90 : 90) : 0;
  const steps = Math.max(2, Math.ceil(k * 90));
  const trail = dir && k > 0
    ? Array.from({ length: steps + 1 }, (_, i) => at(dir, (k * i) / steps, RP).map((v) => v.toFixed(1)).join(",")).join(" ")
    : "";
  const value = (d: Dir) => (d === dir && flying ? Math.round(NS[d] * k) : done[d] ? NS[d] : null);
  const both = done.east && done.west;
  const status = !dir ? t.hint : flying ? t.flying : both ? `${t.landed[dir]} ${t.both}` : `${t.landed[dir]} ${t.other[dir === "east" ? "west" : "east"]}`;

  return (
    <div ref={box}>
      <div style={{ border: "0.5px solid var(--r-line)", background: "var(--r-bg)" }}>
        <svg viewBox="0 0 320 324" style={{ display: "block", width: "100%", maxWidth: "22rem", margin: "0 auto" }} aria-hidden>
          <circle cx={CX} cy={CY} r={R} fill="var(--r-faint)" stroke="var(--r-line)" />
          {[30, 61].map((r) => <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="var(--r-line)" strokeWidth={0.6} />)}
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return <line key={i} x1={CX - Math.cos(a) * R} y1={CY - Math.sin(a) * R} x2={CX + Math.cos(a) * R} y2={CY + Math.sin(a) * R} stroke="var(--r-line)" strokeWidth={0.6} />;
          })}
          <circle cx={CX} cy={CY} r={RP} fill="none" stroke="var(--r-line)" strokeDasharray="2 5" />
          {trail && <polyline points={trail} fill="none" stroke="var(--r-accent)" strokeWidth={2} strokeLinecap="round" />}
          <circle cx={CX} cy={CY + R} r={5} fill="var(--r-fg)" />
          <text x={CX} y={CY + R - 14} textAnchor="middle" fontSize={13} fill="var(--r-fg)" stroke="var(--r-faint)" strokeWidth={4} paintOrder="stroke">{t.home}</text>
          <g transform={`translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${heading.toFixed(1)})`}>
            <circle r={15} fill="var(--r-bg)" />
            <path d="M14 0Q14 -2.4 10 -2.4H5L-2 -12H-5L-2 -2.4H-8L-10.5 -6H-12.5L-11 0L-12.5 6H-10.5L-8 2.4H-2L-5 12H-2L5 2.4H10Q14 2.4 14 0z" fill="var(--r-accent)" />
          </g>
          <text x={CX} y={314} textAnchor="middle" fontSize={12} fill="var(--r-muted)">{t.pole}</text>
        </svg>
      </div>

      <div className="nc-x-bar" role="group" aria-label={t.hint}>
        {(["east", "west"] as Dir[]).map((d) => (
          <button key={d} type="button" className="nc-x-btn" aria-pressed={dir === d} onClick={() => start(d)}>{t.go[d]}</button>
        ))}
      </div>

      <div style={{ marginTop: "1.1rem" }}>
        <div className="nc-x-stat" style={{ marginBottom: "0.5rem" }}>{t.axis}</div>
        {(["east", "west"] as Dir[]).map((d) => {
          const v = value(d);
          const x0 = pct(0), x = pct(v ?? 0);
          return (
            <div key={d} style={{ display: "grid", gridTemplateColumns: "3.4rem 1fr 5rem", alignItems: "center", gap: 8, height: 30 }}>
              <span className="nc-x-stat" style={{ color: d === dir ? "var(--r-fg)" : undefined }}>{t.row[d]}</span>
              <span style={{ position: "relative", height: "100%" }}>
                <span style={{ position: "absolute", left: `${x0}%`, top: 0, bottom: 0, width: 1, background: "var(--r-line)" }} />
                <span style={{ position: "absolute", left: `${Math.min(x0, x)}%`, width: `${Math.abs(x - x0)}%`, top: 9, height: 12, background: d === dir ? "var(--r-accent)" : "var(--r-muted)" }} />
              </span>
              <span className="nc-x-num" style={{ fontSize: "1.05rem", textAlign: "right", whiteSpace: "nowrap" }}>{v === null ? "" : `${signed(v)} ${t.ns}`}</span>
            </div>
          );
        })}
        <div style={{ display: "grid", gridTemplateColumns: "3.4rem 1fr 5rem", gap: 8 }}>
          <span />
          <span className="nc-x-stat" style={{ display: "flex", justifyContent: "space-between" }}><span>← {t.behind}</span><span>{t.ahead} →</span></span>
        </div>
      </div>
      <div className="nc-x-hint" aria-live="polite">{status}</div>
    </div>
  );
}
