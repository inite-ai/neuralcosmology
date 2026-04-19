import type { Book } from "@/types/book";

export const books: Book[] = [
  {
    slug: "celestial-code",
    titles: {
      en: "The Celestial Code",
      ru: "Небесный Код",
    },
    hook: {
      en: "Five independent discoveries, five different fields, one shape — tested against data.",
      ru: "Пять независимых открытий в пяти разных областях складываются в одну картину — и эта картина проверяется на данных.",
    },
    synopsis: {
      en:
        "A non-fiction investigation at the intersection of cosmology, neuroscience, biology, and information theory. The book traces how disparate anomalies — galactic rotation curves, antimatter asymmetry, consciousness, cellular bioelectricity, and the measurement problem — converge on a single underlying architecture. Companion volume to the Pointer Architecture research programme, written for readers who want rigorous argument without mysticism.",
      ru:
        "Нон-фикшн на стыке космологии, нейронауки, биологии и теории информации. Книга собирает разрозненные аномалии — кривые вращения галактик, асимметрию материи и антиматерии, сознание, биоэлектричество клеток и проблему измерения — в единую архитектуру. Спутник исследовательской программы Pointer Architecture для читателей, которые хотят строгую аргументацию без мистики.",
    },
    status: "wip",
    statusLabel: {
      en: "In progress · 5.5/8 author sheets · target spring 2027",
      ru: "В работе · 5.5/8 а.л. · цель — весна 2027",
    },
    genre: "non-fiction",
    coverImage: "/covers/celestial-code.svg",
    comparables: [
      "The Order of Time — Carlo Rovelli",
      "I Am a Strange Loop — Douglas Hofstadter",
      "The Emperor's New Mind — Roger Penrose",
    ],
  },
  {
    slug: "bugs-academy",
    titles: {
      en: "Bugs Academy",
      ru: "Академия Багов",
      pt: "Academia dos Bugs",
    },
    hook: {
      en: "A debugger saves the universe.",
      ru: "Debugger спасает вселенную.",
      pt: "Um debugger salva o universo.",
    },
    synopsis: {
      en:
        "A sci-fi novel in which reality is a running program and a handful of systems engineers are the last line of defence against the exceptions eating it alive. Fast, funny, and grounded in real physics — the bugs behave exactly like the anomalies catalogued in the research programme behind the book.",
      ru:
        "Научная фантастика, где реальность — запущенная программа, а горстка системных инженеров — последняя линия защиты против пожирающих её исключений. Быстро, с юмором, но физика настоящая: баги ведут себя ровно как аномалии из научной программы, стоящей за книгой.",
      pt:
        "Ficção científica em que a realidade é um programa em execução e um punhado de engenheiros é a última linha de defesa contra as exceções que a devoram. Física real, ritmo rápido, humor.",
    },
    status: "forthcoming",
    statusLabel: {
      en: "Complete · 11.5 sheets · 231 pp · seeking publisher",
      ru: "Готова · 11.5 а.л. · 231 стр. · ищет издателя",
    },
    genre: "sci-fi",
    pages: 231,
    coverImage: "/covers/bugs-academy.svg",
    comparables: [
      "Snow Crash — Neal Stephenson",
      "The Three-Body Problem — Liu Cixin",
      "Permutation City — Greg Egan",
    ],
  },
  {
    slug: "era-of-architects",
    titles: {
      en: "Era of Architects",
      ru: "Эра Архитекторов",
    },
    hook: {
      en: "The sequel. The bugs were debugged. The architects are next.",
      ru: "Сиквел. Баги починены. На очереди — архитекторы.",
    },
    synopsis: {
      en:
        "Direct sequel to Bugs Academy. After the exceptions are quieted, a deeper question surfaces: who wrote the program in the first place, and what happens when the code starts reading its authors back? A literary sci-fi that keeps the science rigorous and lets the characters carry the weight.",
      ru:
        "Прямой сиквел «Академии Багов». Когда исключения утихают, всплывает более глубокий вопрос: кто вообще написал программу — и что будет, когда код начнёт читать своих авторов в ответ? Литературная научная фантастика — с сохранением строгости науки.",
    },
    status: "wip",
    statusLabel: {
      en: "In progress · 1.0 sheet · 3 of 17 chapters",
      ru: "В работе · 1.0 а.л. · 3 из 17 глав",
    },
    genre: "literary-sci-fi",
    coverImage: "/covers/era-of-architects.svg",
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}
