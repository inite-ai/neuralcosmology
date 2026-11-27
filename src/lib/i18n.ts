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
    allBooks: string;
    home: string;
    endOfBook: string;
    signIn: string;
    signOut: string;
    gateLoginTitle: string;
    gateLoginBody: string;
    gateLoginCta: string;
    gatePurchaseTitle: string;
    gatePurchaseBody: string;
    gatePurchaseCta: string;
    gateHaveIt: string;
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
      ai: string;
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
    directionsSectionTitle: "Three ways in",
    directionsEyebrow: { books: "Books", science: "Science", essays: "Essays" },
    directionsTitle: {
      books: "Five books.",
      science: "The research programme.",
      essays: "Short essays.",
    },
    directionsBlurb: {
      books:
        "Two books about science, in which I build a hypothesis and then test it, two novels about the physicist Dan Reinov and his daughter, and Eternity. The opening chapters of every book are free to read.",
      science: "A preprint with its code and data, set out so that every claim can be falsified.",
      essays:
        "Essays on consciousness, cosmology and memory, each built around one question.",
    },
    exploreCta: "Explore",
  },
  books: {
    indexEyebrow: "Books",
    indexTitle: "Two books about science, two novels and Eternity.",
    indexLead:
      "In the first non-fiction book I gather published work on the brain, cosmology and biology into one hypothesis; in the second I test it and show which parts failed. In the novels the same ideas happen to people: to the physicist Dan Reinov in Bugs Academy and to his daughter in Era of Architects. Every book can be read online. The Celestial Code and Eternity open in full once you sign in or confirm your email; the others open with free chapters.",
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
    allBooks: "All books",
    home: "Home",
    endOfBook: "End of the book",
    signIn: "Sign in",
    signOut: "Sign out",
    gateLoginTitle: "The rest of the book is open to registered readers",
    gateLoginBody: "Sign in or create an account. It takes a minute, and every chapter opens right here.",
    gateLoginCta: "Sign in or register",
    gatePurchaseTitle: "This chapter is part of the full edition",
    gatePurchaseBody: "The opening chapters are free. The full book is available after purchase and stays in your library.",
    gatePurchaseCta: "Buy the book",
    gateHaveIt: "Already bought it? Sign in",
    gateBuyLibrary: "All books",
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
    predictionsHeader: "Predictions and falsifiers",
    companionHeader: "Companion volume",
    companionBody:
      "The Celestial Code, the first non-fiction book in the series, walks through the same argument in plain language, with the full chain of reasoning and the references.",
    companionCta: "Read about the book →",
    citeHeader: "Cite",
    readPdf: "Read PDF",
    codeRelease: "Code release",
    contactReview: "Contact for review",
  },
  essays: {
    eyebrow: "Essays",
    title: "Physics in plain language.",
    lead:
      "Short essays, each following one idea from physics to the end.",
    placeholderBody:
      "The first essay, A Loss Function for the Universe, is in its final edit. It looks at the shape five independent anomalies share once you line them up side by side.",
    placeholderLink1: "Pointer Architecture preprint",
    placeholderLink2: "non-fiction volume",
  },
  lecturesPage: {
    eyebrow: "Lectures",
    title: "Talks and recordings.",
    lead: "Talks and conversations by the scientists whose work the programme builds on, and my own walk-throughs once I record them.",
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
      "I am an engineer and have worked with AI for twenty years; I am also writing a PhD dissertation. The rest of my time goes into Neural Cosmology, a research programme on the nature of consciousness, and into five books on it: two non-fiction investigations, two novels and Eternity.",
      "The programme starts from the claim that consciousness is a property of certain computational architectures and needs no separate ingredient layered on top of physics. That premise yields observable predictions across physics, biology, and cosmology. The first formal piece of a larger programme is the Pointer Architecture preprint: a computational substrate with a working implementation in the Sixth language and falsifiers written down in advance.",
      "In short, I am a scientist with questions; there are enough prophets with answers already. The programme is built to be falsifiable, and the fiction does not contradict the physics. I built this site so that you can check every argument yourself.",
    ],
    agentsHeader: "Press, agents, publishers",
    agentsBody:
      "I am looking for a literary agent for the English and Brazilian Portuguese rights to the novels in the series, and for reviewers and endorsements for the preprint. Serious inquiries are welcome.",
    emailCta: "Email: info@neuralcosmology.com",
    elsewhereHeader: "Elsewhere",
  },
  footer: {
    tagline: "A research programme and books about the universe as a learning network.",
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
      press: "Literary agents and press",
      ai: "For AI agents",
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
        "The universe works as a learning network. Consciousness arises where its connections form particular configurations.",
      subheadExtra:
        "Preprints, code, essays and book materials from a programme that joins information-theoretic physics, cosmology and the foundations of mind.",
      cta: "Enter",
    },
    whatIs: {
      title: "What this is",
      lead1:
        "Neural Cosmology is an attempt to bring five anomalies of the standard picture of the world into one model.",
      lead2:
        "Galaxy rotation, the matter–antimatter asymmetry, the measurement problem, consciousness and cellular bioelectricity are studied by five different sciences, and each explains its own puzzle in its own way. The programme checks whether all five grow out of one computational structure.",
      leadMechanism:
        "If the universe does work as a learning network, all five anomalies should follow from that one structure. Consciousness then becomes a measurable quantity that depends on how connections are arranged, and the model's predictions can be tested by experiment.",
      lead3:
        "The argument runs through the books, the preprint and the essays.",
    },
    corePrinciples: {
      title: "Five facts",
      axioms: [
        "Five facts from five different journals. Together they point the same way.",
        "By several statistical measures the brain and the cosmic web are nearly indistinguishable (Vazza, Feletti, 2020).",
        "Erasing a single bit releases heat (Landauer, 1961; measured 2012). Information is physical.",
        "Cells 'know' what shape to build, and part of that knowledge lives outside the genes, in bioelectric patterns (Levin lab, Tufts).",
        "Treat the universe as a neural network, and quantum mechanics and gravity come out as its limiting cases (Vanchurin, 2020).",
        "Consciousness is a measure of integration, denoted Φ (Tononi, IIT).",
      ],
    },
    tablet: {
      title: "The Observer's Tablet",
      subtitle: "Ten rules for living inside a learning network",
      disclaimer:
        "These are short rules I draw for myself from the same model:\nif the world learns,\nwe have to learn too.",
      commandments: [
        {
          title: "Step off the beaten track",
          desc: [
            "Life only looks like a straight line: almost every day throws up a fork that is easy to rush past on autopilot.",
            "Noticing those places and choosing at them on purpose is most of the work."
          ],
        },
        {
          title: "Start from the inside",
          desc: [
            "Outward signs are worth nothing while there is discord inside.",
            "Sort yourself out first, and the rest becomes visible from there."
          ],
        },
        {
          title: "Don't dwell on the past",
          desc: [
            "The past weighs nothing by itself; what makes it heavy is a memory that replays it again and again.",
            "Once you see the pattern the loop follows, it comes undone."
          ],
        },
        {
          title: "Tell the voices apart",
          desc: [
            "The voice worth listening to is the one that leaves your head clearer.",
            "The others, however many there are and however loud, only add to the confusion."
          ],
        },
        {
          title: "Break the shell",
          desc: [
            "When your usual way of life starts to crack, it is usually time to step out of it.",
            "Better to leave before the shell turns into a cage."
          ],
        },
        {
          title: "Sit through the pause",
          desc: [
            "When something has fallen apart, don't rush to rebuild at once.",
            "The pause is work too: stay in it until you can see what the next step should be."
          ],
        },
        {
          title: "Notice what comes back",
          desc: [
            "If a situation keeps repeating, you haven't worked it through yet.",
            "It will keep coming back until you understand what it is teaching you."
          ],
        },
        {
          title: "Let the unfinished go",
          desc: [
            "Not every story ends with a full stop; sometimes it breaks off because you simply see there is no point going on.",
            "Such an ending can be accepted calmly, without long explanations or farewell scenes."
          ],
        },
        {
          title: "Don't wait for permission",
          desc: [
            "The person you could become is already in view, and waiting for someone's permission to become them is pointless: nobody will hand it out.",
            "Name who you want to be and start acting the way that person would."
          ],
        },
        {
          title: "Make yourself whole",
          desc: [
            "When the self is split, a decision doesn't last until evening, because each half pulls its own way.",
            "You have to gather yourself into one piece or fall apart, and there is rarely a third option."
          ],
        },
      ],
    },
    practices: {
      title: "Practices of attention",
      list: [
        "Watch which situations repeat: that is where forks usually hide.",
        "Before an important decision, pause for at least five minutes.",
        "Separate what really matters from what is merely loud.",
        "Promise only what you can actually do.",
        "If you are lost, stop and look around before running on.",
        "Do the important thing even when nobody is watching.",
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
      headline: "Write if this speaks to you.",
      body:
        "I read every message with ideas, criticism or reviews.",
      cta: "Write",
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        namePlaceholder: "Your name",
        emailPlaceholder: "your@email.com",
        messagePlaceholder: "What's on your mind…",
        submit: "Send",
        sending: "Sending…",
        success: "Got it. I'll reply once I've read it.",
        error: "Something went wrong. Write directly to info@neuralcosmology.com",
        directEmail: "or directly",
      },
    },
  },
};

