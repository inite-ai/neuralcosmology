"use client";

import { useMemo, useState } from "react";
import type { Dict, WidgetProps } from "./kit";

// Индекс сборки слова (Кронин, Уокер): буквы даны даром, шаг — склеить два уже
// имеющихся куска; всё собранное остаётся в запасе. Индекс — минимальное число
// шагов. Ищется перебором с углублением (точно для коротких слов), при нехватке
// бюджета — верхняя оценка жадной сборкой слева направо.

const MAXLEN = 16;
type Step = [string, string, string];

function greedy(w: string): Step[] {
  const pool = new Set<string>();
  const steps: Step[] = [];
  let cur = w[0];
  let i = 1;
  while (i < w.length) {
    let piece = w[i];
    for (const p of pool) if (p.length > piece.length && w.startsWith(p, i)) piece = p;
    const next = cur + piece;
    steps.push([cur, piece, next]);
    pool.add(next);
    cur = next;
    i += piece.length;
  }
  return steps;
}

function exact(w: string, budget = 400000): { steps: Step[]; exact: boolean } {
  const g = greedy(w);
  if (w.length <= 1) return { steps: [], exact: true };
  // Ни один кусок длиннее буквы не повторяется — переиспользовать нечего, индекс = длина − 1.
  let repeats = false;
  for (let i = 0; i + 2 <= w.length && !repeats; i++) if (w.indexOf(w.slice(i, i + 2), i + 2) >= 0) repeats = true;
  if (!repeats) return { steps: g, exact: true };
  const subs = new Set<string>();
  for (let i = 0; i < w.length; i++) for (let j = i + 2; j <= w.length; j++) subs.add(w.slice(i, j));
  const letters = [...new Set(w)];
  let nodes = 0;
  let out: Step[] | null = null;
  const seen = new Set<string>();
  const dfs = (pool: string[], path: Step[], bound: number): boolean => {
    if (++nodes > budget) throw new Error("budget");
    if (pool.includes(w)) {
      out = path.slice();
      return true;
    }
    const longest = Math.max(1, ...pool.map((p) => p.length));
    if (path.length + Math.ceil(Math.log2(w.length / longest)) > bound) return false;
    const key = [...pool].sort().join("|") + "#" + path.length;
    if (seen.has(key)) return false;
    seen.add(key);
    const avail = [...letters, ...pool];
    const cands: Step[] = [];
    for (const a of avail)
      for (const b of avail) {
        const c = a + b;
        if (subs.has(c) && !pool.includes(c)) cands.push([a, b, c]);
      }
    cands.sort((x, y) => y[2].length - x[2].length);
    for (const s of cands) {
      path.push(s);
      if (dfs([...pool, s[2]], path, bound)) return true;
      path.pop();
    }
    return false;
  };
  try {
    for (let bound = Math.ceil(Math.log2(w.length)); bound < g.length; bound++) {
      seen.clear();
      if (dfs([], [], bound)) return { steps: out!, exact: true };
    }
    return { steps: g, exact: true };
  } catch {
    return { steps: g, exact: false };
  }
}

const T: Dict<{ word: string; index: string; len: string; presets: string[]; upper: string; hint: string; letters: string }> = {
  ru: { word: "Слово", index: "индекс сборки", len: "букв", presets: ["абракадабра", "аааааааааааааааа", "колокол", "щёголь", "тартарары"], upper: "не больше", letters: "Буквы даны даром", hint: "Длинная однообразная цепочка собирается в несколько приёмов, короткая пёстрая требует шага на каждую букву. Сравните «аааааааааааааааа» и «щёголь»." },
  en: { word: "Word", index: "assembly index", len: "letters", presets: ["abracadabra", "aaaaaaaaaaaaaaaa", "banana", "wizardly", "abcabcabcabc"], upper: "at most", letters: "Letters come free", hint: "A long monotonous chain assembles in a few moves; a short motley one needs a step per letter. Compare “aaaaaaaaaaaaaaaa” with “wizardly”." },
  pt: { word: "Palavra", index: "índice de montagem", len: "letras", presets: ["abracadabra", "aaaaaaaaaaaaaaaa", "banana", "pomba", "cocoricocoric"], upper: "no máximo", letters: "As letras vêm de graça", hint: "Uma cadeia longa e monótona se monta em poucos passos; uma curta e variada pede um passo por letra. Compare “aaaaaaaaaaaaaaaa” com “pomba”." },
  es: { word: "Palabra", index: "índice de ensamblaje", len: "letras", presets: ["abracadabra", "aaaaaaaaaaaaaaaa", "banana", "murciélago", "cucurrucucú"], upper: "como mucho", letters: "Las letras salen gratis", hint: "Una cadena larga y monótona se ensambla en pocos pasos; una corta y variada pide un paso por letra. Compare «aaaaaaaaaaaaaaaa» con «murciélago»." },
};

export default function Assembly({ lang }: WidgetProps) {
  const t = T[lang];
  const [word, setWord] = useState(t.presets[0]);
  const w = word.toLowerCase().replace(/\s+/g, "").slice(0, MAXLEN);
  const res = useMemo(() => exact(w), [w]);
  const n = res.steps.length;
  const built = new Set(res.steps.map((s) => s[2]));
  return (
    <div>
      <div className="nc-x-bar" style={{ marginTop: 0 }}>
        <label className="nc-x-stat" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {t.word}
          <input
            value={word}
            maxLength={MAXLEN}
            onChange={(e) => setWord(e.target.value)}
            style={{ width: "13rem", minHeight: "2.25rem", padding: "0 0.6rem", border: "0.5px solid var(--r-line)", borderRadius: 2, background: "var(--r-bg)", color: "var(--r-fg)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}
          />
        </label>
      </div>
      <div className="nc-x-bar">
        <span className="nc-x-seg" role="group">
          {t.presets.map((p) => (
            <button key={p} type="button" className="nc-x-btn" aria-pressed={w === p} onClick={() => setWord(p)}>{p.length > 10 ? `${p.slice(0, 8)}…` : p}</button>
          ))}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "1.4rem", margin: "1rem 0 0.8rem" }}>
        <div>
          <div className="nc-x-num" style={{ fontSize: "2.4rem" }}>{res.exact ? n : `≤ ${n}`}</div>
          <div className="nc-x-stat">{t.index}</div>
        </div>
        <div>
          <div className="nc-x-num" style={{ fontSize: "2.4rem", color: "var(--r-muted)" }}>{w.length}</div>
          <div className="nc-x-stat">{t.len}</div>
        </div>
      </div>
      <div className="nc-x-stat" style={{ marginBottom: "0.4rem" }}>{t.letters}: {[...new Set(w)].join(" ")}</div>
      <ol className="nc-asm">
        {res.steps.map(([a, b, c], i) => (
          <li key={i}>
            <span className="nc-x-stat">{String(i + 1).padStart(2, "0")}</span>
            <code className={built.has(a) ? "re" : undefined}>{a}</code>
            <span className="nc-x-stat">+</span>
            <code className={built.has(b) ? "re" : undefined}>{b}</code>
            <span className="nc-x-stat">→</span>
            <code className="new">{c}</code>
          </li>
        ))}
      </ol>
      <div className="nc-x-hint">{t.hint}</div>
    </div>
  );
}
