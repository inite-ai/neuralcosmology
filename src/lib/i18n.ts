import type { SupportedLocale } from "@/lib/get-locale";
import { DEFAULT_LOCALE } from "@/lib/get-locale";

export type Dict = {
  siteName: string;
  meta: {
    title: string;
    description: string;
    ogLocale: string;
  };
  nav: {
    home: string;
    books: string;
    science: string;
    essays: string;
    about: string;
    contact: string;
  };
  hero: {
    directionsSectionTitle: string;
    directionsEyebrow: {
      books: string;
      science: string;
      essays: string;
    };
    directionsTitle: {
      books: string;
      science: string;
      essays: string;
    };
    directionsBlurb: {
      books: string;
      science: string;
      essays: string;
    };
    exploreCta: string;
  };
  books: {
    indexEyebrow: string;
    indexTitle: string;
    indexLead: string;
    readMore: string;
    allBooks: string;
    rightsInquiry: string;
    comparableHeader: string;
    russianTitle: string;
    genre: {
      nonFiction: string;
      sciFi: string;
      literarySciFi: string;
    };
  };
  science: {
    indexEyebrow: string;
    indexTitle: string;
    indexLead: string;
    allResearch: string;
    cardCta: string;
    preprintBadge: string;
    abstractHeader: string;
    tldrHeader: string;
    predictionsHeader: string;
    companionHeader: string;
    companionBody: string;
    companionCta: string;
    citeHeader: string;
    readPdf: string;
    codeRelease: string;
    contactReview: string;
  };
  essays: {
    eyebrow: string;
    title: string;
    lead: string;
    placeholderBody: string;
    placeholderLink1: string;
    placeholderLink2: string;
  };
  about: {
    eyebrow: string;
    title: string;
    bio: string[];
    agentsHeader: string;
    agentsBody: string;
    emailCta: string;
    elsewhereHeader: string;
  };
  footer: {
    tagline: string;
    columns: {
      read: string;
      research: string;
      contact: string;
    };
    links: {
      books: string;
      essays: string;
      science: string;
      pointer: string;
      references: string;
      about: string;
      press: string;
      github: string;
    };
    copyright: string;
  };
  home: {
    hero: {
      badge: string;
      title: string;
      headline: string;
      subhead: string;
      subheadExtra: string;
      cta: string;
    };
    whatIs: {
      title: string;
      lead1: string;
      lead2: string;
      leadMechanism: string;
      lead3: string;
    };
    corePrinciples: {
      title: string;
      axioms: string[];
    };
    tablet: {
      title: string;
      subtitle: string;
      disclaimer: string;
      commandments: { title: string; desc: string[] }[];
    };
    practices: {
      title: string;
      list: string[];
      cta: string;
    };
    lectures: {
      title: string;
      headline: string;
      sub: string;
      cta: string;
    };
    callToClarity: {
      title: string;
      headline: string;
      body: string;
      cta: string;
    };
  };
};