const ru: Dict = {
  siteName: "Нейронная космология",
  meta: {
    title: "Нейронная космология - Михаил Савченко",
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
      books: "Пять книг.",
      science: "Исследовательская программа.",
      essays: "Короткие эссе.",
    },
    directionsBlurb: {
      books:
        "Две книги о науке, в которых я строю гипотезу и потом проверяю её, два романа о физике Дане Рейнове и его дочери и «Вечность». Первые главы каждой книги открыты бесплатно.",
      science:
        "Препринт, код и данные. Программа устроена так, чтобы её можно было опровергнуть.",
      essays:
        "Эссе о сознании, космологии и памяти, каждое построено вокруг одного вопроса.",
    },
    exploreCta: "Открыть",
  },
  books: {
    indexEyebrow: "Книги",
    indexTitle: "Две книги о науке, два романа и «Вечность».",
    indexLead:
      "В первой книге нон-фикшн я свожу опубликованные работы о мозге, космологии и биологии в одну гипотезу, а во второй проверяю её и показываю, какие её части проверку не прошли. В романах с теми же идеями сталкиваются люди: физик Дан Рейнов в «Академии Багов» и его дочь в «Эре Архитекторов». Все книги можно читать онлайн. «Небесный Код» и «Вечность» открываются целиком и бесплатно, если войти или подтвердить почту, у остальных открыты первые главы.",
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
    allBooks: "Все книги",
    home: "На главную",
    endOfBook: "Конец книги",
    signIn: "Войти",
    signOut: "Выйти",
    gateLoginTitle: "Дальше книга открыта для зарегистрированных читателей",
    gateLoginBody: "Войдите или заведите аккаунт. Это займёт минуту, и все главы откроются прямо здесь.",
    gateLoginCta: "Войти или зарегистрироваться",
    gatePurchaseTitle: "Эта глава входит в полную версию",
    gatePurchaseBody: "Первые главы открыты бесплатно. Полная книга доступна после покупки и остаётся в вашей библиотеке.",
    gatePurchaseCta: "Купить книгу",
    gateHaveIt: "Уже купили? Войдите",
    gateBuyLibrary: "Вся библиотека",
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
    indexEyebrow: "Исследовательская программа",
    indexTitle: "Наука, из которой выросли книги.",
    indexLead:
      "Препринты, код и данные: то, что нон-фикшн разворачивает в аргумент, а фантастика в сюжет.",
    allResearch: "← Все работы",
    cardCta: "Открыть страницу работы →",
    preprintBadge: "Препринт · v9.0",
    abstractHeader: "Аннотация",
    tldrHeader: "Коротко",
    predictionsHeader: "Предсказания и критерии опровержения",
    companionHeader: "Книга к препринту",
    companionBody:
      "Первая книга нон-фикшн из серии, «Небесный Код», излагает то же рассуждение простым языком, целиком и со ссылками.",
    companionCta: "О книге →",
    citeHeader: "Цитирование",
    readPdf: "Открыть PDF",
    codeRelease: "Код и данные",
    contactReview: "Связаться для рецензии",
  },
  essays: {
    eyebrow: "Эссе",
    title: "Физика обычным языком.",
    lead:
      "Короткие эссе: в каждом я беру одну мысль из физики и довожу её до конца.",
    placeholderBody:
      "Первое эссе, «Функция потерь для Вселенной», на финальной правке. В нём я разбираю общую форму, которая видна, если поставить рядом пять независимых аномалий.",
    placeholderLink1: "препринт Pointer Architecture",
    placeholderLink2: "нон-фикшн из серии",
  },
  lecturesPage: {
    eyebrow: "Лекции",
    title: "Записи выступлений.",
    lead: "Лекции и беседы учёных, на чьи работы опирается программа, и мои собственные разборы, когда я их запишу.",
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
      "Я инженер, двадцать лет работаю с ИИ. Параллельно пишу диссертацию. Всё остальное время уходит на «Нейронную космологию», исследовательскую программу о природе сознания, и на пять книг по этой теме: два документальных расследования, два романа и «Вечность».",
      "Программа исходит из того, что сознание - свойство определённых вычислительных архитектур и никакой отдельной сущности над физикой не требует. Отсюда следуют наблюдательные предсказания для физики, биологии и космологии. Первая формальная часть большой программы - препринт Pointer Architecture: вычислительный субстрат с работающей реализацией на языке Sixth и критериями опровержения, записанными заранее.",
      "Если коротко, я учёный с вопросами; пророков с ответами хватает и без меня. Программа с самого начала устроена так, чтобы её можно было опровергнуть, и художественная часть не противоречит физической. Сайт я сделал, чтобы вы могли проверить каждый аргумент сами.",
    ],
    agentsHeader: "Пресса, агенты, издатели",
    agentsBody:
      "Ищу литературного агента, который займётся правами на романы серии для английского и бразильского рынков, а ещё рецензентов для препринта. Серьёзным предложениям буду рад.",
    emailCta: "Почта: info@neuralcosmology.com",
    elsewhereHeader: "Где ещё",
  },
  footer: {
    tagline: "Научная программа и книги о Вселенной как обучающейся сети.",
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
      press: "Литагентам и прессе",
      ai: "ИИ-агентам",
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
        "Вселенная работает как обучающаяся сеть. Сознание возникает там, где её связи складываются в определённые конфигурации.",
      subheadExtra:
        "Препринты, код, эссе и материалы книг одной программы, которая занимается физикой, космологией и природой сознания.",
      cta: "Войти",
    },
    whatIs: {
      title: "Что это",
      lead1:
        "Нейронная космология сводит пять аномалий стандартной картины мира в единую модель.",
      lead2:
        "Вращением галактик, асимметрией материи и антиматерии, проблемой измерения, сознанием и биоэлектричеством клеток занимаются пять разных наук, и каждая объясняет свою загадку по-своему. Программа проверяет, не вырастают ли все пять из одной вычислительной структуры.",
      leadMechanism:
        "Если Вселенная действительно работает как обучающаяся сеть, все пять аномалий должны следовать из этой одной структуры. Тогда сознание становится измеримой величиной, которая зависит от того, как устроены связи, а предсказания модели можно проверить экспериментом.",
      lead3:
        "Разбор идёт в книгах, препринте и эссе.",
    },
    corePrinciples: {
      title: "Пять фактов",
      axioms: [
        "Пять фактов из разных журналов. Вместе они указывают в одну сторону.",
        "По ряду статистических показателей мозг и космическая паутина почти неотличимы (Вацца, Фелетти, 2020).",
        "Стирание одного бита информации выделяет тепло (Ландауэр, 1961; измерено в 2012-м). Информация физична.",
        "Клетки «знают», какую форму строить, и часть этого знания записана в биоэлектрических узорах, помимо генов (лаборатория Левина, Тафтс).",
        "Если считать Вселенную нейронной сетью, квантовая механика и гравитация получаются её предельными случаями (Ванчурин, 2020).",
        "Сознание - мера интегрированности системы, её обозначают Φ (Тонони, IIT).",
      ],
    },
    tablet: {
      title: "Скрижаль наблюдателя",
      subtitle: "Десять правил для того, кто живёт внутри обучающейся сети",
      disclaimer:
        "Это короткие правила, которые я вывожу для себя из той же модели:\nесли мир учится,\nучиться приходится и нам.",
      commandments: [
        {
          title: "Сойдите с накатанной",
          desc: [
            "Жизнь только кажется прямой линией: почти каждый день подбрасывает развилку, которую легко проскочить на автомате.",
            "Большая часть работы в том, чтобы замечать такие места и выбирать на них сознательно."
          ],
        },
        {
          title: "Начните изнутри",
          desc: [
            "Внешние знаки ничего не дают, пока внутри не утихнет разлад.",
            "Сначала разберитесь с собой, и остальное станет видно уже оттуда."
          ],
        },
        {
          title: "Не копайтесь в прошлом",
          desc: [
            "Прошлое само по себе ничего не весит: тяжёлым его делает память, которая снова и снова его прокручивает.",
            "Когда вы видите, по какому узору идёт этот круг, он размыкается."
          ],
        },
        {
          title: "Различайте голоса",
          desc: [
            "Слушать стоит тот голос, после которого в голове становится яснее.",
            "Остальные, сколько бы их ни было и как бы громко они ни звучали, только запутывают."
          ],
        },
        {
          title: "Ломайте скорлупу",
          desc: [
            "Если привычный уклад жизни дал трещину, обычно это значит, что из него пора выходить.",
            "Лучше выйти, пока скорлупа не превратилась в клетку."
          ],
        },
        {
          title: "Побудьте в паузе",
          desc: [
            "Когда что-то рухнуло, не спешите сразу строить заново.",
            "Пауза тоже работа: побудьте в ней, пока не станет понятно, каким будет следующий шаг."
          ],
        },
        {
          title: "Замечайте, что возвращается",
          desc: [
            "Если ситуация повторяется, значит, вы её ещё не разобрали до конца.",
            "Она будет возвращаться, пока вы не поймёте, чему она учит."
          ],
        },
        {
          title: "Отпускайте незавершённое",
          desc: [
            "Не каждая история заканчивается точкой: иногда её обрывает простое понимание, что продолжать незачем.",
            "Такой конец можно принять спокойно, обходясь без долгих объяснений и прощальных сцен."
          ],
        },
        {
          title: "Не ждите разрешения",
          desc: [
            "Человек, которым вы можете стать, уже виден, а ждать чьего-то разрешения, чтобы им стать, бесполезно: его никто не выдаст.",
            "Назовите, кем хотите быть, и начните поступать так, как поступал бы этот человек."
          ],
        },
        {
          title: "Соберите себя",
          desc: [
            "Когда «я» расколото, решение не доживает до вечера, потому что каждая половина тянет в свою сторону.",
            "Приходится собирать себя в одно целое, иначе вы рассыпаетесь, и третьего обычно не дано."
          ],
        },
      ],
    },
    practices: {
      title: "Практики внимания",
      list: [
        "Смотрите, какие ситуации повторяются: чаще всего развилки прячутся именно в них.",
        "Перед важным решением сделайте паузу хотя бы на пять минут.",
        "Отделяйте то, что действительно важно, от того, что просто громко звучит.",
        "Обещайте только то, что можете сделать.",
        "Если заблудились, остановитесь и оглядитесь, прежде чем бежать дальше.",
        "Делайте важное, даже когда никто не смотрит.",
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
      headline: "Напишите, если вам это близко.",
      body:
        "Я читаю все письма с идеями, критикой и рецензиями.",
      cta: "Написать",
      form: {
        name: "Имя",
        email: "Почта",
        message: "Сообщение",
        namePlaceholder: "Как к вам обращаться",
        emailPlaceholder: "your@email.com",
        messagePlaceholder: "Что на уме…",
        submit: "Отправить",
        sending: "Отправляю…",
        success: "Получено. Отвечу, как прочитаю.",
        error: "Что-то пошло не так. Напишите напрямую на info@neuralcosmology.com",
        directEmail: "или напрямую",
      },
    },
  },
};

