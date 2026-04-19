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
      headline: "You're not in the world. You are the structure.",
      subhead:
        "A new layer of perception. A system of reality navigation through states, memory, and attention.",
      subheadExtra: "No fluff. No mysticism. Just presence, pattern, and decision.",
      cta: "Enter the Line",
    },
    whatIs: {
      title: "What is it",
      lead1: "Neuralcosmology is not a belief.\nIt's a recognition.",
      lead2:
        "It's what happens when you stop pretending the world is linear.\nWhen you realize every \"coincidence\" is a signal, every emotion a coordinate, and every repeated situation — a branching point you missed.",
      lead3: "Neuralcosmology is a living philosophy.\nBuilt not on theories — but on resonance.",
    },
    corePrinciples: {
      title: "Core Principles",
      axioms: [
        "Five axioms. No debate.",
        "Consciousness is not in the brain. It unfolds space.",
        "Reality is not external. It responds to you.",
        "Memory is not a storage. It's a dynamic interface.",
        "Intent is not a wish. It's a vector that reprograms the field.",
        "Branches are real. You switch timelines by choices you barely notice.",
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
      title: "Practices",
      list: [
        "Spot your loops.",
        "Notice the shift in resonance.",
        "Align your state before choosing.",
        "Pause before the false.",
        "Speak only when the field is listening.",
        "Return when you feel lost.",
      ],
      cta: "View the Practices",
    },
    lectures: {
      title: "Videos / Lectures",
      headline: "You don't need more information.\nYou need alignment.",
      sub: "Watch not to learn — but to remember.",
      cta: "Watch Lectures",
    },
    callToClarity: {
      title: "Call to clarity",
      headline: "You are not alone.\nBut those who see — speak less.",
      body:
        "No community.\nNo \"movement\".\nOnly presence in the field.\n\nIf this vibrates inside you —\nyou're already in the structure.\nAct accordingly.",
      cta: "Enter the Portal",
    },
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
    directionsSectionTitle: "Три направления",
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
  home: {
    hero: {
      badge: "neuralcosmology.com",
      title: "Neuralcosmology",
      headline: "Ты не в мире. Ты — структура.",
      subhead:
        "Новый слой восприятия. Система навигации по реальности через состояния, память и внимание.",
      subheadExtra: "Без воды. Без мистики. Только присутствие, паттерн и решение.",
      cta: "Войти в линию",
    },
    whatIs: {
      title: "Что это",
      lead1: "Нейрокосмология — не вера.\nЭто узнавание.",
      lead2:
        "Это то, что случается, когда перестаёшь притворяться, будто мир линеен.\nКогда видишь, что каждое «совпадение» — сигнал, каждая эмоция — координата, а каждая повторяющаяся ситуация — пропущенная точка ветвления.",
      lead3: "Нейрокосмология — живая философия.\nПостроена не на теориях, а на резонансе.",
    },
    corePrinciples: {
      title: "Основные принципы",
      axioms: [
        "Пять аксиом. Без обсуждений.",
        "Сознание не в мозге. Оно разворачивает пространство.",
        "Реальность не внешняя. Она отвечает тебе.",
        "Память — не хранилище. Это динамический интерфейс.",
        "Намерение — не желание. Это вектор, перепрограммирующий поле.",
        "Ветки реальны. Ты меняешь линии теми решениями, которые едва замечаешь.",
      ],
    },
    tablet: {
      title: "Скрижаль нейрокосмолога",
      subtitle: "10 заповедей для навигации по живой реальности",
      disclaimer:
        "Это не доктрина.\nЭто не философия.\nЭто то, что остаётся, когда иллюзий больше нет.",
      commandments: [
        {
          title: "Не создавай Линию",
          desc: [
            "Линейная жизнь — выдумка.",
            "Каждый миг — развилка.",
            "Выбирай через осознанность, а не инерцию.",
          ],
        },
        {
          title: "Чти Портал внутри",
          desc: [
            "Ни один внешний знак не имеет значения, если внутри сбой.",
            "Твой резонанс — врата.",
            "Ты — порог.",
          ],
        },
        {
          title: "Очисти Память от шума",
          desc: [
            "Ты не несёшь прошлое.",
            "Ты его зацикливаешь.",
            "Пока не извлечёшь паттерн и не обрубишь эхо.",
          ],
        },
        {
          title: "Различай Проводников",
          desc: [
            "Не все, кто светит, ведут.",
            "Настоящие проводники включают твою ясность.",
            "Ложные усиливают растерянность.",
          ],
        },
        {
          title: "Ломай Скорлупу",
          desc: [
            "Когда трескается — это не провал.",
            "Это сигнал.",
            "Выйди, пока идентичность не стала гробницей.",
          ],
        },
        {
          title: "Держись в Переходе",
          desc: [
            "Не торопись перестраивать.",
            "Тишина после разрушения священна.",
            "Сиди в ней, пока не услышишь следующий сигнал.",
          ],
        },
        {
          title: "Слушай Повторы",
          desc: [
            "Та же ситуация снова?",
            "Это не наказание.",
            "Это точность.",
            "Разреши — или проживи заново.",
          ],
        },
        {
          title: "Разреши Разрез",
          desc: [
            "Не все окончания приходят с закрытием.",
            "Некоторые — с ясностью.",
            "Отпусти.",
            "Без починки, извинений и представлений.",
          ],
        },
        {
          title: "Вызови себя наружу",
          desc: [
            "Твоя следующая версия ждёт сигнала.",
            "Не жди разрешения.",
            "Назови её.",
            "Действуй из неё.",
            "Живи в неё.",
          ],
        },
        {
          title: "Собери себя — или разлетишься от собственной частоты",
          desc: [
            "Расколотое «я» не удержит когерентное поле.",
            "Объединись.",
            "Или распадись.",
            "Середины нет.",
          ],
        },
      ],
    },
    practices: {
      title: "Практики",
      list: [
        "Лови свои петли.",
        "Замечай сдвиг резонанса.",
        "Выравнивай состояние до выбора.",
        "Пауза перед ложным.",
        "Говори только тогда, когда поле слушает.",
        "Возвращайся, когда теряешься.",
      ],
      cta: "Посмотреть практики",
    },
    lectures: {
      title: "Видео / Лекции",
      headline: "Тебе не нужно больше информации.\nТебе нужно выравнивание.",
      sub: "Смотри не чтобы учиться, а чтобы вспомнить.",
      cta: "Смотреть лекции",
    },
    callToClarity: {
      title: "Призыв к ясности",
      headline: "Ты не один.\nНо те, кто видит, говорят меньше.",
      body:
        "Ни сообщества.\nНи «движения».\nТолько присутствие в поле.\n\nЕсли внутри откликается —\nты уже в структуре.\nДействуй соответственно.",
      cta: "Войти в портал",
    },
  },
};