const en: Dict = {
  siteName: "Neural Cosmology",
  meta: {
    title: "Neural Cosmology — Mikhail Savchenko",
    description:
      "Public HQ for the Neural Cosmology programme: three books, one preprint, a growing body of essays. Scientist with questions, not prophet with answers.",
    ogLocale: "en_US",
  },
  nav: {
    home: "Home",
    books: "Books",
    science: "Science",
    essays: "Essays",
    about: "About",
    contact: "Contact",
  },
  hero: {
    directionsSectionTitle: "Three directions",
    directionsEyebrow: { books: "Books", science: "Science", essays: "Essays" },
    directionsTitle: {
      books: "Three books, one universe.",
      science: "The research programme.",
      essays: "Long-form writing.",
    },
    directionsBlurb: {
      books:
        "Non-fiction, sci-fi, and its literary sequel — same questions in three registers.",
      science: "Preprints, code, and data. Falsifiable by design.",
      essays:
        "Where the physics meets the prose. One idea, fully argued.",
    },
    exploreCta: "Explore",
  },
  books: {
    indexEyebrow: "The series",
    indexTitle: "Three books, one universe from three angles.",
    indexLead:
      "A non-fiction investigation, a sci-fi novel about its implications, and a literary sequel that follows the characters once the anomalies go quiet. Same questions, three registers.",
    readMore: "Read more →",
    allBooks: "← All books",
    rightsInquiry: "Rights / publisher inquiry",
    comparableHeader: "Comparable titles",
    russianTitle: "Russian title",
    genre: {
      nonFiction: "Non-fiction",
      sciFi: "Sci-fi",
      literarySciFi: "Literary sci-fi",
    },
  },
  science: {
    indexEyebrow: "Research programme",
    indexTitle: "The science behind the books.",
    indexLead:
      "Preprints, code, and data. The research programme that the non-fiction volume dramatises and the sci-fi volume runs scenarios on.",
    allResearch: "← All research",
    cardCta: "Read the landing page →",
    preprintBadge: "Preprint · v2",
    abstractHeader: "Abstract",
    tldrHeader: "TL;DR",
    predictionsHeader: "Predictions & falsifiers",
    companionHeader: "Companion volume",
    companionBody:
      "The non-fiction book in the series walks through the argument in plain language, with the full reasoning chain and references.",
    companionCta: "Read about the book →",
    citeHeader: "Cite",
    readPdf: "Read PDF",
    codeRelease: "Code release",
    contactReview: "Contact for review",
  },
  essays: {
    eyebrow: "Essays",
    title: "Long-form writing.",
    lead:
      "Where the physics meets the prose. The first essays are in final edit — back soon.",
    placeholderBody:
      "The first essay — A Loss Function for the Universe — is in final edit. It walks through the shape that shows up when five independent anomalies are lined up side by side.",
    placeholderLink1: "Pointer Architecture preprint",
    placeholderLink2: "non-fiction volume",
  },
  about: {
    eyebrow: "About",
    title: "Mikhail Savchenko",
    bio: [
      "I hold a PhD, run an AI-adjacent engineering practice, and spend the rest of my time writing the Neural Cosmology series — a non-fiction investigation and two novels orbiting the same research programme.",
      "The research programme itself is a constrained information-geometric model of galactic rotation that I benchmark against SPARC and release with code and data under a reproducibility pipeline. The books dramatise the same questions in different registers: one as rigorous argument, one as sci-fi, one as literary sequel.",
      "My stance, for what it is worth: scientist with questions, not prophet with answers. The programme is falsifiable by design. The fiction is honest about the physics. Everything on this site is an invitation to check the work.",
    ],
    agentsHeader: "Press, agents, publishers",
    agentsBody:
      "I am seeking representation for EN and PT-BR rights on the fiction titles, and endorsements / reviewers for the preprint. Serious inquiries welcome.",
    emailCta: "Email — info@neuralcosmology.com",
    elsewhereHeader: "Elsewhere",
  },
  footer: {
    tagline:
      "Neural Cosmology — three books, one preprint, a growing body of essays.",
    columns: {
      read: "Read",
      research: "Research",
      contact: "Contact",
    },
    links: {
      books: "Books",
      essays: "Essays",
      science: "Science",
      pointer: "Pointer Architecture",
      references: "References",
      about: "About the author",
      press: "Agents & press",
      github: "GitHub",
    },
    copyright: "All rights reserved.",
  },
  home: {
    hero: {
      badge: "neuralcosmology.com",
      title: "Neuralcosmology",
      headline: "Neural Cosmology",
      subhead:
        "The universe as a learning network. Consciousness as a property of certain graph configurations.",
      subheadExtra:
        "Preprints, code, essays and book materials — a programme bridging information-theoretic physics, cosmology and the foundations of mind.",
      cta: "Enter",
    },
    whatIs: {
      title: "What this is",
      lead1:
        "Neural Cosmology is an attempt to gather five anomalies of the standard picture of the world into one frame.",
      lead2:
        "Galaxy rotation. Matter–antimatter asymmetry. The measurement problem. Consciousness. Cellular bioelectricity. Five mysteries apart. One picture together.",
      leadMechanism:
        "The universe works as a learning network. The five anomalies turn out to be expressions of one computational structure — from the cosmic web to cellular bioelectricity. Consciousness is a measurable quantity, tied to how connections are arranged. Predictions are tested experimentally.",
      lead3:
        "The argument runs through the books, the preprint and the essays.",
    },
    corePrinciples: {
      title: "Five anomalies",
      axioms: [
        "Five facts from five different journals. Together they point the same way.",
        "The brain's structure and the cosmic web are statistically indistinguishable (Vazza, Feletti, 2020).",
        "Erasing a single bit releases heat (Landauer, 1961; measured 2012). Information is physical.",
        "Cells know what shape to build before genes start — through bioelectric patterns (Levin lab, Tufts).",
        "The universe as a neural network: quantum mechanics and gravity fall out as its limits (Vanchurin, PNAS 2022).",
        "Consciousness is a measure of integration, denoted Φ (Tononi, IIT).",
      ],
    },
    tablet: {
      title: "The Neuralcosmologist's Tablet",
      subtitle: "10 Commandments for Navigating a Living Reality",
      disclaimer:
        "This is not a doctrine.\nThis is not philosophy.\nThis is what remains when the illusions are gone.",
      commandments: [
        {
          title: "Don't flatten life into a line",
          desc: [
            "Linear life is fiction.",
            "Every moment is a fork.",
            "Choose deliberately.",
          ],
        },
        {
          title: "Start from the inside",
          desc: [
            "Outer signals mean little when your inner state is off.",
            "Address your own state first.",
            "Everything else reads from there.",
          ],
        },
        {
          title: "Clear memory of noise",
          desc: [
            "The past doesn't weigh on you by itself.",
            "The mind replays it.",
            "Find the pattern and the loop breaks.",
          ],
        },
        {
          title: "Tell who actually helps",
          desc: [
            "Real help restores clarity.",
            "Everything else compounds confusion.",
            "Use that as your check.",
          ],
        },
        {
          title: "Break the old form",
          desc: [
            "A crack is the signal to leave.",
            "Step out before the form becomes a cell.",
          ],
        },
        {
          title: "Hold through the transition",
          desc: [
            "Don't rush to rebuild.",
            "The pause after collapse does work.",
            "Stay in it until the next step is clear.",
          ],
        },
        {
          title: "Listen to repeats",
          desc: [
            "The same situation again? That's diagnostic.",
            "Resolve it or it returns a third time.",
          ],
        },
        {
          title: "Permit the cut",
          desc: [
            "Not every ending arrives closed.",
            "Some arrive clear.",
            "Let go without repairs, apologies, or scenes.",
          ],
        },
        {
          title: "Call yourself forward",
          desc: [
            "Your next version is waiting.",
            "No permission is coming.",
            "Name it. Act from it. Live it.",
          ],
        },
        {
          title: "Gather yourself",
          desc: [
            "A fractured self won't hold decisions.",
            "Gather, or scatter.",
            "There is no middle.",
          ],
        },
      ],
    },
    practices: {
      title: "Practices of attention",
      list: [
        "Watch which situations repeat — those are the forks.",
        "A five-minute pause before decisions.",
        "Separate signal from noise.",
        "Only say what you can do.",
        "If you're lost — stand, don't run.",
        "Do the important thing when no one's watching.",
      ],
      cta: "More",
    },
    lectures: {
      title: "Lectures",
      headline: "No recordings yet.",
      sub: "Breakdowns from the book and the preprint will be recorded. Subscribe for updates.",
      cta: "Subscribe",
    },
    callToClarity: {
      title: "Get in touch",
      headline: "No community, no movement.\nOnly the work and its testing.",
      body:
        "The preprint is open. Write with questions, reviews or critique — everything gets read.",
      cta: "Write",
    },
  },
};

