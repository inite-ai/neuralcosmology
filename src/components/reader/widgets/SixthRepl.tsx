"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, StepIcon, type Dict, type WidgetProps } from "./kit";

// Карманный Sixth: стековая часть (prelude, память, if/else/then, определения слов)
// и слова подложки из LANGUAGE.md — MARK, EDGE+, EDGE-, EDGE?, NSET, NGET, NODES,
// EDGES, OUT, IN, RESET, bi-edge. Узлы нумеруются с единицы, как в Racket-реализации.
// Программы лестницы — из examples/ репозитория neuralcosmology/sixth.

type V = number | string;
type Node = { w: string } | { if: Node[]; else: Node[] };
type Graph = { next: number; nodes: Map<number, number>; edges: Set<string> };

class Halt extends Error {}

function tokenize(src: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === "\\" && (i + 1 >= src.length || /\s/.test(src[i + 1]))) { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (c === "(" && (i + 1 >= src.length || /\s/.test(src[i + 1]))) { while (i < src.length && src[i] !== ")") i++; i++; continue; }
    if (c === '"') {
      const j = src.indexOf('"', i + 1);
      if (j < 0) throw new Error("unterminated string");
      out.push(src.slice(i, j + 1));
      i = j + 1;
      continue;
    }
    let j = i;
    while (j < src.length && !/\s/.test(src[j])) j++;
    out.push(src.slice(i, j));
    i = j;
  }
  return out;
}

function parse(toks: string[], i: number, ends: string[]): [Node[], number, string] {
  const out: Node[] = [];
  while (i < toks.length) {
    const t = toks[i];
    if (ends.includes(t)) return [out, i, t];
    if (t === "if") {
      const [a, j, end] = parse(toks, i + 1, ["else", "then"]);
      let b: Node[] = [];
      let k = j;
      if (end === "else") [b, k] = parse(toks, j + 1, ["then"]);
      out.push({ if: a, else: b });
      i = k + 1;
      continue;
    }
    out.push({ w: t });
    i++;
  }
  return [out, i, ""];
}

type Run = { stack: V[]; mem: Map<string, V>; g: Graph; out: string; pass: number; fail: string[]; words: Map<string, Node[]> };

