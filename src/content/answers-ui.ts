import type { SupportedLocale } from "@/lib/get-locale";

// Подписи раздела «Вопросы» (/answers).
export const answersUi: Record<
  SupportedLocale,
  {
    nav: string;
    eyebrow: string;
    title: string;
    lead: string;
    short: string;
    faq: string;
    further: string;
    essay: string;
    book: string;
    preprint: string;
    preprintTitle: string;
    updated: string;
    shownIn: string;
  }
> = {
  en: {
    nav: "Questions",
    eyebrow: "Questions",
    title: "Each question gets a short answer first, then the evidence.",
    lead: "Pages on whether the universe is a neural network, what explains galaxy rotation curves and where consciousness comes from. Each page opens with a direct answer and then shows the data, the open problems and what would prove it wrong.",
    short: "Short answer",
    faq: "Frequently asked",
    further: "Go deeper",
    essay: "Essay",
    book: "Book",
    preprint: "Preprint",
    preprintTitle: "Pointer Architecture v9.0 — preprint and working code",
    updated: "Updated",
    shownIn: "shown in English",
  },
  ru: {
    nav: "Вопросы",
    eyebrow: "Вопросы",
    title: "На каждый вопрос сначала короткий ответ, потом доказательства.",
    lead: "Здесь собраны страницы о том, может ли Вселенная быть нейросетью, что объясняет кривые вращения галактик и откуда берётся сознание. Каждая начинается с прямого ответа, дальше идут данные, открытые проблемы и то, что опровергло бы гипотезу.",
    short: "Коротко",
    faq: "Частые вопросы",
    further: "Читать дальше",
    essay: "Эссе",
    book: "Книга",
    preprint: "Препринт",
    preprintTitle: "Pointer Architecture v9.0: препринт и работающий код",
    updated: "Обновлено",
    shownIn: "показано на английском",
  },
  pt: {
    nav: "Perguntas",
    eyebrow: "Perguntas",
    title: "Para cada pergunta, primeiro a resposta curta, depois a evidência.",
    lead: "Páginas sobre se o universo é uma rede neural, o que explica as curvas de rotação das galáxias e de onde vem a consciência. Cada página começa com uma resposta direta e depois mostra os dados, os problemas em aberto e o que refutaria a hipótese.",
    short: "Resposta curta",
    faq: "Perguntas frequentes",
    further: "Para ir além",
    essay: "Ensaio",
    book: "Livro",
    preprint: "Preprint",
    preprintTitle: "Pointer Architecture v9.0 — preprint e código funcional",
    updated: "Atualizado",
    shownIn: "exibido em inglês",
  },
  es: {
    nav: "Preguntas",
    eyebrow: "Preguntas",
    title: "Para cada pregunta, primero la respuesta corta y luego la evidencia.",
    lead: "Páginas sobre si el universo es una red neuronal, qué explica las curvas de rotación de las galaxias y de dónde viene la consciencia. Cada página empieza con una respuesta directa y luego muestra los datos, los problemas abiertos y qué refutaría la hipótesis.",
    short: "Respuesta corta",
    faq: "Preguntas frecuentes",
    further: "Para profundizar",
    essay: "Ensayo",
    book: "Libro",
    preprint: "Preprint",
    preprintTitle: "Pointer Architecture v9.0 — preprint y código funcional",
    updated: "Actualizado",
    shownIn: "mostrado en inglés",
  },
};