const pt: Dict = {
  siteName: "Neural Cosmology",
  meta: {
    title: "Neural Cosmology — Mikhail Savchenko",
    description:
      "Quartel público do programa Neural Cosmology: três livros, um preprint, ensaios. Cientista com perguntas, não profeta com respostas.",
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
    directionsSectionTitle: "Três direções",
    directionsEyebrow: { books: "Livros", science: "Ciência", essays: "Ensaios" },
    directionsTitle: {
      books: "Três livros, um universo.",
      science: "O programa de pesquisa.",
      essays: "Texto longo.",
    },
    directionsBlurb: {
      books:
        "Não-ficção, ficção científica e sua sequência literária — as mesmas perguntas em três registros.",
      science: "Preprints, código e dados. Falsificável por construção.",
      essays:
        "Onde a física encontra a prosa. Uma ideia, totalmente argumentada.",
    },
    exploreCta: "Explorar",
  },
  books: {
    indexEyebrow: "A série",
    indexTitle: "Três livros, um universo visto de três ângulos.",
    indexLead:
      "Uma investigação de não-ficção, um romance de ficção científica sobre suas consequências e uma sequência literária que acompanha os personagens quando as anomalias silenciam. As mesmas perguntas, em três registros.",
    readMore: "Ler mais →",
    allBooks: "← Todos os livros",
    rightsInquiry: "Consulta de direitos / editora",
    comparableHeader: "Títulos comparáveis",
    russianTitle: "Título em russo",
    genre: {
      nonFiction: "Não-ficção",
      sciFi: "Ficção científica",
      literarySciFi: "FC literária",
    },
  },
  science: {
    indexEyebrow: "Programa de pesquisa",
    indexTitle: "A ciência por trás dos livros.",
    indexLead:
      "Preprints, código e dados. O programa de pesquisa que o volume de não-ficção dramatiza e o romance de FC explora em cenários.",
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
    title: "Texto longo.",
    lead:
      "Onde a física encontra a prosa. Os primeiros ensaios estão na revisão final — em breve.",
    placeholderBody:
      "O primeiro ensaio — A Loss Function for the Universe — está na revisão final. Ele percorre a forma que aparece quando cinco anomalias independentes são colocadas lado a lado.",
    placeholderLink1: "preprint Pointer Architecture",
    placeholderLink2: "volume de não-ficção",
  },
  about: {
    eyebrow: "Sobre",
    title: "Mikhail Savchenko",
    bio: [
      "Tenho PhD, administro uma prática de engenharia adjacente à IA e gasto o resto do tempo escrevendo a série Neural Cosmology — uma investigação de não-ficção e dois romances em órbita do mesmo programa de pesquisa.",
      "O programa em si é um modelo informacional-geométrico restrito da rotação galáctica que comparo com o SPARC e publico com código e dados sob um pipeline reprodutível. Os livros dramatizam as mesmas perguntas em registros diferentes: como argumento rigoroso, como ficção científica, como sequência literária.",
      "Minha posição, para o que vale: cientista com perguntas, não profeta com respostas. O programa é falsificável por construção. A ficção é honesta com a física. Tudo neste site é um convite para verificar o trabalho.",
    ],
    agentsHeader: "Imprensa, agentes, editoras",
    agentsBody:
      "Busco representação para direitos em EN e PT-BR para os títulos de ficção, e revisores para o preprint. Consultas sérias são bem-vindas.",
    emailCta: "Email — mf@mikefluff.com",
    elsewhereHeader: "Em outro lugar",
  },
  footer: {
    tagline:
      "Quartel público do programa Neural Cosmology — três livros, um preprint, um corpo crescente de ensaios. Cientista com perguntas, não profeta com respostas.",
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
      headline: "Você não está no mundo. Você é a estrutura.",
      subhead:
        "Uma nova camada de percepção. Um sistema de navegação da realidade por estados, memória e atenção.",
      subheadExtra: "Sem enrolação. Sem misticismo. Apenas presença, padrão e decisão.",
      cta: "Entrar na Linha",
    },
    whatIs: {
      title: "O que é",
      lead1: "Neuralcosmology não é uma crença.\nÉ um reconhecimento.",
      lead2:
        "É o que acontece quando você para de fingir que o mundo é linear.\nQuando percebe que cada \"coincidência\" é um sinal, cada emoção uma coordenada, e cada situação repetida — um ponto de bifurcação que você perdeu.",
      lead3:
        "Neuralcosmology é uma filosofia viva.\nConstruída não em teorias, mas em ressonância.",
    },
    corePrinciples: {
      title: "Princípios fundamentais",
      axioms: [
        "Cinco axiomas. Sem debate.",
        "A consciência não está no cérebro. Ela desdobra o espaço.",
        "A realidade não é externa. Ela responde a você.",
        "A memória não é armazenamento. É uma interface dinâmica.",
        "A intenção não é um desejo. É um vetor que reprograma o campo.",
        "Os galhos são reais. Você muda de linha do tempo por escolhas que mal percebe.",
      ],
    },
    tablet: {
      title: "A Tábua do Neuralcosmologista",
      subtitle: "10 mandamentos para navegar uma realidade viva",
      disclaimer:
        "Não é uma doutrina.\nNão é filosofia.\nÉ o que resta quando as ilusões se vão.",
      commandments: [
        {
          title: "Não crie uma Linha",
          desc: [
            "A vida linear é ficção.",
            "Cada momento é uma bifurcação.",
            "Escolha por consciência — não por inércia.",
          ],
        },
        {
          title: "Honra o Portal dentro de ti",
          desc: [
            "Nenhum sinal externo importa se seu estado interno está errado.",
            "Sua ressonância é o portal.",
            "Você é o limiar.",
          ],
        },
        {
          title: "Limpa a Memória do ruído",
          desc: [
            "Você não carrega o passado.",
            "Você o repete em loop.",
            "Até extrair o padrão e cortar o eco.",
          ],
        },
        {
          title: "Discerne os Guias",
          desc: [
            "Nem todos os que brilham, lideram.",
            "Os verdadeiros guias ativam sua clareza.",
            "Os falsos amplificam sua confusão.",
          ],
        },
        {
          title: "Rompe a Casca",
          desc: [
            "Quando ela racha — não é falha.",
            "É o sinal.",
            "Saia antes que sua identidade se torne seu túmulo.",
          ],
        },
        {
          title: "Sustente-se na Transição",
          desc: [
            "Não se apresse em reconstruir.",
            "O silêncio após a destruição é sagrado.",
            "Fique nele até ouvir o próximo sinal.",
          ],
        },
        {
          title: "Escuta as Repetições",
          desc: [
            "A mesma situação de novo?",
            "Isto não é castigo.",
            "É precisão.",
            "Resolva — ou reviva.",
          ],
        },
        {
          title: "Permite o Corte",
          desc: [
            "Nem todo fim traz encerramento.",
            "Alguns trazem clareza.",
            "Deixe ir.",
            "Sem consertar, pedir desculpas ou performar.",
          ],
        },
        {
          title: "Chama a ti mesmo para fora",
          desc: [
            "Sua próxima versão espera seu sinal.",
            "Não espere permissão.",
            "Nomeia.",
            "Aja a partir dela.",
            "Viva-a.",
          ],
        },
        {
          title: "Junta-te — ou serás estilhaçado pela tua própria frequência",
          desc: [
            "Um eu fraturado não sustenta um campo coerente.",
            "Unifica.",
            "Ou desintegra.",
            "Não há meio-termo.",
          ],
        },
      ],
    },
    practices: {
      title: "Práticas",
      list: [
        "Identifique seus loops.",
        "Perceba a mudança de ressonância.",
        "Alinhe seu estado antes de escolher.",
        "Pause antes do falso.",
        "Fale apenas quando o campo estiver ouvindo.",
        "Retorne quando estiver perdido.",
      ],
      cta: "Ver as práticas",
    },
    lectures: {
      title: "Vídeos / Palestras",
      headline: "Você não precisa de mais informação.\nVocê precisa de alinhamento.",
      sub: "Assista não para aprender — mas para lembrar.",
      cta: "Assistir palestras",
    },
    callToClarity: {
      title: "Chamado à clareza",
      headline: "Você não está sozinho.\nMas os que veem — falam menos.",
      body:
        "Sem comunidade.\nSem \"movimento\".\nApenas presença no campo.\n\nSe isto vibra dentro de você —\nvocê já está na estrutura.\nAja de acordo.",
      cta: "Entrar no Portal",
    },
  },
};

