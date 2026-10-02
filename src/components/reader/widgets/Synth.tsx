"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict, WidgetProps } from "./kit";

// Модуль Карла: «пять ламп, три потенциометра без надписей, один тумблер».
// Пять расстроенных пил через резонансный фильтр, медленная модуляция среза,
// у каждого генератора свой дрейф громкости — его и показывают лампы.
// Ручки: высота гула, яркость, движение. Звук только по тумблеру.

const T: Dict<{ toggle: string; on: string; off: string; hint: string; knobs: string[]; minutes: (m: string) => string }> = {
  ru: { toggle: "Тумблер", on: "гудит", off: "выключен", knobs: ["первая ручка", "вторая ручка", "третья ручка"], minutes: (m) => `работает ${m}`, hint: "Включите тумблер и покрутите ручки: тяните вверх-вниз или стрелками. Подписей нет, как у Карла. Звук низкий, сначала убавьте громкость." },
  en: { toggle: "Toggle", on: "humming", off: "off", knobs: ["first knob", "second knob", "third knob"], minutes: (m) => `running ${m}`, hint: "Flip the toggle and turn the knobs: drag up and down or use the arrow keys. No labels, just like Karl’s. The sound is low; turn your volume down first." },
  pt: { toggle: "Interruptor", on: "zumbindo", off: "desligado", knobs: ["primeiro botão", "segundo botão", "terceiro botão"], minutes: (m) => `ligado há ${m}`, hint: "Ligue o interruptor e gire os botões: arraste para cima e para baixo ou use as setas. Sem rótulos, como no do Karl. O som é grave; abaixe o volume antes." },
  es: { toggle: "Interruptor", on: "zumbando", off: "apagado", knobs: ["primera perilla", "segunda perilla", "tercera perilla"], minutes: (m) => `encendido hace ${m}`, hint: "Encienda el interruptor y gire las perillas: arrastre arriba y abajo o use las flechas. Sin rótulos, como el de Karl. El sonido es grave; baje el volumen antes." },
};

const RATIOS = [1, 1.5, 2, 2.997, 4.01];

type Engine = { ctx: AudioContext; master: GainNode; filter: BiquadFilterNode; oscs: OscillatorNode[]; gains: GainNode[]; lfo: OscillatorNode; lfoGain: GainNode };

function Knob({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const drag = useRef<{ y: number; v: number } | null>(null);
  return (
    <div
      className="nc-syn-knob"
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      style={{ ["--a" as string]: `${-135 + value * 270}deg` }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { y: e.clientY, v: value };
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        onChange(Math.max(0, Math.min(1, drag.current.v + (drag.current.y - e.clientY) / 160)));
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowRight") { e.preventDefault(); onChange(Math.min(1, value + 0.05)); }
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") { e.preventDefault(); onChange(Math.max(0, value - 0.05)); }
      }}
    >
      <i />
    </div>
  );
}

export default function Synth({ lang }: WidgetProps) {
  const t = T[lang];
  const [on, setOn] = useState(false);
  const [k, setK] = useState([0.35, 0.4, 0.3]);
  const [lamps, setLamps] = useState([0, 0, 0, 0, 0]);
  const [secs, setSecs] = useState(0);
  const eng = useRef<Engine | null>(null);
  // Контекст создаётся прямо в обработчике нажатия: Safari иначе не даст звука.
  const ctxRef = useRef<AudioContext | null>(null);
  const kRef = useRef(k);
  kRef.current = k;

  const apply = (e: Engine, v: number[]) => {
    const now = e.ctx.currentTime;
    const root = 38 + v[0] * 70;
    e.oscs.forEach((o, i) => o.frequency.setTargetAtTime(root * RATIOS[i] * (1 + (i - 2) * 0.0025), now, 0.08));
    const cut = 90 + v[1] ** 2 * 2600;
    e.filter.frequency.setTargetAtTime(cut, now, 0.1);
    e.filter.Q.setTargetAtTime(4 + v[1] * 9, now, 0.1);
    e.lfo.frequency.setTargetAtTime(0.03 + v[2] * 1.2, now, 0.2);
    e.lfoGain.gain.setTargetAtTime(cut * (0.15 + v[2] * 0.7), now, 0.2);
  };

  useEffect(() => {
    if (eng.current) apply(eng.current, k);
  }, [k]);

  useEffect(() => {
    if (!on) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const master = ctx.createGain();
    master.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.42;
    const fb = ctx.createGain();
    fb.gain.value = 0.32;
    filter.connect(master);
    master.connect(ctx.destination);
    master.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(ctx.destination);
    const oscs: OscillatorNode[] = [], gains: GainNode[] = [];
    RATIOS.forEach((_, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 ? "triangle" : "sawtooth";
      const g = ctx.createGain();
      g.gain.value = 0;
      o.connect(g);
      g.connect(filter);
      o.start();
      oscs.push(o);
      gains.push(g);
    });
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    const e: Engine = { ctx, master, filter, oscs, gains, lfo, lfoGain };
    eng.current = e;
    apply(e, kRef.current);
    master.gain.setTargetAtTime(0.16, ctx.currentTime, 0.6);
    void ctx.resume();
    // Дрейф громкости генераторов — лампы.
    const t0 = performance.now();
    const phases = RATIOS.map(() => Math.random() * 10);
    const iv = setInterval(() => {
      const s = (performance.now() - t0) / 1000;
      const motion = kRef.current[2];
      const lv = phases.map((p, i) => 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(s * (0.13 + i * 0.07) * (0.4 + motion * 2.2) + p)) ** 2);
      lv.forEach((v, i) => gains[i].gain.setTargetAtTime(v * (i ? 0.5 / i : 0.9), ctx.currentTime, 0.15));
      setLamps(lv);
      setSecs(Math.floor(s));
    }, 100);
    return () => {
      clearInterval(iv);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
      setTimeout(() => void ctx.close(), 600);
      ctxRef.current = null;
      eng.current = null;
      setLamps([0, 0, 0, 0, 0]);
      setSecs(0);
    };
  }, [on]);

  const mm = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  return (
    <div>
      <div className={`nc-syn${on ? " is-on" : ""}`}>
        <div className="nc-syn-lamps">
          {lamps.map((v, i) => (
            <span key={i} style={{ ["--l" as string]: on ? v : 0 }} />
          ))}
        </div>
        <div className="nc-syn-knobs">
          {k.map((v, i) => (
            <Knob key={i} value={v} label={t.knobs[i]} onChange={(nv) => setK((o) => o.map((x, j) => (j === i ? nv : x)))} />
          ))}
        </div>
        <button type="button" className="nc-syn-toggle" role="switch" aria-checked={on} aria-label={t.toggle} onClick={() => {
          if (!on) {
            const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            ctxRef.current = new Ctx();
            void ctxRef.current.resume();
          }
          setOn(!on);
        }}>
          <i />
        </button>
      </div>
      <div className="nc-x-bar">
        <span className="nc-x-stat">{t.toggle}: <b>{on ? t.on : t.off}</b></span>
        <span className="nc-x-spacer" />
        {on && <span className="nc-x-stat">{t.minutes(mm)}</span>}
      </div>
      <div className="nc-x-hint">{t.hint}</div>
    </div>
  );
}
