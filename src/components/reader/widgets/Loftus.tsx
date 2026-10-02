"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Reset, type Dict, type WidgetProps } from "./kit";

// Лофтус и Палмер (1974), опыт 1 и 2. Читатель смотрит схематичную аварию, отвечает
// на вопрос со случайным глаголом, потом — про битое стекло (его в ролике нет).
// Средние оценки из статьи (mph → км/ч): smashed 40,5; collided 39,3; bumped 38,1;
// hit 34,0; contacted 31,8. Стекло «видели»: smashed 32 %, hit 14 %, контроль 12 %.

const MEANS = [40.5, 39.3, 38.1, 34.0, 31.8];
const VERB_EN = ["smashed", "collided", "bumped", "hit", "contacted"];

const T: Dict<{
  q: string[]; verbs: string[]; kmh: string; answer: string; glassQ: string; yes: string; no: string; replay: string; again: string;
  your: string; study: string; glass: (you: string) => string; watch: string; unit: string; note: string;
}> = {
  ru: {
    q: ["С какой скоростью ехали машины, когда разбились друг о друга?", "С какой скоростью ехали машины, когда столкнулись?", "С какой скоростью ехали машины, когда стукнулись друг о друга?", "С какой скоростью ехали машины, когда ударились друг о друга?", "С какой скоростью ехали машины, когда соприкоснулись?"],
    verbs: ["разбились", "столкнулись", "стукнулись", "ударились", "соприкоснулись"],
    kmh: "км/ч", answer: "Ответить", glassQ: "Было ли на месте аварии битое стекло?", yes: "Было", no: "Не было", replay: "Ещё раз", again: "Попробовать с другим словом",
    your: "ваш ответ", study: "Средние оценки в опыте 1974 года, по глаголу в вопросе", unit: "км/ч",
    glass: (you) => `Битого стекла в ролике не было. Вы ответили: «${you}». У Лофтус через неделю «было» отвечали 32 % тех, кого спрашивали со словом smashed («разбились»), 14 % — со словом hit («ударились») и 12 % тех, кого о скорости не спрашивали вовсе.`,
    watch: "Посмотрите на аварию", note: "Ваш глагол выпал случайно. Остальным читателям достаются другие.",
  },
  en: {
    q: ["About how fast were the cars going when they smashed into each other?", "About how fast were the cars going when they collided with each other?", "About how fast were the cars going when they bumped into each other?", "About how fast were the cars going when they hit each other?", "About how fast were the cars going when they contacted each other?"],
    verbs: VERB_EN, kmh: "km/h", answer: "Answer", glassQ: "Was there any broken glass at the scene?", yes: "Yes", no: "No", replay: "Replay", again: "Try another word",
    your: "your answer", study: "Mean estimates in the 1974 experiment, by the verb in the question", unit: "km/h",
    glass: (you) => `There was no broken glass in the clip. You answered “${you}”. In Loftus’s study a week later, 32% of those asked with “smashed” said yes, 14% of those asked with “hit”, and 12% of those never asked about speed.`,
    watch: "Watch the accident", note: "Your verb was drawn at random. Other readers get other ones.",
  },
  pt: {
    q: ["A que velocidade iam os carros quando se espatifaram um no outro?", "A que velocidade iam os carros quando colidiram?", "A que velocidade iam os carros quando se esbarraram?", "A que velocidade iam os carros quando bateram um no outro?", "A que velocidade iam os carros quando se tocaram?"],
    verbs: ["se espatifaram", "colidiram", "se esbarraram", "bateram", "se tocaram"],
    kmh: "km/h", answer: "Responder", glassQ: "Havia vidro quebrado no local do acidente?", yes: "Havia", no: "Não havia", replay: "Ver de novo", again: "Tentar com outra palavra",
    your: "sua resposta", study: "Estimativas médias no experimento de 1974, pelo verbo da pergunta", unit: "km/h",
    glass: (you) => `Não havia vidro quebrado no vídeo. Você respondeu “${you}”. No estudo de Loftus, uma semana depois, disseram “sim” 32% dos que ouviram “smashed” (se espatifaram), 14% dos que ouviram “hit” (bateram) e 12% dos que não foram perguntados sobre a velocidade.`,
    watch: "Veja o acidente", note: "Seu verbo foi sorteado. Outros leitores recebem outros.",
  },
  es: {
    q: ["¿A qué velocidad iban los coches cuando se estrellaron entre sí?", "¿A qué velocidad iban los coches cuando chocaron?", "¿A qué velocidad iban los coches cuando se toparon?", "¿A qué velocidad iban los coches cuando se golpearon?", "¿A qué velocidad iban los coches cuando se tocaron?"],
    verbs: ["se estrellaron", "chocaron", "se toparon", "se golpearon", "se tocaron"],
    kmh: "km/h", answer: "Responder", glassQ: "¿Había vidrios rotos en el lugar del accidente?", yes: "Había", no: "No había", replay: "Ver otra vez", again: "Probar con otra palabra",
    your: "su respuesta", study: "Estimaciones medias en el experimento de 1974, según el verbo de la pregunta", unit: "km/h",
    glass: (you) => `En el vídeo no había vidrios rotos. Usted respondió «${you}». En el estudio de Loftus, una semana después, dijeron «sí» el 32 % de quienes oyeron «smashed» (se estrellaron), el 14 % de quienes oyeron «hit» (se golpearon) y el 12 % de quienes no fueron preguntados por la velocidad.`,
    watch: "Mire el accidente", note: "Su verbo salió al azar. A otros lectores les tocan otros.",
  },
};

