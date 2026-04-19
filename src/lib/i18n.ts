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
};

const ru: Dict = {
  siteName: "Нейронная космология",
  meta: {
    title: "Нейронная космология — Михаил Савченко",
    description:
      "Публичный штаб проекта «Нейронная космология»: три книги, препринт, эссе. Учёный с вопросами, а не пророк с ответами.",
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
    directionsEyebrow: { books: "Книги", science: "Наука", essays: "Эссе" },
    directionsTitle: {
      books: "Три книги, одна вселенная.",
      science: "Исследовательская программа.",
      essays: "Длинная форма.",
    },
    directionsBlurb: {
      books:
        "Нон-фикшн, научная фантастика и её литературный сиквел — одни и те же вопросы в трёх регистрах.",
      science: "Препринты, код, данные. Фальсифицируется по построению.",
      essays:
        "Там, где физика встречается с прозой. Одна идея — полностью аргументированная.",
    },
    exploreCta: "Перейти",
  },
  books: {
    indexEyebrow: "Серия",
    indexTitle: "Три книги — одна вселенная, три угла.",
    indexLead:
      "Нон-фикшн-исследование, научная фантастика о его следствиях и литературный сиквел о том, что происходит после. Одни и те же вопросы, три регистра.",
    readMore: "Подробнее →",
    allBooks: "← Все книги",
    rightsInquiry: "Запрос прав / издателю",
    comparableHeader: "Близкие по духу",
    russianTitle: "Русское название",
    genre: {
      nonFiction: "Нон-фикшн",
      sciFi: "Научная фантастика",
      literarySciFi: "Литературная НФ",
    },
  },
  science: {
    indexEyebrow: "Исследовательская программа",
    indexTitle: "Наука за книгами.",
    indexLead:
      "Препринты, код, данные. Программа, которую разворачивает нон-фикшн-том и прогоняет в сценариях — фантастика.",
    allResearch: "← Все работы",
    cardCta: "Читать страницу работы →",
    preprintBadge: "Препринт · v2",
    abstractHeader: "Аннотация",
    tldrHeader: "Коротко",
    predictionsHeader: "Предсказания и фальсификаторы",
    companionHeader: "Сопутствующий том",
    companionBody:
      "Нон-фикшн-книга серии проходит аргументацию простым языком, с полной цепочкой рассуждений и ссылками.",
    companionCta: "О книге →",
    citeHeader: "Цитирование",
    readPdf: "Открыть PDF",
    codeRelease: "Код и данные",
    contactReview: "Связаться для рецензии",
  },
  essays: {
    eyebrow: "Эссе",
    title: "Длинная форма.",
    lead:
      "Там, где физика встречается с прозой. Первые эссе на финальной правке — скоро.",
    placeholderBody:
      "Первое эссе — «Функция потерь для вселенной» — на финальной правке. Оно проходит по форме, которая проступает, когда ставишь пять независимых аномалий рядом.",
    placeholderLink1: "препринт Pointer Architecture",
    placeholderLink2: "нон-фикшн-том",
  },
  about: {
    eyebrow: "Об авторе",
    title: "Михаил Савченко",
    bio: [
      "У меня PhD, инженерная практика рядом с AI и остальная часть времени уходит на серию «Нейронная космология» — нон-фикшн-исследование и два романа, крутящихся вокруг одной и той же программы.",
      "Программа — это ограниченная информационно-геометрическая модель галактического вращения, которую я проверяю на SPARC и публикую с кодом и данными по воспроизводимому пайплайну. Книги разворачивают те же вопросы в разных регистрах: как строгий аргумент, как научная фантастика, как литературный сиквел.",
      "Позиция, если кратко: учёный с вопросами, а не пророк с ответами. Программа фальсифицируема по построению. Фантастика честна перед физикой. Весь сайт — это приглашение проверить работу.",
    ],
    agentsHeader: "Пресса, агенты, издатели",
    agentsBody:
      "Ищу представление для англоязычных и бразильских прав на художественные тексты, а также рецензентов и отзывы на препринт. Серьёзные запросы приветствуются.",
    emailCta: "Email — mf@mikefluff.com",
    elsewhereHeader: "Ещё",
  },
  footer: {
    tagline:
      "Публичный штаб программы «Нейронная космология»: три книги, препринт, эссе. Учёный с вопросами, а не пророк с ответами.",
    columns: {
      read: "Читать",
      research: "Исследования",
      contact: "Контакты",
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
};

const pt: Dict = {
  ...en,
  meta: {
    title: "Neural Cosmology — Mikhail Savchenko",
    description:
      "Quartel público do programa Neural Cosmology: três livros, um preprint, ensaios. Cientista com perguntas, não profeta com respostas.",
    ogLocale: "pt_BR",
  },
  nav: { ...en.nav },
};

const es: Dict = {
  ...en,
  meta: {
    title: "Neural Cosmology — Mikhail Savchenko",
    description:
      "Sede pública del programa Neural Cosmology: tres libros, un preprint, ensayos. Científico con preguntas, no profeta con respuestas.",
    ogLocale: "es_ES",
  },
  nav: { ...en.nav },
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
