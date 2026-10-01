"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Reset, type Dict, type WidgetProps } from "./kit";

// Опыт Ярбуса своими глазами. Картина размыта везде, кроме пятна у курсора или
// пальца (резкое зрение — около двух градусов), за двадцать секунд записывается
// путь этого пятна, остановки выделяются по разбросу (I-DT). Траектории разных
// вопросов можно положить друг на друга.

const SRC = "/book/ill/cs-ch01-repin.webp";
const AR = 1600 / 1536;
const SECONDS = 20;
const COLORS = ["var(--r-accent)", "#d2663a", "#2f9a74", "#b0478e", "#c49a1c", "#3c86cf", "#7d62c9"];

const T: Dict<{ questions: string[]; pick: string; start: string; again: string; clear: string; left: (s: number) => string; hint: string; yours: string; idle: string; touch: string }> = {
  ru: {
    questions: ["Просто посмотрите на картину", "Насколько обеспечена эта семья?", "Сколько лет каждому из присутствующих?", "Чем они занимались до прихода гостя?", "Запомните, во что все одеты", "Запомните, где что стоит в комнате", "Как долго вошедший отсутствовал?"],
    pick: "Вопрос перед показом", start: "Смотреть 20 секунд", again: "Ещё вопрос", clear: "Стереть траектории", left: (s) => `осталось ${s} с`,
    hint: "Ведите курсором или пальцем: резко видно только пятно вокруг него, как у глаза. Мышь — грубая замена глаза, но разница между вопросами видна и так.",
    yours: "Ваши траектории", idle: "Выберите вопрос и нажмите «Смотреть»", touch: "Ведите пальцем по картине",
  },
  en: {
    questions: ["Just look at the painting", "How well off is this family?", "How old is each person?", "What were they doing before the visitor came?", "Remember what everyone is wearing", "Remember where everything is in the room", "How long was the visitor away?"],
    pick: "The question before viewing", start: "Look for 20 seconds", again: "Another question", clear: "Erase paths", left: (s) => `${s} s left`,
    hint: "Move the cursor or your finger: only a spot around it is sharp, as with the eye. A mouse is a crude stand-in for an eye, but the difference between questions shows anyway.",
    yours: "Your paths", idle: "Pick a question and press “Look”", touch: "Move your finger over the painting",
  },
  pt: {
    questions: ["Apenas olhe para o quadro", "Qual é a situação financeira desta família?", "Que idade tem cada um dos presentes?", "O que faziam antes de o visitante chegar?", "Lembre-se do que cada um está vestindo", "Lembre-se de onde está cada coisa na sala", "Quanto tempo o visitante esteve fora?"],
    pick: "A pergunta antes de olhar", start: "Olhar por 20 segundos", again: "Outra pergunta", clear: "Apagar trajetórias", left: (s) => `faltam ${s} s`,
    hint: "Mova o cursor ou o dedo: só uma mancha em volta dele fica nítida, como no olho. O mouse é um substituto tosco do olho, mas a diferença entre as perguntas aparece mesmo assim.",
    yours: "Suas trajetórias", idle: "Escolha uma pergunta e toque em “Olhar”", touch: "Passe o dedo pelo quadro",
  },
  es: {
    questions: ["Solo mire el cuadro", "¿Qué tan acomodada es esta familia?", "¿Qué edad tiene cada uno de los presentes?", "¿Qué hacían antes de que llegara el visitante?", "Recuerde cómo va vestido cada uno", "Recuerde dónde está cada cosa en la sala", "¿Cuánto tiempo estuvo ausente el visitante?"],
    pick: "La pregunta antes de mirar", start: "Mirar 20 segundos", again: "Otra pregunta", clear: "Borrar trayectorias", left: (s) => `quedan ${s} s`,
    hint: "Mueva el cursor o el dedo: solo se ve nítida una mancha a su alrededor, como en el ojo. El ratón es un sustituto tosco del ojo, pero la diferencia entre preguntas se ve igual.",
    yours: "Sus trayectorias", idle: "Elija una pregunta y pulse «Mirar»", touch: "Pase el dedo por el cuadro",
  },
};

type Pt = { x: number; y: number; t: number };
type Fix = { x: number; y: number; d: number };
type Run = { q: number; fix: Fix[]; raw: Pt[]; color: string; on: boolean };

// I-DT: окно точек, пока разброс меньше порога, — одна остановка.
function fixations(pts: Pt[], disp = 0.035, minMs = 140): Fix[] {
  const out: Fix[] = [];
  let i = 0;
  while (i < pts.length) {
    let j = i;
    let minX = pts[i].x, maxX = pts[i].x, minY = pts[i].y, maxY = pts[i].y;
    while (j + 1 < pts.length) {
      const p = pts[j + 1];
      const nx0 = Math.min(minX, p.x), nx1 = Math.max(maxX, p.x), ny0 = Math.min(minY, p.y), ny1 = Math.max(maxY, p.y);
      if (nx1 - nx0 + (ny1 - ny0) * AR ** -1 > disp) break;
      [minX, maxX, minY, maxY] = [nx0, nx1, ny0, ny1];
      j++;
    }
    const d = pts[j].t - pts[i].t;
    if (d >= minMs) {
      let sx = 0, sy = 0;
      for (let k = i; k <= j; k++) { sx += pts[k].x; sy += pts[k].y; }
      out.push({ x: sx / (j - i + 1), y: sy / (j - i + 1), d });
      i = j + 1;
    } else i++;
  }
  return out;
}