function* exec(code: Node[], r: Run, depth = 0): Generator<void> {
  if (depth > 400) throw new Error("recursion too deep");
  const pop = (): V => {
    if (!r.stack.length) throw new Error("stack underflow");
    return r.stack.pop()!;
  };
  const num = () => {
    const v = pop();
    if (typeof v !== "number") throw new Error(`number expected, got ${JSON.stringify(v)}`);
    return v;
  };
  const push = (...v: V[]) => r.stack.push(...v);
  const node = (n: number) => {
    if (!r.g.nodes.has(n)) throw new Error(`no node ${n}`);
    return n;
  };
  for (const n of code) {
    if ("if" in n) {
      yield* exec(num() !== 0 ? n.if : n.else, r, depth + 1);
      continue;
    }
    const w = n.w;
    if (/^-?\d+$/.test(w)) { push(Number(w)); continue; }
    if (w.startsWith('"')) { push(w.slice(1, -1)); continue; }
    const user = r.words.get(w);
    if (user) { yield* exec(user, r, depth + 1); continue; }
    switch (w) {
      case "dup": { const a = pop(); push(a, a); break; }
      case "drop": pop(); break;
      case "swap": { const b = pop(), a = pop(); push(b, a); break; }
      case "over": { const b = pop(), a = pop(); push(a, b, a); break; }
      case "nip": { const b = pop(); pop(); push(b); break; }
      case "tuck": { const b = pop(), a = pop(); push(b, a, b); break; }
      case "rot": { const c = pop(), b = pop(), a = pop(); push(b, c, a); break; }
      case "-rot": { const c = pop(), b = pop(), a = pop(); push(c, a, b); break; }
      case "2dup": { const b = pop(), a = pop(); push(a, b, a, b); break; }
      case "2drop": pop(); pop(); break;
      case "+": { const b = num(), a = num(); push(a + b); break; }
      case "-": { const b = num(), a = num(); push(a - b); break; }
      case "*": { const b = num(), a = num(); push(a * b); break; }
      case "/": { const b = num(), a = num(); if (!b) throw new Error("division by zero"); push(Math.trunc(a / b)); break; }
      case "mod": { const b = num(), a = num(); push(a % b); break; }
      case "1+": push(num() + 1); break;
      case "1-": push(num() - 1); break;
      case "<": { const b = num(), a = num(); push(a < b ? 1 : 0); break; }
      case ">": { const b = num(), a = num(); push(a > b ? 1 : 0); break; }
      case "<=": { const b = num(), a = num(); push(a <= b ? 1 : 0); break; }
      case ">=": { const b = num(), a = num(); push(a >= b ? 1 : 0); break; }
      case "=": { const b = pop(), a = pop(); push(a === b ? 1 : 0); break; }
      case "<>": { const b = pop(), a = pop(); push(a !== b ? 1 : 0); break; }
      case "not": push(num() === 0 ? 1 : 0); break;
      case "store": { const k = pop(), v = pop(); r.mem.set(String(k), v); break; }
      case "load": { const k = String(pop()); if (!r.mem.has(k)) throw new Error(`nothing stored under "${k}"`); push(r.mem.get(k)!); break; }
      case ".": r.out += `${pop()} `; break;
      case "cr": r.out += "\n"; break;
      case "emit": r.out += String.fromCharCode(num()); break;
      case "MARK": { const id = ++r.g.next; r.g.nodes.set(id, 0); push(id); yield; break; }
      case "EDGE+": { const b = node(num()), a = node(num()); r.g.edges.add(`${a}>${b}`); yield; break; }
      case "EDGE-": { const b = node(num()), a = node(num()); r.g.edges.delete(`${a}>${b}`); yield; break; }
      case "bi-edge": { const b = node(num()), a = node(num()); r.g.edges.add(`${a}>${b}`); r.g.edges.add(`${b}>${a}`); yield; break; }
      case "EDGE?": { const b = num(), a = num(); push(r.g.edges.has(`${a}>${b}`) ? 1 : 0); break; }
      case "NSET": { const v = num(), a = node(num()); r.g.nodes.set(a, v); yield; break; }
      case "NGET": push(r.g.nodes.get(node(num())) ?? 0); break;
      case "NODES": push(r.g.nodes.size); break;
      case "EDGES": push(r.g.edges.size); break;
      case "OUT": { const a = num(); let c = 0; for (const e of r.g.edges) if (e.startsWith(`${a}>`)) c++; push(c); break; }
      case "IN": { const a = num(); let c = 0; for (const e of r.g.edges) if (e.endsWith(`>${a}`)) c++; push(c); break; }
      case "RESET": r.g = { next: 0, nodes: new Map(), edges: new Set() }; yield; break;
      case "assert-eq": { const b = pop(), a = pop(); if (a === b) r.pass++; else r.fail.push(`${a} ≠ ${b}`); break; }
      case "REPORT": break;
      default: throw new Error(`unknown word: ${w}`);
    }
  }
}

function compile(src: string): { main: Node[]; words: Map<string, Node[]> } {
  const toks = tokenize(src);
  const words = new Map<string, Node[]>();
  const rest: string[] = [];
  for (let i = 0; i < toks.length; i++) {
    if (toks[i] === "use") { i++; continue; }
    if (toks[i] === ":") {
      const name = toks[i + 1];
      const end = toks.indexOf(";", i + 2);
      if (!name || end < 0) throw new Error("definition without ;");
      words.set(name, []);
      words.set(name, parse(toks.slice(i + 2, end), 0, [])[0]);
      i = end;
      continue;
    }
    rest.push(toks[i]);
  }
  return { main: parse(rest, 0, [])[0], words };
}

