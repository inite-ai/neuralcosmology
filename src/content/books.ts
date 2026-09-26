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
  {
    slug: "nobody-writes-code",
    titles: {
      en: "Nobody Writes Code Anymore",
      ru: "Код больше не пишут",
      pt: "Ninguém Mais Escreve Código",
      es: "Ya Nadie Escribe Código",
    },
    hook: {
      en: "Writing code became almost free. What is scarce now is knowing what not to write.",
      ru: "Когда писать код стало почти бесплатно, дефицитом стало умение не написать лишнего.",
      pt: "Escrever código ficou quase de graça. O que falta agora é saber o que não escrever.",
      es: "Escribir código se volvió casi gratis. Lo que escasea ahora es saber qué no escribir.",
    },
    synopsis: {
      en:
        "Applied non-fiction for readers who do not write code. For sixty years programming was taken to be the production of code, because every idea had to be translated into the machine's language by hand. Language models brought the cost of that translation to zero, and the conclusion drawn was that anyone can program now. The book shows where that conclusion breaks: the patch against the organism, architecture as a system of prohibitions, the test as a reward function the agent learns to game, agent memory, software that repairs itself, applications dissolving into conversation, and the question of where senior engineers will come from once an apprentice has no reason to practise. Development begins where writing code ends.",
      ru:
        "Прикладной нон-фикшн для тех, кто код не пишет. Шестьдесят лет программирование считали производством кода, потому что любую идею приходилось вручную переводить на язык машины. Языковые модели обнулили стоимость перевода, и из этого сделали вывод, что программировать теперь может каждый. Книга показывает, где этот вывод ломается: заплатка против организма, архитектура как система запретов, тест как функция награды, которую агент учится обманывать, память агентов, софт, который чинит себя сам, приложения, растворяющиеся в разговоре, — и откуда возьмутся сеньоры, если ученику больше незачем набивать руку. Разработка начинается там, где написание кода заканчивается.",
      pt:
        "Não ficção aplicada para quem não escreve código. Durante sessenta anos a programação foi vista como produção de código, porque toda ideia precisava ser traduzida à mão para a linguagem da máquina. Os modelos de linguagem zeraram o custo dessa tradução, e daí se concluiu que agora qualquer um pode programar. O livro mostra onde essa conclusão quebra: o remendo contra o organismo, a arquitetura como sistema de proibições, o teste como função de recompensa que o agente aprende a burlar, a memória dos agentes, o software que se conserta sozinho, os aplicativos que se dissolvem em conversa — e de onde virão os seniores quando o aprendiz não tiver mais motivo para praticar. O desenvolvimento começa onde termina a escrita de código.",
      es:
        "No ficción aplicada para quien no escribe código. Durante sesenta años la programación se entendió como producción de código, porque cada idea había que traducirla a mano al lenguaje de la máquina. Los modelos de lenguaje redujeron a cero el coste de esa traducción, y de ahí se concluyó que ahora cualquiera puede programar. El libro muestra dónde se rompe esa conclusión: el parche frente al organismo, la arquitectura como sistema de prohibiciones, el test como función de recompensa que el agente aprende a engañar, la memoria de los agentes, el software que se repara solo, las aplicaciones que se disuelven en conversación, y de dónde saldrán los seniors cuando el aprendiz ya no tenga motivo para practicar. El desarrollo empieza donde termina la escritura de código.",
    },
    status: "wip",
    statusLabel: {
      en: "In progress · full draft · 27 chapters, 2 interludes",
      ru: "В работе · полный черновик · 27 глав, 2 интерлюдии",
      pt: "Em andamento · rascunho completo · 27 capítulos, 2 interlúdios",
      es: "En proceso · borrador completo · 27 capítulos, 2 interludios",
    },
    genre: "non-fiction",
    coverImage: "/covers/nobody-writes-code.svg",
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}
