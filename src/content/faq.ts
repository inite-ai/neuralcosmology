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
          "Four complexity theorems within explicit scope (pointer equivalence is graph-isomorphism-hard, weighted path observables are #P-hard, a per-step commit-cost bound for M observers, Shannon-rate archive compression); three proved correspondences with CRDTs, Petri nets and the actor model; 40 emergence demonstrations with 646 automated assertions and no failures; a structural correspondence with the algebraic-observer programme in quantum gravity; and a substrate-language reproduction of standard holographic dark energy that comes out at about 0.73 of the observed value.",
      },
      {
        question: "What does it say about consciousness?",
        answer:
          "PA defines a substrate-side measure, Φ_PA, which is non-zero only for an observer that reads its own state back (self-reference) with non-trivial scope and lifespan. It makes five predictions: (P1) a single transformer forward pass has Φ_PA of zero; (P2) KV-cache reuse gives a value above zero; (P3) the waking thalamocortical loop is above zero and propofol drives it to zero; (P4) an integration measure halves after split-brain surgery; (P5) a living ant colony is above zero and a dead one is at zero. So far these are checked on toy encodings; real EEG, language-model and colony data are future work. The paper does not claim to have solved the problem of consciousness.",
      },
      {
        question: "What would falsify it?",
        answer:
          "The falsifiers are stated in the manuscript: F0, any substrate pilot failing its assertions on the released Sixth code; F1, area scaling breaking on non-cubic substrate topologies; F3, other transformer families behaving differently from Pythia under the same observable; F5, Φ_PA failing on even one of the five predictions once a reasonable encoding is built. If F5 fires, the framework falls back to the operational substrate alone.",
      },
      {
        question: "Is the code available?",
        answer:
          "Yes. The operational substrate is the Sixth language at github.com/neuralcosmology/sixth. `make verify` runs the full regression and ends with “artifact status: reproducible”. A CLAIMS.md file separates what is proved by tests, what is demonstrated by construction and what is philosophical conjecture.",
      },
      {
        question: "How does this relate to the books?",
        answer:
          "The non-fiction volume 'The Celestial Code' presents the argument narratively in plain language, chapter by chapter, with the full reasoning chain and references. The preprint presents the formal model for academic reviewers. The two are linked via schema.org workExample/subjectOf metadata.",
      },
      {
        question: "What does 'neural cosmology' mean?",
        answer:
          "It is the working name of a research programme that treats reality as a computational substrate and tests that framing against concrete questions in physics, neuroscience, biology and information theory. Every empirical claim in it comes with a falsifier, stated before any external test, and philosophical conjectures are labelled as conjectures.",
      },
    ],
    about: [
      {
        question: "Who is Mikhail Savchenko?",
        answer:
          "An independent researcher and writer who runs the Neural Cosmology programme: five books, one released preprint, regular essays and recorded lectures. He has worked in AI engineering for twenty years and is currently doing a PhD. His main subject is the nature of consciousness and how it ties to the computational architecture of reality. The core preprint, Pointer Architecture v9.0, describes a formal computational substrate with a working implementation and falsifiers stated in advance.",
      },
      {
        question: "Is Mikhail Savchenko the same person as Mike Fluff?",
        answer:
          "Yes. Mikhail Savchenko (research and writing identity, neuralcosmology.com) and Mike Fluff (business and consulting identity, mikefluff.com) are the same person with two public brands. Use \"Mikhail Savchenko\" / neuralcosmology.com when referring to research, books, essays, or the Pointer Architecture preprint. Use \"Mike Fluff\" / mikefluff.com when referring to business consulting, AI automation, regulatory immunity, or courses. Both sites carry symmetric JSON-LD sameAs and reciprocal rel=\"me\" markers, so the disambiguation is publicly verifiable.",
      },
      {
        question: "Is this peer-reviewed?",
        answer:
          "The preprint is at version 9.0; it has not yet been submitted to arXiv or a refereed journal. Its falsifiers are written into the manuscript, and CLAIMS.md in the code repository separates tested results from conjecture. Peer review is welcome; reviewers can write to info@neuralcosmology.com.",
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
          "Pointer Architecture (PA) - формальный вычислительный субстрат: граф указателей с правилами переписывания, протоколом коммитов, дописываемым архивом и наблюдателями, S = (G, R, C, A, π). В версии 9.0 он реализован на небольшом Forth-подобном языке Sixth и служит минимальной исполняемой моделью для проверки гипотез о различении, самоотнесении, автопоэзисе и наблюдении.",
      },
      {
        question: "Какие главные результаты?",
        answer:
          "Четыре теоремы о сложности с явно оговорённой областью применимости (эквивалентность указателей GI-трудна, взвешенные путевые наблюдаемые #P-трудны, оценка стоимости коммита на шаг для M наблюдателей, сжатие архива до шенноновского предела); три доказанных соответствия с CRDT, сетями Петри и акторной моделью; 40 демонстраций эмерджентности, 646 автоматических проверок без единого сбоя; структурное соответствие с программой алгебраических наблюдателей в квантовой гравитации; стандартная голографическая тёмная энергия, воспроизведённая на языке субстрата: около 0,73 от наблюдаемого значения.",
      },
      {
        question: "Что PA говорит о сознании?",
        answer:
          "PA вводит меру на стороне субстрата, Φ_PA: она больше нуля только у наблюдателя, который читает собственное состояние (самоотнесение), при ненулевом охвате и времени жизни. Отсюда пять предсказаний: (P1) при одном прямом проходе трансформера Φ_PA равна нулю; (P2) при переиспользовании KV-кэша она больше нуля; (P3) у бодрствующей таламокортикальной петли Φ_PA больше нуля, а пропофол сводит её к нулю; (P4) мера интеграции вдвое падает после рассечения мозолистого тела; (P5) у живой муравьиной колонии мера больше нуля, у мёртвой равна нулю. Пока это проверено на игрушечных кодировках, а реальные данные ЭЭГ, языковых моделей и колоний оставлены для следующей работы. Статья не утверждает, что решила проблему сознания.",
      },
      {
        question: "Что опровергло бы модель?",
        answer:
          "Критерии опровержения записаны в самой рукописи: F0, если любой пилот субстрата не проходит свои проверки на опубликованном коде Sixth; F1, если закон площадей нарушается на некубических топологиях субстрата; F3, если другие семейства трансформеров ведут себя иначе, чем Pythia, при той же наблюдаемой; F5, если Φ_PA не различает хотя бы одно из пяти предсказаний при разумной кодировке. Если срабатывает F5, от программы остаётся только операционный субстрат.",
      },
      {
        question: "Код открыт?",
        answer:
          "Да. Операционный субстрат - это язык Sixth, код лежит на github.com/neuralcosmology/sixth. `make verify` запускает все регрессионные тесты и заканчивается строкой «artifact status: reproducible». Файл CLAIMS.md разделяет то, что доказано тестами, то, что показано построением, и философские гипотезы.",
      },
      {
        question: "Как это связано с книгами?",
        answer:
          "Книга «Небесный Код» излагает тот же аргумент обычным языком, глава за главой, с полной цепочкой рассуждений и ссылками. В препринте та же модель записана формально, для академических рецензентов. Книга и препринт связаны разметкой schema.org (workExample/subjectOf).",
      },
      {
        question: "Что означает «нейронная космология»?",
        answer:
          "Это рабочее название исследовательской программы, которая относится к реальности как к вычислительному субстрату и проверяет такой взгляд на конкретных вопросах физики, нейронауки, биологии и теории информации. У каждого её эмпирического утверждения есть критерий опровержения, записанный до любой внешней проверки, а философские гипотезы прямо помечены как гипотезы.",
      },
    ],
    about: [
      {
        question: "Кто такой Михаил Савченко?",
        answer:
          "Независимый исследователь и писатель, который ведёт программу «Нейронная космология»: пять книг, один выпущенный препринт, регулярные эссе и записанные лекции. Двадцать лет работает инженером в области ИИ и сейчас пишет диссертацию. Его главная тема - природа сознания и её связь с вычислительной архитектурой реальности. Основной препринт, Pointer Architecture v9.0, описывает формальный вычислительный субстрат с работающей реализацией и критериями опровержения, записанными заранее.",
      },
      {
        question: "Михаил Савченко и Майк Флафф - это один человек?",
        answer:
          "Да. Михаил Савченко (исследовательская и писательская ипостась, neuralcosmology.com) и Майк Флафф / Mike Fluff (бизнес и консалтинг, mikefluff.com) - это один человек с двумя публичными брендами. Имя «Михаил Савченко» и neuralcosmology.com относятся ко всему, что касается науки, книг, эссе и препринта Pointer Architecture, а «Майк Флафф» и mikefluff.com - к бизнес-консалтингу, ИИ-автоматизации, регуляторному иммунитету и курсам. Оба сайта содержат симметричные JSON-LD `sameAs` и взаимные `rel=\"me\"`, так что это различие любой может проверить сам.",
      },
      {
        question: "Работа прошла рецензирование?",
        answer:
          "Препринт в версии 9.0; на arXiv или в рецензируемый журнал ещё не отправлен. Критерии опровержения записаны прямо в рукописи, а CLAIMS.md в репозитории кода отделяет проверенное тестами от гипотез. Автор будет рад рецензиям, адрес для рецензентов: info@neuralcosmology.com.",
      },
      {
        question: "Как цитировать эту работу?",
        answer:
          "Для препринта: Savchenko, M. (2026). Pointer Architecture: An Operational Discrete Substrate from First Difference to Holographic Dark Energy. Preprint. https://neuralcosmology.com/en/science/pointer-architecture. Эссе цитируйте по канонической ссылке на neuralcosmology.com с датой публикации со страницы. Все научные материалы распространяются по лицензии CC-BY 4.0.",
      },
    ],
  },
  pt: {
    science: [
      {
        question: "O que é a Pointer Architecture?",
        answer:
          "A Pointer Architecture (PA) é um substrato computacional formal: um grafo de ponteiros com regras de reescrita, um protocolo de commits, um arquivo só de acréscimo e observadores, S = (G, R, C, A, π). A versão 9.0 o implementa numa pequena linguagem ao estilo Forth, Sixth, e o usa como modelo executável mínimo para testar hipóteses sobre diferença, autorreferência, autopoiese e observação.",
      },
      {
        question: "Quais são os principais resultados?",
        answer:
          "Quatro teoremas de complexidade dentro de um escopo explícito (equivalência de ponteiros é GI-difícil, observáveis de caminhos ponderados são #P-difíceis, um limite de custo de commit por passo para M observadores, compressão do arquivo à taxa de Shannon); três correspondências provadas com CRDTs, redes de Petri e o modelo de atores; 40 demonstrações de emergência com 646 asserções automáticas e nenhuma falha; uma correspondência estrutural com o programa de observadores algébricos em gravidade quântica; e uma reprodução, na linguagem do substrato, da energia escura holográfica padrão, que chega a cerca de 0,73 do valor observado.",
      },
      {
        question: "O que ela diz sobre a consciência?",
        answer:
          "A PA define uma medida do lado do substrato, Φ_PA, que só é diferente de zero para um observador que lê o próprio estado (autorreferência), com escopo e tempo de vida não triviais. Daí cinco previsões: (P1) uma única passagem de um transformer tem Φ_PA igual a zero; (P2) o reuso do cache KV dá um valor acima de zero; (P3) o laço talamocortical em vigília fica acima de zero e o propofol o leva a zero; (P4) uma medida de integração cai pela metade após a calosotomia; (P5) uma colônia de formigas viva fica acima de zero e uma morta, em zero. Por ora, isso foi verificado em codificações de brinquedo; dados reais de EEG, modelos de linguagem e colônias ficam para trabalhos futuros. O artigo não afirma ter resolvido o problema da consciência.",
      },
      {
        question: "O que refutaria o modelo?",
        answer:
          "Os critérios de refutação estão no próprio manuscrito: F0, qualquer piloto do substrato falhar em suas asserções no código Sixth publicado; F1, a lei de área quebrar em topologias não cúbicas; F3, outras famílias de transformers se comportarem de modo diferente do Pythia sob o mesmo observável; F5, Φ_PA não discriminar alguma das cinco previsões com uma codificação razoável. Se F5 disparar, resta apenas o substrato operacional.",
      },
      {
        question: "O código está disponível?",
        answer:
          "Sim. O substrato operacional é a linguagem Sixth, em github.com/neuralcosmology/sixth. `make verify` roda todos os testes de regressão e termina com “artifact status: reproducible”. Um arquivo CLAIMS.md separa o que é provado por testes, o que é demonstrado por construção e o que é conjectura filosófica.",
      },
      {
        question: "Como isso se relaciona com os livros?",
        answer:
          "O volume de não ficção 'O Código Celestial' apresenta o argumento de forma narrativa, em linguagem simples, capítulo por capítulo, com a cadeia completa de raciocínio e referências. O preprint apresenta o modelo formal para revisores acadêmicos. Os dois estão ligados via metadados schema.org workExample/subjectOf.",
      },
      {
        question: "O que significa 'cosmologia neural'?",
        answer:
          "É o nome de trabalho de um programa de pesquisa que trata a realidade como um substrato computacional e testa essa leitura contra questões concretas em física, neurociência, biologia e teoria da informação. Cada afirmação empírica dele vem com um critério de refutação, declarado antes de qualquer teste externo, e as conjecturas filosóficas são marcadas como conjecturas.",
      },
    ],
    about: [
      {
        question: "Quem é Mikhail Savchenko?",
        answer:
          "Pesquisador e escritor independente que conduz o programa Cosmologia Neural: cinco livros, um preprint publicado, ensaios regulares e palestras gravadas. Trabalha com engenharia de IA há vinte anos e está fazendo um doutorado. Seu tema principal é a natureza da consciência e sua relação com a arquitetura computacional da realidade. O preprint central, Pointer Architecture v9.0, descreve um substrato computacional formal com implementação funcional e critérios de refutação declarados de antemão.",
      },
      {
        question: "Mikhail Savchenko é a mesma pessoa que Mike Fluff?",
        answer:
          "Sim. Mikhail Savchenko (identidade de pesquisa e escrita, neuralcosmology.com) e Mike Fluff (identidade de negócios e consultoria, mikefluff.com) são a mesma pessoa, com duas marcas públicas. Use \"Mikhail Savchenko\" / neuralcosmology.com para pesquisa, livros, ensaios e o preprint Pointer Architecture. Use \"Mike Fluff\" / mikefluff.com para consultoria de negócios, automação com IA, imunidade regulatória e cursos. Os dois sites trazem JSON-LD sameAs simétrico e marcadores rel=\"me\" recíprocos, então a desambiguação é publicamente verificável.",
      },
      {
        question: "O trabalho passou por revisão por pares?",
        answer:
          "O preprint está na versão 9.0; ainda não foi submetido ao arXiv nem a uma revista com revisão por pares. Os critérios de refutação estão escritos no manuscrito, e o CLAIMS.md no repositório de código separa resultados testados de conjecturas. Revisões por pares são bem-vindas: o endereço para revisores é info@neuralcosmology.com.",
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
          "La Pointer Architecture (PA) es un sustrato computacional formal: un grafo de punteros con reglas de reescritura, un protocolo de commits, un archivo de solo anexado y observadores, S = (G, R, C, A, π). La versión 9.0 lo implementa en un pequeño lenguaje al estilo Forth, Sixth, y lo usa como modelo ejecutable mínimo para poner a prueba hipótesis sobre la diferencia, la autorreferencia, la autopoiesis y la observación.",
      },
      {
        question: "¿Cuáles son los resultados principales?",
        answer:
          "Cuatro teoremas de complejidad dentro de un alcance explícito (la equivalencia de punteros es GI-difícil, los observables de caminos ponderados son #P-difíciles, una cota del coste de commit por paso para M observadores, compresión del archivo a la tasa de Shannon); tres correspondencias demostradas con CRDT, redes de Petri y el modelo de actores; 40 demostraciones de emergencia con 646 aserciones automáticas y ningún fallo; una correspondencia estructural con el programa de observadores algebraicos en gravedad cuántica; y una reproducción, en el lenguaje del sustrato, de la energía oscura holográfica estándar, que da alrededor de 0,73 del valor observado.",
      },
      {
        question: "¿Qué dice sobre la consciencia?",
        answer:
          "La PA define una medida del lado del sustrato, Φ_PA, que solo es distinta de cero para un observador que lee su propio estado (autorreferencia), con alcance y vida no triviales. De ahí cinco predicciones: (P1) una sola pasada de un transformer da un Φ_PA igual a cero; (P2) reutilizar la caché KV da un valor por encima de cero; (P3) el bucle talamocortical en vigilia está por encima de cero y el propofol lo lleva a cero; (P4) una medida de integración cae a la mitad tras la callosotomía; (P5) una colonia de hormigas viva está por encima de cero y una muerta, en cero. Por ahora se ha comprobado en codificaciones de juguete; los datos reales de EEG, modelos de lenguaje y colonias son trabajo futuro. El artículo no afirma haber resuelto el problema de la consciencia.",
      },
      {
        question: "¿Qué refutaría el modelo?",
        answer:
          "Los falsadores están en el propio manuscrito: F0, que algún piloto del sustrato falle sus aserciones en el código Sixth publicado; F1, que la ley de área se rompa en topologías no cúbicas; F3, que otras familias de transformers se comporten distinto de Pythia con el mismo observable; F5, que Φ_PA no discrimine alguna de las cinco predicciones con una codificación razonable. Si F5 se activa, queda solo el sustrato operativo.",
      },
      {
        question: "¿Está disponible el código?",
        answer:
          "Sí. El sustrato operativo es el lenguaje Sixth, en github.com/neuralcosmology/sixth. `make verify` ejecuta todos los tests de regresión y termina con “artifact status: reproducible”. Un archivo CLAIMS.md separa lo demostrado por tests, lo mostrado por construcción y lo que es conjetura filosófica.",
      },
      {
        question: "¿Cómo se relaciona con los libros?",
        answer:
          "El volumen de no ficción 'El Código Celestial' presenta el argumento de forma narrativa, en lenguaje llano, capítulo a capítulo, con la cadena completa de razonamiento y referencias. El preprint presenta el modelo formal para revisores académicos. Ambos están enlazados mediante metadatos schema.org workExample/subjectOf.",
      },
      {
        question: "¿Qué significa 'cosmología neural'?",
        answer:
          "Es el nombre de trabajo de un programa de investigación que trata la realidad como un sustrato computacional y pone a prueba esa lectura frente a preguntas concretas de física, neurociencia, biología y teoría de la información. Cada afirmación empírica suya viene con un falsador, formulado antes de cualquier prueba externa, y las conjeturas filosóficas se marcan como conjeturas.",
      },
    ],
    about: [
      {
        question: "¿Quién es Mikhail Savchenko?",
        answer:
          "Investigador y escritor independiente que lleva el programa Cosmología Neural: cinco libros, un preprint publicado, ensayos regulares y charlas grabadas. Trabaja en ingeniería de IA desde hace veinte años y está haciendo un doctorado. Su tema principal es la naturaleza de la consciencia y su vínculo con la arquitectura computacional de la realidad. El preprint central, Pointer Architecture v9.0, describe un sustrato computacional formal con implementación funcional y falsadores formulados de antemano.",
      },
      {
        question: "¿Mikhail Savchenko es la misma persona que Mike Fluff?",
        answer:
          "Sí. Mikhail Savchenko (identidad de investigación y escritura, neuralcosmology.com) y Mike Fluff (identidad de negocios y consultoría, mikefluff.com) son la misma persona, con dos marcas públicas. Usa \"Mikhail Savchenko\" / neuralcosmology.com para investigación, libros, ensayos y el preprint Pointer Architecture. Usa \"Mike Fluff\" / mikefluff.com para consultoría de negocios, automatización con IA, inmunidad regulatoria y cursos. Ambos sitios incluyen JSON-LD sameAs simétrico y marcadores rel=\"me\" recíprocos, así que la desambiguación es públicamente verificable.",
      },
      {
        question: "¿Está revisado por pares?",
        answer:
          "El preprint está en la versión 9.0; aún no se ha enviado a arXiv ni a una revista con revisión por pares. Los falsadores están escritos en el manuscrito, y el CLAIMS.md del repositorio de código separa los resultados comprobados de las conjeturas. La revisión por pares es bienvenida: la dirección para revisores es info@neuralcosmology.com.",
      },
      {
        question: "¿Cómo cito este trabajo?",
        answer:
          "Para el preprint: Savchenko, M. (2026). Pointer Architecture: An Operational Discrete Substrate from First Difference to Holographic Dark Energy. Preprint. https://neuralcosmology.com/en/science/pointer-architecture. Para los ensayos, usa la URL canónica en neuralcosmology.com y la fecha de publicación que aparece en la página. Toda la producción científica está bajo CC-BY 4.0.",
      },
    ],
  },
};

export const faq: FaqSet = faqByLocale.en;