const ru: Dict = {
  siteName: "Нейронная космология",
  meta: {
    title: "Нейронная космология — Михаил Савченко",
    description:
      "Открытый дом программы «Нейронная космология»: три книги, препринт, эссе. Учёный с вопросами, не пророк с ответами.",
    ogLocale: "ru_RU",
  },
  nav: {
    home: "Главная",
    books: "Книги",
    science: "Наука",
    essays: "Эссе",
    about: "Об авторе",
    contact: "Контакты",
  },
  hero: {
    directionsSectionTitle: "Три двери",
    directionsEyebrow: { books: "Книги", science: "Наука", essays: "Эссе" },
    directionsTitle: {
      books: "Три книги, одна вселенная.",
      science: "Программа исследования.",
      essays: "Длинная проза.",
    },
    directionsBlurb: {
      books:
        "Нон-фикшн, научная фантастика и её литературное продолжение. Одни и те же вопросы в трёх голосах.",
      science:
        "Препринты, код, данные. Собрана так, чтобы её можно было опровергнуть.",
      essays:
        "Там, где физика пересекается с прозой. Одна мысль, доведённая до конца.",
    },
    exploreCta: "Открыть",
  },
  books: {
    indexEyebrow: "Серия",
    indexTitle: "Три книги — одна вселенная, три угла зрения.",
    indexLead:
      "Нон-фикшн-расследование, научная фантастика о его следствиях и литературный продолжатель — о том, что остаётся, когда шум стихает. Одни и те же вопросы в трёх голосах.",
    readMore: "Подробнее →",
    allBooks: "← Все книги",
    rightsInquiry: "Запрос прав / издателю",
    comparableHeader: "По соседству на полке",
    russianTitle: "Русское название",
    genre: {
      nonFiction: "Нон-фикшн",
      sciFi: "Научная фантастика",
      literarySciFi: "Литературная НФ",
    },
  },
  science: {
    indexEyebrow: "Программа исследования",
    indexTitle: "Наука, стоящая за книгами.",
    indexLead:
      "Препринты, код, данные. То, что нон-фикшн разворачивает в аргумент, а фантастика — в сюжет.",
    allResearch: "← Все работы",
    cardCta: "Читать страницу работы →",
    preprintBadge: "Препринт · v2",
    abstractHeader: "Аннотация",
    tldrHeader: "Коротко",
    predictionsHeader: "Предсказания и фальсификаторы",
    companionHeader: "Сопутствующая книга",
    companionBody:
      "Нон-фикшн из серии ведёт аргумент простым языком, с полной цепочкой рассуждений и ссылками.",
    companionCta: "О книге →",
    citeHeader: "Цитирование",
    readPdf: "Открыть PDF",
    codeRelease: "Код и данные",
    contactReview: "Связаться для рецензии",
  },
  essays: {
    eyebrow: "Эссе",
    title: "Длинная проза.",
    lead:
      "Там, где физика пересекается с прозой. Первые эссе на финальной правке — скоро будут здесь.",
    placeholderBody:
      "Первое эссе — «Функция потерь для вселенной» — на финальной правке. Оно проходит по форме, которая проступает, когда ставишь пять независимых аномалий рядом.",
    placeholderLink1: "препринт Pointer Architecture",
    placeholderLink2: "нон-фикшн из серии",
  },
  about: {
    eyebrow: "Об авторе",
    title: "Михаил Савченко",
    bio: [
      "У меня PhD, инженерная практика на границе с ИИ — и серия «Нейронная космология», на которую уходит всё остальное время: одно нон-фикшн-расследование и два романа, вращающихся вокруг одной и той же программы.",
      "Сама программа — ограниченная информационно-геометрическая модель галактического вращения, которую я проверяю на каталоге SPARC и публикую с кодом и данными по воспроизводимому пайплайну. Книги раскрывают те же вопросы в трёх регистрах: как строгий аргумент, как научная фантастика, как литературное продолжение.",
      "Моя позиция, если коротко: учёный с вопросами, не пророк с ответами. Программа по самому устройству готова быть опровергнутой. Фантастика честна перед физикой. Весь сайт — приглашение проверить работу.",
    ],
    agentsHeader: "Пресса, агенты, издатели",
    agentsBody:
      "Ищу представление для англоязычных и бразильских прав на художественные тексты, а также рецензентов и отзывы на препринт. Серьёзные запросы — добро пожаловать.",
    emailCta: "Email — info@neuralcosmology.com",
    elsewhereHeader: "По соседству",
  },
  footer: {
    tagline:
      "«Нейронная космология» — три книги, препринт, собрание эссе.",
    columns: {
      read: "Читать",
      research: "Исследования",
      contact: "Связь",
    },
    links: {
      books: "Книги",
      essays: "Эссе",
      science: "Наука",
      pointer: "Pointer Architecture",
      references: "Ссылки",
      about: "Об авторе",
      press: "Агентам и прессе",
      github: "GitHub",
    },
    copyright: "Все права защищены.",
  },
  home: {
    hero: {
      badge: "neuralcosmology.com",
      title: "Neuralcosmology",
      headline: "Нейронная космология",
      subhead:
        "Вселенная как обучающаяся сеть. Сознание как свойство определённых конфигураций графа.",
      subheadExtra:
        "Препринты, код, эссе и материалы книг — исследование на стыке физики, космологии и природы сознания.",
      cta: "Войти",
    },
    whatIs: {
      title: "Что это",
      lead1:
        "Нейронная космология сводит пять аномалий стандартной картины мира в единую модель.",
      lead2:
        "Вращение галактик. Асимметрия материи. Проблема измерения. Сознание. Биоэлектричество клеток. По отдельности — пять загадок. Вместе — одна картина.",
      leadMechanism:
        "Вселенная работает как обучающаяся сеть. Пять аномалий оказываются проявлениями одной вычислительной структуры — от космической паутины до биоэлектричества клеток. Сознание — измеримая величина, зависит от того, как устроены связи. Предсказания проверяются экспериментально.",
      lead3:
        "Разбор идёт в книгах, препринте и эссе.",
    },
    corePrinciples: {
      title: "Пять аномалий",
      axioms: [
        "Пять фактов из разных журналов. Вместе они указывают в одну сторону.",
        "Структура мозга и структура космической паутины статистически неотличимы (Вацца, Фелетти, 2020).",
        "Стирание одного бита информации выделяет тепло (Ландауэр, 1961; измерено в 2012-м). Информация физична.",
        "Клетки знают форму до того, как работают гены — через биоэлектрические паттерны (лаборатория Левина, Tufts).",
        "Вселенная как нейронная сеть: квантовая механика и гравитация выводятся как её пределы (Ванчурин, PNAS 2022).",
        "Сознание — мера интегрированности системы, обозначается Φ (Тонони, IIT).",
      ],
    },
    tablet: {
      title: "Скрижаль нейрокосмолога",
      subtitle: "Десять заповедей для живой реальности",
      disclaimer:
        "Не доктрина.\nНе философия.\nТо, что остаётся, когда иллюзии уходят.",
      commandments: [
        {
          title: "Не вытягивай жизнь в линию",
          desc: [
            "Линейность — иллюзия.",
            "Каждый момент — развилка.",
            "Выбирай сознательно.",
          ],
        },
        {
          title: "Начинай изнутри",
          desc: [
            "Внешние сигналы мало значат, если внутри разлад.",
            "Сначала разберись со своим состоянием.",
            "Остальное считывается уже из него.",
          ],
        },
        {
          title: "Очисти память от шума",
          desc: [
            "Прошлое не давит само по себе.",
            "Его прокручивает голова.",
            "Найди узор — цикл оборвётся.",
          ],
        },
        {
          title: "Различай, кто помогает",
          desc: [
            "Настоящая помощь возвращает ясность.",
            "Всё остальное только путает сильнее.",
            "Сверяйся по этому.",
          ],
        },
        {
          title: "Ломай старую форму",
          desc: [
            "Трещина — сигнал к выходу.",
            "Выходи, пока форма не стала клеткой.",
          ],
        },
        {
          title: "Держись в переходе",
          desc: [
            "Не спеши перестраивать.",
            "Пауза после разрушения делает работу.",
            "Сиди в ней, пока не станет виден следующий шаг.",
          ],
        },
        {
          title: "Слушай повторы",
          desc: [
            "Та же ситуация снова — это диагностика.",
            "Разреши её, или она придёт в третий раз.",
          ],
        },
        {
          title: "Позволь разрыв",
          desc: [
            "Не всякий конец приходит с финалом.",
            "Иногда — только с ясностью.",
            "Отпускай без починок, извинений и сцен.",
          ],
        },
        {
          title: "Вызови себя вперёд",
          desc: [
            "Следующая версия тебя ждёт.",
            "Разрешения не будет.",
            "Назови. Действуй. Живи.",
          ],
        },
        {
          title: "Собери себя",
          desc: [
            "Расколотое «я» не удержит решения.",
            "Собирай или рассыпешься.",
            "Середины нет.",
          ],
        },
      ],
    },
    practices: {
      title: "Практики внимания",
      list: [
        "Смотри, какие ситуации повторяются — это развилки.",
        "Пауза пять минут — перед решением.",
        "Различай сигнал и шум.",
        "Говори только то, что можешь сделать.",
        "Если заблудился — не беги, а стой.",
        "Делай важное, когда никто не смотрит.",
      ],
      cta: "Подробнее",
    },
    lectures: {
      title: "Лекции",
      headline: "Пока записей нет.",
      sub: "Буду записывать разборы из книги и препринта. Подписывайся на обновления.",
      cta: "Подписаться",
    },
    callToClarity: {
      title: "Связаться",
      headline: "Ни сообщества, ни движения.\nТолько работа и её проверка.",
      body:
        "Препринт открыт. Пиши с вопросами, рецензиями или критикой — всё читается.",
      cta: "Написать",
    },
  },
};