const LADDER: { n: string; src: string }[] = [
  { n: "02", src: `\\ Rung 2 — the first distinction.\nuse prelude\nuse debug\n\nMARK "O" store\n\nNODES 1 assert-eq\nEDGES 0 assert-eq\n"O" load OUT 0 assert-eq\n"O" load IN  0 assert-eq\n` },
  { n: "04", src: `\\ Rung 4 — the first pointer: A → B.\nuse prelude\nuse debug\n\nMARK "A" store\nMARK "B" store\n"A" load "B" load EDGE+\n\nEDGES 1 assert-eq\n"A" load "B" load EDGE? 1 assert-eq\n"B" load "A" load EDGE? 0 assert-eq   \\ direction matters\n` },
  { n: "05", src: `\\ Rung 5 — the self-pointer.\nuse prelude\nuse debug\n\nMARK "O" store\n"O" load "O" load EDGE+\n\nNODES 1 assert-eq\nEDGES 1 assert-eq\n"O" load "O" load EDGE? 1 assert-eq\n` },
  { n: "07", src: `\\ Rung 7 — the observer: a self-loop plus state.\nuse prelude\nuse debug\n\nMARK "O" store\n"O" load "O" load EDGE+\n"O" load 5 NSET\n"O" load NGET 5 assert-eq\n` },
  { n: "09", src: `\\ Rung 9 — recognition: O sees X, X does not see O.\nuse prelude\nuse debug\n\nMARK "O" store\n"O" load "O" load EDGE+\n"O" load 1 NSET\nMARK "X" store\n"O" load "X" load EDGE+\n\n"O" load OUT 2 assert-eq\n"X" load "O" load EDGE? 0 assert-eq\n` },
  { n: "∞", src: `\\ A word of your own: a ring of distinctions.\nuse prelude\nuse debug\n\nMARK "first" store\n"first" load "prev" store\n\n: grow ( k -- )\n  dup 0 = if drop else\n    MARK dup "prev" load swap EDGE+ "prev" store\n    1 - grow\n  then ;\n\n7 grow\n"prev" load "first" load EDGE+   \\ close the ring\nNODES 8 assert-eq\nEDGES 8 assert-eq\n` },
];

const T: Dict<{ run: string; step: string; stack: string; checks: (p: number, f: number) => string; ladder: string; hint: string; empty: string }> = {
  ru: { run: "Выполнить", step: "По шагам", stack: "стек", checks: (p, f) => (f ? `проверок: ${p} ✓, ${f} ✗` : `проверок: ${p} ✓`), ladder: "Ступени лестницы", hint: "Код можно править. Слова подложки: MARK, EDGE+, EDGE-, EDGE?, NSET, NGET, NODES, EDGES, OUT, IN, RESET, bi-edge; стековые — dup, drop, swap, over, rot, + − * mod, = <, store/load, if/else/then и свои слова через : … ;", empty: "пусто: ничего ещё не отличено" },
  en: { run: "Run", step: "Step by step", stack: "stack", checks: (p, f) => (f ? `checks: ${p} ✓, ${f} ✗` : `checks: ${p} ✓`), ladder: "Rungs of the ladder", hint: "You can edit the code. Substrate words: MARK, EDGE+, EDGE-, EDGE?, NSET, NGET, NODES, EDGES, OUT, IN, RESET, bi-edge; stack words — dup, drop, swap, over, rot, + − * mod, = <, store/load, if/else/then, and your own words with : … ;", empty: "empty: nothing distinguished yet" },
  pt: { run: "Executar", step: "Passo a passo", stack: "pilha", checks: (p, f) => (f ? `verificações: ${p} ✓, ${f} ✗` : `verificações: ${p} ✓`), ladder: "Degraus da escada", hint: "Dá para editar o código. Palavras do substrato: MARK, EDGE+, EDGE-, EDGE?, NSET, NGET, NODES, EDGES, OUT, IN, RESET, bi-edge; de pilha — dup, drop, swap, over, rot, + − * mod, = <, store/load, if/else/then e palavras próprias com : … ;", empty: "vazio: nada distinguido ainda" },
  es: { run: "Ejecutar", step: "Paso a paso", stack: "pila", checks: (p, f) => (f ? `comprobaciones: ${p} ✓, ${f} ✗` : `comprobaciones: ${p} ✓`), ladder: "Peldaños de la escalera", hint: "El código se puede editar. Palabras del sustrato: MARK, EDGE+, EDGE-, EDGE?, NSET, NGET, NODES, EDGES, OUT, IN, RESET, bi-edge; de pila — dup, drop, swap, over, rot, + − * mod, = <, store/load, if/else/then y palabras propias con : … ;", empty: "vacío: nada distinguido todavía" },
};

type Snap = { g: Graph; names: Map<number, string> };

