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
      en: "Five independent discoveries from five different fields form a single picture, and that picture can be tested against data.",
      ru: "Пять независимых открытий из пяти разных областей складываются в одну картину, и её можно проверить на данных.",
      pt: "Cinco descobertas independentes, de cinco campos diferentes, formam uma só imagem, e ela pode ser testada com dados.",
      es: "Cinco descubrimientos independientes, de cinco campos distintos, forman una sola imagen, y esa imagen puede ponerse a prueba con datos.",
    },
    synopsis: {
      en:
        "A non-fiction investigation at the intersection of cosmology, neuroscience, biology, and information theory. The book traces how disparate anomalies — galactic rotation curves, antimatter asymmetry, consciousness, cellular bioelectricity, and the measurement problem — converge on a single underlying architecture. A companion to the Pointer Architecture preprint, written for readers who want rigorous argument without mysticism.",
      ru:
        "Нон-фикшн на стыке космологии, нейронауки, биологии и теории информации. Книга собирает разрозненные аномалии — кривые вращения галактик, асимметрию материи и антиматерии, сознание, биоэлектричество клеток и проблему измерения — в единую архитектуру. Книга-спутник препринта Pointer Architecture для читателей, которым нужна строгая аргументация без мистики.",
      pt:
        "Uma investigação de não ficção na interseção da cosmologia, da neurociência, da biologia e da teoria da informação. O livro acompanha como anomalias dispersas — curvas de rotação galáctica, assimetria de antimatéria, consciência, bioeletricidade celular e o problema da medição — convergem para uma única arquitetura subjacente. Volume complementar ao preprint Pointer Architecture, escrito para leitores que querem argumentação rigorosa sem misticismo.",
      es:
        "Una investigación de no ficción en la intersección de la cosmología, la neurociencia, la biología y la teoría de la información. El libro sigue cómo anomalías dispares — curvas de rotación galáctica, asimetría de antimateria, consciencia, bioelectricidad celular y el problema de la medición — convergen en una única arquitectura subyacente. Volumen complementario al preprint Pointer Architecture, escrito para lectores que buscan argumentación rigurosa sin misticismo.",
    },
    status: "wip",
    statusLabel: {
      en: "In progress · 5.5/8 author sheets · target spring 2027",
      ru: "В работе · 5,5 из 8 а. л. · выход весной 2027",
      pt: "Em andamento · 5,5/8 folhas de autor · previsto para o primeiro semestre de 2027",
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
    slug: "conscious-selection",
    titles: {
      en: "Conscious Selection",
      ru: "Осознанный Отбор",
      pt: "Seleção Consciente",
      es: "Selección Consciente",
    },
    hook: {
      en: "The first book ended with one word: check. The second one does the checking.",
      ru: "Первая книга закончилась словом «проверьте». Вторая проверяет.",
      pt: "O primeiro livro terminou com uma palavra: confiram. O segundo faz a conferência.",
      es: "El primer libro terminó con una palabra: comprueben. El segundo hace la comprobación.",
    },
    synopsis: {
      en:
        "The second non-fiction volume of the Neural Cosmology series. Almost everything the world could show an observer is filtered out before the observer gets to choose anything: sharp vision is squeezed into two degrees of arc, a memory is rewritten each time it is recalled, the environment keeps only the stable states of a quantum system, and open-ended evolution has refused to start in any laboratory for forty years. The author runs his own hypothesis from The Celestial Code through the same selection, publishes what survived, and builds three machines to see whether selection can be started by hand.",
      ru:
        "Вторая книга нон-фикшн-линии «Нейронной космологии». Почти всё, что мир мог бы предъявить наблюдателю, отсеивается раньше, чем тот успевает что-либо выбрать: резкое зрение ужато до двух градусов, воспоминание переписывается при каждом обращении, среда оставляет от квантовой системы только устойчивые состояния, а открытая эволюция за сорок лет так и не завелась ни в одной лаборатории. Автор прогоняет через тот же отбор собственную гипотезу из «Небесного Кода», публикует, что от неё уцелело, и строит три установки, чтобы проверить, можно ли запустить отбор руками.",
      pt:
        "O segundo volume de não ficção da série Cosmologia Neural. Quase tudo o que o mundo poderia mostrar a um observador é filtrado antes que ele consiga escolher qualquer coisa: a visão nítida cabe em dois graus de arco, uma lembrança é reescrita a cada vez que é acessada, o ambiente guarda apenas os estados estáveis de um sistema quântico, e a evolução aberta se recusa há quarenta anos a arrancar em qualquer laboratório. O autor submete a própria hipótese de O Código Celestial à mesma seleção, publica o que sobreviveu e constrói três máquinas para ver se a seleção pode ser posta em marcha à mão.",
      es:
        "El segundo volumen de no ficción de la serie Cosmología Neural. Casi todo lo que el mundo podría mostrarle a un observador queda filtrado antes de que este llegue a elegir nada: la visión nítida cabe en dos grados de arco, un recuerdo se reescribe cada vez que se evoca, el entorno conserva solo los estados estables de un sistema cuántico, y la evolución abierta lleva cuarenta años negándose a arrancar en ningún laboratorio. El autor somete su propia hipótesis de El Código Celestial a la misma selección, publica lo que sobrevivió y construye tres máquinas para ver si la selección puede ponerse en marcha a mano.",
    },
    status: "wip",
    statusLabel: {
      en: "In progress · chapter draft, interludes to come",
      ru: "В работе · черновик глав, интерлюдии впереди",
      pt: "Em andamento · rascunho dos capítulos, interlúdios a caminho",
      es: "En proceso · borrador de capítulos, interludios por llegar",
    },
    genre: "non-fiction",
    coverImage: "/covers/conscious-selection.svg",
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
      ru: "Отладчик спасает вселенную.",
      pt: "Um debugger salva o universo.",
      es: "Un debugger salva el universo.",
    },
    synopsis: {
      en:
        "A Moscow quantum physicist has seen the folds of reality since childhood and has learned to keep quiet about it. After he saves a stranger's life by accident, an ageless teacher takes him to an Academy for people like him, the bugs in the system, and shows him that the world is a running system with its own maintainers. Science fiction with real physics, written fast and with humour, and at its centre a mother who vanished twenty-one years ago.",
      ru:
        "Московский физик-квантовик с детства видит складки реальности и давно научился об этом молчать. Случайно спасив незнакомцу жизнь, он попадает к нестареющему учителю в Академию для таких же «багов» системы, где выясняется, что мир — работающая система со своими сисадминами. Фантастика с настоящей физикой, написанная быстро и с юмором, а в центре сюжета — мать, пропавшая двадцать один год назад.",
      pt:
        "Um físico quântico de Moscovo vê as dobras da realidade desde criança e aprendeu a calar-se sobre isso. Depois de salvar por acaso a vida de um desconhecido, um mestre que não envelhece leva-o para uma Academia de pessoas como ele, os bugs do sistema, e mostra-lhe que o mundo é um sistema em funcionamento com os seus próprios administradores. Ficção científica com física de verdade, escrita com ritmo e humor, e no centro uma mãe desaparecida há vinte e um anos.",
      es:
        "Un físico cuántico de Moscú ve los pliegues de la realidad desde niño y ha aprendido a callarlo. Tras salvar por accidente la vida de un desconocido, un maestro que no envejece lo lleva a una Academia para gente como él, los bugs del sistema, y le muestra que el mundo es un sistema en marcha con sus propios administradores. Ciencia ficción con física real, escrita con ritmo y humor, y en el centro una madre desaparecida hace veintiún años.",
    },
    status: "forthcoming",
    statusLabel: {
      en: "Complete · 11.5 sheets · 231 pp · seeking publisher",
      ru: "Готова · 11,5 а. л. · 231 стр. · ищет издателя",
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
      en: "The sequel: the bugs are fixed, and the architects are next.",
      ru: "Продолжение: баги починены, на очереди архитекторы.",
      pt: "A continuação: os bugs foram corrigidos, e agora é a vez dos arquitetos.",
      es: "La continuación: los bugs están arreglados y ahora les toca a los arquitectos.",
    },
    synopsis: {
      en:
        "Direct sequel to Bugs Academy. After the exceptions are quieted, a deeper question surfaces: who wrote the program in the first place, and what happens when the code starts reading its authors back? Literary science fiction that keeps the science rigorous and lets the characters carry the weight.",
      ru:
        "Прямой сиквел «Академии Багов». Когда исключения утихают, всплывает более глубокий вопрос: кто вообще написал программу и что будет, когда код начнёт читать своих авторов в ответ? Литературная фантастика, в которой наука остаётся строгой, а главный груз несут герои.",
      pt:
        "Sequência direta de Academia dos Bugs. Quando as exceções se calam, surge uma pergunta mais profunda: quem escreveu o programa, afinal — e o que acontece quando o código começa a ler de volta os seus autores? Uma ficção científica literária que mantém o rigor da ciência e deixa que os personagens carreguem o peso.",
      es:
        "Secuela directa de Academia de los Bugs. Cuando las excepciones se aquietan, surge una pregunta más profunda: ¿quién escribió el programa, para empezar, y qué ocurre cuando el código empieza a leer de vuelta a sus autores? Una ciencia ficción literaria que mantiene el rigor de la ciencia y deja que los personajes lleven el peso.",
    },
    status: "wip",
    statusLabel: {
      en: "In progress · 1.0 sheet · 3 of 17 chapters",
      ru: "В работе · 1 а. л. · 3 из 17 глав",
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