export default function Yarbus({ lang }: WidgetProps) {
  const t = T[lang];
  const area = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState(0);
  const [phase, setPhase] = useState<"idle" | "look" | "done">("idle");
  const [left, setLeft] = useState(SECONDS);
  const [runs, setRuns] = useState<Run[]>([]);
  const [touch, setTouch] = useState(false);
  const pts = useRef<Pt[]>([]);
  const t0 = useRef(0);
  const last = useRef<Pt>({ x: 0.5, y: 0.5, t: 0 });

  const setSpot = (x: number, y: number) => {
    const el = area.current;
    if (!el) return;
    el.style.setProperty("--fx", `${x * 100}%`);
    el.style.setProperty("--fy", `${y * 100}%`);
    el.style.setProperty("--fr", `${Math.round(el.clientWidth * 0.075)}px`);
  };

  // Пока смотрим: точка пишется и по таймеру, чтобы неподвижный курсор тоже давал остановку.
  useEffect(() => {
    if (phase !== "look") return;
    const iv = setInterval(() => {
      const now = performance.now() - t0.current;
      pts.current.push({ ...last.current, t: now });
      const s = Math.max(0, Math.ceil(SECONDS - now / 1000));
      setLeft(s);
      if (now >= SECONDS * 1000) {
        clearInterval(iv);
        const fix = fixations(pts.current);
        setRuns((r) => [...r.map((x) => ({ ...x, on: false })), { q, fix, raw: pts.current, color: COLORS[r.length % COLORS.length], on: true }]);
        setPhase("done");
      }
    }, 33);
    return () => clearInterval(iv);
  }, [phase, q]);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const isTouch = e.pointerType === "touch";
    if (isTouch !== touch) setTouch(isTouch);
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    // Палец закрывает то, что под ним: пятно чуть выше точки касания.
    const y = Math.min(1, Math.max(0, (e.clientY - r.top - (isTouch ? 56 : 0)) / r.height));
    last.current = { x, y, t: 0 };
    setSpot(x, y);
  };

  const start = () => {
    pts.current = [];
    t0.current = performance.now();
    setLeft(SECONDS);
    setPhase("look");
    setSpot(last.current.x, last.current.y);
  };

  const visible = runs.filter((r) => r.on);

  return (
    <div>
      <div className="nc-x-stat" style={{ marginBottom: "0.5rem" }}>{t.pick}</div>
      <div className="nc-x-seg" role="radiogroup" aria-label={t.pick} style={{ marginBottom: "0.8rem" }}>
        {t.questions.map((s, i) => (
          <button key={i} type="button" role="radio" className="nc-x-btn" aria-checked={q === i} aria-pressed={q === i} disabled={phase === "look"} onClick={() => setQ(i)} title={s}>
            {i + 1}
          </button>
        ))}
      </div>
      <div className="nc-x-title" style={{ fontSize: "1.15rem", marginBottom: "0.8rem" }}>{t.questions[q]}</div>

      <div
        ref={area}
        className={`nc-yarbus nc-yarbus--${phase}`}
        style={{ aspectRatio: `${AR}`, touchAction: phase === "look" ? "none" : "auto" }}
        onPointerMove={move}
        onPointerDown={move}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SRC} alt="" className="nc-yarbus-blur" draggable={false} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SRC} alt="" className="nc-yarbus-sharp" draggable={false} />
        {phase !== "look" && visible.length > 0 && (
          <svg viewBox={`0 0 ${1000 * AR} 1000`} preserveAspectRatio="none" className="nc-yarbus-paths" aria-hidden>
            {visible.map((r, k) => (
              <g key={k} style={{ color: r.color }}>
                <polyline points={r.fix.map((f) => `${f.x * 1000 * AR},${f.y * 1000}`).join(" ")} fill="none" stroke="currentColor" strokeWidth={2.5} strokeOpacity={0.85} vectorEffect="non-scaling-stroke" />
                {r.fix.map((f, i) => (
                  <circle key={i} cx={f.x * 1000 * AR} cy={f.y * 1000} r={6 + Math.sqrt(f.d) * 0.9} fill="currentColor" fillOpacity={0.28} stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
                ))}
              </g>
            ))}
          </svg>
        )}
        {phase === "idle" && <div className="nc-yarbus-note">{t.idle}</div>}
        {phase === "look" && (
          <div className="nc-yarbus-timer">
            <span style={{ width: `${(left / SECONDS) * 100}%` }} />
            <em>{touch ? t.touch : t.left(left)}</em>
          </div>
        )}
      </div>

      <div className="nc-x-bar">
        <button type="button" className="nc-x-btn nc-x-btn--primary" onClick={start} disabled={phase === "look"}>
          <Play /> {t.start}
        </button>
        {phase === "done" && (
          <button type="button" className="nc-x-btn" onClick={() => setQ((x) => (x + 1) % t.questions.length)}>
            {t.again} →
          </button>
        )}
        <span className="nc-x-spacer" />
        {runs.length > 0 && phase !== "look" && (
          <button type="button" className="nc-x-btn" onClick={() => { setRuns([]); setPhase("idle"); }}>
            <Reset /> {t.clear}
          </button>
        )}
      </div>

      {runs.length > 0 && phase !== "look" && (
        <div style={{ marginTop: "0.8rem" }}>
          <div className="nc-x-stat" style={{ marginBottom: "0.4rem" }}>{t.yours}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {runs.map((r, i) => (
              <button
                key={i}
                type="button"
                className="nc-x-btn"
                aria-pressed={r.on}
                onClick={() => setRuns((rs) => rs.map((x, k) => (k === i ? { ...x, on: !x.on } : x)))}
                style={r.on ? { background: "transparent", color: "var(--r-fg)", borderColor: r.color } : undefined}
              >
                <i style={{ width: 10, height: 10, borderRadius: "50%", background: r.on ? r.color : "transparent", border: `1.5px solid ${r.color}` }} />
                {r.q + 1}. {t.questions[r.q]}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="nc-x-hint">{t.hint}</div>
    </div>
  );
}
