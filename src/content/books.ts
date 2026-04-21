import type { Book } from "@/types/book";

export const books: Book[] = [
  {
    slug: "celestial-code",
    titles: {
      en: "The Celestial Code",
      ru: "Небесный Код",
      pt: "O Código Celestial",
      es: "El Código Celestial",
    },
    hook: {
      en: "Five independent discoveries, five different fields, one shape — tested against data.",
      ru: "Пять независимых открытий в пяти разных областях складываются в одну картину — и эта картина проверяется на данных.",
      pt: "Cinco descobertas independentes, cinco campos diferentes, uma forma — testada contra dados.",
      es: "Cinco descubrimientos independientes, cinco campos distintos, una misma forma — puesta a prueba contra los datos.",
    },
    synopsis: {
      en:
        "A non-fiction investigation at the intersection of cosmology, neuroscience, biology, and information theory. The book traces how disparate anomalies — galactic rotation curves, antimatter asymmetry, consciousness, cellular bioelectricity, and the measurement problem — converge on a single underlying architecture. Companion volume to the Pointer Architecture research programme, written for readers who want rigorous argument without mysticism.",
      ru:
        "Нон-фикшн на стыке космологии, нейронауки, биологии и теории информации. Книга собирает разрозненные аномалии — кривые вращения галактик, асимметрию материи и антиматерии, сознание, биоэлектричество клеток и проблему измерения — в единую архитектуру. Спутник исследовательской программы Pointer Architecture для читателей, которые хотят строгую аргументацию без мистики.",
      pt:
        "Uma investigação de não-ficção na interseção da cosmologia, da neurociência, da biologia e da teoria da informação. O livro acompanha como anomalias dispersas — curvas de rotação galáctica, assimetria de antimatéria, consciência, bioeletricidade celular e o problema da medição — convergem para uma única arquitetura subjacente. Volume complementar ao programa de pesquisa Pointer Architecture, escrito para leitores que querem argumento rigoroso sem misticismo.",
      es:
        "Una investigación de no ficción en la intersección de la cosmología, la neurociencia, la biología y la teoría de la información. El libro sigue cómo anomalías dispares — curvas de rotación galáctica, asimetría de antimateria, consciencia, bioelectricidad celular y el problema de la medición — convergen en una única arquitectura subyacente. Volumen complementario al programa de investigación Pointer Architecture, escrito para lectores que quieren argumento riguroso sin misticismo.",
    },
    status: "wip",
    statusLabel: {
      en: "In progress · 5.5/8 author sheets · target spring 2027",
      ru: "В работе · 5.5/8 а.л. · цель — весна 2027",
      pt: "Em andamento · 5,5/8 folhas de autor · previsto para a primavera de 2027",
      es: "En proceso · 5,5/8 pliegos de autor · primavera de 2027",
    },
    genre: "non-fiction",
    coverImage: "/covers/celestial-code.svg",
    comparables: [
      "The Order of Time — Carlo Rovelli",
      "I Am a Strange Loop — Douglas Hofstadter",
      "The Emperor's New Mind — Roger Penrose",
    ],
    companionPaperSlug: "pointer-architecture",
  },
  {
    slug: "bugs-academy",
    titles: {
      en: "Bugs Academy",
      ru: "Академия Багов",
      pt: "Academia dos Bugs",
      es: "Academia de los Bugs",
    },
    hook: {
      en: "A debugger saves the universe.",
      ru: "Debugger спасает вселенную.",
      pt: "Um debugger salva o universo.",
      es: "Un debugger salva el universo.",
    },
    synopsis: {
      en:
        "A sci-fi novel in which reality is a running program and a handful of systems engineers are the last line of defence against the exceptions eating it alive. Fast, funny, and grounded in real physics — the bugs behave exactly like the anomalies catalogued in the research programme behind the book.",
      ru:
        "Научная фантастика, где реальность — запущенная программа, а горстка системных инженеров — последняя линия защиты против пожирающих её исключений. Быстро, с юмором, но физика настоящая: баги ведут себя ровно как аномалии из научной программы, стоящей за книгой.",
      pt:
        "Um romance de ficção científica em que a realidade é um programa em execução e um punhado de engenheiros de sistemas é a última linha de defesa contra as exceções que a devoram. Rápido, bem-humorado e fundamentado em física real — os bugs se comportam exatamente como as anomalias catalogadas no programa de pesquisa por trás do livro.",
      es:
        "Una novela de ciencia ficción en la que la realidad es un programa en ejecución y un puñado de ingenieros de sistemas son la última línea de defensa contra las excepciones que la devoran. Rápida, divertida y anclada en física real — los bugs se comportan exactamente como las anomalías catalogadas en el programa de investigación que está detrás del libro.",
    },
    status: "forthcoming",
    statusLabel: {
      en: "Complete · 11.5 sheets · 231 pp · seeking publisher",
      ru: "Готова · 11.5 а.л. · 231 стр. · ищет издателя",
      pt: "Pronto · 11,5 folhas · 231 pp · buscando editora",
      es: "Terminada · 11,5 pliegos · 231 pp · en busca de editorial",
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
      pt: "Era dos Arquitetos",
      es: "Era de los Arquitectos",
    },
    hook: {
      en: "The sequel. The bugs were debugged. The architects are next.",
      ru: "Сиквел. Баги починены. На очереди — архитекторы.",
      pt: "A sequência. Os bugs foram depurados. Os arquitetos são os próximos.",
      es: "La secuela. Los bugs fueron depurados. Los arquitectos son los siguientes.",
    },
    synopsis: {
      en:
        "Direct sequel to Bugs Academy. After the exceptions are quieted, a deeper question surfaces: who wrote the program in the first place, and what happens when the code starts reading its authors back? A literary sci-fi that keeps the science rigorous and lets the characters carry the weight.",
      ru:
        "Прямой сиквел «Академии Багов». Когда исключения утихают, всплывает более глубокий вопрос: кто вообще написал программу — и что будет, когда код начнёт читать своих авторов в ответ? Литературная научная фантастика — с сохранением строгости науки.",
      pt:
        "Sequência direta de Academia dos Bugs. Quando as exceções se calam, surge uma pergunta mais profunda: quem escreveu o programa, afinal — e o que acontece quando o código começa a ler de volta os seus autores? Uma ficção científica literária que mantém o rigor da ciência e deixa que os personagens carreguem o peso.",
      es:
        "Secuela directa de Academia de los Bugs. Cuando las excepciones se aquietan, surge una pregunta más profunda: ¿quién escribió el programa, para empezar, y qué ocurre cuando el código empieza a leer de vuelta a sus autores? Una ciencia ficción literaria que mantiene el rigor de la ciencia y deja que los personajes lleven el peso.",
    },
    status: "wip",
    statusLabel: {
      en: "In progress · 1.0 sheet · 3 of 17 chapters",
      ru: "В работе · 1.0 а.л. · 3 из 17 глав",
      pt: "Em andamento · 1,0 folha · 3 de 17 capítulos",
      es: "En proceso · 1,0 pliego · 3 de 17 capítulos",
    },
    genre: "literary-sci-fi",
    coverImage: "/covers/era-of-architects.svg",
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}
