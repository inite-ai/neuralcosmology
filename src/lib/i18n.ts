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
    lectures: string;
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
  reader: {
    back: string;
    download: string;
    openInNewTab: string;
    shownIn: string;
  };
  library: {
    readOnline: string;
    continueReading: string;
    startReading: string;
    contents: string;
    free: string;
    afterSignIn: string;
    afterPurchase: string;
    statusRead: string;
    statusReading: string;
    minutes: string;
    chapter: string;
    prev: string;
    next: string;
    backToBook: string;
    endOfBook: string;
    signIn: string;
    signOut: string;
    gateLoginTitle: string;
    gateLoginBody: string;
    gateLoginCta: string;
    gatePurchaseTitle: string;
    gatePurchaseBody: string;
    gatePurchaseCta: string;
    gateBuyLibrary: string;
    textSize: string;
    theme: string;
    themeDark: string;
    themeLight: string;
    themeSepia: string;
    updated: string;
    version: string;
    inLibrary: string;
    openContents: string;
    closeContents: string;
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
  lecturesPage: {
    eyebrow: string;
    title: string;
    lead: string;
    placeholderBody: string;
    watchCta: string;
    durationSuffix: string;
    backToIndex: string;
    transcript: string;
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
      seeAll: string;
    };
    callToClarity: {
      title: string;
      headline: string;
      body: string;
      cta: string;
      form: {
        name: string;
        email: string;
        message: string;
        namePlaceholder: string;
        emailPlaceholder: string;
        messagePlaceholder: string;
        submit: string;
        sending: string;
        success: string;
        error: string;
        directEmail: string;
      };
    };
  };
};

