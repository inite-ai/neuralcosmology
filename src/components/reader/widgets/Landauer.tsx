"use client";

import { useRef, useState } from "react";
import { Reset, sci, type Dict, type WidgetProps } from "./kit";

// Принцип Ландауэра на регистре из 32 бит: стирание (сброс в ноль) отдаёт в среду
// не меньше kT ln 2 тепла на каждый бит, какое бы значение там ни лежало.

const KB = 1.380649e-23;
const LN2 = Math.LN2;
const EV = 1.602176634e-19;
const N = 32;

type Temp = { k: number; label: Dict<string> };
const TEMPS: Temp[] = [
  { k: 2.725, label: { ru: "2,7 K · космос", en: "2.7 K · deep space", pt: "2,7 K · espaço", es: "2,7 K · espacio" } },
  { k: 77, label: { ru: "77 K · жидкий азот", en: "77 K · liquid nitrogen", pt: "77 K · nitrogênio líquido", es: "77 K · nitrógeno líquido" } },
  { k: 300, label: { ru: "300 K · комната", en: "300 K · room", pt: "300 K · sala", es: "300 K · habitación" } },
  { k: 310, label: { ru: "310 K · тело", en: "310 K · body", pt: "310 K · corpo", es: "310 K · cuerpo" } },
];

const T: Dict<{
  register: string; erase: string; fill: string; temp: string; perBit: string; erased: string; heat: string; hint: string;
  photo: (j: string) => string; tea: (b: string) => string; brain: (b: string) => string; j: string; ev: string;
}> = {
  ru: {
    register: "Регистр из 32 бит: нажмите на ячейку, чтобы записать", erase: "Стереть всё", fill: "Записать случайное", temp: "Температура среды",
    perBit: "Цена одного стёртого бита", erased: "Стёрто бит", heat: "Отдано тепла", j: "Дж", ev: "эВ",
    hint: "Стирание не знает, что лежит в ячейке, и платит за каждую. Записать можно почти даром, стереть даром нельзя.",
    photo: (j) => `Удалить из телефона фотографию на 3 МБ — не меньше ${j} Дж.`,
    tea: (b) => `Чтобы нагреть стиранием чашку чая на один градус, пришлось бы стереть ${b} бит.`,
    brain: (b) => `Мозгу на его 20 Вт этот предел позволил бы стирать до ${b} бит в секунду.`,
  },
  en: {
    register: "A 32-bit register: tap a cell to write", erase: "Erase all", fill: "Write random", temp: "Temperature of the surroundings",
    perBit: "Cost of erasing one bit", erased: "Bits erased", heat: "Heat released", j: "J", ev: "eV",
    hint: "Erasure doesn’t know what a cell holds, so it pays for every one. Writing can be nearly free; erasing can’t.",
    photo: (j) => `Deleting a 3 MB photo from your phone costs at least ${j} J.`,
    tea: (b) => `To warm a cup of tea by one degree through erasure alone, you would have to erase ${b} bits.`,
    brain: (b) => `At its 20 W, a brain held only to this limit could erase up to ${b} bits per second.`,
  },
  pt: {
    register: "Um registro de 32 bits: toque numa célula para escrever", erase: "Apagar tudo", fill: "Escrever ao acaso", temp: "Temperatura do ambiente",
    perBit: "Custo de apagar um bit", erased: "Bits apagados", heat: "Calor liberado", j: "J", ev: "eV",
    hint: "O apagamento não sabe o que há na célula e paga por todas. Escrever pode sair quase de graça; apagar, não.",
    photo: (j) => `Apagar do celular uma foto de 3 MB custa no mínimo ${j} J.`,
    tea: (b) => `Para aquecer uma xícara de chá em um grau só apagando, seria preciso apagar ${b} bits.`,
    brain: (b) => `Com seus 20 W, um cérebro limitado só por esse piso poderia apagar até ${b} bits por segundo.`,
  },
  es: {
    register: "Un registro de 32 bits: toque una celda para escribir", erase: "Borrar todo", fill: "Escribir al azar", temp: "Temperatura del entorno",
    perBit: "Costo de borrar un bit", erased: "Bits borrados", heat: "Calor liberado", j: "J", ev: "eV",
    hint: "El borrado no sabe qué hay en la celda y paga por todas. Escribir puede salir casi gratis; borrar, no.",
    photo: (j) => `Borrar del teléfono una foto de 3 MB cuesta al menos ${j} J.`,
    tea: (b) => `Para calentar una taza de té un grado solo borrando, habría que borrar ${b} bits.`,
    brain: (b) => `Con sus 20 W, un cerebro limitado solo por este piso podría borrar hasta ${b} bits por segundo.`,
  },
};

