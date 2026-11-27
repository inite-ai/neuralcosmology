"use client";

import { useEffect, useRef, useState } from "react";
import { aha, prefersReducedMotion, Reset, type Dict, type WidgetProps } from "./kit";

// Семантическое насыщение: читатель тридцать раз повторяет слово и нажимает на него,
// буквы понемногу расползаются и раскалываются. В конце — вопрос без правильного ответа.

const TIMES = 30;

const T: Dict<{
  word: string; hint: string; press: (w: string) => string; own: string; take: string; ask: (w: string) => string; answers: [string, string, string];
  after: [string, string, string]; wait: string; again: string;
}> = {
  ru: {
    word: "ложка", hint: "Произносите слово вслух или шёпотом и каждый раз нажимайте на него.", press: (w) => `Повторить: ${w}`,
    own: "Своё слово", take: "Взять", ask: (w) => `Тридцать раз. Осталось ли «${w}» словом?`, answers: ["Да, слово", "Остались звуки", "То так, то этак"],
    after: ["Значение у вас устояло.", "Вы слышали звуки без значения. Это и есть семантическое насыщение.", "Значение мерцает: то есть, то пропадает."],
    wait: "Буквы снова на местах. Отведите взгляд, а потом прочтите слово ещё раз.", again: "Сначала",
  },
  en: {
    word: "spoon", hint: "Say the word aloud or in a whisper, and press it each time.", press: (w) => `Repeat: ${w}`,
    own: "Your own word", take: "Use it", ask: (w) => `Thirty times. Is “${w}” still a word?`, answers: ["Yes, a word", "Only sounds", "It comes and goes"],
    after: ["For you the meaning held.", "You heard sounds without a meaning. That is semantic satiation.", "The meaning flickers on and off."],
    wait: "The letters are back in place. Look away, then read the word again.", again: "Start over",
  },
  pt: {
    word: "colher", hint: "Diga a palavra em voz alta ou sussurrando e toque nela a cada vez.", press: (w) => `Repetir: ${w}`,
    own: "Outra palavra", take: "Usar", ask: (w) => `Trinta vezes. “${w}” ainda é uma palavra?`, answers: ["Sim, é palavra", "Sobraram sons", "Vai e volta"],
    after: ["Para você o sentido resistiu.", "Você ouviu sons sem sentido. Isso é a saciação semântica.", "O sentido pisca: aparece e some."],
    wait: "As letras voltaram ao lugar. Desvie os olhos e depois leia a palavra de novo.", again: "Recomeçar",
  },
  es: {
    word: "cuchara", hint: "Di la palabra en voz alta o en un susurro y púlsala cada vez.", press: (w) => `Repetir: ${w}`,
    own: "Otra palabra", take: "Usar", ask: (w) => `Treinta veces. ¿«${w}» sigue siendo una palabra?`, answers: ["Sí, una palabra", "Quedaron sonidos", "Va y viene"],
    after: ["Para ti el sentido resistió.", "Oíste sonidos sin sentido. Eso es la saciedad semántica.", "El sentido parpadea: aparece y se va."],
    wait: "Las letras han vuelto a su sitio. Aparta la vista y luego lee la palabra otra vez.", again: "Empezar de nuevo",
  },
};

// Устойчивая «случайность» буквы: от повтора к повтору она уходит в одну сторону.
const rnd = (i: number, k: number) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
};

function Letter({ ch, i, p, still }: { ch: string; i: number; p: number; still: boolean }) {
  const drift = Math.pow(p, 1.6);
  const crack = Math.max(0, (p - 0.4) / 0.6);
  const ease = still ? undefined : "transform 0.25s ease-out, opacity 0.25s ease-out";
  const half = (top: boolean) => {
    const k = top ? 10 : 20;
    const y = (top ? -1 : 1) * 0.3 * crack + rnd(i, k) * 0.12 * crack;
    return (
      <span
        style={{
          position: top ? "relative" : "absolute", left: 0, top: 0, display: "inline-block",
          clipPath: top ? "inset(-20% -20% 49.5% -20%)" : "inset(49.5% -20% -20% -20%)",
          transform: `translate(${rnd(i, k + 1) * 0.3 * crack}em, ${y}em) rotate(${rnd(i, k + 2) * 40 * crack}deg)`,
          transition: ease,
        }}
      >
        {ch}
      </span>
    );
  };
  return (
    <span
      style={{
        position: "relative", display: "inline-block", whiteSpace: "pre",
        transform: `translate(${rnd(i, 1) * 0.35 * drift}em, ${rnd(i, 2) * 0.7 * drift}em) rotate(${rnd(i, 3) * 65 * drift}deg)`,
        opacity: 1 - 0.25 * drift, transition: ease,
      }}
    >
      {half(true)}
      {half(false)}
    </span>
  );
}