const pt: Dict = {
  siteName: "Neural Cosmology",
  meta: {
    title: "Neural Cosmology — Mikhail Savchenko",
    description:
      "Casa aberta do programa Neural Cosmology: três livros, um preprint, ensaios. Cientista com perguntas, não profeta com respostas.",
    ogLocale: "pt_BR",
  },
  nav: {
    home: "Início",
    books: "Livros",
    science: "Ciência",
    essays: "Ensaios",
    about: "Sobre",
    contact: "Contato",
  },
  hero: {
    directionsSectionTitle: "Três portas",
    directionsEyebrow: { books: "Livros", science: "Ciência", essays: "Ensaios" },
    directionsTitle: {
      books: "Três livros, um universo.",
      science: "O programa de pesquisa.",
      essays: "Prosa longa.",
    },
    directionsBlurb: {
      books:
        "Não-ficção, ficção científica e a continuação literária dela. As mesmas perguntas em três vozes.",
      science: "Preprints, código e dados. Feita para ser posta à prova.",
      essays:
        "Onde a física encontra a prosa. Uma ideia, levada até o fim.",
    },
    exploreCta: "Entrar",
  },
  books: {
    indexEyebrow: "A série",
    indexTitle: "Três livros, um universo por três ângulos.",
    indexLead:
      "Uma investigação de não-ficção, um romance de ficção científica sobre suas consequências e uma continuação literária que acompanha os personagens depois que o ruído cessa. As mesmas perguntas em três vozes.",
    readMore: "Ler mais →",
    allBooks: "← Todos os livros",
    rightsInquiry: "Consulta de direitos / editora",
    comparableHeader: "Vizinhança na estante",
    russianTitle: "Título em russo",
    genre: {
      nonFiction: "Não-ficção",
      sciFi: "Ficção científica",
      literarySciFi: "FC literária",
    },
  },
  science: {
    indexEyebrow: "Programa de pesquisa",
    indexTitle: "A ciência atrás dos livros.",
    indexLead:
      "Preprints, código e dados. O que o livro de não-ficção desdobra em argumento, o romance de FC joga em cenários.",
    allResearch: "← Toda a pesquisa",
    cardCta: "Ler a página de trabalho →",
    preprintBadge: "Preprint · v2",
    abstractHeader: "Resumo",
    tldrHeader: "Em resumo",
    predictionsHeader: "Previsões e falsificadores",
    companionHeader: "Volume complementar",
    companionBody:
      "O livro de não-ficção da série percorre o argumento em linguagem simples, com a cadeia completa de raciocínio e as referências.",
    companionCta: "Sobre o livro →",
    citeHeader: "Citar",
    readPdf: "Ler o PDF",
    codeRelease: "Código e dados",
    contactReview: "Contato para revisão",
  },
  essays: {
    eyebrow: "Ensaios",
    title: "Prosa longa.",
    lead:
      "Onde a física encontra a prosa. Os primeiros ensaios estão na revisão final — em breve por aqui.",
    placeholderBody:
      "O primeiro ensaio — A Loss Function for the Universe — está na revisão final. Ele percorre a forma que aparece quando cinco anomalias independentes são colocadas lado a lado.",
    placeholderLink1: "preprint Pointer Architecture",
    placeholderLink2: "volume de não-ficção",
  },
  about: {
    eyebrow: "Sobre",
    title: "Mikhail Savchenko",
    bio: [
      "Tenho doutorado, toco uma prática de engenharia próxima da IA, e o que sobra do tempo vai para a série Neural Cosmology — uma investigação de não-ficção e dois romances em torno do mesmo programa de pesquisa.",
      "O programa em si é um modelo informacional-geométrico restrito da rotação galáctica que confronto com o catálogo SPARC e publico com código e dados num pipeline reprodutível. Os livros levam as mesmas perguntas em três vozes: como argumento rigoroso, como ficção científica, como continuação literária.",
      "Minha posição, para o que vale: cientista com perguntas, não profeta com respostas. O programa está feito para ser refutado. A ficção é honesta com a física. Este site é um convite a verificar o trabalho.",
    ],
    agentsHeader: "Imprensa, agentes, editoras",
    agentsBody:
      "Busco representação para direitos em EN e PT-BR para os títulos de ficção, e revisores para o preprint. Consultas sérias são bem-vindas.",
    emailCta: "Email — info@neuralcosmology.com",
    elsewhereHeader: "Em outro lugar",
  },
  footer: {
    tagline:
      "Neural Cosmology — três livros, um preprint, um conjunto crescente de ensaios.",
    columns: {
      read: "Ler",
      research: "Pesquisa",
      contact: "Contato",
    },
    links: {
      books: "Livros",
      essays: "Ensaios",
      science: "Ciência",
      pointer: "Pointer Architecture",
      references: "Referências",
      about: "Sobre o autor",
      press: "Agentes e imprensa",
      github: "GitHub",
    },
    copyright: "Todos os direitos reservados.",
  },
  home: {
    hero: {
      badge: "neuralcosmology.com",
      title: "Neuralcosmology",
      headline: "Neural Cosmology",
      subhead:
        "O universo como uma rede em aprendizado. A consciência como propriedade de certas configurações de grafo.",
      subheadExtra:
        "Preprints, código, ensaios e materiais de livros — um programa que liga física teórico-informacional, cosmologia e os fundamentos da mente.",
      cta: "Entrar",
    },
    whatIs: {
      title: "O que é",
      lead1:
        "Neural Cosmology é a tentativa de reunir cinco anomalias da imagem padrão do mundo numa única moldura.",
      lead2:
        "Rotação galáctica. Assimetria matéria–antimatéria. Problema da medição. Consciência. Bioeletricidade celular. Separados, cinco enigmas. Juntos, uma imagem.",
      leadMechanism:
        "O universo funciona como uma rede em aprendizado. As cinco anomalias aparecem como manifestações de uma única estrutura computacional — da rede cósmica à bioeletricidade celular. A consciência é uma grandeza mensurável, ligada a como as conexões estão dispostas. As previsões são testadas experimentalmente.",
      lead3:
        "O argumento atravessa os livros, o preprint e os ensaios.",
    },
    corePrinciples: {
      title: "Cinco anomalias",
      axioms: [
        "Cinco fatos de cinco revistas diferentes. Juntos apontam para o mesmo lado.",
        "A estrutura do cérebro e a teia cósmica são estatisticamente indistinguíveis (Vazza, Feletti, 2020).",
        "Apagar um bit libera calor (Landauer, 1961; medido em 2012). A informação é física.",
        "As células sabem a forma antes de os genes trabalharem — via padrões bioelétricos (laboratório Levin, Tufts).",
        "O universo como rede neural: mecânica quântica e gravidade surgem como seus limites (Vanchurin, PNAS 2022).",
        "Consciência como medida de integração, denotada Φ (Tononi, IIT).",
      ],
    },
    tablet: {
      title: "A Tábua do Neuralcosmologista",
      subtitle: "Dez mandamentos para uma realidade viva",
      disclaimer:
        "Não é doutrina.\nNão é filosofia.\nÉ o que resta quando as ilusões se vão.",
      commandments: [
        {
          title: "Não estique a vida em linha",
          desc: [
            "Vida linear é ficção.",
            "Cada momento é uma bifurcação.",
            "Escolha deliberadamente.",
          ],
        },
        {
          title: "Comece por dentro",
          desc: [
            "Sinais lá fora valem pouco quando por dentro está desafinado.",
            "Resolva primeiro o próprio estado.",
            "O resto se lê a partir dele.",
          ],
        },
        {
          title: "Limpe a memória do ruído",
          desc: [
            "O passado não pesa sozinho.",
            "A cabeça o reproduz.",
            "Veja o padrão — o laço se rompe.",
          ],
        },
        {
          title: "Distinga quem realmente ajuda",
          desc: [
            "Ajuda verdadeira devolve clareza.",
            "O resto só aumenta a confusão.",
            "Use isso como critério.",
          ],
        },
        {
          title: "Rompa a forma antiga",
          desc: [
            "A rachadura é o sinal para sair.",
            "Saia antes que a forma vire uma cela.",
          ],
        },
        {
          title: "Segure-se na travessia",
          desc: [
            "Não corra para reconstruir.",
            "A pausa depois do desmoronamento faz trabalho.",
            "Fique nela até o próximo passo aparecer.",
          ],
        },
        {
          title: "Escute as repetições",
          desc: [
            "A mesma cena de novo? Isso é diagnóstico.",
            "Resolva — ou ela volta pela terceira vez.",
          ],
        },
        {
          title: "Permita o corte",
          desc: [
            "Nem todo fim chega fechado.",
            "Alguns chegam claros.",
            "Solte, sem remendos, desculpas ou cena.",
          ],
        },
        {
          title: "Chame-se para fora",
          desc: [
            "Sua próxima versão está esperando.",
            "Permissão não vai chegar.",
            "Dê-lhe nome. Aja a partir dele. Viva-o.",
          ],
        },
        {
          title: "Reúna-se",
          desc: [
            "Um eu partido não sustenta decisões.",
            "Reúna ou desfaça-se.",
            "Não há meio-termo.",
          ],
        },
      ],
    },
    practices: {
      title: "Práticas de atenção",
      list: [
        "Observe quais situações se repetem — são as bifurcações.",
        "Pausa de cinco minutos antes de decidir.",
        "Separe sinal de ruído.",
        "Só diga o que pode fazer.",
        "Se se perdeu — pare, não corra.",
        "Faça o importante quando ninguém está olhando.",
      ],
      cta: "Mais",
    },
    lectures: {
      title: "Palestras",
      headline: "Ainda não há gravações.",
      sub: "Vou gravar análises do livro e do preprint. Assine para receber atualizações.",
      cta: "Assinar",
    },
    callToClarity: {
      title: "Entrar em contato",
      headline: "Sem comunidade, sem movimento.\nSó o trabalho e sua verificação.",
      body:
        "O preprint está aberto. Escreva com perguntas, resenhas ou críticas — tudo é lido.",
      cta: "Escrever",
    },
  },
};

