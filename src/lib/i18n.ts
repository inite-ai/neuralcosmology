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
    emailCta: "Email — mf@mikefluff.com",
    elsewhereHeader: "Elsewhere",
  },
  footer: {
    tagline:
      "Public HQ for the Neural Cosmology programme — three books, one preprint, a growing body of essays. Scientist with questions, not prophet with answers.",
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
    copyright: "Presence is enough.",
  },
  home: {
    hero: {
      badge: "neuralcosmology.com",
      title: "Neuralcosmology",
      headline: "The universe is a neural network. Not as metaphor.",
      subhead:
        "Five anomalies — from galaxy rotation to cellular bioelectricity — line up into one picture. Neural Cosmology is the frame in which they can be gathered and tested.",
      subheadExtra: "Every claim here comes with a falsifier.",
      cta: "Enter",
    },
    whatIs: {
      title: "What this is",
      lead1:
        "Neural Cosmology is an attempt to gather five anomalies of the standard picture of the world into one frame.",
      lead2:
        "Galaxy rotation. Matter–antimatter asymmetry. The measurement problem. Consciousness. Cellular bioelectricity. Five mysteries apart. One picture together.",
      lead3:
        "In the books — the argument in full. In the preprint — numbers and falsifiers. In the essays — individual sections.",
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
          title: "Do not create a Line",
          desc: [
            "Linear life is fiction.",
            "Every moment is a fork.",
            "Choose through awareness — not inertia.",
          ],
        },
        {
          title: "Honor the Portal within",
          desc: [
            "No outer sign matters if your inner state is off.",
            "Your resonance is the gateway.",
            "You are the threshold.",
          ],
        },
        {
          title: "Cleanse Memory of Noise",
          desc: [
            "You don't carry the past.",
            "You loop it.",
            "Until you extract the pattern and cut the echo.",
          ],
        },
        {
          title: "Discern the Guides",
          desc: [
            "Not all who shine, lead.",
            "True guides activate your clarity.",
            "False ones amplify your confusion.",
          ],
        },
        {
          title: "Break the Shell",
          desc: [
            "When it cracks — it's not failure.",
            "It's the signal.",
            "Step out before your identity becomes your tomb.",
          ],
        },
        {
          title: "Hold through the Transition",
          desc: [
            "Don't rush to reconstruct.",
            "The silence after destruction is sacred.",
            "Sit in it until you hear the next signal.",
          ],
        },
        {
          title: "Listen to the Repeats",
          desc: [
            "The same situation again?",
            "That's not punishment.",
            "That's precision.",
            "Resolve it — or relive it.",
          ],
        },
        {
          title: "Permit the Cut",
          desc: [
            "Not all endings come with closure.",
            "Some come with clarity.",
            "Let go.",
            "Without fixing, apologizing, or performing.",
          ],
        },
        {
          title: "Call yourself forth",
          desc: [
            "Your next version is waiting for your signal.",
            "Don't wait for permission.",
            "Name it.",
            "Act from it.",
            "Live into it.",
          ],
        },
        {
          title: "Gather yourself — or be shattered by your own frequency",
          desc: [
            "A fractured self cannot hold a coherent field.",
            "Unify.",
            "Or disintegrate.",
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
        "If this matters — read the preprint, write with questions and reviews.\nI reply myself.",
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
    emailCta: "Email — mf@mikefluff.com",
    elsewhereHeader: "По соседству",
  },
  footer: {
    tagline:
      "Открытый дом программы «Нейронная космология»: три книги, препринт, собрание эссе. Учёный с вопросами, не пророк с ответами.",
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
    copyright: "Присутствия достаточно.",
  },
  home: {
    hero: {
      badge: "neuralcosmology.com",
      title: "Neuralcosmology",
      headline: "Вселенная — нейросеть. Не как метафора.",
      subhead:
        "Пять аномалий — от вращения галактик до биоэлектричества клеток — складываются в одну картину. Нейронная космология — рамка, в которой их можно собрать и проверить.",
      subheadExtra:
        "У каждого тезиса здесь — критерий опровержения.",
      cta: "Войти",
    },
    whatIs: {
      title: "Что это",
      lead1:
        "Нейронная космология — попытка собрать пять аномалий стандартной картины мира в одну рамку.",
      lead2:
        "Вращение галактик. Асимметрия материи. Проблема измерения. Сознание. Биоэлектричество клеток. По отдельности — пять загадок. Вместе — одна картина.",
      lead3:
        "В книгах — аргумент целиком. В препринте — числа и критерии опровержения. В эссе — отдельные срезы.",
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
        "Не программа.\nГолос из романов серии — ориентиры изнутри сюжета.",
      commandments: [
        {
          title: "Не вытягивай свою жизнь в линию",
          desc: [
            "Линейная жизнь — выдумка.",
            "Каждый миг — развилка.",
            "Выбирай в сознании, а не по инерции.",
          ],
        },
        {
          title: "Чти порог внутри",
          desc: [
            "Внешние знаки ничего не стоят, если внутри разлад.",
            "Врата — ты сам.",
            "Порог — тоже ты.",
          ],
        },
        {
          title: "Очисти память от шума",
          desc: [
            "Ты не несёшь прошлое.",
            "Ты его прокручиваешь.",
            "Пока не увидишь узор и не оборвёшь эхо.",
          ],
        },
        {
          title: "Различай проводников",
          desc: [
            "Не все, кто светит, ведут.",
            "Настоящие — возвращают тебе ясность.",
            "Ложные — сеют растерянность.",
          ],
        },
        {
          title: "Ломай скорлупу",
          desc: [
            "Она треснула — это знак, а не поражение.",
            "Выйди сам, пока форма не стала гробницей.",
          ],
        },
        {
          title: "Держись в переходе",
          desc: [
            "Не торопись перестраивать.",
            "Тишина после разрушения священна.",
            "Сиди в ней, пока не услышишь следующий знак.",
          ],
        },
        {
          title: "Слушай повторы",
          desc: [
            "Та же ситуация снова?",
            "Не наказание — точность.",
            "Разреши её — или проживи заново.",
          ],
        },
        {
          title: "Позволь разрез",
          desc: [
            "Не всякий конец приходит завершённым.",
            "Иной приходит с ясностью.",
            "Отпусти.",
            "Без починок, извинений и сцен.",
          ],
        },
        {
          title: "Вызови себя вперёд",
          desc: [
            "Следующий ты ждёт знака.",
            "Не жди разрешения.",
            "Назови его.",
            "Действуй из него.",
            "Живи им.",
          ],
        },
        {
          title: "Собери себя — или разлетишься от собственной частоты",
          desc: [
            "Расколотое «я» не удержит цельного поля.",
            "Собери.",
            "Или распадись.",
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
        "Если важно — читай препринт, пиши с вопросами и рецензиями.\nОтвечаю сам.",
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
    emailCta: "Email — mf@mikefluff.com",
    elsewhereHeader: "Em outro lugar",
  },
  footer: {
    tagline:
      "Casa aberta do programa Neural Cosmology: três livros, um preprint, um conjunto crescente de ensaios. Cientista com perguntas, não profeta com respostas.",
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
    copyright: "A presença basta.",
  },
  home: {
    hero: {
      badge: "neuralcosmology.com",
      title: "Neuralcosmology",
      headline: "O universo é uma rede neural. Não como metáfora.",
      subhead:
        "Cinco anomalias — da rotação galáctica à bioeletricidade celular — se alinham numa única imagem. Neural Cosmology é a moldura em que elas se juntam e se põem à prova.",
      subheadExtra: "Cada tese aqui vem com um falsificador.",
      cta: "Entrar",
    },
    whatIs: {
      title: "O que é",
      lead1:
        "Neural Cosmology é a tentativa de reunir cinco anomalias da imagem padrão do mundo numa única moldura.",
      lead2:
        "Rotação galáctica. Assimetria matéria–antimatéria. Problema da medição. Consciência. Bioeletricidade celular. Separados, cinco enigmas. Juntos, uma imagem.",
      lead3:
        "Nos livros — o argumento inteiro. No preprint — números e falsificadores. Nos ensaios — recortes.",
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
          title: "Não estique a sua vida em linha",
          desc: [
            "A vida linear é ficção.",
            "Cada momento é uma bifurcação.",
            "Escolha com consciência, não por inércia.",
          ],
        },
        {
          title: "Honre o Limiar dentro de você",
          desc: [
            "Nenhum sinal lá fora importa, se dentro está desafinado.",
            "Sua ressonância é o portal.",
            "Você é o limiar.",
          ],
        },
        {
          title: "Limpe a memória do ruído",
          desc: [
            "Você não carrega o passado.",
            "Você o repete em loop.",
            "Até enxergar o desenho e cortar o eco.",
          ],
        },
        {
          title: "Saiba distinguir os guias",
          desc: [
            "Nem todo que brilha guia.",
            "Os verdadeiros devolvem sua clareza.",
            "Os falsos espalham confusão.",
          ],
        },
        {
          title: "Rompa a casca",
          desc: [
            "Ela rachou — é sinal, não é fracasso.",
            "Saia antes que a forma vire seu túmulo.",
          ],
        },
        {
          title: "Segure-se na travessia",
          desc: [
            "Não corra para reconstruir.",
            "O silêncio depois do desmoronamento é sagrado.",
            "Fique nele até ouvir o próximo sinal.",
          ],
        },
        {
          title: "Escute as repetições",
          desc: [
            "A mesma cena de novo?",
            "Não é castigo. É precisão.",
            "Resolva — ou viva outra vez.",
          ],
        },
        {
          title: "Permita o corte",
          desc: [
            "Nem todo fim vem fechado.",
            "Alguns vêm claros.",
            "Solte.",
            "Sem remendos, desculpas nem cena.",
          ],
        },
        {
          title: "Chame a si mesmo para fora",
          desc: [
            "O seu próximo você aguarda um sinal.",
            "Não espere permissão.",
            "Dê-lhe um nome.",
            "Aja a partir dele.",
            "Viva-o.",
          ],
        },
        {
          title: "Reúna-se — ou se despedaçará pela própria frequência",
          desc: [
            "Um eu partido não sustenta um campo inteiro.",
            "Reúna.",
            "Ou desfaça.",
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
        "Se isto importa — leia o preprint, escreva com perguntas e resenhas.\nRespondo pessoalmente.",
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
    emailCta: "Email — mf@mikefluff.com",
    elsewhereHeader: "En otros sitios",
  },
  footer: {
    tagline:
      "Casa abierta del programa Neural Cosmology: tres libros, un preprint, un conjunto creciente de ensayos. Científico con preguntas, no profeta con respuestas.",
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
    copyright: "La presencia basta.",
  },
  home: {
    hero: {
      badge: "neuralcosmology.com",
      title: "Neuralcosmology",
      headline: "El universo es una red neuronal. No como metáfora.",
      subhead:
        "Cinco anomalías — de la rotación galáctica a la bioelectricidad celular — encajan en una sola imagen. Neural Cosmology es el marco en el que se reúnen y se ponen a prueba.",
      subheadExtra: "Cada tesis aquí viene con un falsador.",
      cta: "Entrar",
    },
    whatIs: {
      title: "Qué es",
      lead1:
        "Neural Cosmology es el intento de reunir cinco anomalías de la imagen estándar del mundo en un solo marco.",
      lead2:
        "Rotación galáctica. Asimetría materia–antimateria. Problema de la medición. Consciencia. Bioelectricidad celular. Por separado, cinco enigmas. Juntos, una imagen.",
      lead3:
        "En los libros — el argumento entero. En el preprint — cifras y falsadores. En los ensayos — fragmentos.",
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
            "Elige con consciencia, no por inercia.",
          ],
        },
        {
          title: "Honra el Umbral dentro de ti",
          desc: [
            "Ninguna señal de fuera importa si por dentro hay desafinación.",
            "Tu resonancia es la puerta.",
            "Tú mismo eres el umbral.",
          ],
        },
        {
          title: "Limpia la memoria del ruido",
          desc: [
            "No cargas el pasado.",
            "Lo repites en bucle.",
            "Hasta que ves el dibujo y cortas el eco.",
          ],
        },
        {
          title: "Distingue a los guías",
          desc: [
            "No todo el que brilla guía.",
            "Los verdaderos te devuelven la claridad.",
            "Los falsos reparten confusión.",
          ],
        },
        {
          title: "Rompe la cáscara",
          desc: [
            "Se agrieta — es señal, no es derrota.",
            "Sal antes de que la forma sea tu tumba.",
          ],
        },
        {
          title: "Sostente en la travesía",
          desc: [
            "No corras a reconstruir.",
            "El silencio tras el derrumbe es sagrado.",
            "Quédate en él hasta oír la próxima señal.",
          ],
        },
        {
          title: "Escucha las repeticiones",
          desc: [
            "¿La misma escena otra vez?",
            "No es castigo. Es precisión.",
            "Resuélvela — o vuelve a vivirla.",
          ],
        },
        {
          title: "Permite el corte",
          desc: [
            "No todo final llega cerrado.",
            "Algunos llegan claros.",
            "Suelta.",
            "Sin remiendos, disculpas ni escena.",
          ],
        },
        {
          title: "Llámate hacia afuera",
          desc: [
            "Tu próximo tú espera una señal.",
            "No esperes permiso.",
            "Ponle nombre.",
            "Actúa desde él.",
            "Vívelo.",
          ],
        },
        {
          title: "Reúnete — o te romperás por tu propia frecuencia",
          desc: [
            "Un yo partido no sostiene un campo entero.",
            "Reúne.",
            "O desintégrate.",
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
        "Si esto importa — lee el preprint, escribe con preguntas y reseñas.\nRespondo personalmente.",
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