export default function Satiation({ lang }: WidgetProps) {
  const t = T[lang];
  const box = useRef<HTMLDivElement>(null);
  const ask = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLButtonElement>(null);
  const sent = useRef(false);
  const [word, setWord] = useState(t.word);
  const [draft, setDraft] = useState("");
  const [n, setN] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [still] = useState(prefersReducedMotion);
  const done = n >= TIMES;
  const letters = Array.from(word);
  const p = answer === null ? n / TIMES : 0;

  // Кнопка-слово кончилась: фокус уходит на вопрос, чтобы с клавиатуры не потеряться.
  useEffect(() => {
    if (done && answer === null) ask.current?.focus({ preventScroll: true });
  }, [done, answer]);

  const restart = (w: string) => {
    setWord(w);
    setN(0);
    setAnswer(null);
    stage.current?.focus({ preventScroll: true });
  };
  const choose = (i: number) => {
    setAnswer(i);
    if (!sent.current) {
      sent.current = true;
      aha(box.current);
    }
    ask.current?.focus({ preventScroll: true });
  };

  return (
    <div ref={box}>
      <button
        ref={stage}
        type="button"
        aria-label={t.press(word)}
        aria-disabled={done}
        onClick={() => !done && setN((x) => x + 1)}
        // Удержанная клавиша не считается за повторы.
        onKeyDown={(e) => e.repeat && e.preventDefault()}
        style={{
          containerType: "inline-size", display: "grid", placeItems: "center", width: "100%", height: "13rem", overflow: "hidden",
          border: "0.5px solid var(--r-line)", background: "var(--r-bg)", color: "var(--r-fg)", cursor: done ? "default" : "pointer",
          touchAction: "manipulation", userSelect: "none", WebkitUserSelect: "none",
        }}
      >
        <span aria-hidden style={{ fontFamily: "var(--font-display)", fontSize: `min(5rem, ${(115 / Math.max(4, letters.length)).toFixed(1)}cqw)`, lineHeight: 1.2, whiteSpace: "nowrap" }}>
          {letters.map((ch, i) => <Letter key={i} ch={ch} i={i} p={p} still={still} />)}
        </span>
      </button>
      <div aria-hidden style={{ height: 2, background: "var(--r-faint)" }}>
        <div style={{ height: 2, width: `${(n / TIMES) * 100}%`, background: "var(--r-accent)" }} />
      </div>

      {!done && (
        <>
          <div className="nc-x-bar">
            <span className="nc-x-hint" style={{ margin: 0, flex: "1 1 14rem" }}>{t.hint}</span>
            <span className="nc-x-stat"><b>{n}</b> / {TIMES}</span>
          </div>
          <form
            className="nc-x-bar"
            onSubmit={(e) => {
              e.preventDefault();
              const w = draft.trim();
              if (w) {
                restart(w);
                setDraft("");
              }
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={16}
              placeholder={t.own}
              aria-label={t.own}
              autoComplete="off"
              style={{ minHeight: "2.25rem", width: "11rem", padding: "0 0.7rem", border: "0.5px solid var(--r-line)", borderRadius: 2, background: "var(--r-bg)", color: "var(--r-fg)", fontSize: "1rem" }}
            />
            <button type="submit" className="nc-x-btn" disabled={!draft.trim()}>{t.take}</button>
          </form>
        </>
      )}

      <div ref={ask} tabIndex={-1} aria-live="polite" style={{ outline: "none" }}>
        {done && answer === null && (
          <div style={{ marginTop: "1rem" }}>
            <div className="nc-x-title" style={{ fontSize: "1.15rem", overflowWrap: "anywhere" }}>{t.ask(word)}</div>
            <div className="nc-x-bar">
              {t.answers.map((a, i) => (
                <button key={a} type="button" className="nc-x-btn" onClick={() => choose(i)}>{a}</button>
              ))}
            </div>
          </div>
        )}
        {answer !== null && (
          <div className="nc-x-hint" style={{ marginTop: "1rem" }}>{t.after[answer]} {t.wait}</div>
        )}
      </div>
      {answer !== null && (
        <div className="nc-x-bar">
          <button type="button" className="nc-x-btn" onClick={() => restart(word)}><Reset /> {t.again}</button>
        </div>
      )}
    </div>
  );
}
