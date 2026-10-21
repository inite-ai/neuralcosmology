import type { SupportedLocale } from "@/lib/get-locale";

// Книги того же автора на mikefluff.com (вне серии «Нейронная космология»)
// и проверка текста на ИИ оттуда же. Названия — как на mikefluff.com.
export const MIKEFLUFF = "https://www.mikefluff.com";

export const otherBooks: { slug: string; titles: Record<SupportedLocale, string>; about: Record<SupportedLocale, string> }[] = [
  {
    slug: "nobody-owns-money",
    titles: { en: "Nobody Owns Money", ru: "Ни у кого нет денег", pt: "Ninguém Tem Dinheiro", es: "Nadie tiene dinero" },
    about: {
      en: "the real history of crypto",
      ru: "настоящая история криптовалют",
      pt: "a história real das criptomoedas",
      es: "la historia real de las criptomonedas",
    },
  },
  {
    slug: "nobody-writes-code",
    titles: { en: "Nobody Writes Code Anymore", ru: "Код больше не пишут", pt: "Ninguém Mais Escreve Código", es: "Ya Nadie Escribe Código" },
    about: {
      en: "software development after language models",
      ru: "разработка программ после языковых моделей",
      pt: "o desenvolvimento de software depois dos modelos de linguagem",
      es: "el desarrollo de software después de los modelos de lenguaje",
    },
  },
];

export const OTHER_BOOKS_COPY: Record<SupportedLocale, { label: string; all: string; checker: string; checkerAbout: string }> = {
  en: {
    label: "Other books by the author",
    all: "All of Mikhail Savchenko's books, read online",
    checker: "AI text checker",
    checkerAbout: "highlights the phrases that make a text in English, Russian, Spanish or Portuguese read like ChatGPT; runs in the browser",
  },
  ru: {
    label: "Другие книги автора",
    all: "Все книги Михаила Савченко, читать онлайн",
    checker: "Проверка текста на ИИ",
    checkerAbout: "подсвечивает обороты, по которым текст на русском, английском, испанском или португальском читается как написанный ChatGPT; работает в браузере",
  },
  pt: {
    label: "Outros livros do autor",
    all: "Todos os livros de Mikhail Savchenko, para ler online",
    checker: "Verificador de texto de IA",
    checkerAbout: "destaca as frases que fazem um texto em português, inglês, espanhol ou russo soar como ChatGPT; funciona no navegador",
  },
  es: {
    label: "Otros libros del autor",
    all: "Todos los libros de Mikhail Savchenko, para leer en línea",
    checker: "Detector de texto de IA",
    checkerAbout: "resalta las frases que hacen que un texto en español, inglés, portugués o ruso suene a ChatGPT; funciona en el navegador",
  },
};