function layout(ids: number[], edges: [number, number][]): Map<number, { x: number; y: number }> {
  const P = new Map<number, { x: number; y: number }>();
  ids.forEach((id, i) => {
    const a = (i / Math.max(1, ids.length)) * Math.PI * 2 - Math.PI / 2;
    P.set(id, { x: Math.cos(a) * 0.6, y: Math.sin(a) * 0.6 });
  });
  if (ids.length === 1) P.set(ids[0], { x: 0, y: 0 });
  for (let it = 0; it < 200; it++) {
    const F = new Map(ids.map((id) => [id, { x: 0, y: 0 }]));
    for (const a of ids)
      for (const b of ids) {
        if (a >= b) continue;
        const pa = P.get(a)!, pb = P.get(b)!;
        const dx = pa.x - pb.x, dy = pa.y - pb.y, d2 = dx * dx + dy * dy + 0.01;
        const f = 0.02 / d2;
        F.get(a)!.x += dx * f; F.get(a)!.y += dy * f;
        F.get(b)!.x -= dx * f; F.get(b)!.y -= dy * f;
      }
    for (const [a, b] of edges) {
      if (a === b) continue;
      const pa = P.get(a)!, pb = P.get(b)!;
      const dx = pb.x - pa.x, dy = pb.y - pa.y, d = Math.hypot(dx, dy) || 1;
      const f = (d - 0.55) * 0.08;
      F.get(a)!.x += (dx / d) * f; F.get(a)!.y += (dy / d) * f;
      F.get(b)!.x -= (dx / d) * f; F.get(b)!.y -= (dy / d) * f;
    }
    for (const id of ids) {
      const p = P.get(id)!, f = F.get(id)!;
      p.x = Math.max(-1, Math.min(1, p.x + f.x - p.x * 0.01));
      p.y = Math.max(-1, Math.min(1, p.y + f.y - p.y * 0.01));
    }
  }
  return P;
}

