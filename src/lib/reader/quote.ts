// Общие для клиента и сервера правила текста цитаты.

const INVISIBLE = /[​-‍⁠﻿­]/g;

/** Цитата без невидимых символов (водяной знак, мягкий перенос); абзацы через пустую строку. */
export function plainQuote(s: string): string {
  return s
    .replace(INVISIBLE, "")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Укорачивает цитату для подписи в соцсети: целые предложения, если помещаются,
 * иначе по границе слова с многоточием. Абзацы склеиваются в одну строку.
 */
export function excerpt(quote: string, max: number): string {
  const flat = quote.replace(/\s*\n\s*\n\s*/g, " ").trim();
  // Выделение, оборванное на запятой или тире, заканчивается многоточием, а не «одежде,».
  if (flat.length <= max) return /[,;:—–-]$/.test(flat) ? `${flat.replace(/[\s,;:—–-]+$/, "")}…` : flat;
  const cut = flat.slice(0, max);
  const sentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "), cut.lastIndexOf("… "));
  if (sentence > max * 0.6) return cut.slice(0, sentence + 1);
  const space = cut.lastIndexOf(" ");
  return `${cut.slice(0, space > max * 0.6 ? space : max).replace(/[\s,;:—–-]+$/, "")}…`;
}

const AUTHOR: Record<string, string> = {
  ru: "Михаил Савченко",
  en: "Mikhail Savchenko",
  pt: "Mikhail Savchenko",
  es: "Mikhail Savchenko",
};

/** Подпись под цитатой в языке книги: «…» — Михаил Савченко, «Небесный Код». */
export function signed(quote: string, bookTitle: string, lang: string): string {
  // Кавычки по языку: ёлочки в русском и испанском, лапки в английском и бразильском
  // португальском; название книги в простом тексте — в ёлочках там, где это норма.
  const guillemets = lang === "ru" || lang === "es";
  const [o, c] = guillemets ? ["«", "»"] : ["“", "”"];
  const title = guillemets ? `«${bookTitle}»` : bookTitle;
  return `${o}${quote}${c} — ${AUTHOR[lang] ?? AUTHOR.en}, ${title}`;
}

export const authorName = (lang: string) => AUTHOR[lang] ?? AUTHOR.en;