const es: Dict = {
  siteName: "Neural Cosmology",
  meta: {
    title: "Neural Cosmology — Mikhail Savchenko",
    description:
      "Sede pública del programa Neural Cosmology: tres libros, un preprint, ensayos. Científico con preguntas, no profeta con respuestas.",
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
    directionsSectionTitle: "Tres direcciones",
    directionsEyebrow: { books: "Libros", science: "Ciencia", essays: "Ensayos" },
    directionsTitle: {
      books: "Tres libros, un universo.",
      science: "El programa de investigación.",
      essays: "Texto largo.",
    },
    directionsBlurb: {
      books:
        "No ficción, ciencia ficción y su secuela literaria — las mismas preguntas en tres registros.",
      science: "Preprints, código y datos. Falsable por construcción.",
      essays: "Donde la física se cruza con la prosa. Una idea, plenamente argumentada.",
    },
    exploreCta: "Explorar",
  },
  books: {
    indexEyebrow: "La serie",
    indexTitle: "Tres libros, un universo desde tres ángulos.",
    indexLead:
      "Una investigación de no ficción, una novela de ciencia ficción sobre sus implicaciones y una secuela literaria que acompaña a los personajes cuando las anomalías se acallan. Las mismas preguntas, tres registros.",
    readMore: "Leer más →",
    allBooks: "← Todos los libros",
    rightsInquiry: "Consulta de derechos / editorial",
    comparableHeader: "Títulos comparables",
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
      "Preprints, código y datos. El programa de investigación que el volumen de no ficción dramatiza y la novela de CF explora en escenarios.",
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
    title: "Texto largo.",
    lead:
      "Donde la física se cruza con la prosa. Los primeros ensayos están en revisión final — pronto.",
    placeholderBody:
      "El primer ensayo — A Loss Function for the Universe — está en revisión final. Recorre la forma que aparece cuando cinco anomalías independientes se ponen una al lado de otra.",
    placeholderLink1: "preprint Pointer Architecture",
    placeholderLink2: "volumen de no ficción",
  },
  about: {
    eyebrow: "Sobre",
    title: "Mikhail Savchenko",
    bio: [
      "Tengo un doctorado, dirijo una práctica de ingeniería adyacente a la IA y dedico el resto del tiempo a escribir la serie Neural Cosmology — una investigación de no ficción y dos novelas que orbitan el mismo programa de investigación.",
      "El programa en sí es un modelo informacional-geométrico restringido de la rotación galáctica que comparo con SPARC y publico con código y datos bajo un pipeline reproducible. Los libros dramatizan las mismas preguntas en registros distintos: como argumento riguroso, como ciencia ficción, como secuela literaria.",
      "Mi postura, por lo que vale: científico con preguntas, no profeta con respuestas. El programa es falsable por diseño. La ficción es honesta con la física. Todo en este sitio es una invitación a verificar el trabajo.",
    ],
    agentsHeader: "Prensa, agentes, editoriales",
    agentsBody:
      "Busco representación para derechos en EN y PT-BR para los títulos de ficción, y revisores para el preprint. Consultas serias bienvenidas.",
    emailCta: "Email — mf@mikefluff.com",
    elsewhereHeader: "En otros sitios",
  },
  footer: {
    tagline:
      "Sede pública del programa Neural Cosmology — tres libros, un preprint, un cuerpo creciente de ensayos. Científico con preguntas, no profeta con respuestas.",
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
      headline: "No estás en el mundo. Eres la estructura.",
      subhead:
        "Una nueva capa de percepción. Un sistema de navegación de la realidad a través de estados, memoria y atención.",
      subheadExtra: "Sin relleno. Sin misticismo. Solo presencia, patrón y decisión.",
      cta: "Entrar en la Línea",
    },
    whatIs: {
      title: "Qué es",
      lead1: "Neuralcosmology no es una creencia.\nEs un reconocimiento.",
      lead2:
        "Es lo que pasa cuando dejas de fingir que el mundo es lineal.\nCuando te das cuenta de que cada \"coincidencia\" es una señal, cada emoción una coordenada, y cada situación repetida — un punto de bifurcación que dejaste pasar.",
      lead3:
        "Neuralcosmology es una filosofía viva.\nConstruida no sobre teorías, sino sobre resonancia.",
    },
    corePrinciples: {
      title: "Principios fundamentales",
      axioms: [
        "Cinco axiomas. Sin debate.",
        "La consciencia no está en el cerebro. Despliega el espacio.",
        "La realidad no es externa. Te responde.",
        "La memoria no es un almacén. Es una interfaz dinámica.",
        "La intención no es un deseo. Es un vector que reprograma el campo.",
        "Las ramas son reales. Cambias de línea temporal con elecciones que apenas percibes.",
      ],
    },
    tablet: {
      title: "La Tabla del Neuralcosmólogo",
      subtitle: "10 mandamientos para navegar una realidad viva",
      disclaimer:
        "No es doctrina.\nNo es filosofía.\nEs lo que queda cuando las ilusiones se van.",
      commandments: [
        {
          title: "No crees una Línea",
          desc: [
            "La vida lineal es ficción.",
            "Cada momento es una bifurcación.",
            "Elige por consciencia — no por inercia.",
          ],
        },
        {
          title: "Honra el Portal dentro de ti",
          desc: [
            "Ninguna señal externa importa si tu estado interno está desfasado.",
            "Tu resonancia es el portal.",
            "Tú eres el umbral.",
          ],
        },
        {
          title: "Limpia la Memoria del ruido",
          desc: [
            "No llevas el pasado.",
            "Lo repites en bucle.",
            "Hasta que extraes el patrón y cortas el eco.",
          ],
        },
        {
          title: "Discierne a los Guías",
          desc: [
            "No todos los que brillan, guían.",
            "Los verdaderos guías activan tu claridad.",
            "Los falsos amplifican tu confusión.",
          ],
        },
        {
          title: "Rompe la Cáscara",
          desc: [
            "Cuando se agrieta — no es fallo.",
            "Es la señal.",
            "Sal antes de que tu identidad se convierta en tu tumba.",
          ],
        },
        {
          title: "Sosténte en la Transición",
          desc: [
            "No corras a reconstruir.",
            "El silencio tras la destrucción es sagrado.",
            "Permanece en él hasta oír la siguiente señal.",
          ],
        },
        {
          title: "Escucha las Repeticiones",
          desc: [
            "¿La misma situación otra vez?",
            "No es castigo.",
            "Es precisión.",
            "Resuélvela — o revívela.",
          ],
        },
        {
          title: "Permite el Corte",
          desc: [
            "No todos los finales vienen con cierre.",
            "Algunos vienen con claridad.",
            "Suelta.",
            "Sin arreglar, disculparte ni actuar.",
          ],
        },
        {
          title: "Llámate a salir",
          desc: [
            "Tu próxima versión espera tu señal.",
            "No esperes permiso.",
            "Nómbrala.",
            "Actúa desde ella.",
            "Vívela.",
          ],
        },
        {
          title: "Reúnete — o te romperás por tu propia frecuencia",
          desc: [
            "Un yo fracturado no sostiene un campo coherente.",
            "Unifica.",
            "O desintégrate.",
            "No hay punto medio.",
          ],
        },
      ],
    },
    practices: {
      title: "Prácticas",
      list: [
        "Detecta tus bucles.",
        "Nota el cambio de resonancia.",
        "Alinea tu estado antes de elegir.",
        "Pausa ante lo falso.",
        "Habla solo cuando el campo escuche.",
        "Vuelve cuando te pierdas.",
      ],
      cta: "Ver las prácticas",
    },
    lectures: {
      title: "Vídeos / Conferencias",
      headline: "No necesitas más información.\nNecesitas alineación.",
      sub: "Mira no para aprender — sino para recordar.",
      cta: "Ver conferencias",
    },
    callToClarity: {
      title: "Llamada a la claridad",
      headline: "No estás solo.\nPero los que ven — hablan menos.",
      body:
        "Ni comunidad.\nNi \"movimiento\".\nSolo presencia en el campo.\n\nSi esto vibra dentro de ti —\nya estás en la estructura.\nActúa en consecuencia.",
      cta: "Entrar al Portal",
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