function Crash({ play }: { play: number }) {
  // Перекрёсток сверху: машина слева, машина снизу, лёгкий удар, остановка.
  const [k, setK] = useState(1);
  const raf = useRef(0);
  useEffect(() => {
    const t0 = performance.now();
    const tick = (t: number) => {
      const v = Math.min(1, (t - t0) / 2600);
      setK(v);
      if (v < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [play]);
  const hit = 0.62;
  const a = Math.min(k, hit) / hit;
  const after = Math.max(0, k - hit) / (1 - hit);
  const ease = (x: number) => 1 - (1 - x) ** 3;
  const ax = -40 + 250 * a + 22 * ease(after), ay = 104 + 6 * ease(after), ar = 14 * ease(after);
  const bx = 262 + 8 * ease(after), by = 260 - 140 * a - 10 * ease(after), br = -90 + 20 * ease(after);
  const car = (x: number, y: number, r: number, fill: string) => (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x={-26} y={-12} width={52} height={24} rx={5} fill={fill} />
      <rect x={4} y={-9} width={12} height={18} rx={2} fill="var(--r-bg)" opacity={0.75} />
      <rect x={-18} y={-9} width={10} height={18} rx={2} fill="var(--r-bg)" opacity={0.5} />
    </g>
  );
  return (
    <svg viewBox="0 0 520 240" style={{ display: "block", width: "100%", border: "0.5px solid var(--r-line)", background: "var(--r-bg)" }} aria-hidden>
      <rect x={0} y={80} width={520} height={56} fill="var(--r-faint)" />
      <rect x={232} y={0} width={56} height={240} fill="var(--r-faint)" />
      <line x1={0} y1={108} x2={520} y2={108} stroke="var(--r-line)" strokeDasharray="10 10" />
      <line x1={260} y1={0} x2={260} y2={240} stroke="var(--r-line)" strokeDasharray="10 10" />
      {car(ax, ay, ar, "var(--r-accent)")}
      {car(bx, by, br, "var(--r-fg)")}
    </svg>
  );
}

export default function Loftus({ lang }: WidgetProps) {
  const t = T[lang];
  const [verb, setVerb] = useState(() => Math.floor(Math.random() * 5));
  const [phase, setPhase] = useState<"ask" | "glass" | "done">("ask");
  const [speed, setSpeed] = useState(50);
  const [glass, setGlass] = useState<string>("");
  const [play, setPlay] = useState(0);
  const max = 90;

  return (
    <div>
      <div className="nc-x-stat" style={{ marginBottom: "0.5rem" }}>{t.watch}</div>
      <Crash play={play} />
      <div className="nc-x-bar">
        <button type="button" className="nc-x-btn" onClick={() => setPlay((p) => p + 1)}><Play /> {t.replay}</button>
      </div>

      {phase === "ask" && (
        <div style={{ marginTop: "1rem" }}>
          <div className="nc-x-title" style={{ fontSize: "1.15rem" }}>{t.q[verb]}</div>
          <div className="nc-x-bar" style={{ marginTop: "0.8rem" }}>
            <input type="range" min={10} max={130} step={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: "min(22rem, 100%)" }} aria-label={t.q[verb]} />
            <span className="nc-x-num" style={{ fontSize: "1.4rem" }}>{speed} <span className="nc-x-stat">{t.kmh}</span></span>
            <button type="button" className="nc-x-btn nc-x-btn--primary" onClick={() => setPhase("glass")}>{t.answer}</button>
          </div>
        </div>
      )}

      {phase === "glass" && (
        <div style={{ marginTop: "1rem" }}>
          <div className="nc-x-title" style={{ fontSize: "1.15rem" }}>{t.glassQ}</div>
          <div className="nc-x-bar">
            {[t.yes, t.no].map((a) => (
              <button key={a} type="button" className="nc-x-btn" onClick={() => { setGlass(a); setPhase("done"); }}>{a}</button>
            ))}
          </div>
        </div>
      )}

      {phase === "done" && (
        <div style={{ marginTop: "1rem" }}>
          <div className="nc-x-stat" style={{ marginBottom: "0.6rem" }}>{t.study}</div>
          <div style={{ display: "grid", gap: 6 }}>
            {MEANS.map((m, i) => {
              const kmh = m * 1.609;
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(6.5rem, 9rem) 1fr", alignItems: "center", gap: 10 }}>
                  <span className="nc-x-stat" style={{ color: i === verb ? "var(--r-fg)" : undefined }}>
                    {t.verbs[i]}{lang !== "en" && <> · <i>{VERB_EN[i]}</i></>}
                  </span>
                  <span style={{ position: "relative", height: 18 }}>
                    <span style={{ position: "absolute", left: 0, top: 3, height: 12, width: `${(kmh / max) * 100}%`, background: i === verb ? "var(--r-accent)" : "var(--r-line)" }} />
                    <span className="nc-x-stat" style={{ position: "absolute", left: `calc(${(kmh / max) * 100}% + 6px)`, top: 0 }}>{kmh.toLocaleString(lang, { maximumFractionDigits: 0 })}</span>
                    {i === verb && (
                      <span title={t.your} style={{ position: "absolute", left: `${Math.min(100, (speed / max) * 100)}%`, top: -3, width: 2, height: 24, background: "var(--r-fg)" }} />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="nc-x-stat" style={{ marginTop: "0.5rem" }}>▏ {t.your}: <b>{speed} {t.unit}</b></div>
          <div className="nc-x-hint" style={{ marginTop: "0.9rem" }}>{t.glass(glass)}</div>
          <div className="nc-x-bar">
            <button
              type="button"
              className="nc-x-btn"
              onClick={() => {
                setVerb((v) => (v + 1 + Math.floor(Math.random() * 4)) % 5);
                setPhase("ask");
                setPlay((p) => p + 1);
              }}
            >
              <Reset /> {t.again}
            </button>
          </div>
        </div>
      )}
      {phase !== "done" && <div className="nc-x-hint">{t.note}</div>}
    </div>
  );
}
