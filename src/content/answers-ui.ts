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
    title: "Big questions — short answers, then the evidence.",
    lead: "Is the universe a neural network? What explains galaxy rotation curves? Where does consciousness come from? Each page opens with a direct answer and then shows the data, the open problems and what would prove it wrong.",
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
    title: "Большие вопросы — сначала короткий ответ, потом доказательства.",
    lead: "Может ли Вселенная быть нейросетью? Что объясняет кривые вращения галактик? Откуда берётся сознание? Каждая страница начинается с прямого ответа, дальше данные, открытые проблемы и то, что опровергло бы гипотезу.",
    short: "Коротко",
    faq: "Частые вопросы",
    further: "Читать дальше",
    essay: "Эссе",
    book: "Книга",
    preprint: "Препринт",
    preprintTitle: "Pointer Architecture v9.0 — препринт и работающий код",
    updated: "Обновлено",
    shownIn: "показано на английском",
  },
  pt: {
    nav: "Perguntas",
    eyebrow: "Perguntas",
    title: "Grandes perguntas — primeiro a resposta curta, depois a evidência.",
    lead: "O universo é uma rede neural? O que explica as curvas de rotação das galáxias? De onde vem a consciência? Cada página começa com uma resposta direta e depois mostra os dados e o que a refutaria.",
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
    title: "Grandes preguntas — primero la respuesta corta, luego la evidencia.",
    lead: "¿Es el universo una red neuronal? ¿Qué explica las curvas de rotación de las galaxias? ¿De dónde viene la conciencia? Cada página empieza con una respuesta directa y luego muestra los datos y qué la refutaría.",
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