const es: Dict = {
  siteName: "Neural Cosmology",
  meta: {
    title: "Neural Cosmology — Mikhail Savchenko",
    description:
      "Casa abierta del programa Neural Cosmology: tres libros, un preprint, ensayos. Científico con preguntas, no profeta con respuestas.",
    ogLocale: "es_ES",
  },
  nav: {
    home: "Inicio",
    books: "Libros",
    science: "Ciencia",
    essays: "Ensayos",
    about: "Sobre",
    contact: "Contacto",
  },
  hero: {
    directionsSectionTitle: "Tres puertas",
    directionsEyebrow: { books: "Libros", science: "Ciencia", essays: "Ensayos" },
    directionsTitle: {
      books: "Tres libros, un universo.",
      science: "El programa de investigación.",
      essays: "Prosa larga.",
    },
    directionsBlurb: {
      books:
        "No ficción, ciencia ficción y su continuación literaria. Las mismas preguntas en tres voces.",
      science: "Preprints, código y datos. Hecho para ser refutado.",
      essays: "Donde la física se cruza con la prosa. Una idea, llevada hasta el final.",
    },
    exploreCta: "Entrar",
  },
  books: {
    indexEyebrow: "La serie",
    indexTitle: "Tres libros, un universo desde tres ángulos.",
    indexLead:
      "Una investigación de no ficción, una novela de ciencia ficción sobre sus implicaciones y una continuación literaria que acompaña a los personajes cuando el ruido se apaga. Las mismas preguntas en tres voces.",
    readMore: "Leer más →",
    allBooks: "← Todos los libros",
    rightsInquiry: "Consulta de derechos / editorial",
    comparableHeader: "Vecinos de estantería",
    russianTitle: "Título en ruso",
    genre: {
      nonFiction: "No ficción",
      sciFi: "Ciencia ficción",
      literarySciFi: "CF literaria",
    },
  },
  science: {
    indexEyebrow: "Programa de investigación",
    indexTitle: "La ciencia detrás de los libros.",
    indexLead:
      "Preprints, código y datos. Lo que el libro de no ficción despliega como argumento, la novela lo lanza como escenario.",
    allResearch: "← Toda la investigación",
    cardCta: "Leer la página del trabajo →",
    preprintBadge: "Preprint · v2",
    abstractHeader: "Resumen",
    tldrHeader: "En breve",
    predictionsHeader: "Predicciones y falsadores",
    companionHeader: "Volumen complementario",
    companionBody:
      "El libro de no ficción de la serie recorre el argumento en lenguaje llano, con la cadena completa de razonamiento y las referencias.",
    companionCta: "Sobre el libro →",
    citeHeader: "Citar",
    readPdf: "Leer el PDF",
    codeRelease: "Código y datos",
    contactReview: "Contacto para revisión",
  },
  essays: {
    eyebrow: "Ensayos",
    title: "Prosa larga.",
    lead:
      "Donde la física se cruza con la prosa. Los primeros ensayos están en revisión final — pronto por aquí.",
    placeholderBody:
      "El primer ensayo — A Loss Function for the Universe — está en revisión final. Recorre la forma que aparece cuando cinco anomalías independientes se ponen una al lado de otra.",
    placeholderLink1: "preprint Pointer Architecture",
    placeholderLink2: "volumen de no ficción",
  },
  about: {
    eyebrow: "Sobre",
    title: "Mikhail Savchenko",
    bio: [
      "Tengo un doctorado, llevo una práctica de ingeniería cercana a la IA, y el resto del tiempo va a la serie Neural Cosmology — una investigación de no ficción y dos novelas que giran alrededor del mismo programa de investigación.",
      "El programa mismo es un modelo informacional-geométrico restringido de la rotación galáctica que contrasto con SPARC y publico con código y datos en un pipeline reproducible. Los libros llevan las mismas preguntas en tres voces: como argumento riguroso, como ciencia ficción, como continuación literaria.",
      "Mi postura, por lo que vale: científico con preguntas, no profeta con respuestas. El programa está hecho para ser refutado. La ficción es honesta con la física. Este sitio es una invitación a verificar el trabajo.",
    ],
    agentsHeader: "Prensa, agentes, editoriales",
    agentsBody:
      "Busco representación para derechos en EN y PT-BR para los títulos de ficción, y revisores para el preprint. Consultas serias bienvenidas.",
    emailCta: "Email — info@neuralcosmology.com",
    elsewhereHeader: "En otros sitios",
  },
  footer: {
    tagline:
      "Neural Cosmology — tres libros, un preprint, un conjunto creciente de ensayos.",
    columns: {
      read: "Leer",
      research: "Investigación",
      contact: "Contacto",
    },
    links: {
      books: "Libros",
      essays: "Ensayos",
      science: "Ciencia",
      pointer: "Pointer Architecture",
      references: "Referencias",
      about: "Sobre el autor",
      press: "Agentes y prensa",
      github: "GitHub",
    },
    copyright: "Todos los derechos reservados.",
  },
  home: {
    hero: {
      badge: "neuralcosmology.com",
      title: "Neuralcosmology",
      headline: "Neural Cosmology",
      subhead:
        "El universo como una red que aprende. La consciencia como propiedad de ciertas configuraciones de grafo.",
      subheadExtra:
        "Preprints, código, ensayos y materiales de libros — un programa que une física teórico-informacional, cosmología y los fundamentos de la mente.",
      cta: "Entrar",
    },
    whatIs: {
      title: "Qué es",
      lead1:
        "Neural Cosmology es el intento de reunir cinco anomalías de la imagen estándar del mundo en un solo marco.",
      lead2:
        "Rotación galáctica. Asimetría materia–antimateria. Problema de la medición. Consciencia. Bioelectricidad celular. Por separado, cinco enigmas. Juntos, una imagen.",
      leadMechanism:
        "El universo funciona como una red que aprende. Las cinco anomalías resultan ser manifestaciones de una sola estructura computacional — desde la red cósmica hasta la bioelectricidad celular. La consciencia es una magnitud medible, ligada a cómo están dispuestas las conexiones. Las predicciones se comprueban experimentalmente.",
      lead3:
        "El argumento recorre los libros, el preprint y los ensayos.",
    },
    corePrinciples: {
      title: "Cinco anomalías",
      axioms: [
        "Cinco hechos de cinco revistas distintas. Juntos apuntan en la misma dirección.",
        "La estructura del cerebro y la red cósmica son estadísticamente indistinguibles (Vazza, Feletti, 2020).",
        "Borrar un bit libera calor (Landauer, 1961; medido en 2012). La información es física.",
        "Las células conocen la forma antes de que los genes trabajen — mediante patrones bioeléctricos (laboratorio Levin, Tufts).",
        "El universo como red neuronal: la mecánica cuántica y la gravedad surgen como sus límites (Vanchurin, PNAS 2022).",
        "Consciencia como medida de integración, denotada Φ (Tononi, IIT).",
      ],
    },
    tablet: {
      title: "La Tabla del Neuralcosmólogo",
      subtitle: "Diez mandamientos para una realidad viva",
      disclaimer:
        "No es doctrina.\nNo es filosofía.\nEs lo que queda cuando las ilusiones se van.",
      commandments: [
        {
          title: "No estires tu vida en línea",
          desc: [
            "La vida lineal es ficción.",
            "Cada momento es una bifurcación.",
            "Elige deliberadamente.",
          ],
        },
        {
          title: "Empieza por dentro",
          desc: [
            "Las señales de fuera valen poco si por dentro hay desafinación.",
            "Resuelve primero tu propio estado.",
            "El resto se lee desde ahí.",
          ],
        },
        {
          title: "Limpia la memoria del ruido",
          desc: [
            "El pasado no pesa solo.",
            "La cabeza lo repite.",
            "Ve el patrón — el bucle se rompe.",
          ],
        },
        {
          title: "Distingue a quien de verdad ayuda",
          desc: [
            "La ayuda real devuelve claridad.",
            "Todo lo demás solo enreda más.",
            "Úsalo como criterio.",
          ],
        },
        {
          title: "Rompe la forma vieja",
          desc: [
            "La grieta es la señal para salir.",
            "Sal antes de que la forma sea una celda.",
          ],
        },
        {
          title: "Sostente en la travesía",
          desc: [
            "No corras a reconstruir.",
            "La pausa tras el derrumbe hace trabajo.",
            "Quédate en ella hasta que aparezca el próximo paso.",
          ],
        },
        {
          title: "Escucha las repeticiones",
          desc: [
            "¿La misma escena otra vez? Es diagnóstico.",
            "Resuélvela — o vuelve por tercera vez.",
          ],
        },
        {
          title: "Permite el corte",
          desc: [
            "No todo final llega cerrado.",
            "Algunos llegan claros.",
            "Suelta sin remiendos, disculpas ni escena.",
          ],
        },
        {
          title: "Llámate hacia afuera",
          desc: [
            "Tu próxima versión está esperando.",
            "El permiso no va a llegar.",
            "Ponle nombre. Actúa desde él. Vívelo.",
          ],
        },
        {
          title: "Reúnete",
          desc: [
            "Un yo partido no sostiene decisiones.",
            "Reúnete o desintégrate.",
            "No hay punto medio.",
          ],
        },
      ],
    },
    practices: {
      title: "Prácticas de atención",
      list: [
        "Observa qué situaciones se repiten — son las bifurcaciones.",
        "Pausa de cinco minutos antes de decidir.",
        "Separa señal de ruido.",
        "Di solo lo que puedas hacer.",
        "Si te perdiste — quédate quieto, no corras.",
        "Haz lo importante cuando nadie te mira.",
      ],
      cta: "Más",
    },
    lectures: {
      title: "Charlas",
      headline: "Aún no hay grabaciones.",
      sub: "Grabaré análisis del libro y del preprint. Suscríbete para recibir novedades.",
      cta: "Suscribirse",
    },
    callToClarity: {
      title: "Escribir",
      headline: "Ni comunidad, ni movimiento.\nSolo el trabajo y su prueba.",
      body:
        "El preprint está abierto. Escribe con preguntas, reseñas o críticas — todo se lee.",
      cta: "Escribir",
    },
  },
};

const dictionaries: Record<SupportedLocale, Dict> = { en, ru, pt, es };

export function getDict(locale: SupportedLocale | string): Dict {
  const key = (dictionaries[locale as SupportedLocale] ? locale : DEFAULT_LOCALE) as SupportedLocale;
  return dictionaries[key];
}

export function pickLocalized<T extends Record<string, unknown>>(
  record: T,
  locale: SupportedLocale,
  fallback: SupportedLocale = DEFAULT_LOCALE,
): string {
  const direct = record[locale];
  if (typeof direct === "string" && direct.length > 0) return direct;
  const fb = record[fallback];
  return typeof fb === "string" ? fb : "";
}
