"use client";

import { useEffect, useState } from "react";
import { Reset, type Dict, type WidgetProps } from "./kit";

// Предрегистрация на ладони: запишите предсказание, снимите с него SHA-256 и
// запечатайте. Отпечаток хранится только в этом браузере. Потом правьте текст —
// отпечаток пересчитывается на лету и не сходится от любой запятой.

const KEY = "nc-envelope";

async function sha256(s: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const T: Dict<{ placeholder: string; example: string; seal: string; sealed: (d: string) => string; now: string; match: string; mismatch: (n: number) => string; reset: string; hint: string; fp: string }> = {
  ru: {
    placeholder: "Что вы ожидаете увидеть, в какую сторону, какого размера эффект и при каком исходе признаете, что ошиблись",
    example: "Завтра в полдень в моём городе будет идти дождь. Если в полдень дождя не будет, я ошибся.",
    seal: "Запечатать", sealed: (d) => `Запечатано ${d}. Отпечаток сохранён в этом браузере.`, now: "Отпечаток текста сейчас",
    match: "Сходится: текст тот же, что при запечатывании.", mismatch: (n) => `Не сходится: отличается ${n} знаков из 64. Достаточно было тронуть одну запятую.`,
    reset: "Новое предсказание", fp: "Отпечаток в реестре", hint: "Попробуйте поправить в запечатанном тексте одну букву: отпечаток изменится почти целиком, и подмену увидит любой, кто сверит его с реестром.",
  },
  en: {
    placeholder: "What you expect to see, in which direction, how big the effect, and what outcome will make you admit you were wrong",
    example: "Tomorrow at noon it will be raining in my town. If it isn’t raining at noon, I was wrong.",
    seal: "Seal", sealed: (d) => `Sealed ${d}. The fingerprint is kept in this browser.`, now: "Fingerprint of the text now",
    match: "Matches: the text is the same as when sealed.", mismatch: (n) => `Doesn’t match: ${n} of 64 characters differ. Touching one comma was enough.`,
    reset: "New prediction", fp: "Fingerprint in the register", hint: "Try changing a single letter in the sealed text: the fingerprint changes almost entirely, and anyone checking it against the register will see the swap.",
  },
  pt: {
    placeholder: "O que você espera ver, em que direção, de que tamanho é o efeito e que resultado o fará admitir que errou",
    example: "Amanhã ao meio-dia vai estar chovendo na minha cidade. Se não estiver chovendo ao meio-dia, eu errei.",
    seal: "Lacrar", sealed: (d) => `Lacrado em ${d}. A impressão fica guardada neste navegador.`, now: "Impressão do texto agora",
    match: "Confere: o texto é o mesmo do momento do lacre.", mismatch: (n) => `Não confere: ${n} de 64 caracteres diferem. Bastou mexer numa vírgula.`,
    reset: "Nova previsão", fp: "Impressão no registro", hint: "Tente mudar uma única letra do texto lacrado: a impressão muda quase toda, e qualquer um que a compare com o registro verá a troca.",
  },
  es: {
    placeholder: "Qué espera ver, en qué dirección, de qué tamaño es el efecto y qué resultado le hará admitir que se equivocó",
    example: "Mañana a mediodía estará lloviendo en mi ciudad. Si a mediodía no llueve, me equivoqué.",
    seal: "Sellar", sealed: (d) => `Sellado el ${d}. La huella se guarda en este navegador.`, now: "Huella del texto ahora",
    match: "Coincide: el texto es el mismo que al sellarlo.", mismatch: (n) => `No coincide: difieren ${n} de 64 caracteres. Bastó con tocar una coma.`,
    reset: "Nueva predicción", fp: "Huella en el registro", hint: "Pruebe a cambiar una sola letra del texto sellado: la huella cambia casi entera, y cualquiera que la compare con el registro verá el cambio.",
  },
};

type Sealed = { hash: string; at: string };

export default function Envelope({ lang }: WidgetProps) {
  const t = T[lang];
  const [text, setText] = useState(t.example);
  const [hash, setHash] = useState("");
  const [sealed, setSealed] = useState<Sealed | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as Sealed & { text?: string };
        setSealed({ hash: s.hash, at: s.at });
        if (s.text) setText(s.text);
      }
    } catch {}
  }, []);

  useEffect(() => {
    let live = true;
    sha256(text).then((h) => live && setHash(h)).catch(() => {});
    return () => {
      live = false;
    };
  }, [text]);

  const seal = () => {
    const s = { hash, at: new Date().toLocaleString(lang, { dateStyle: "long", timeStyle: "short" }) };
    setSealed(s);
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...s, text }));
    } catch {}
  };

  const diff = sealed ? [...hash].filter((c, i) => c !== sealed.hash[i]).length : 0;

  return (
    <div>
      <textarea
        className="nc-env-text"
        value={text}
        placeholder={t.placeholder}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        aria-label={t.placeholder}
      />
      <div className="nc-env-hash">
        {sealed && (
          <div>
            <div className="nc-x-stat">{t.fp}</div>
            <code>{sealed.hash}</code>
          </div>
        )}
        <div>
          <div className="nc-x-stat">{t.now}</div>
          <code>
            {[...hash].map((c, i) => (
              <span key={i} className={sealed && c !== sealed.hash[i] ? "x" : undefined}>{c}</span>
            ))}
          </code>
        </div>
      </div>
      {sealed && (
        <div className="nc-x-hint" style={{ color: diff ? "#d2663a" : "var(--r-accent)" }}>
          {diff ? t.mismatch(diff) : t.match}
        </div>
      )}
      <div className="nc-x-bar">
        {!sealed ? (
          <button type="button" className="nc-x-btn nc-x-btn--primary" onClick={seal} disabled={!text.trim() || !hash}>
            <svg viewBox="0 0 16 16" aria-hidden><circle cx="8" cy="8" r="5.5" fill="currentColor" /></svg> {t.seal}
          </button>
        ) : (
          <button
            type="button"
            className="nc-x-btn"
            onClick={() => {
              setSealed(null);
              try {
                localStorage.removeItem(KEY);
              } catch {}
            }}
          >
            <Reset /> {t.reset}
          </button>
        )}
        <span className="nc-x-spacer" />
        {sealed && <span className="nc-x-stat">{t.sealed(sealed.at)}</span>}
      </div>
      <div className="nc-x-hint">{t.hint}</div>
    </div>
  );
}