const random = () => Array.from({ length: N }, () => (Math.random() < 0.5 ? 1 : 0));

export default function Landauer({ lang }: WidgetProps) {
  const t = T[lang];
  const [bits, setBits] = useState<number[]>(random);
  const [ti, setTi] = useState(2);
  const [erased, setErased] = useState(0);
  const [heat, setHeat] = useState(0);
  const [sparks, setSparks] = useState<{ id: number; i: number }[]>([]);
  const sid = useRef(0);
  const busy = useRef(false);

  const T0 = TEMPS[ti].k;
  const e = KB * T0 * LN2;

  const erase = () => {
    if (busy.current) return;
    busy.current = true;
    // Ячейки гаснут по очереди, каждая отдаёт искру тепла.
    for (let i = 0; i < N; i++) {
      setTimeout(() => {
        setBits((b) => b.map((v, k) => (k === i ? 0 : v)));
        setErased((n) => n + 1);
        setHeat((h) => h + e);
        const id = ++sid.current;
        setSparks((s) => [...s, { id, i }]);
        setTimeout(() => setSparks((s) => s.filter((x) => x.id !== id)), 900);
        if (i === N - 1) busy.current = false;
      }, i * 28);
    }
  };

  const fmt = (x: number) => sci(x, lang, 2);

  return (
    <div>
      <div className="nc-x-stat" style={{ marginBottom: "0.5rem" }}>{t.register}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(16, minmax(0, 1fr))", gap: 3, position: "relative" }}>
        {bits.map((b, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setBits((x) => x.map((v, k) => (k === i ? 1 - v : v)))}
            aria-label={`bit ${i + 1}: ${b}`}
            style={{
              position: "relative",
              aspectRatio: "1 / 1.25",
              border: "0.5px solid var(--r-line)",
              background: b ? "var(--r-fg)" : "var(--r-bg)",
              color: b ? "var(--r-bg)" : "var(--r-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              borderRadius: 2,
              cursor: "pointer",
              transition: "background-color .2s, color .2s",
            }}
          >
            {b}
            {sparks.filter((s) => s.i === i).map((s) => (
              <span key={s.id} aria-hidden className="nc-x-spark" />
            ))}
          </button>
        ))}
      </div>
      <div className="nc-x-bar">
        <button type="button" className="nc-x-btn nc-x-btn--primary" onClick={erase}>{t.erase}</button>
        <button type="button" className="nc-x-btn" onClick={() => setBits(random())}><Reset /> {t.fill}</button>
      </div>
      <div className="nc-x-bar" style={{ marginTop: "0.9rem" }}>
        <span className="nc-x-stat">{t.temp}</span>
        <span className="nc-x-seg" role="group" aria-label={t.temp}>
          {TEMPS.map((x, i) => (
            <button key={x.k} type="button" className="nc-x-btn" aria-pressed={ti === i} onClick={() => setTi(i)}>{x.label[lang]}</button>
          ))}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(8.5rem, 1fr))", gap: "1rem", marginTop: "1.1rem" }}>
        <div>
          <div className="nc-x-stat">{t.perBit} · kT ln 2</div>
          <div className="nc-x-num">{fmt(e)} <span className="nc-x-stat">{t.j}</span></div>
          <div className="nc-x-stat">{(e / EV).toLocaleString(lang, { maximumSignificantDigits: 2 })} {t.ev}</div>
        </div>
        <div>
          <div className="nc-x-stat">{t.erased}</div>
          <div className="nc-x-num">{erased.toLocaleString(lang)}</div>
        </div>
        <div>
          <div className="nc-x-stat">{t.heat}</div>
          <div className="nc-x-num">{fmt(heat)} <span className="nc-x-stat">{t.j}</span></div>
        </div>
      </div>
      <ul className="nc-x-facts">
        <li>{t.photo(fmt(3 * 8 * 1e6 * e))}</li>
        <li>{t.tea(fmt((250 * 4.184) / e))}</li>
        <li>{t.brain(fmt(20 / (KB * 310 * LN2)))}</li>
      </ul>
      <div className="nc-x-hint">{t.hint}</div>
    </div>
  );
}
