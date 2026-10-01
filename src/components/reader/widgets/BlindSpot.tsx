"use client";

import { useState } from "react";
import type { Dict, WidgetProps } from "./kit";

// Слепое пятно: крестик слева, мишень справа. Правый глаз, глядя на крестик,
// на некотором расстоянии перестаёт видеть мишень, а на её месте мозг дорисовывает
// то, что вокруг: сплошную линию или полоски.

type Mode = "dot" | "line" | "stripes";

const T: Dict<{ modes: Record<Mode, string>; steps: string[]; after: Record<Mode, string> }> = {
  ru: {
    modes: { dot: "Круг", line: "Разрыв в линии", stripes: "Пятно на полосках" },
    steps: ["Закройте левый глаз.", "Правым смотрите на крестик, не переводя взгляд.", "Медленно приближайтесь к экрану и отдаляйтесь, сантиметров от двадцати до шестидесяти."],
    after: { dot: "На каком-то расстоянии круг пропадёт целиком.", line: "Разрыв закроется: линия станет сплошной, хотя на экране её нет.", stripes: "Пятно исчезнет, а полоски пройдут через его место, как будто его и не было." },
  },
  en: {
    modes: { dot: "Dot", line: "Gap in a line", stripes: "Patch on stripes" },
    steps: ["Close your left eye.", "Look at the cross with your right eye and keep looking.", "Slowly move toward the screen and back, from about 20 to 60 cm."],
    after: { dot: "At some distance the dot vanishes entirely.", line: "The gap closes: the line looks continuous, though the screen has no line there.", stripes: "The patch vanishes and the stripes run through its place as if it were never there." },
  },
  pt: {
    modes: { dot: "Círculo", line: "Falha na linha", stripes: "Mancha nas listras" },
    steps: ["Feche o olho esquerdo.", "Com o direito, olhe para a cruz sem desviar.", "Aproxime-se da tela e afaste-se devagar, de uns 20 a 60 cm."],
    after: { dot: "A certa distância o círculo some por inteiro.", line: "A falha se fecha: a linha parece contínua, embora a tela não tenha linha ali.", stripes: "A mancha some e as listras passam pelo lugar dela como se nunca tivesse existido." },
  },
  es: {
    modes: { dot: "Círculo", line: "Hueco en la línea", stripes: "Mancha en las rayas" },
    steps: ["Cierre el ojo izquierdo.", "Con el derecho, mire la cruz sin apartar la vista.", "Acérquese a la pantalla y aléjese despacio, de unos 20 a 60 cm."],
    after: { dot: "A cierta distancia el círculo desaparece por completo.", line: "El hueco se cierra: la línea parece continua, aunque la pantalla no tiene línea ahí.", stripes: "La mancha desaparece y las rayas pasan por su lugar como si nunca hubiera estado." },
  },
};

export default function BlindSpot({ lang }: WidgetProps) {
  const t = T[lang];
  const [mode, setMode] = useState<Mode>("dot");
  const W = 600, H = 200, cx = 70, tx = 470, cy = 100;
  return (
    <div>
      <div className="nc-x-seg" role="group" style={{ marginBottom: "0.8rem" }}>
        {(Object.keys(t.modes) as Mode[]).map((m) => (
          <button key={m} type="button" className="nc-x-btn" aria-pressed={mode === m} onClick={() => setMode(m)}>{t.modes[m]}</button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", border: "0.5px solid var(--r-line)", background: "var(--r-bg)" }} aria-label={t.steps.join(" ")}>
        <defs>
          <pattern id="nc-bs-stripes" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="14" fill="var(--r-fg)" />
          </pattern>
        </defs>
        {mode === "stripes" && <rect x={W * 0.5} y={0} width={W * 0.5} height={H} fill="url(#nc-bs-stripes)" opacity={0.85} />}
        {mode === "line" && (
          <g stroke="var(--r-accent)" strokeWidth={6}>
            <line x1={cx + 30} y1={cy} x2={tx - 26} y2={cy} />
            <line x1={tx + 26} y1={cy} x2={W - 10} y2={cy} />
          </g>
        )}
        <g stroke="var(--r-fg)" strokeWidth={3} strokeLinecap="round">
          <line x1={cx - 14} y1={cy} x2={cx + 14} y2={cy} />
          <line x1={cx} y1={cy - 14} x2={cx} y2={cy + 14} />
        </g>
        {mode === "dot" && <circle cx={tx} cy={cy} r={18} fill="var(--r-accent)" />}
        {mode === "stripes" && <circle cx={tx} cy={cy} r={24} fill="var(--r-accent)" />}
      </svg>
      <ol style={{ margin: "0.9rem 0 0", paddingLeft: "1.2rem", display: "grid", gap: "0.25rem" }}>
        {t.steps.map((s, i) => (
          <li key={i} style={{ color: "var(--r-soft)", fontSize: "0.85rem" }}>{s}</li>
        ))}
      </ol>
      <div className="nc-x-hint">{t.after[mode]}</div>
    </div>
  );
}