const en: Dict = {
  siteName: "Neural Cosmology",
  meta: {
    title: "Neural Cosmology — Mikhail Savchenko",
    description:
      "Mikhail Savchenko's Neural Cosmology programme: books, a preprint, essays and lectures on consciousness and the universe as a learning network.",
    ogLocale: "en_US",
  },
  nav: {
    home: "Home",
    books: "Books",
    science: "Science",
    essays: "Essays",
    lectures: "Lectures",
    about: "About",
    contact: "Contact",
  },
  hero: {
    directionsSectionTitle: "Three directions",
    directionsEyebrow: { books: "Books", science: "Science", essays: "Essays" },
    directionsTitle: {
      books: "Four books, one universe.",
      science: "The research programme.",
      essays: "Long-form writing.",
    },
    directionsBlurb: {
      books:
        "Two non-fiction volumes, a science-fiction novel and its literary sequel: the same questions asked in two voices.",
      science: "A preprint, code and data, built so that they can be proven wrong.",
      essays:
        "Where physics meets prose: one idea, argued to the end.",
    },
    exploreCta: "Explore",
  },
  books: {
    indexEyebrow: "The series",
    indexTitle: "Four books, one universe, two lines.",
    indexLead:
      "A non-fiction investigation and its sequel, where the author puts his own hypothesis to the test; a science-fiction novel about the implications, and a literary sequel that follows the characters once the anomalies go quiet. Same questions, asked with evidence and with story.",
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
  reader: {
    back: "Back",
    download: "Download PDF",
    openInNewTab: "Open in new tab",
    shownIn: "shown in",
  },
  library: {
    readOnline: "Read online",
    continueReading: "Continue reading",
    startReading: "Start reading",
    contents: "Contents",
    free: "Free",
    afterSignIn: "After sign-in",
    afterPurchase: "After purchase",
    statusRead: "Read",
    statusReading: "Reading",
    minutes: "min",
    chapter: "Chapter",
    prev: "Previous",
    next: "Next",
    backToBook: "About the book",
    endOfBook: "End of the book",
    signIn: "Sign in",
    signOut: "Sign out",
    gateLoginTitle: "The rest of the book is open to registered readers",
    gateLoginBody: "Sign in or create an account. It takes a minute, and every chapter opens right here.",
    gateLoginCta: "Sign in or register",
    gatePurchaseTitle: "This chapter is part of the full edition",
    gatePurchaseBody: "The opening chapters are free. The full book is available after purchase and stays in your library.",
    gatePurchaseCta: "Buy the book",
    gateBuyLibrary: "All four books",
    textSize: "Text size",
    theme: "Theme",
    themeDark: "Dark",
    themeLight: "Light",
    themeSepia: "Sepia",
    updated: "Updated",
    version: "version",
    inLibrary: "Online library",
    openContents: "Open contents",
    closeContents: "Close contents",
  },
  science: {
    indexEyebrow: "Research programme",
    indexTitle: "The science behind the books.",
    indexLead:
      "Preprints, code and data: the research the non-fiction turns into an argument and the fiction turns into a story.",
    allResearch: "← All research",
    cardCta: "Open the paper's page →",
    preprintBadge: "Preprint · v9.0",
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
      "Short pieces where physics meets plain language, one idea per essay, followed to the end.",
    placeholderBody:
      "The first essay — A Loss Function for the Universe — is in final edit. It walks through the shape that shows up when five independent anomalies are lined up side by side.",
    placeholderLink1: "Pointer Architecture preprint",
    placeholderLink2: "non-fiction volume",
  },
  lecturesPage: {
    eyebrow: "Lectures",
    title: "Talks and recordings.",
    lead: "Talks and conversations by the scientists the programme builds on, and my own walk-throughs as they get recorded.",
    placeholderBody:
      "No recordings are online yet. Upcoming: a walk-through of the Pointer Architecture preprint and a reading session around the non-fiction volume. Check back or subscribe for updates.",
    watchCta: "Watch",
    durationSuffix: "min",
    backToIndex: "All lectures",
    transcript: "Transcript",
  },
  about: {
    eyebrow: "About",
    title: "Mikhail Savchenko",
    bio: [
      "Twenty years of AI engineering, with a PhD currently in progress. The rest of my time goes into Neural Cosmology — a research programme on the nature of consciousness, and a four-book series around it: two nonfiction investigations and two novels.",
      "The programme starts from the claim that consciousness is a property of certain computational architectures and needs no separate ingredient layered on top of physics. That premise yields observable predictions across physics, biology, and cosmology. The first formal piece is the Pointer Architecture preprint: a computational substrate with a working implementation in the Sixth language and falsifiers written down in advance. It is the first part of a larger programme.",
      "In short, I am a scientist with questions; there are enough prophets with answers already. The programme is built to be falsifiable, and the fiction does not contradict the physics. The whole site is an invitation to check the arguments for yourself.",
    ],
    agentsHeader: "Press, agents, publishers",
    agentsBody:
      "I am looking for a literary agent for EN and PT-BR rights on the fiction titles in the series, and for reviewers and endorsements on the preprint. Serious inquiries are welcome.",
    emailCta: "Email — info@neuralcosmology.com",
    elsewhereHeader: "Elsewhere",
  },
  footer: {
    tagline: "The universe as a learning network — in science and in fiction.",
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
        "Preprints, code, essays and book materials from a programme that joins information-theoretic physics, cosmology and the foundations of mind.",
      cta: "Enter",
    },
    whatIs: {
      title: "What this is",
      lead1:
        "Neural Cosmology is an attempt to bring five anomalies of the standard picture of the world into one model.",
      lead2:
        "Galaxy rotation, the matter–antimatter asymmetry, the measurement problem, consciousness, cellular bioelectricity: apart, five mysteries; together, one picture.",
      leadMechanism:
        "If the universe works as a learning network, the five anomalies turn out to be expressions of one computational structure, from the cosmic web to cellular bioelectricity. Consciousness then becomes a measurable quantity that depends on how connections are arranged, and the model's predictions can be tested by experiment.",
      lead3:
        "The argument runs through the books, the preprint and the essays.",
    },
    corePrinciples: {
      title: "Five anomalies",
      axioms: [
        "Five facts from five different journals. Together they point the same way.",
        "By several statistical measures the brain and the cosmic web are nearly indistinguishable (Vazza, Feletti, 2020).",
        "Erasing a single bit releases heat (Landauer, 1961; measured 2012). Information is physical.",
        "Cells 'know' what shape to build, and that knowledge lives in bioelectric patterns as well as in genes (Levin lab, Tufts).",
        "The universe as a neural network: quantum mechanics and gravity emerge as its limits (Vanchurin, 2020).",
        "Consciousness is a measure of integration, denoted Φ (Tononi, IIT).",
      ],
    },
    tablet: {
      title: "The Neuralcosmologist's Tablet",
      subtitle: "10 Commandments for Navigating a Living Reality",
      disclaimer:
        "There is no doctrine here.\nOnly what remains\nwhen the illusions are gone.",
      commandments: [
        {
          title: "Don't flatten life into a line",
          desc: [
            "Linearity is an illusion.",
            "Every instant is a fork.",
            "Choose deliberately.",
          ],
        },
        {
          title: "Start from the inside",
          desc: [
            "Outer signs are hollow when the inside doesn't agree.",
            "Turn to yourself first.",
            "Everything else reads from there.",
          ],
        },
        {
          title: "Clear the memory of noise",
          desc: [
            "The past has no weight of its own.",
            "The mind is what carries it.",
            "Find the pattern — the loop comes undone.",
          ],
        },
        {
          title: "Tell the voices apart",
          desc: [
            "The real one gives clarity back.",
            "The others only thicken the confusion.",
            "That is the measure.",
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
            "The pause after collapse is itself the work.",
            "Stay in it until the next step surfaces.",
          ],
        },
        {
          title: "Listen to repeats",
          desc: [
            "If it returns, it hasn't been worked out.",
            "It keeps returning until you do.",
          ],
        },
        {
          title: "Let the unfinished go",
          desc: [
            "Not every ending arrives finished.",
            "Sometimes it arrives only with clarity.",
            "Without explanations, without apologies, without scenes.",
          ],
        },
        {
          title: "Call yourself forward",
          desc: [
            "Your next version is waiting.",
            "Permission is not coming.",
            "Name it. Act from it. Live it.",
          ],
        },
        {
          title: "Gather yourself",
          desc: [
            "A fractured self will not hold a decision.",
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
        "If you are lost, stop.",
        "Do the important thing when no one's watching.",
      ],
      cta: "More",
    },
    lectures: {
      title: "Lectures",
      headline: "No recordings yet.",
      sub: "Walk-throughs of the book and the preprint are on the way. Subscribe for updates.",
      cta: "Subscribe",
      seeAll: "All lectures →",
    },
    callToClarity: {
      title: "Get in touch",
      headline: "Working on something close?",
      body:
        "Write and let's get acquainted. Ideas, criticism, reviews: I read everything.",
      cta: "Write",
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        namePlaceholder: "How should I address you",
        emailPlaceholder: "your@email.com",
        messagePlaceholder: "What's on your mind…",
        submit: "Send",
        sending: "Sending…",
        success: "Received. I'll reply once I read it.",
        error: "Something went wrong. Write directly to info@neuralcosmology.com",
        directEmail: "or directly",
      },
    },
  },
};

const ru: Dict = {
  siteName: "Нейронная космология",
  meta: {
    title: "Нейронная космология — Михаил Савченко",
    description:
      "Исследовательская программа Михаила Савченко «Нейронная космология»: книги, препринт, эссе и лекции о сознании и Вселенной как обучающейся сети.",
    ogLocale: "ru_RU",
  },
  nav: {
    home: "Главная",
    books: "Книги",
    science: "Наука",
    essays: "Эссе",
    lectures: "Лекции",
    about: "Об авторе",
    contact: "Контакты",
  },
  hero: {
    directionsSectionTitle: "Три двери",
    directionsEyebrow: { books: "Книги", science: "Наука", essays: "Эссе" },
    directionsTitle: {
      books: "Четыре книги, одна вселенная.",
      science: "Исследовательская программа.",
      essays: "Длинная проза.",
    },
    directionsBlurb: {
      books:
        "Две книги нон-фикшн, фантастический роман и его литературное продолжение: одни и те же вопросы, заданные двумя голосами.",
      science:
        "Препринт, код и данные. Программа устроена так, чтобы её можно было опровергнуть.",
      essays:
        "Там, где физика встречается с прозой: одна мысль, доведённая до конца.",
    },
    exploreCta: "Открыть",
  },
  books: {
    indexEyebrow: "Серия",
    indexTitle: "Четыре книги — одна вселенная, две линии.",
    indexLead:
      "Нон-фикшн и его продолжение, где автор проверяет собственную гипотезу; фантастический роман на том же материале и продолжение романа. Две линии, одна гипотеза.",
    readMore: "Подробнее →",
    allBooks: "← Все книги",
    rightsInquiry: "Издателям: права на книгу",
    comparableHeader: "По соседству на полке",
    russianTitle: "Русское название",
    genre: {
      nonFiction: "Нон-фикшн",
      sciFi: "Научная фантастика",
      literarySciFi: "Литературная НФ",
    },
  },
  reader: {
    back: "Назад",
    download: "Скачать PDF",
    openInNewTab: "Открыть в новой вкладке",
    shownIn: "показано на",
  },
  library: {
    readOnline: "Читать онлайн",
    continueReading: "Продолжить чтение",
    startReading: "Начать читать",
    contents: "Оглавление",
    free: "Бесплатно",
    afterSignIn: "После входа",
    afterPurchase: "После покупки",
    statusRead: "Прочитано",
    statusReading: "Читаю",
    minutes: "мин",
    chapter: "Глава",
    prev: "Назад",
    next: "Дальше",
    backToBook: "О книге",
    endOfBook: "Конец книги",
    signIn: "Войти",
    signOut: "Выйти",
    gateLoginTitle: "Дальше книга открыта для зарегистрированных читателей",
    gateLoginBody: "Войдите или заведите аккаунт. Это займёт минуту, и все главы откроются прямо здесь.",
    gateLoginCta: "Войти или зарегистрироваться",
    gatePurchaseTitle: "Эта глава входит в полную версию",
    gatePurchaseBody: "Первые главы открыты бесплатно. Полная книга доступна после покупки и остаётся в вашей библиотеке.",
    gatePurchaseCta: "Купить книгу",
    gateBuyLibrary: "Все четыре книги",
    textSize: "Размер текста",
    theme: "Тема",
    themeDark: "Тёмная",
    themeLight: "Светлая",
    themeSepia: "Сепия",
    updated: "Обновлено",
    version: "версия",
    inLibrary: "Онлайн-библиотека",
    openContents: "Открыть оглавление",
    closeContents: "Закрыть оглавление",
  },
  science: {
    indexEyebrow: "Программа исследования",
    indexTitle: "Наука, на которой стоят книги.",
    indexLead:
      "Препринты, код и данные: то, что нон-фикшн разворачивает в аргумент, а фантастика — в сюжет.",
    allResearch: "← Все работы",
    cardCta: "Открыть страницу работы →",
    preprintBadge: "Препринт · v9.0",
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
      "Короткие разборы на стыке физики и обычного языка: одна мысль на текст, доведённая до конца.",
    placeholderBody:
      "Первое эссе, «Функция потерь для Вселенной», на финальной правке. Оно проходит по форме, которая проступает, когда ставишь пять независимых аномалий рядом.",
    placeholderLink1: "препринт Pointer Architecture",
    placeholderLink2: "нон-фикшн из серии",
  },
  lecturesPage: {
    eyebrow: "Лекции",
    title: "Записи выступлений.",
    lead: "Лекции и беседы учёных, на чьих работах стоит программа, и мои собственные разборы по мере записи.",
    placeholderBody:
      "Пока записей нет. В планах разбор препринта Pointer Architecture и чтение глав из нон-фикшна. Заходите позже или подпишитесь на обновления.",
    watchCta: "Смотреть",
    durationSuffix: "мин",
    backToIndex: "Все лекции",
    transcript: "Транскрипт",
  },
  about: {
    eyebrow: "Об авторе",
    title: "Михаил Савченко",
    bio: [
      "Я инженер, двадцать лет работаю с ИИ. Параллельно пишу диссертацию. Всё остальное время уходит на «Нейронную космологию» — исследовательскую программу о природе сознания и четыре книги по этой теме: два документальных расследования и два романа.",
      "Программа исходит из того, что сознание — свойство определённых вычислительных архитектур и никакой отдельной сущности над физикой не требует. Отсюда следуют наблюдательные предсказания на стыке физики, биологии и космологии. Первая формальная часть — препринт Pointer Architecture: вычислительный субстрат с работающей реализацией на языке Sixth и заранее записанными фальсификаторами. Это лишь первая часть большой программы.",
      "Если коротко, я учёный с вопросами; пророков с ответами хватает и без меня. Программа с самого начала устроена так, чтобы её можно было опровергнуть, и художественная часть не противоречит физической. Весь сайт — приглашение проверить аргументы своими руками.",
    ],
    agentsHeader: "Пресса, агенты, издатели",
    agentsBody:
      "Ищу литературного агента на англоязычные и бразильские права на художественные книги серии, а также рецензентов и отзывы на препринт. Серьёзным предложениям буду рад.",
    emailCta: "Email — info@neuralcosmology.com",
    elsewhereHeader: "Где ещё",
  },
  footer: {
    tagline: "Вселенная как обучающаяся сеть — в науке и в прозе.",
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
        "Препринты, код, эссе и материалы книг: исследование на стыке физики, космологии и природы сознания.",
      cta: "Войти",
    },
    whatIs: {
      title: "Что это",
      lead1:
        "Нейронная космология сводит пять аномалий стандартной картины мира в единую модель.",
      lead2:
        "Вращение галактик, асимметрия материи и антиматерии, проблема измерения, сознание, биоэлектричество клеток: по отдельности это пять загадок, вместе — одна картина.",
      leadMechanism:
        "Если Вселенная работает как обучающаяся сеть, пять аномалий оказываются проявлениями одной вычислительной структуры, от космической паутины до биоэлектричества клеток. Сознание в этой картине — измеримая величина, которая зависит от того, как устроены связи, а предсказания модели можно проверить экспериментом.",
      lead3:
        "Разбор идёт в книгах, препринте и эссе.",
    },
    corePrinciples: {
      title: "Пять аномалий",
      axioms: [
        "Пять фактов из разных журналов. Вместе они указывают в одну сторону.",
        "По ряду статистических показателей мозг и космическая паутина почти неотличимы (Вацца, Фелетти, 2020).",
        "Стирание одного бита информации выделяет тепло (Ландауэр, 1961; измерено в 2012-м). Информация физична.",
        "Клетки «знают», какую форму строить, и часть этого знания записана в биоэлектрических узорах, помимо генов (лаборатория Левина, Тафтс).",
        "Вселенная как нейронная сеть: квантовая механика и гравитация получаются её пределами (Ванчурин, 2020).",
        "Сознание — мера интегрированности системы, обозначается Φ (Тонони, IIT).",
      ],
    },
    tablet: {
      title: "Скрижаль нейрокосмолога",
      subtitle: "Десять заповедей для живой реальности",
      disclaimer:
        "Доктрины здесь нет.\nЕсть то, что остаётся,\nкогда уходят иллюзии.",
      commandments: [
        {
          title: "Не живи по накатанной",
          desc: [
            "Линейность — иллюзия.",
            "Каждый миг — развилка.",
            "Выбирай осознанно.",
          ],
        },
        {
          title: "Начинай изнутри",
          desc: [
            "Внешние знаки пусты, если внутри разлад.",
            "Обратись сначала к себе.",
            "Остальное видно уже оттуда.",
          ],
        },
        {
          title: "Не копайся в прошлом",
          desc: [
            "Само по себе прошлое — мертво.",
            "Его держит ум.",
            "Увидь узор — и петля разомкнётся.",
          ],
        },
        {
          title: "Различай голоса",
          desc: [
            "Настоящий возвращает ясность.",
            "Остальные только путают.",
            "Это и есть мера.",
          ],
        },
        {
          title: "Ломай скорлупу",
          desc: [
            "Трещина — сигнал к выходу.",
            "Выходи, пока скорлупа не стала клеткой.",
          ],
        },
        {
          title: "Выдержи паузу",
          desc: [
            "Не спеши перестраивать.",
            "Пауза после разрушения — тоже работа.",
            "Побудь в ней, пока не проступит следующий шаг.",
          ],
        },
        {
          title: "Замечай, что возвращается",
          desc: [
            "Повторяется — значит, ещё не доведено до конца.",
            "Возвращается, пока ты не разберёшься.",
          ],
        },
        {
          title: "Отпускай незавершённое",
          desc: [
            "Не всякий конец — завершён.",
            "Иногда он приходит только с ясностью.",
            "Без объяснений, без извинений, без сцен.",
          ],
        },
        {
          title: "Опереди себя",
          desc: [
            "Тот, кем ты можешь стать, — уже зовёт.",
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
        "Заблудился — остановись.",
        "Делай важное, когда никто не смотрит.",
      ],
      cta: "Подробнее",
    },
    lectures: {
      title: "Лекции",
      headline: "Пока записей нет.",
      sub: "Разборы книги и препринта скоро появятся. Подписывайтесь на обновления.",
      cta: "Подписаться",
      seeAll: "Все лекции →",
    },
    callToClarity: {
      title: "Связаться",
      headline: "Работаете над чем-то близким?",
      body:
        "Напишите, познакомимся. Идеи, критику, рецензии я читаю все.",
      cta: "Написать",
      form: {
        name: "Имя",
        email: "Email",
        message: "Сообщение",
        namePlaceholder: "Как к вам обращаться",
        emailPlaceholder: "your@email.com",
        messagePlaceholder: "Что на уме…",
        submit: "Отправить",
        sending: "Отправляем…",
        success: "Получено. Отвечу, как прочитаю.",
        error: "Что-то пошло не так. Напишите напрямую на info@neuralcosmology.com",
        directEmail: "или напрямую",
      },
    },
  },
};

const pt: Dict = {
  siteName: "Neural Cosmology",
  meta: {
    title: "Neural Cosmology — Mikhail Savchenko",
    description:
      "O programa Neural Cosmology, de Mikhail Savchenko: livros, um preprint, ensaios e palestras sobre a consciência e o universo como rede em aprendizado.",
    ogLocale: "pt_BR",
  },
  nav: {
    home: "Início",
    books: "Livros",
    science: "Ciência",
    essays: "Ensaios",
    lectures: "Palestras",
    about: "Sobre",
    contact: "Contato",
  },
  hero: {
    directionsSectionTitle: "Três portas",
    directionsEyebrow: { books: "Livros", science: "Ciência", essays: "Ensaios" },
    directionsTitle: {
      books: "Quatro livros, um universo.",
      science: "O programa de pesquisa.",
      essays: "Prosa longa.",
    },
    directionsBlurb: {
      books:
        "Dois livros de não ficção, um romance de ficção científica e sua continuação literária: as mesmas perguntas em duas vozes.",
      science: "Um preprint, código e dados, feitos para poderem ser refutados.",
      essays:
        "Onde a física encontra a prosa: uma ideia levada até o fim.",
    },
    exploreCta: "Entrar",
  },
  books: {
    indexEyebrow: "A série",
    indexTitle: "Quatro livros, um universo, duas linhas.",
    indexLead:
      "Uma investigação de não ficção e sua continuação, em que o autor submete a própria hipótese ao teste; um romance de ficção científica sobre suas consequências e uma continuação literária que acompanha os personagens depois que as anomalias silenciam. As mesmas perguntas, com provas e com enredo.",
    readMore: "Ler mais →",
    allBooks: "← Todos os livros",
    rightsInquiry: "Para editoras: direitos",
    comparableHeader: "Vizinhança na estante",
    russianTitle: "Título em russo",
    genre: {
      nonFiction: "Não ficção",
      sciFi: "Ficção científica",
      literarySciFi: "FC literária",
    },
  },
  reader: {
    back: "Voltar",
    download: "Baixar PDF",
    openInNewTab: "Abrir em nova aba",
    shownIn: "exibido em",
  },
  library: {
    readOnline: "Ler online",
    continueReading: "Continuar lendo",
    startReading: "Começar a ler",
    contents: "Sumário",
    free: "Grátis",
    afterSignIn: "Após entrar",
    afterPurchase: "Após a compra",
    statusRead: "Lido",
    statusReading: "Lendo",
    minutes: "min",
    chapter: "Capítulo",
    prev: "Anterior",
    next: "Próximo",
    backToBook: "Sobre o livro",
    endOfBook: "Fim do livro",
    signIn: "Entrar",
    signOut: "Sair",
    gateLoginTitle: "O restante do livro está aberto para leitores cadastrados",
    gateLoginBody: "Entre ou crie uma conta. Leva um minuto, e todos os capítulos se abrem aqui mesmo.",
    gateLoginCta: "Entrar ou cadastrar-se",
    gatePurchaseTitle: "Este capítulo faz parte da edição completa",
    gatePurchaseBody: "Os primeiros capítulos são gratuitos. O livro completo fica disponível após a compra e permanece na sua biblioteca.",
    gatePurchaseCta: "Comprar o livro",
    gateBuyLibrary: "Os quatro livros",
    textSize: "Tamanho do texto",
    theme: "Tema",
    themeDark: "Escuro",
    themeLight: "Claro",
    themeSepia: "Sépia",
    updated: "Atualizado",
    version: "versão",
    inLibrary: "Biblioteca online",
    openContents: "Abrir sumário",
    closeContents: "Fechar sumário",
  },
  science: {
    indexEyebrow: "Programa de pesquisa",
    indexTitle: "A ciência por trás dos livros.",
    indexLead:
      "Preprints, código e dados: o que a não ficção transforma em argumento e a ficção transforma em enredo.",
    allResearch: "← Toda a pesquisa",
    cardCta: "Abrir a página do trabalho →",
    preprintBadge: "Preprint · v9.0",
    abstractHeader: "Resumo",
    tldrHeader: "Em resumo",
    predictionsHeader: "Previsões e falsificadores",
    companionHeader: "Volume complementar",
    companionBody:
      "O livro de não ficção da série percorre o argumento em linguagem simples, com a cadeia completa de raciocínio e as referências.",
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
      "Textos breves em que a física encontra a linguagem comum: uma ideia por ensaio, levada até o fim.",
    placeholderBody:
      "O primeiro ensaio — A Loss Function for the Universe — está na revisão final. Ele percorre a forma que aparece quando cinco anomalias independentes são colocadas lado a lado.",
    placeholderLink1: "preprint Pointer Architecture",
    placeholderLink2: "volume de não ficção",
  },
  lecturesPage: {
    eyebrow: "Palestras",
    title: "Gravações e falas.",
    lead: "Palestras e conversas dos cientistas em cujo trabalho o programa se apoia, e minhas próprias análises à medida que forem gravadas.",
    placeholderBody:
      "Ainda não há gravações online. Em preparação: uma análise do preprint Pointer Architecture e uma leitura do volume de não ficção. Volte depois ou assine para receber atualizações.",
    watchCta: "Assistir",
    durationSuffix: "min",
    backToIndex: "Todas as palestras",
    transcript: "Transcrição",
  },
  about: {
    eyebrow: "Sobre",
    title: "Mikhail Savchenko",
    bio: [
      "Vinte anos de engenharia de IA, com um doutorado em andamento. O resto do tempo vai para a Neural Cosmology, um programa de pesquisa sobre a natureza da consciência, e para uma série de quatro livros em torno dele: duas investigações de não ficção e dois romances.",
      "O programa parte da ideia de que a consciência é uma propriedade de certas arquiteturas computacionais e dispensa qualquer ingrediente separado sobreposto à física. Dessa premissa decorrem previsões observáveis em física, biologia e cosmologia. A primeira peça formal é o preprint Pointer Architecture: um substrato computacional com implementação funcional na linguagem Sixth e falsificadores escritos de antemão. É a primeira parte de um programa maior.",
      "Em poucas palavras, sou um cientista com perguntas; profetas com respostas já existem de sobra. O programa foi construído para poder ser refutado, e a ficção não contradiz a física. O site inteiro é um convite a verificar os argumentos por conta própria.",
    ],
    agentsHeader: "Imprensa, agentes, editoras",
    agentsBody:
      "Busco um agente literário para direitos em EN e PT-BR dos títulos de ficção da série, além de revisores e endossos para o preprint. Propostas sérias são bem-vindas.",
    emailCta: "Email — info@neuralcosmology.com",
    elsewhereHeader: "Em outros lugares",
  },
  footer: {
    tagline: "O universo como uma rede em aprendizado — na ciência e na ficção.",
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
        "Preprints, código, ensaios e materiais dos livros de um programa que une a física da informação, a cosmologia e os fundamentos da mente.",
      cta: "Entrar",
    },
    whatIs: {
      title: "O que é",
      lead1:
        "A Neural Cosmology é uma tentativa de reunir cinco anomalias da imagem padrão do mundo num único modelo.",
      lead2:
        "Rotação das galáxias, assimetria entre matéria e antimatéria, problema da medição, consciência, bioeletricidade celular: separados, são cinco enigmas; juntos, uma só imagem.",
      leadMechanism:
        "Se o universo funciona como uma rede em aprendizado, as cinco anomalias passam a ser manifestações de uma única estrutura computacional, da teia cósmica à bioeletricidade celular. A consciência vira então uma grandeza mensurável, que depende de como as conexões estão dispostas, e as previsões do modelo podem ser testadas em experimentos.",
      lead3:
        "O argumento atravessa os livros, o preprint e os ensaios.",
    },
    corePrinciples: {
      title: "Cinco anomalias",
      axioms: [
        "Cinco fatos de cinco revistas diferentes. Juntos apontam para o mesmo lado.",
        "Por vários indicadores estatísticos, o cérebro e a teia cósmica são quase indistinguíveis (Vazza, Feletti, 2020).",
        "Apagar um bit libera calor (Landauer, 1961; medido em 2012). A informação é física.",
        "As células \"sabem\" que forma construir, e parte desse saber está nos padrões bioelétricos, além dos genes (laboratório de Levin, Tufts).",
        "O universo como rede neural: a mecânica quântica e a gravidade surgem como seus limites (Vanchurin, 2020).",
        "A consciência como medida de integração, indicada por Φ (Tononi, IIT).",
      ],
    },
    tablet: {
      title: "A Tábua do Neuralcosmologista",
      subtitle: "Dez mandamentos para uma realidade viva",
      disclaimer:
        "Aqui não há doutrina.\nHá o que resta\nquando as ilusões se vão.",
      commandments: [
        {
          title: "Não viva no automático",
          desc: [
            "Linearidade é ilusão.",
            "Cada instante é uma bifurcação.",
            "Escolha com lucidez.",
          ],
        },
        {
          title: "Comece por dentro",
          desc: [
            "Sinais externos são ocos quando por dentro não bate.",
            "Volte-se primeiro a si mesmo.",
            "O resto se lê a partir dele.",
          ],
        },
        {
          title: "Limpe a memória do ruído",
          desc: [
            "O passado não pesa por si.",
            "É a mente que o carrega.",
            "Veja o padrão — o laço se desmancha.",
          ],
        },
        {
          title: "Distinga as vozes",
          desc: [
            "A verdadeira devolve clareza.",
            "As outras só adensam a confusão.",
            "Essa é a medida.",
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
          title: "Aguente a pausa",
          desc: [
            "Não corra para reconstruir.",
            "A pausa depois do desmoronamento também é trabalho.",
            "Permaneça nela até que o próximo passo apareça.",
          ],
        },
        {
          title: "Escute as repetições",
          desc: [
            "Se volta, é porque não foi resolvido.",
            "Volta até você resolver.",
          ],
        },
        {
          title: "Deixe ir o inacabado",
          desc: [
            "Nem todo fim chega concluído.",
            "Às vezes chega apenas com clareza.",
            "Sem explicações, sem desculpas, sem cena.",
          ],
        },
        {
          title: "Adiante-se a si mesmo",
          desc: [
            "Sua próxima versão está esperando.",
            "Permissão não vai chegar.",
            "Dê-lhe nome. Aja a partir dela. Viva-a.",
          ],
        },
        {
          title: "Reúna-se",
          desc: [
            "Um eu partido não sustenta uma decisão.",
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
        "Se se perdeu, pare.",
        "Faça o importante quando ninguém está olhando.",
      ],
      cta: "Mais",
    },
    lectures: {
      title: "Palestras",
      headline: "Ainda não há gravações.",
      sub: "As análises do livro e do preprint estão a caminho. Assine para receber as novidades.",
      cta: "Assinar",
      seeAll: "Todas as palestras →",
    },
    callToClarity: {
      title: "Entrar em contato",
      headline: "Trabalha em algo próximo?",
      body:
        "Escreva e vamos nos conhecer. Ideias, críticas, resenhas: eu leio tudo.",
      cta: "Escrever",
      form: {
        name: "Nome",
        email: "Email",
        message: "Mensagem",
        namePlaceholder: "Como devo chamar você",
        emailPlaceholder: "seu@email.com",
        messagePlaceholder: "O que está pensando…",
        submit: "Enviar",
        sending: "Enviando…",
        success: "Recebido. Respondo assim que ler.",
        error: "Algo deu errado. Escreva direto para info@neuralcosmology.com",
        directEmail: "ou direto",
      },
    },
  },
};

const es: Dict = {
  siteName: "Neural Cosmology",
  meta: {
    title: "Neural Cosmology — Mikhail Savchenko",
    description:
      "El programa Neural Cosmology de Mikhail Savchenko: libros, un preprint, ensayos y charlas sobre la consciencia y el universo como red que aprende.",
    ogLocale: "es_ES",
  },
  nav: {
    home: "Inicio",
    books: "Libros",
    science: "Ciencia",
    essays: "Ensayos",
    lectures: "Charlas",
    about: "Sobre",
    contact: "Contacto",
  },
  hero: {
    directionsSectionTitle: "Tres puertas",
    directionsEyebrow: { books: "Libros", science: "Ciencia", essays: "Ensayos" },
    directionsTitle: {
      books: "Cuatro libros, un universo.",
      science: "El programa de investigación.",
      essays: "Prosa larga.",
    },
    directionsBlurb: {
      books:
        "Dos libros de no ficción, una novela de ciencia ficción y su continuación literaria: las mismas preguntas en dos voces.",
      science: "Un preprint, código y datos, hechos para poder refutarse.",
      essays: "Donde la física se cruza con la prosa: una idea llevada hasta el final.",
    },
    exploreCta: "Entrar",
  },
  books: {
    indexEyebrow: "La serie",
    indexTitle: "Cuatro libros, un universo, dos líneas.",
    indexLead:
      "Una investigación de no ficción y su continuación, en la que el autor somete su propia hipótesis a prueba; una novela de ciencia ficción sobre sus implicaciones y una continuación literaria que acompaña a los personajes cuando las anomalías callan. Las mismas preguntas, con pruebas y con trama.",
    readMore: "Leer más →",
    allBooks: "← Todos los libros",
    rightsInquiry: "Para editoriales: derechos",
    comparableHeader: "Vecinos de estantería",
    russianTitle: "Título en ruso",
    genre: {
      nonFiction: "No ficción",
      sciFi: "Ciencia ficción",
      literarySciFi: "CF literaria",
    },
  },
  reader: {
    back: "Atrás",
    download: "Descargar PDF",
    openInNewTab: "Abrir en nueva pestaña",
    shownIn: "mostrado en",
  },
  library: {
    readOnline: "Leer en línea",
    continueReading: "Seguir leyendo",
    startReading: "Empezar a leer",
    contents: "Índice",
    free: "Gratis",
    afterSignIn: "Tras iniciar sesión",
    afterPurchase: "Tras la compra",
    statusRead: "Leído",
    statusReading: "Leyendo",
    minutes: "min",
    chapter: "Capítulo",
    prev: "Anterior",
    next: "Siguiente",
    backToBook: "Sobre el libro",
    endOfBook: "Fin del libro",
    signIn: "Iniciar sesión",
    signOut: "Cerrar sesión",
    gateLoginTitle: "El resto del libro está abierto para lectores registrados",
    gateLoginBody: "Inicia sesión o crea una cuenta. Lleva un minuto, y todos los capítulos se abren aquí mismo.",
    gateLoginCta: "Iniciar sesión o registrarse",
    gatePurchaseTitle: "Este capítulo forma parte de la edición completa",
    gatePurchaseBody: "Los primeros capítulos son gratuitos. El libro completo está disponible tras la compra y queda en tu biblioteca.",
    gatePurchaseCta: "Comprar el libro",
    gateBuyLibrary: "Los cuatro libros",
    textSize: "Tamaño del texto",
    theme: "Tema",
    themeDark: "Oscuro",
    themeLight: "Claro",
    themeSepia: "Sepia",
    updated: "Actualizado",
    version: "versión",
    inLibrary: "Biblioteca en línea",
    openContents: "Abrir índice",
    closeContents: "Cerrar índice",
  },
  science: {
    indexEyebrow: "Programa de investigación",
    indexTitle: "La ciencia detrás de los libros.",
    indexLead:
      "Preprints, código y datos: lo que la no ficción convierte en argumento y la ficción convierte en trama.",
    allResearch: "← Toda la investigación",
    cardCta: "Abrir la página del trabajo →",
    preprintBadge: "Preprint · v9.0",
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
      "Textos breves donde la física se cruza con el lenguaje común: una idea por ensayo, llevada hasta el final.",
    placeholderBody:
      "El primer ensayo — A Loss Function for the Universe — está en revisión final. Recorre la forma que aparece cuando cinco anomalías independientes se ponen una al lado de otra.",
    placeholderLink1: "preprint Pointer Architecture",
    placeholderLink2: "volumen de no ficción",
  },
  lecturesPage: {
    eyebrow: "Charlas",
    title: "Grabaciones e intervenciones.",
    lead: "Charlas y conversaciones de los científicos en cuyo trabajo se apoya el programa, y mis propios análisis a medida que se graben.",
    placeholderBody:
      "Aún no hay grabaciones en línea. En preparación: un análisis del preprint Pointer Architecture y una lectura del volumen de no ficción. Vuelve más tarde o suscríbete para novedades.",
    watchCta: "Ver",
    durationSuffix: "min",
    backToIndex: "Todas las charlas",
    transcript: "Transcripción",
  },
  about: {
    eyebrow: "Sobre",
    title: "Mikhail Savchenko",
    bio: [
      "Veinte años de ingeniería de IA, con un doctorado en curso. El resto del tiempo se lo dedico a Neural Cosmology, un programa de investigación sobre la naturaleza de la consciencia, y a una serie de cuatro libros en torno a él: dos investigaciones de no ficción y dos novelas.",
      "El programa parte de la idea de que la consciencia es una propiedad de ciertas arquitecturas computacionales y no necesita ningún ingrediente aparte superpuesto a la física. De esa premisa se siguen predicciones observables en física, biología y cosmología. La primera pieza formal es el preprint Pointer Architecture: un sustrato computacional con implementación funcional en el lenguaje Sixth y falsadores escritos de antemano. Es la primera parte de un programa más amplio.",
      "En pocas palabras, soy un científico con preguntas; profetas con respuestas ya hay de sobra. El programa está construido para poder refutarse, y la ficción no contradice la física. Todo el sitio es una invitación a comprobar los argumentos por uno mismo.",
    ],
    agentsHeader: "Prensa, agentes, editoriales",
    agentsBody:
      "Busco un agente literario para derechos en EN y PT-BR sobre los títulos de ficción de la serie, así como revisores y respaldos para el preprint. Las consultas serias son bienvenidas.",
    emailCta: "Email — info@neuralcosmology.com",
    elsewhereHeader: "En otros lugares",
  },
  footer: {
    tagline: "El universo como una red que aprende — en ciencia y en ficción.",
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
        "Preprints, código, ensayos y materiales de los libros de un programa que une la física de la información, la cosmología y los fundamentos de la mente.",
      cta: "Entrar",
    },
    whatIs: {
      title: "Qué es",
      lead1:
        "Neural Cosmology es un intento de reunir cinco anomalías de la imagen estándar del mundo en un solo modelo.",
      lead2:
        "La rotación de las galaxias, la asimetría entre materia y antimateria, el problema de la medición, la consciencia, la bioelectricidad celular: por separado son cinco enigmas; juntos, una sola imagen.",
      leadMechanism:
        "Si el universo funciona como una red que aprende, las cinco anomalías resultan ser manifestaciones de una sola estructura computacional, desde la red cósmica hasta la bioelectricidad celular. La consciencia pasa a ser una magnitud medible, que depende de cómo están dispuestas las conexiones, y las predicciones del modelo pueden comprobarse con experimentos.",
      lead3:
        "El argumento recorre los libros, el preprint y los ensayos.",
    },
    corePrinciples: {
      title: "Cinco anomalías",
      axioms: [
        "Cinco hechos de cinco revistas distintas. Juntos apuntan en la misma dirección.",
        "Según varios indicadores estadísticos, el cerebro y la red cósmica son casi indistinguibles (Vazza, Feletti, 2020).",
        "Borrar un bit libera calor (Landauer, 1961; medido en 2012). La información es física.",
        "Las células \"saben\" qué forma construir, y parte de ese saber está en los patrones bioeléctricos, además de en los genes (laboratorio de Levin, Tufts).",
        "El universo como red neuronal: la mecánica cuántica y la gravedad surgen como sus límites (Vanchurin, 2020).",
        "La consciencia como medida de integración, que se denota Φ (Tononi, IIT).",
      ],
    },
    tablet: {
      title: "La Tabla del Neuralcosmólogo",
      subtitle: "Diez mandamientos para una realidad viva",
      disclaimer:
        "Aquí no hay doctrina.\nHay lo que queda\ncuando se van las ilusiones.",
      commandments: [
        {
          title: "No vivas en piloto automático",
          desc: [
            "La linealidad es ilusión.",
            "Cada instante es una bifurcación.",
            "Elige con lucidez.",
          ],
        },
        {
          title: "Empieza por dentro",
          desc: [
            "Las señales de fuera son huecas cuando por dentro no cuadra.",
            "Vuélvete primero hacia ti.",
            "El resto se lee desde ahí.",
          ],
        },
        {
          title: "Limpia la memoria del ruido",
          desc: [
            "El pasado no pesa por sí mismo.",
            "Es la mente la que lo carga.",
            "Ve el patrón — el lazo se deshace.",
          ],
        },
        {
          title: "Distingue las voces",
          desc: [
            "La verdadera devuelve claridad.",
            "Las otras solo espesan la confusión.",
            "Esa es la medida.",
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
          title: "Sostén la pausa",
          desc: [
            "No corras a reconstruir.",
            "La pausa tras el derrumbe también es trabajo.",
            "Quédate en ella hasta que aparezca el siguiente paso.",
          ],
        },
        {
          title: "Escucha las repeticiones",
          desc: [
            "Si vuelve, no ha sido resuelto.",
            "Vuelve hasta que lo resuelvas.",
          ],
        },
        {
          title: "Suelta lo inconcluso",
          desc: [
            "No todo final llega concluido.",
            "A veces llega solo con claridad.",
            "Sin explicaciones, sin disculpas, sin escena.",
          ],
        },
        {
          title: "Adelántate a ti mismo",
          desc: [
            "Tu próxima versión está esperando.",
            "El permiso no va a llegar.",
            "Ponle nombre. Actúa desde ella. Vívela.",
          ],
        },
        {
          title: "Reúnete",
          desc: [
            "Un yo partido no sostiene una decisión.",
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
        "Si te has perdido, detente.",
        "Haz lo importante cuando nadie te mira.",
      ],
      cta: "Más",
    },
    lectures: {
      title: "Charlas",
      headline: "Aún no hay grabaciones.",
      sub: "Los análisis del libro y del preprint están en camino. Suscríbete para recibir novedades.",
      cta: "Suscribirse",
      seeAll: "Todas las charlas →",
    },
    callToClarity: {
      title: "Escribir",
      headline: "¿Trabajas en algo cercano?",
      body:
        "Escríbeme y nos conocemos. Ideas, críticas, reseñas: lo leo todo.",
      cta: "Escribir",
      form: {
        name: "Nombre",
        email: "Email",
        message: "Mensaje",
        namePlaceholder: "Cómo llamarte",
        emailPlaceholder: "tu@email.com",
        messagePlaceholder: "Qué tienes en mente…",
        submit: "Enviar",
        sending: "Enviando…",
        success: "Recibido. Respondo cuando lo lea.",
        error: "Algo salió mal. Escribe directamente a info@neuralcosmology.com",
        directEmail: "o directamente",
      },
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
