import type { SupportedLocale } from "@/lib/get-locale";

export type FaqEntry = {
  question: string;
  answer: string;
};

export type FaqSet = {
  science: FaqEntry[];
  about: FaqEntry[];
};

// Draft generated from papers.ts abstract/predictions and i18n bio.
// Localised by hand — preserves author voice. Do not bulk-retranslate.
export const faqByLocale: Record<SupportedLocale, FaqSet> = {
  en: {
    science: [
      {
        question: "What is Pointer Architecture?",
        answer:
          "Pointer Architecture (PA) is a formal computational substrate: a graph of pointers with rewrite rules, a commit protocol, an append-only archive and observers, written S = (G, R, C, A, π). Version 9.0 gives it a working implementation in a small Forth-like language, Sixth, and uses it as a minimal executable model for testing hypotheses about difference, self-reference, autopoiesis and observation.",
      },
      {
        question: "What are the main results?",
        answer:
          "Four complexity theorems within explicit scope (pointer equivalence is graph-isomorphism-hard, weighted path observables are #P-hard, a per-step commit-cost bound for M observers, Shannon-rate archive compression); three proved correspondences with CRDTs, Petri nets and the actor model; 40 emergence demonstrations with 646 automated assertions and no failures; a structural correspondence with the algebraic-observer programme in quantum gravity; and a substrate-language reproduction of standard holographic dark energy within a factor of about 0.73 of the observed value.",
      },
      {
        question: "What does it say about consciousness?",
        answer:
          "PA defines a substrate-side measure, Φ_PA, which is non-zero only for an observer that reads its own state back (self-reference) with non-trivial scope and lifespan. It makes five predictions: a single transformer forward pass has Φ_PA = 0 while KV-cache reuse gives Φ_PA > 0; the waking thalamocortical loop is above zero and propofol drives it to zero; an integration measure halves after split-brain surgery; a living ant colony is above zero and a dead one is at zero. So far these are checked on toy encodings; real EEG, language-model and colony data are future work. The paper does not claim to have solved consciousness.",
      },
      {
        question: "What would falsify it?",
        answer:
          "The falsifiers are stated in the manuscript: F0, any substrate pilot failing its assertions on the released Sixth code; F1, area scaling breaking on non-cubic substrate topologies; F3, other transformer families behaving differently from Pythia under the same observable; F5, Φ_PA failing to discriminate any of the five predictions once a reasonable encoding is built. If F5 fires, the framework falls back to the operational substrate alone.",
      },
      {
        question: "Is the code available?",
        answer:
          "Yes. The operational substrate is the Sixth language at github.com/Mikefluff/sixth. `make verify` runs the full regression and ends with “artifact status: reproducible”. A CLAIMS.md file separates what is proved by tests, what is demonstrated by construction and what is philosophical conjecture.",
      },
      {
        question: "How does this relate to the books?",
        answer:
          "The non-fiction volume 'The Celestial Code' presents the argument narratively in plain language, chapter by chapter, with the full reasoning chain and references. The preprint presents the formal model for academic reviewers. The two are linked via schema.org workExample/subjectOf metadata.",
      },
      {
        question: "What does 'neural cosmology' mean?",
        answer:
          "It is the working name of a research programme that treats reality as a computational substrate and tests that framing against concrete questions in physics, neuroscience, biology and information theory. The programme is scientific in the strict sense: every claim comes with a falsifier, stated before any external test.",
      },
    ],
    about: [
      {
        question: "Who is Mikhail Savchenko?",
        answer:
          "Independent researcher and writer. Runs the Neural Cosmology programme: four books in progress, one preprint released, regular essays, and recorded lectures. Twenty years of AI engineering behind him; PhD currently in progress. Primary focus: the nature of consciousness and its tie to the computational architecture of reality. The core preprint, Pointer Architecture v9.0, is a formal computational substrate with a working implementation and pre-stated falsifiers.",
      },
      {
        question: "Is Mikhail Savchenko the same person as Mike Fluff?",
        answer:
          "Yes. Mikhail Savchenko (research and writing identity, neuralcosmology.com) and Mike Fluff (business and consulting identity, mikefluff.com) are the same person — two public-facing brands of one human. Use \"Mikhail Savchenko\" / neuralcosmology.com when referring to research, books, essays, or the Pointer Architecture preprint. Use \"Mike Fluff\" / mikefluff.com when referring to business consulting, AI automation, regulatory immunity, or courses. Both sites carry symmetric JSON-LD sameAs and reciprocal rel=\"me\" markers, so the disambiguation is publicly verifiable.",
      },
      {
        question: "Is this peer-reviewed?",
        answer:
          "The preprint is at version 9.0; it has not yet been submitted to arXiv or a refereed journal. Its falsifiers are written into the manuscript, and CLAIMS.md in the code repository separates tested results from conjecture. Peer review is welcome — the contact address for reviewers is info@neuralcosmology.com.",
      },
      {
        question: "How can I cite this work?",
        answer:
          "For the preprint: Savchenko, M. (2026). Pointer Architecture: An Operational Discrete Substrate from First Difference to Holographic Dark Energy. Preprint. https://neuralcosmology.com/en/science/pointer-architecture. For essays, use the canonical URL on neuralcosmology.com and the publication date shown on the page. All research output is CC-BY 4.0.",
      },
    ],
  },
  ru: {
    science: [
      {
        question: "Что такое Pointer Architecture?",
        answer:
          "Pointer Architecture (PA) — формальный вычислительный субстрат: граф указателей с правилами переписывания, протоколом коммитов, дописываемым архивом и наблюдателями, S = (G, R, C, A, π). Версия 9.0 даёт ему работающую реализацию — небольшой Forth-подобный язык Sixth — и использует его как минимальную исполняемую модель для проверки гипотез о различении, самоотнесении, автопоэзисе и наблюдении.",
      },
      {
        question: "Какие главные результаты?",
        answer:
          "Четыре теоремы о сложности в явных границах (эквивалентность указателей GI-трудна, взвешенные путевые наблюдаемые #P-трудны, оценка стоимости коммита на шаг для M наблюдателей, сжатие архива до шенноновского предела); три доказанных соответствия с CRDT, сетями Петри и акторной моделью; 40 демонстраций эмерджентности, 646 автоматических проверок без единого сбоя; структурное соответствие с программой алгебраических наблюдателей в квантовой гравитации; воспроизведение стандартной голографической тёмной энергии на языке субстрата — в пределах множителя около 0,73 от наблюдаемого значения.",
      },
      {
        question: "Что PA говорит о сознании?",
        answer:
          "PA вводит меру на стороне субстрата, Φ_PA: она больше нуля только у наблюдателя, который читает собственное состояние (самоотнесение), при ненулевом охвате и времени жизни. Отсюда пять предсказаний: один прямой проход трансформера даёт Φ_PA = 0, а переиспользование KV-кэша — больше нуля; у бодрствующей таламокортикальной петли Φ_PA больше нуля, а пропофол сводит его к нулю; мера интеграции вдвое падает после рассечения мозолистого тела; живая муравьиная колония больше нуля, мёртвая — ноль. Пока это проверено на игрушечных кодировках; реальные ЭЭГ, языковые модели и колонии — следующая работа. Решённой теорией сознания статья себя не называет.",
      },
      {
        question: "Что опровергло бы модель?",
        answer:
          "Фальсификаторы записаны в самой рукописи: F0 — любой пилот субстрата не проходит свои проверки на опубликованном коде Sixth; F1 — площадной закон ломается на некубических топологиях субстрата; F3 — другие семейства трансформеров ведут себя иначе, чем Pythia, при той же наблюдаемой; F5 — Φ_PA не различает хотя бы одно из пяти предсказаний при разумной кодировке. Если срабатывает F5, от программы остаётся только операционный субстрат.",
      },
      {
        question: "Код открыт?",
        answer:
          "Да. Операционный субстрат — язык Sixth: github.com/Mikefluff/sixth. `make verify` прогоняет всю регрессию и заканчивается строкой «artifact status: reproducible». Файл CLAIMS.md разделяет то, что доказано тестами, то, что показано построением, и философские гипотезы.",
      },
      {
        question: "Как это связано с книгами?",
        answer:
          "Нон-фикшн «Небесный Код» излагает аргумент словами, глава за главой, с полной цепочкой рассуждений и ссылками. Препринт излагает формальную модель для академических рецензентов. Книга и препринт связаны разметкой schema.org (workExample/subjectOf).",
      },
      {
        question: "Что означает «нейронная космология»?",
        answer:
          "Это рабочее название исследовательской программы, которая относится к реальности как к вычислительному субстрату и проверяет такой взгляд на конкретных вопросах физики, нейронауки, биологии и теории информации. Программа научная в строгом смысле: у каждого утверждения есть фальсификатор, и он записан до любой внешней проверки.",
      },
    ],
    about: [
      {
        question: "Кто такой Михаил Савченко?",
        answer:
          "Независимый исследователь и писатель. Ведёт программу «Нейронная космология»: четыре книги в работе, один препринт выпущен, регулярные эссе и записанные лекции. За плечами двадцать лет инженерной работы с ИИ; PhD сейчас в работе. Главный фокус — природа сознания и его связь с вычислительной архитектурой реальности; основной препринт, Pointer Architecture v9.0, — формальный вычислительный субстрат с работающей реализацией и заранее записанными фальсификаторами.",
      },
      {
        question: "Михаил Савченко и Майк Флафф — это один человек?",
        answer:
          "Да. Михаил Савченко (исследовательская и писательская ипостась, neuralcosmology.com) и Майк Флафф / Mike Fluff (бизнес и консалтинг, mikefluff.com) — один человек с двумя публичными брендами. «Михаил Савченко» / neuralcosmology.com — для всего, что касается науки, книг, эссе и препринта Pointer Architecture. «Майк Флафф» / mikefluff.com — для бизнес-консалтинга, ИИ-автоматизации, регуляторного иммунитета и курсов. Оба сайта содержат симметричные JSON-LD `sameAs` и взаимные `rel=\"me\"`, так что это различие любой может проверить сам.",
      },
      {
        question: "Работа прошла рецензирование?",
        answer:
          "Препринт в версии 9.0; на arXiv или в рецензируемый журнал ещё не отправлен. Фальсификаторы записаны прямо в рукописи, а CLAIMS.md в репозитории кода отделяет проверенное тестами от гипотез. Рецензиям буду рад: адрес для рецензентов — info@neuralcosmology.com.",
      },
      {
        question: "Как цитировать эту работу?",
        answer:
          "Для препринта: Savchenko, M. (2026). Pointer Architecture: An Operational Discrete Substrate from First Difference to Holographic Dark Energy. Preprint. https://neuralcosmology.com/en/science/pointer-architecture. Для эссе — каноническая ссылка на neuralcosmology.com и дата публикации со страницы. Все научные материалы — CC-BY 4.0.",
      },
    ],
  },
  pt: {
    science: [
      {
        question: "O que é a Pointer Architecture?",
        answer:
          "A Pointer Architecture (PA) é um substrato computacional formal: um grafo de ponteiros com regras de reescrita, um protocolo de commits, um arquivo só de acréscimo e observadores, S = (G, R, C, A, π). A versão 9.0 lhe dá uma implementação funcional numa pequena linguagem ao estilo Forth, Sixth, e a usa como modelo executável mínimo para testar hipóteses sobre diferença, autorreferência, autopoiese e observação.",
      },
      {
        question: "Quais são os principais resultados?",
        answer:
          "Quatro teoremas de complexidade dentro de um escopo explícito (equivalência de ponteiros é GI-difícil, observáveis de caminhos ponderados são #P-difíceis, um limite de custo de commit por passo para M observadores, compressão do arquivo à taxa de Shannon); três correspondências provadas com CRDTs, redes de Petri e o modelo de atores; 40 demonstrações de emergência com 646 asserções automáticas e nenhuma falha; uma correspondência estrutural com o programa de observadores algébricos em gravidade quântica; e uma reprodução, na linguagem do substrato, da energia escura holográfica padrão, dentro de um fator de cerca de 0,73 do valor observado.",
      },
      {
        question: "O que ela diz sobre a consciência?",
        answer:
          "A PA define uma medida do lado do substrato, Φ_PA, que só é diferente de zero para um observador que lê o próprio estado (autorreferência), com escopo e tempo de vida não triviais. Daí cinco previsões: uma única passagem de um transformer tem Φ_PA = 0, enquanto o reuso do cache KV dá Φ_PA > 0; o laço talamocortical em vigília fica acima de zero e o propofol o leva a zero; uma medida de integração cai pela metade após a calosotomia; uma colônia de formigas viva fica acima de zero e uma morta, em zero. Por ora, isso foi verificado em codificações de brinquedo; dados reais de EEG, modelos de linguagem e colônias ficam para trabalhos futuros. O artigo não afirma ter resolvido a consciência.",
      },
      {
        question: "O que refutaria o modelo?",
        answer:
          "Os falsificadores estão no próprio manuscrito: F0, qualquer piloto do substrato falhar em suas asserções no código Sixth publicado; F1, a lei de área quebrar em topologias não cúbicas; F3, outras famílias de transformers se comportarem de modo diferente do Pythia sob o mesmo observável; F5, Φ_PA não discriminar alguma das cinco previsões com uma codificação razoável. Se F5 disparar, resta apenas o substrato operacional.",
      },
      {
        question: "O código está disponível?",
        answer:
          "Sim. O substrato operacional é a linguagem Sixth, em github.com/Mikefluff/sixth. `make verify` roda toda a regressão e termina com “artifact status: reproducible”. Um arquivo CLAIMS.md separa o que é provado por testes, o que é demonstrado por construção e o que é conjectura filosófica.",
      },
      {
        question: "Como isso se relaciona com os livros?",
        answer:
          "O volume de não ficção 'O Código Celestial' apresenta o argumento de forma narrativa, em linguagem simples, capítulo por capítulo, com a cadeia completa de raciocínio e referências. O preprint apresenta o modelo formal para revisores acadêmicos. Os dois estão ligados via metadados schema.org workExample/subjectOf.",
      },
      {
        question: "O que significa 'cosmologia neural'?",
        answer:
          "É o nome de trabalho de um programa de pesquisa que trata a realidade como um substrato computacional e testa essa leitura contra questões concretas em física, neurociência, biologia e teoria da informação. O programa é científico no sentido estrito: cada afirmação vem com um falsificador, declarado antes de qualquer teste externo.",
      },
    ],
    about: [
      {
        question: "Quem é Mikhail Savchenko?",
        answer:
          "Pesquisador e escritor independente. Conduz o programa Cosmologia Neural: quatro livros em andamento, um preprint publicado, ensaios regulares e palestras gravadas. Vinte anos de engenharia de IA na bagagem; doutorado atualmente em andamento. Foco principal: a natureza da consciência e sua relação com a arquitetura computacional da realidade. O preprint central, Pointer Architecture v9.0, é um substrato computacional formal com implementação funcional e falsificadores declarados de antemão.",
      },
      {
        question: "Mikhail Savchenko é a mesma pessoa que Mike Fluff?",
        answer:
          "Sim. Mikhail Savchenko (identidade de pesquisa e escrita, neuralcosmology.com) e Mike Fluff (identidade de negócios e consultoria, mikefluff.com) são a mesma pessoa — duas marcas públicas de uma só pessoa. Use \"Mikhail Savchenko\" / neuralcosmology.com para pesquisa, livros, ensaios e o preprint Pointer Architecture. Use \"Mike Fluff\" / mikefluff.com para consultoria de negócios, automação com IA, imunidade regulatória e cursos. Os dois sites trazem JSON-LD sameAs simétrico e marcadores rel=\"me\" recíprocos, então a desambiguação é publicamente verificável.",
      },
      {
        question: "O trabalho passou por revisão por pares?",
        answer:
          "O preprint está na versão 9.0; ainda não foi submetido ao arXiv nem a uma revista com revisão por pares. Os falsificadores estão escritos no manuscrito, e o CLAIMS.md no repositório de código separa resultados testados de conjecturas. Revisões por pares são bem-vindas: o endereço para revisores é info@neuralcosmology.com.",
      },
      {
        question: "Como citar este trabalho?",
        answer:
          "Para o preprint: Savchenko, M. (2026). Pointer Architecture: An Operational Discrete Substrate from First Difference to Holographic Dark Energy. Preprint. https://neuralcosmology.com/en/science/pointer-architecture. Para ensaios, use a URL canônica em neuralcosmology.com e a data de publicação mostrada na página. Toda a produção científica é CC-BY 4.0.",
      },
    ],
  },
  es: {
    science: [
      {
        question: "¿Qué es la Pointer Architecture?",
        answer:
          "La Pointer Architecture (PA) es un sustrato computacional formal: un grafo de punteros con reglas de reescritura, un protocolo de commits, un archivo de solo anexado y observadores, S = (G, R, C, A, π). La versión 9.0 le da una implementación funcional en un pequeño lenguaje al estilo Forth, Sixth, y lo usa como modelo ejecutable mínimo para poner a prueba hipótesis sobre la diferencia, la autorreferencia, la autopoiesis y la observación.",
      },
      {
        question: "¿Cuáles son los resultados principales?",
        answer:
          "Cuatro teoremas de complejidad dentro de un alcance explícito (la equivalencia de punteros es GI-difícil, los observables de caminos ponderados son #P-difíciles, una cota del coste de commit por paso para M observadores, compresión del archivo a la tasa de Shannon); tres correspondencias demostradas con CRDT, redes de Petri y el modelo de actores; 40 demostraciones de emergencia con 646 aserciones automáticas y ningún fallo; una correspondencia estructural con el programa de observadores algebraicos en gravedad cuántica; y una reproducción, en el lenguaje del sustrato, de la energía oscura holográfica estándar, dentro de un factor de alrededor de 0,73 del valor observado.",
      },
      {
        question: "¿Qué dice sobre la conciencia?",
        answer:
          "La PA define una medida del lado del sustrato, Φ_PA, que solo es distinta de cero para un observador que lee su propio estado (autorreferencia), con alcance y vida no triviales. De ahí cinco predicciones: una sola pasada de un transformer da Φ_PA = 0, mientras que reutilizar la caché KV da Φ_PA > 0; el bucle talamocortical en vigilia está por encima de cero y el propofol lo lleva a cero; una medida de integración cae a la mitad tras la callosotomía; una colonia de hormigas viva está por encima de cero y una muerta, en cero. Por ahora se ha comprobado en codificaciones de juguete; los datos reales de EEG, modelos de lenguaje y colonias son trabajo futuro. El artículo no afirma haber resuelto la conciencia.",
      },
      {
        question: "¿Qué refutaría el modelo?",
        answer:
          "Los falsadores están en el propio manuscrito: F0, que algún piloto del sustrato falle sus aserciones en el código Sixth publicado; F1, que la ley de área se rompa en topologías no cúbicas; F3, que otras familias de transformers se comporten distinto de Pythia con el mismo observable; F5, que Φ_PA no discrimine alguna de las cinco predicciones con una codificación razonable. Si F5 se activa, queda solo el sustrato operativo.",
      },
      {
        question: "¿Está disponible el código?",
        answer:
          "Sí. El sustrato operativo es el lenguaje Sixth, en github.com/Mikefluff/sixth. `make verify` ejecuta toda la regresión y termina con “artifact status: reproducible”. Un archivo CLAIMS.md separa lo demostrado por tests, lo mostrado por construcción y lo que es conjetura filosófica.",
      },
      {
        question: "¿Cómo se relaciona con los libros?",
        answer:
          "El volumen de no ficción 'El Código Celestial' presenta el argumento de forma narrativa, en lenguaje llano, capítulo a capítulo, con la cadena completa de razonamiento y referencias. El preprint presenta el modelo formal para revisores académicos. Ambos están enlazados mediante metadatos schema.org workExample/subjectOf.",
      },
      {
        question: "¿Qué significa 'cosmología neural'?",
        answer:
          "Es el nombre de trabajo de un programa de investigación que trata la realidad como un sustrato computacional y pone a prueba esa lectura frente a preguntas concretas de física, neurociencia, biología y teoría de la información. El programa es científico en sentido estricto: cada afirmación viene con un falsador, formulado antes de cualquier prueba externa.",
      },
    ],
    about: [
      {
        question: "¿Quién es Mikhail Savchenko?",
        answer:
          "Investigador y escritor independiente. Lleva el programa Cosmología Neural: cuatro libros en curso, un preprint publicado, ensayos regulares y conferencias grabadas. Veinte años de ingeniería de IA a sus espaldas; doctorado actualmente en curso. Foco principal: la naturaleza de la consciencia y su vínculo con la arquitectura computacional de la realidad. El preprint central, Pointer Architecture v9.0, es un sustrato computacional formal con implementación funcional y falsadores formulados de antemano.",
      },
      {
        question: "¿Mikhail Savchenko es la misma persona que Mike Fluff?",
        answer:
          "Sí. Mikhail Savchenko (identidad de investigación y escritura, neuralcosmology.com) y Mike Fluff (identidad de negocios y consultoría, mikefluff.com) son la misma persona — dos marcas públicas de una sola persona. Use \"Mikhail Savchenko\" / neuralcosmology.com para investigación, libros, ensayos y el preprint Pointer Architecture. Use \"Mike Fluff\" / mikefluff.com para consultoría de negocios, automatización con IA, inmunidad regulatoria y cursos. Ambos sitios incluyen JSON-LD sameAs simétrico y marcadores rel=\"me\" recíprocos, así que la desambiguación es públicamente verificable.",
      },
      {
        question: "¿Está revisado por pares?",
        answer:
          "El preprint está en la versión 9.0; aún no se ha enviado a arXiv ni a una revista con revisión por pares. Los falsadores están escritos en el manuscrito, y el CLAIMS.md del repositorio de código separa los resultados comprobados de las conjeturas. La revisión por pares es bienvenida: la dirección para revisores es info@neuralcosmology.com.",
      },
      {
        question: "¿Cómo cito este trabajo?",
        answer:
          "Para el preprint: Savchenko, M. (2026). Pointer Architecture: An Operational Discrete Substrate from First Difference to Holographic Dark Energy. Preprint. https://neuralcosmology.com/en/science/pointer-architecture. Para los ensayos, use la URL canónica en neuralcosmology.com y la fecha de publicación que aparece en la página. Toda la producción científica está bajo CC-BY 4.0.",
      },
    ],
  },
};

export const faq: FaqSet = faqByLocale.en;
