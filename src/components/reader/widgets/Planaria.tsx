"use client";

import { useEffect, useState } from "react";
import { Reset, type Dict, type WidgetProps } from "./kit";

// Планарии Левина, схема. У червя есть биоэлектрический узор — какой конец
// станет головой. Переписанный узор формы сразу не меняет; меняет её разрез:
// каждый обрезок отрастает по узору, а узор переходит к потомкам. ДНК одна и та же.

type Pattern = "normal" | "double";
type Worm = { id: number; p: Pattern; shape: Pattern; born: number };

const T: Dict<{ cut: string; rewrite: string; reset: string; dna: string; gen: (n: number) => string; legendHead: string; legendTail: string; hint: string; stage: Record<string, string> }> = {
  ru: {
    cut: "Разрезать всех пополам", rewrite: "Переписать узор первому червю", reset: "Сначала", dna: "ДНК у всех одинаковая", gen: (n) => `разрезов: ${n}`,
    legendHead: "узор «голова»", legendTail: "узор «хвост»",
    hint: "Переписанный узор форму сразу не меняет: червь живёт как жил. Разрежьте его — и обе половины отрастят по голове на каждом конце. Режьте дальше: двухголовость передаётся без всякого вмешательства.",
    stage: { start: "Два обычных червя: голова там, где узор «голова».", rewritten: "Узор переписан, ген ни один не тронут. Червь пока выглядит как прежде.", cut: "Обрезки отрастают по своему узору." },
  },
  en: {
    cut: "Cut every worm in half", rewrite: "Rewrite the first worm’s pattern", reset: "Start over", dna: "Same DNA in every worm", gen: (n) => `cuts: ${n}`,
    legendHead: "“head” pattern", legendTail: "“tail” pattern",
    hint: "A rewritten pattern doesn’t change the shape at once: the worm lives on as before. Cut it, and both halves grow a head at each end. Keep cutting: two-headedness is passed on with no further intervention.",
    stage: { start: "Two ordinary worms: the head is where the “head” pattern is.", rewritten: "Pattern rewritten, not a single gene touched. The worm still looks the same.", cut: "The pieces regrow by their pattern." },
  },
  pt: {
    cut: "Cortar todos ao meio", rewrite: "Reescrever o padrão do primeiro verme", reset: "Recomeçar", dna: "O mesmo DNA em todos", gen: (n) => `cortes: ${n}`,
    legendHead: "padrão “cabeça”", legendTail: "padrão “cauda”",
    hint: "O padrão reescrito não muda a forma de imediato: o verme segue como antes. Corte-o, e as duas metades criam uma cabeça em cada ponta. Continue cortando: as duas cabeças passam adiante sem nenhuma intervenção.",
    stage: { start: "Dois vermes comuns: a cabeça fica onde está o padrão “cabeça”.", rewritten: "Padrão reescrito, nenhum gene tocado. O verme ainda parece o mesmo.", cut: "Os pedaços se regeneram segundo o padrão." },
  },
  es: {
    cut: "Cortar a todos por la mitad", rewrite: "Reescribir el patrón del primer gusano", reset: "Empezar de nuevo", dna: "El mismo ADN en todos", gen: (n) => `cortes: ${n}`,
    legendHead: "patrón «cabeza»", legendTail: "patrón «cola»",
    hint: "El patrón reescrito no cambia la forma enseguida: el gusano sigue como antes. Córtelo, y las dos mitades echan una cabeza en cada extremo. Siga cortando: las dos cabezas se heredan sin intervención alguna.",
    stage: { start: "Dos gusanos comunes: la cabeza está donde está el patrón «cabeza».", rewritten: "Patrón reescrito, ningún gen tocado. El gusano aún se ve igual.", cut: "Los trozos se regeneran según su patrón." },
  },
};

const MAX = 8; // два червя, два разреза
let uid = 0;