function GraphView({ snap, empty }: { snap: Snap; empty: string }) {
  const ids = [...snap.g.nodes.keys()];
  const edges = [...snap.g.edges].map((e) => e.split(">").map(Number) as [number, number]);
  const P = useMemo(() => layout(ids, edges), [ids.join(","), edges.map((e) => e.join(">")).join(",")]); // eslint-disable-line react-hooks/exhaustive-deps
  const W = 600, H = 300, s = (p: { x: number; y: number }) => ({ x: W / 2 + p.x * (W / 2 - 50), y: H / 2 + p.y * (H / 2 - 40) });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", border: "0.5px solid var(--r-line)", background: "var(--r-bg)" }}>
      <defs>
        <marker id="nc-sx-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="var(--r-accent)" />
        </marker>
      </defs>
      {!ids.length && (
        <text x={W / 2} y={H / 2} textAnchor="middle" fill="var(--r-muted)" style={{ font: "12px var(--font-mono)" }}>{empty}</text>
      )}
      {edges.map(([a, b]) => {
        const A = s(P.get(a)!), B = s(P.get(b)!);
        if (a === b) return <path key={`${a}>${b}`} d={`M${A.x - 9} ${A.y - 17} C${A.x - 40} ${A.y - 72} ${A.x + 40} ${A.y - 72} ${A.x + 9} ${A.y - 17}`} fill="none" stroke="var(--r-accent)" strokeWidth={1.6} markerEnd="url(#nc-sx-arrow)" />;
        const back = snap.g.edges.has(`${b}>${a}`);
        const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
        const off = back ? 5 : 0;
        return (
          <line key={`${a}>${b}`} x1={A.x + ux * 21 - uy * off} y1={A.y + uy * 17 + ux * off} x2={B.x - ux * 22 - uy * off} y2={B.y - uy * 18 + ux * off} stroke="var(--r-accent)" strokeWidth={1.6} markerEnd="url(#nc-sx-arrow)" />
        );
      })}
      {ids.map((id) => {
        const p = s(P.get(id)!);
        const v = snap.g.nodes.get(id) ?? 0;
        return (
          <g key={id} className="nc-sx-node">
            <circle cx={p.x} cy={p.y} r={19} fill="var(--r-panel)" stroke="var(--r-fg)" strokeWidth={1.2} />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fill="var(--r-fg)" style={{ font: "13px var(--font-mono)" }}>{snap.names.get(id) ?? id}</text>
            {v !== 0 && (
              <g>
                <rect x={p.x + 13} y={p.y + 10} width={String(v).length * 7 + 8} height={14} rx={2} fill="var(--r-accent)" />
                <text x={p.x + 17} y={p.y + 20.5} fill="var(--r-bg)" style={{ font: "10px var(--font-mono)" }}>{v}</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const fresh = (): Run => ({ stack: [], mem: new Map(), g: { next: 0, nodes: new Map(), edges: new Set() }, out: "", pass: 0, fail: [], words: new Map() });
const snapOf = (r: Run): Snap => {
  const names = new Map<number, string>();
  for (const [k, v] of r.mem) if (typeof v === "number" && r.g.nodes.has(v) && !names.has(v)) names.set(v, k);
  return { g: { next: r.g.next, nodes: new Map(r.g.nodes), edges: new Set(r.g.edges) }, names };
};

export default function SixthRepl({ lang }: WidgetProps) {
  const t = T[lang];
  const [src, setSrc] = useState(LADDER[2].src);
  const [snap, setSnap] = useState<Snap>({ g: fresh().g, names: new Map() });
  const [res, setRes] = useState<{ out: string; stack: V[]; pass: number; fail: string[]; err?: string } | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  const run = (code: string, animate: boolean) => {
    stop();
    const r = fresh();
    let it: Generator<void>;
    try {
      const c = compile(code);
      r.words = c.words;
      it = exec(c.main, r);
    } catch (e) {
      setRes({ out: "", stack: [], pass: 0, fail: [], err: (e as Error).message });
      return;
    }
    const finish = (err?: string) => {
      setSnap(snapOf(r));
      setRes({ out: r.out, stack: [...r.stack], pass: r.pass, fail: r.fail, err });
    };
    let steps = 0;
    const advance = (): boolean => {
      try {
        const n = it.next();
        if (++steps > 200000) throw new Halt("step limit");
        if (n.done) { finish(); return false; }
        return true;
      } catch (e) {
        finish((e as Error).message);
        return false;
      }
    };
    if (!animate) {
      while (advance());
      return;
    }
    setSnap(snapOf(r));
    setRes(null);
    timer.current = setInterval(() => {
      if (!advance()) return stop();
      setSnap(snapOf(r));
    }, 380);
  };

  useEffect(() => {
    run(src, false);
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="nc-x-stat" style={{ marginBottom: "0.5rem" }}>{t.ladder}</div>
      <div className="nc-x-seg" role="group" style={{ marginBottom: "0.7rem" }}>
        {LADDER.map((l) => (
          <button key={l.n} type="button" className="nc-x-btn" aria-pressed={src === l.src} onClick={() => { setSrc(l.src); run(l.src, true); }}>{l.n}</button>
        ))}
      </div>
      <div className="nc-sx">
        <textarea value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} aria-label="Sixth" rows={Math.min(18, src.split("\n").length + 1)} />
        <GraphView snap={snap} empty={t.empty} />
      </div>
      <div className="nc-x-bar">
        <button type="button" className="nc-x-btn nc-x-btn--primary" onClick={() => run(src, false)}><Play /> {t.run}</button>
        <button type="button" className="nc-x-btn" onClick={() => run(src, true)}><StepIcon /> {t.step}</button>
        <span className="nc-x-spacer" />
        {res && (
          <span className="nc-x-stat">
            NODES <b>{snap.g.nodes.size}</b> · EDGES <b>{snap.g.edges.size}</b> · <b style={{ color: res.fail.length || res.err ? "#d2663a" : undefined }}>{t.checks(res.pass, res.fail.length)}</b>
          </span>
        )}
      </div>
      {res && (res.err || res.out.trim() || res.stack.length > 0 || res.fail.length > 0) && (
        <pre className="nc-sx-out">
          {res.out.trim() && `${res.out.trim()}\n`}
          {res.stack.length > 0 && `${t.stack}: ${res.stack.map((v) => (typeof v === "string" ? `"${v}"` : v)).join(" ")}\n`}
          {res.fail.map((f) => `✗ ${f}\n`)}
          {res.err && `! ${res.err}`}
        </pre>
      )}
      <div className="nc-x-hint">{t.hint}</div>
    </div>
  );
}