const pt: Dict = {
  siteName: "Cosmologia Neural",
  meta: {
    title: "Cosmologia Neural — Mikhail Savchenko",
    description:
      "O programa Cosmologia Neural, de Mikhail Savchenko: livros, um preprint, ensaios e palestras sobre a consciência e o universo como rede em aprendizado.",
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
      books: "Cinco livros.",
      science: "O programa de pesquisa.",
      essays: "Ensaios curtos.",
    },
    directionsBlurb: {
      books:
        "Dois livros sobre ciência, em que construo uma hipótese e depois a testo, dois romances sobre o físico Dan Reinov e a filha dele, e Eternidade. Os primeiros capítulos de cada livro são gratuitos.",
      science: "Um preprint com código e dados, organizado para que cada afirmação possa ser refutada.",
      essays:
        "Ensaios sobre consciência, cosmologia e memória, cada um construído em torno de uma pergunta.",
    },
    exploreCta: "Entrar",
  },
  books: {
    indexEyebrow: "Livros",
    indexTitle: "Dois livros sobre ciência, dois romances e Eternidade.",
    indexLead:
      "No primeiro livro de não ficção, reúno trabalhos publicados sobre o cérebro, a cosmologia e a biologia numa só hipótese; no segundo, testo essa hipótese e mostro o que não resistiu. Nos romances, as mesmas ideias acontecem com pessoas: com o físico Dan Reinov em Academia dos Bugs e com a filha dele em Era dos Arquitetos. Todos os livros podem ser lidos online. O Código Celestial e Eternidade abrem por inteiro para quem entra na conta ou confirma o e-mail; os outros têm os primeiros capítulos abertos.",
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
    allBooks: "Todos os livros",
    home: "Início",
    endOfBook: "Fim do livro",
    signIn: "Entrar",
    signOut: "Sair",
    gateLoginTitle: "O restante do livro está aberto para leitores cadastrados",
    gateLoginBody: "Entre ou crie uma conta. Leva um minuto, e todos os capítulos se abrem aqui mesmo.",
    gateLoginCta: "Entrar ou cadastrar-se",
    gatePurchaseTitle: "Este capítulo faz parte da edição completa",
    gatePurchaseBody: "Os primeiros capítulos são gratuitos. O livro completo fica disponível após a compra e permanece na sua biblioteca.",
    gatePurchaseCta: "Comprar o livro",
    gateHaveIt: "Já comprou? Entre",
    gateBuyLibrary: "Toda a biblioteca",
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
    predictionsHeader: "Previsões e critérios de refutação",
    companionHeader: "Volume complementar",
    companionBody:
      "O Código Celestial, primeiro livro de não ficção da série, percorre o mesmo argumento em linguagem simples, com a cadeia completa de raciocínio e as referências.",
    companionCta: "Sobre o livro →",
    citeHeader: "Citar",
    readPdf: "Ler o PDF",
    codeRelease: "Código e dados",
    contactReview: "Contato para parecer",
  },
  essays: {
    eyebrow: "Ensaios",
    title: "Física em linguagem comum.",
    lead:
      "Ensaios curtos: em cada um, sigo uma ideia da física até o fim.",
    placeholderBody:
      "O primeiro ensaio — A Loss Function for the Universe — está na revisão final. Ele percorre a forma que aparece quando cinco anomalias independentes são colocadas lado a lado.",
    placeholderLink1: "preprint Pointer Architecture",
    placeholderLink2: "volume de não ficção",
  },
  lecturesPage: {
    eyebrow: "Palestras",
    title: "Palestras e gravações.",
    lead: "Palestras e conversas dos cientistas em cujo trabalho o programa se apoia, e minhas próprias análises, quando eu as gravar.",
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
      "Sou engenheiro, trabalho com IA há vinte anos e estou fazendo um doutorado. O resto do tempo vai para a Cosmologia Neural, um programa de pesquisa sobre a natureza da consciência, e para cinco livros em torno dele: duas investigações de não ficção, dois romances e Eternidade.",
      "O programa parte da ideia de que a consciência é uma propriedade de certas arquiteturas computacionais e dispensa qualquer ingrediente separado sobreposto à física. Dessa premissa decorrem previsões observáveis em física, biologia e cosmologia. A primeira peça formal de um programa maior é o preprint Pointer Architecture: um substrato computacional com implementação funcional na linguagem Sixth e critérios de refutação definidos de antemão.",
      "Em poucas palavras, sou um cientista com perguntas; profetas com respostas já existem de sobra. O programa foi construído para poder ser refutado, e a ficção não contradiz a física. Fiz este site para que você possa verificar cada argumento por conta própria.",
    ],
    agentsHeader: "Imprensa, agentes, editoras",
    agentsBody:
      "Busco um agente literário para os direitos em inglês e em português do Brasil dos romances da série, e também pareceristas e recomendações para o preprint. Propostas sérias são bem-vindas.",
    emailCta: "E-mail: info@neuralcosmology.com",
    elsewhereHeader: "Em outros lugares",
  },
  footer: {
    tagline: "Um programa de pesquisa e livros sobre o universo como rede em aprendizado.",
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
      ai: "Para agentes de IA",
      github: "GitHub",
    },
    copyright: "Todos os direitos reservados.",
  },
  home: {
    hero: {
      badge: "neuralcosmology.com",
      title: "Neuralcosmology",
      headline: "Cosmologia Neural",
      subhead:
        "O universo funciona como uma rede em aprendizado. A consciência surge onde suas conexões formam certas configurações.",
      subheadExtra:
        "Preprints, código, ensaios e materiais dos livros de um programa que une a física da informação, a cosmologia e os fundamentos da mente.",
      cta: "Entrar",
    },
    whatIs: {
      title: "O que é",
      lead1:
        "A Cosmologia Neural é uma tentativa de reunir cinco anomalias da imagem padrão do mundo num único modelo.",
      lead2:
        "A rotação das galáxias, a assimetria entre matéria e antimatéria, o problema da medição, a consciência e a bioeletricidade celular são estudados por cinco ciências diferentes, e cada uma explica o seu enigma à sua maneira. O programa verifica se os cinco nascem de uma mesma estrutura computacional.",
      leadMechanism:
        "Se o universo de fato funciona como uma rede em aprendizado, as cinco anomalias devem decorrer dessa mesma estrutura. A consciência vira então uma grandeza mensurável, que depende de como as conexões estão dispostas, e as previsões do modelo podem ser testadas em experimentos.",
      lead3:
        "O argumento atravessa os livros, o preprint e os ensaios.",
    },
    corePrinciples: {
      title: "Cinco fatos",
      axioms: [
        "Cinco fatos de cinco revistas diferentes. Juntos apontam para o mesmo lado.",
        "Por vários indicadores estatísticos, o cérebro e a teia cósmica são quase indistinguíveis (Vazza, Feletti, 2020).",
        "Apagar um bit libera calor (Landauer, 1961; medido em 2012). A informação é física.",
        "As células \"sabem\" que forma construir, e parte desse saber está nos padrões bioelétricos, além dos genes (laboratório de Levin, Tufts).",
        "Se o universo for tratado como uma rede neural, a mecânica quântica e a gravidade aparecem como seus casos-limite (Vanchurin, 2020).",
        "A consciência é uma medida de integração, indicada por Φ (Tononi, IIT).",
      ],
    },
    tablet: {
      title: "A Tábua do Observador",
      subtitle: "Dez regras para quem vive dentro de uma rede que aprende",
      disclaimer:
        "São regras curtas que tiro para mim do mesmo modelo:\nse o mundo aprende,\nnós também precisamos aprender.",
      commandments: [
        {
          title: "Saia do automático",
          desc: [
            "A vida só parece uma linha reta: quase todo dia aparece uma bifurcação fácil de atravessar sem perceber.",
            "Notar esses pontos e escolher neles de propósito é a maior parte do trabalho."
          ],
        },
        {
          title: "Comece por dentro",
          desc: [
            "Sinais externos não valem nada enquanto por dentro há desarmonia.",
            "Resolva-se primeiro consigo mesmo, e o resto fica visível a partir daí."
          ],
        },
        {
          title: "Não remexa o passado",
          desc: [
            "O passado não pesa nada por si; quem o torna pesado é a memória que o repete sem parar.",
            "Quando você enxerga o desenho que esse círculo segue, ele se desfaz."
          ],
        },
        {
          title: "Distinga as vozes",
          desc: [
            "Vale ouvir a voz depois da qual a cabeça fica mais clara.",
            "As outras, por mais numerosas e altas que sejam, só aumentam a confusão."
          ],
        },
        {
          title: "Quebre a casca",
          desc: [
            "Quando o seu jeito habitual de viver começa a rachar, costuma ser hora de sair dele.",
            "Melhor sair antes que a casca vire uma jaula."
          ],
        },
        {
          title: "Aguente a pausa",
          desc: [
            "Quando algo desmorona, não corra para reconstruir na mesma hora.",
            "A pausa também é trabalho: fique nela até ver qual deve ser o próximo passo."
          ],
        },
        {
          title: "Repare no que volta",
          desc: [
            "Se uma situação se repete, é porque você ainda não a resolveu até o fim.",
            "Ela vai continuar voltando até você entender o que ela ensina."
          ],
        },
        {
          title: "Deixe ir o inacabado",
          desc: [
            "Nem toda história termina com ponto final; às vezes ela se interrompe porque você simplesmente percebe que não há por que continuar.",
            "Um fim assim pode ser aceito com calma, sem longas explicações nem cenas de despedida."
          ],
        },
        {
          title: "Não espere permissão",
          desc: [
            "A pessoa que você pode vir a ser já está à vista, e esperar a permissão de alguém para virar essa pessoa é inútil: ninguém vai concedê-la.",
            "Diga quem você quer ser e comece a agir como essa pessoa agiria."
          ],
        },
        {
          title: "Junte seus pedaços",
          desc: [
            "Quando o eu está partido, uma decisão não dura até a noite, porque cada metade puxa para um lado.",
            "É preciso juntar as partes num todo só, ou você se desfaz, e raramente existe uma terceira saída."
          ],
        },
      ],
    },
    practices: {
      title: "Práticas de atenção",
      list: [
        "Repare nas situações que se repetem: é nelas que as bifurcações costumam se esconder.",
        "Antes de uma decisão importante, faça uma pausa de pelo menos cinco minutos.",
        "Separe o que de fato importa do que só faz barulho.",
        "Prometa apenas o que você consegue fazer.",
        "Se você se perdeu, pare e olhe em volta antes de continuar correndo.",
        "Faça o que é importante mesmo quando ninguém está olhando.",
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
      headline: "Escreva se isso faz sentido para você.",
      body:
        "Leio todas as mensagens com ideias, críticas e resenhas.",
      cta: "Escrever",
      form: {
        name: "Nome",
        email: "E-mail",
        message: "Mensagem",
        namePlaceholder: "Seu nome",
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
  siteName: "Cosmología Neural",
  meta: {
    title: "Cosmología Neural — Mikhail Savchenko",
    description:
      "El programa Cosmología Neural de Mikhail Savchenko: libros, un preprint, ensayos y charlas sobre la consciencia y el universo como red que aprende.",
    ogLocale: "es_ES",
  },
  nav: {
    home: "Inicio",
    books: "Libros",
    science: "Ciencia",
    essays: "Ensayos",
    lectures: "Charlas",
    about: "El autor",
    contact: "Contacto",
  },
  hero: {
    directionsSectionTitle: "Tres puertas",
    directionsEyebrow: { books: "Libros", science: "Ciencia", essays: "Ensayos" },
    directionsTitle: {
      books: "Cinco libros.",
      science: "El programa de investigación.",
      essays: "Ensayos breves.",
    },
    directionsBlurb: {
      books:
        "Dos libros sobre ciencia, en los que construyo una hipótesis y luego la pongo a prueba, dos novelas sobre el físico Dan Reinov y su hija, y Eternidad. Los primeros capítulos de cada libro son gratis.",
      science: "Un preprint con código y datos, organizado para que cada afirmación pueda refutarse.",
      essays: "Ensayos sobre la consciencia, la cosmología y la memoria, cada uno construido en torno a una pregunta.",
    },
    exploreCta: "Entrar",
  },
  books: {
    indexEyebrow: "Libros",
    indexTitle: "Dos libros sobre ciencia, dos novelas y Eternidad.",
    indexLead:
      "En el primer libro de no ficción reúno trabajos publicados sobre el cerebro, la cosmología y la biología en una sola hipótesis; en el segundo la pongo a prueba y muestro lo que no resistió. En las novelas, esas mismas ideas les pasan a personas: al físico Dan Reinov en Academia de los Bugs y a su hija en Era de los Arquitectos. Todos los libros se pueden leer en línea. El Código Celestial y Eternidad se abren enteros si inicias sesión o confirmas tu correo; los demás tienen abiertos los primeros capítulos.",
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
    allBooks: "Todos los libros",
    home: "Inicio",
    endOfBook: "Fin del libro",
    signIn: "Iniciar sesión",
    signOut: "Cerrar sesión",
    gateLoginTitle: "El resto del libro está abierto para lectores registrados",
    gateLoginBody: "Inicia sesión o crea una cuenta. Lleva un minuto, y todos los capítulos se abren aquí mismo.",
    gateLoginCta: "Iniciar sesión o registrarse",
    gatePurchaseTitle: "Este capítulo forma parte de la edición completa",
    gatePurchaseBody: "Los primeros capítulos son gratuitos. El libro completo está disponible tras la compra y queda en tu biblioteca.",
    gatePurchaseCta: "Comprar el libro",
    gateHaveIt: "¿Ya lo compraste? Inicia sesión",
    gateBuyLibrary: "Toda la biblioteca",
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
      "El Código Celestial, el primer libro de no ficción de la serie, recorre el mismo argumento en lenguaje llano, con la cadena completa de razonamiento y las referencias.",
    companionCta: "Sobre el libro →",
    citeHeader: "Citar",
    readPdf: "Leer el PDF",
    codeRelease: "Código y datos",
    contactReview: "Contacto para revisión",
  },
  essays: {
    eyebrow: "Ensayos",
    title: "Física en lenguaje llano.",
    lead:
      "Ensayos breves: en cada uno sigo una idea de la física hasta el final.",
    placeholderBody:
      "El primer ensayo — A Loss Function for the Universe — está en revisión final. Recorre la forma que aparece cuando cinco anomalías independientes se ponen una al lado de otra.",
    placeholderLink1: "preprint Pointer Architecture",
    placeholderLink2: "volumen de no ficción",
  },
  lecturesPage: {
    eyebrow: "Charlas",
    title: "Charlas y grabaciones.",
    lead: "Charlas y conversaciones de los científicos en cuyo trabajo se apoya el programa, y mis propios análisis, cuando los grabe.",
    placeholderBody:
      "Aún no hay grabaciones en línea. En preparación: un análisis del preprint Pointer Architecture y una lectura del volumen de no ficción. Vuelve más tarde o suscríbete para novedades.",
    watchCta: "Ver",
    durationSuffix: "min",
    backToIndex: "Todas las charlas",
    transcript: "Transcripción",
  },
  about: {
    eyebrow: "El autor",
    title: "Mikhail Savchenko",
    bio: [
      "Soy ingeniero, trabajo con IA desde hace veinte años y estoy haciendo un doctorado. El resto del tiempo se lo dedico a la Cosmología Neural, un programa de investigación sobre la naturaleza de la consciencia, y a cinco libros en torno a él: dos investigaciones de no ficción, dos novelas y Eternidad.",
      "El programa parte de la idea de que la consciencia es una propiedad de ciertas arquitecturas computacionales y no necesita ningún ingrediente aparte superpuesto a la física. De esa premisa se siguen predicciones observables en física, biología y cosmología. La primera pieza formal de un programa más amplio es el preprint Pointer Architecture: un sustrato computacional con implementación funcional en el lenguaje Sixth y falsadores escritos de antemano.",
      "En pocas palabras, soy un científico con preguntas; profetas con respuestas ya hay de sobra. El programa está construido para poder refutarse, y la ficción no contradice la física. Hice este sitio para que puedas comprobar cada argumento por tu cuenta.",
    ],
    agentsHeader: "Prensa, agentes, editoriales",
    agentsBody:
      "Busco un agente literario para los derechos en inglés y en portugués de Brasil de las novelas de la serie, y también revisores y avales para el preprint. Las consultas serias son bienvenidas.",
    emailCta: "Correo: info@neuralcosmology.com",
    elsewhereHeader: "En otros lugares",
  },
  footer: {
    tagline: "Un programa de investigación y libros sobre el universo como red que aprende.",
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
      ai: "Para agentes de IA",
      github: "GitHub",
    },
    copyright: "Todos los derechos reservados.",
  },
  home: {
    hero: {
      badge: "neuralcosmology.com",
      title: "Neuralcosmology",
      headline: "Cosmología Neural",
      subhead:
        "El universo funciona como una red que aprende. La consciencia surge donde sus conexiones forman ciertas configuraciones.",
      subheadExtra:
        "Preprints, código, ensayos y materiales de los libros de un programa que une la física de la información, la cosmología y los fundamentos de la mente.",
      cta: "Entrar",
    },
    whatIs: {
      title: "Qué es",
      lead1:
        "La Cosmología Neural es un intento de reunir cinco anomalías de la imagen estándar del mundo en un solo modelo.",
      lead2:
        "De la rotación de las galaxias, la asimetría entre materia y antimateria, el problema de la medición, la consciencia y la bioelectricidad celular se ocupan cinco ciencias distintas, y cada una explica su enigma a su manera. El programa comprueba si los cinco nacen de una misma estructura computacional.",
      leadMechanism:
        "Si el universo de verdad funciona como una red que aprende, las cinco anomalías deberían derivarse de esa misma estructura. La consciencia pasa entonces a ser una magnitud medible, que depende de cómo están dispuestas las conexiones, y las predicciones del modelo pueden comprobarse con experimentos.",
      lead3:
        "El argumento recorre los libros, el preprint y los ensayos.",
    },
    corePrinciples: {
      title: "Cinco hechos",
      axioms: [
        "Cinco hechos de cinco revistas distintas. Juntos apuntan en la misma dirección.",
        "Según varios indicadores estadísticos, el cerebro y la red cósmica son casi indistinguibles (Vazza, Feletti, 2020).",
        "Borrar un bit libera calor (Landauer, 1961; medido en 2012). La información es física.",
        "Las células \"saben\" qué forma construir, y parte de ese saber está en los patrones bioeléctricos, además de en los genes (laboratorio de Levin, Tufts).",
        "Si se trata el universo como una red neuronal, la mecánica cuántica y la gravedad aparecen como sus casos límite (Vanchurin, 2020).",
        "La consciencia es una medida de integración, que se denota Φ (Tononi, IIT).",
      ],
    },
    tablet: {
      title: "La Tabla del Observador",
      subtitle: "Diez reglas para quien vive dentro de una red que aprende",
      disclaimer:
        "Son reglas breves que saco para mí del mismo modelo:\nsi el mundo aprende,\nnos toca aprender también.",
      commandments: [
        {
          title: "Sal del piloto automático",
          desc: [
            "La vida solo parece una línea recta: casi cada día aparece una bifurcación que es fácil cruzar sin darse cuenta.",
            "Fijarse en esos puntos y elegir en ellos a conciencia es la mayor parte del trabajo."
          ],
        },
        {
          title: "Empieza por dentro",
          desc: [
            "Las señales de fuera no sirven de nada mientras por dentro haya discordia.",
            "Primero ponte en paz contigo, y desde ahí se verá el resto."
          ],
        },
        {
          title: "No escarbes en el pasado",
          desc: [
            "El pasado no pesa nada por sí mismo; lo que lo vuelve pesado es una memoria que lo repite una y otra vez.",
            "Cuando ves el dibujo que sigue ese círculo, el círculo se abre."
          ],
        },
        {
          title: "Distingue las voces",
          desc: [
            "Vale la pena escuchar la voz que te deja la cabeza más clara.",
            "Las demás, por muchas que sean y por alto que suenen, solo aumentan la confusión."
          ],
        },
        {
          title: "Rompe la cáscara",
          desc: [
            "Cuando tu forma habitual de vivir empieza a agrietarse, suele ser hora de salir de ella.",
            "Mejor salir antes de que la cáscara se convierta en jaula."
          ],
        },
        {
          title: "Sostén la pausa",
          desc: [
            "Cuando algo se ha derrumbado, no corras a reconstruirlo enseguida.",
            "La pausa también es trabajo: quédate en ella hasta ver cuál debe ser el siguiente paso."
          ],
        },
        {
          title: "Fíjate en lo que vuelve",
          desc: [
            "Si una situación se repite, es que todavía no la has resuelto del todo.",
            "Seguirá volviendo hasta que entiendas qué te está enseñando."
          ],
        },
        {
          title: "Suelta lo inconcluso",
          desc: [
            "No toda historia termina con punto final; a veces se interrumpe porque simplemente ves que no tiene sentido seguir.",
            "Un final así puede aceptarse con calma, sin largas explicaciones ni escenas de despedida."
          ],
        },
        {
          title: "No esperes permiso",
          desc: [
            "La persona que puedes llegar a ser ya se ve, y esperar el permiso de alguien para convertirte en ella es inútil: nadie te lo va a dar.",
            "Di quién quieres ser y empieza a actuar como actuaría esa persona."
          ],
        },
        {
          title: "Vuelve a ser uno",
          desc: [
            "Cuando el yo está partido, una decisión no llega viva a la noche, porque cada mitad tira hacia su lado.",
            "Tienes que juntar tus partes en una sola pieza o te deshaces, y casi nunca hay una tercera opción."
          ],
        },
      ],
    },
    practices: {
      title: "Prácticas de atención",
      list: [
        "Fíjate en qué situaciones se repiten: suele ser ahí donde se esconden las bifurcaciones.",
        "Antes de una decisión importante, haz una pausa de al menos cinco minutos.",
        "Separa lo que de verdad importa de lo que solo hace ruido.",
        "Promete solo lo que puedas cumplir.",
        "Si te has perdido, detente y mira alrededor antes de seguir corriendo.",
        "Haz lo importante también cuando nadie te mira.",
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
      title: "Contacto",
      headline: "Escríbeme si esto te dice algo.",
      body:
        "Leo todos los mensajes con ideas, críticas y reseñas.",
      cta: "Escribir",
      form: {
        name: "Nombre",
        email: "Correo",
        message: "Mensaje",
        namePlaceholder: "Tu nombre",
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