function Body({ w, cutting }: { w: Worm; cutting: boolean }) {
  // Червь 240×44: голова — закруглённый треугольник с двумя глазами, хвост — сужение.
  const head = (x: number, dir: 1 | -1) => (
    <g>
      <circle cx={x + dir * 12} cy={17} r={3} fill="var(--r-bg)" />
      <circle cx={x + dir * 12} cy={27} r={3} fill="var(--r-bg)" />
      <circle cx={x + dir * 12.6} cy={17} r={1.4} fill="var(--r-fg)" />
      <circle cx={x + dir * 12.6} cy={27} r={1.4} fill="var(--r-fg)" />
    </g>
  );
  const right = w.shape === "double" ? "head" : "tail";
  // Голова — широкий закруглённый конец, хвост — сужение в точку.
  const path =
    right === "head"
      ? "M30 6 C10 6 2 14 2 22 C2 30 10 38 30 38 L210 38 C230 38 238 30 238 22 C238 14 230 6 210 6 Z"
      : "M30 6 C10 6 2 14 2 22 C2 30 10 38 30 38 C110 37 190 31 238 23 C190 14 110 7 30 6 Z";
  const gid = `pl-${w.id}`;
  return (
    <g>
      <defs>
        <linearGradient id={gid} x1="0" x2="1">
          <stop offset="0" stopColor="var(--r-accent)" />
          <stop offset="0.45" stopColor="color-mix(in srgb, var(--r-accent) 30%, var(--r-muted))" />
          {w.p === "double" ? <stop offset="0.55" stopColor="color-mix(in srgb, var(--r-accent) 30%, var(--r-muted))" /> : null}
          <stop offset="1" stopColor={w.p === "double" ? "var(--r-accent)" : "var(--r-muted)"} />
        </linearGradient>
      </defs>
      <path d={path} fill={`url(#${gid})`} opacity={0.9} />
      {head(2, 1)}
      {right === "head" && head(238, -1)}
      {cutting && <line x1={120} y1={0} x2={120} y2={44} stroke="var(--r-fg)" strokeWidth={1.5} strokeDasharray="3 3" />}
    </g>
  );
}

export default function Planaria({ lang }: WidgetProps) {
  const t = T[lang];
  const [worms, setWorms] = useState<Worm[]>(() => [0, 1].map(() => ({ id: uid++, p: "normal" as Pattern, shape: "normal" as Pattern, born: 0 })));
  const [cuts, setCuts] = useState(0);
  const [stage, setStage] = useState<"start" | "rewritten" | "cut">("start");
  const [cutting, setCutting] = useState(false);

  useEffect(() => {
    if (!cutting) return;
    const id = setTimeout(() => {
      setWorms((ws) => ws.flatMap((w) => [0, 1].map(() => ({ id: uid++, p: w.p, shape: w.p, born: Date.now() }))).slice(0, MAX));
      setCuts((c) => c + 1);
      setStage("cut");
      setCutting(false);
    }, 700);
    return () => clearTimeout(id);
  }, [cutting]);

  const rows = Math.ceil(worms.length / 2);
  return (
    <div>
      <svg viewBox={`0 0 520 ${rows * 64 + 16}`} style={{ display: "block", width: "100%", border: "0.5px solid var(--r-line)", background: "var(--r-bg)" }} aria-label={t.stage[stage]}>
        {worms.map((w, i) => (
          <g key={w.id} transform={`translate(${worms.length === 1 ? 140 : (i % 2) * 260 + 10} ${Math.floor(i / 2) * 64 + 14})`} className={Date.now() - w.born < 1500 ? "nc-pl-grow" : undefined}>
            <Body w={w} cutting={cutting} />
          </g>
        ))}
      </svg>
      <div className="nc-x-bar" style={{ gap: "0.4rem 1rem" }}>
        <span className="nc-x-stat" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <i style={{ width: 18, height: 6, background: "var(--r-accent)" }} /> {t.legendHead}
        </span>
        <span className="nc-x-stat" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <i style={{ width: 18, height: 6, background: "var(--r-muted)" }} /> {t.legendTail}
        </span>
        <span className="nc-x-spacer" />
        <span className="nc-x-stat">{t.dna} · <b>{t.gen(cuts)}</b></span>
      </div>
      <div className="nc-x-title" style={{ fontSize: "1.05rem", margin: "0.8rem 0 0" }}>{t.stage[stage]}</div>
      <div className="nc-x-bar">
        <button type="button" className="nc-x-btn nc-x-btn--primary" disabled={cutting || worms.length >= MAX} onClick={() => setCutting(true)}>✂ {t.cut}</button>
        <button
          type="button"
          className="nc-x-btn"
          disabled={worms[0].p === "double"}
          onClick={() => {
            setWorms((ws) => ws.map((w, i) => (i === 0 ? { ...w, p: "double" } : w)));
            setStage("rewritten");
          }}
        >
          {t.rewrite}
        </button>
        <button
          type="button"
          className="nc-x-btn"
          onClick={() => {
            setWorms([0, 1].map(() => ({ id: uid++, p: "normal" as Pattern, shape: "normal" as Pattern, born: 0 })));
            setCuts(0);
            setStage("start");
          }}
        >
          <Reset /> {t.reset}
        </button>
      </div>
      <div className="nc-x-hint">{t.hint}</div>
    </div>
  );
}
