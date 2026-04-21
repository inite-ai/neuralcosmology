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
          "Pointer Architecture is a constrained information-geometric model of galactic rotation curves. It treats gravity as a gradient over a memory-density field and fits three competing versions — unconstrained pointer, constrained pointer with a physical prior on halo extent, and an NFW baseline — head-to-head on the 171-galaxy SPARC sample.",
      },
      {
        question: "What is the main empirical result?",
        answer:
          "On the 171-galaxy SPARC sample, the constrained Pointer model wins AIC on 60 out of 171 galaxies against NFW. The partial correlation between halo extent and inferred information mass is ρ = +0.19 with q_FDR = 0.04. Four of six residual-structure features correlate with galactic age at FDR-controlled significance.",
      },
      {
        question: "How is it different from MOND or NFW?",
        answer:
          "MOND modifies Newtonian dynamics at low accelerations. NFW posits a cold-dark-matter halo with a specific density profile. Pointer Architecture keeps standard gravity but adds a memory-density term to the enclosed mass integral and fits the three models at matched parameter count, so comparisons are at parity rather than stacked.",
      },
      {
        question: "What would falsify the model?",
        answer:
          "Three independent falsifiers: (1) if the ρ sign flips on an age-controlled resample from LITTLE THINGS or THINGS, the correlation is noise; (2) if AIC-preferred galaxies correlate with survey artefacts rather than galactic age, the result is observational; (3) if the reproducibility pipeline yields materially different fits under reasonable re-parameterisation, the results are over-fit. The preprint enumerates each rejection criterion explicitly.",
      },
      {
        question: "Is the data and code available?",
        answer:
          "Yes. The full reproducibility pipeline — four Python scripts, per-galaxy fit outputs, correlation tables, PCA, and residual diagnostics — is released alongside the preprint at github.com/neuralcosmology/pointer-architecture. SPARC source data is not rehosted but comes from the authoritative Lelli, McGaugh, Schombert (2016) release.",
      },
      {
        question: "How does this relate to the books?",
        answer:
          "The non-fiction volume 'The Celestial Code' presents the argument narratively in plain language, chapter by chapter, with the full reasoning chain and references. The preprint presents the same model formally for academic reviewers. The two are linked via schema.org workExample/subjectOf metadata.",
      },
      {
        question: "What does 'neural cosmology' mean?",
        answer:
          "It is the working name of a research programme that treats reality as a computational substrate and tests that framing against concrete anomalies in cosmology, neuroscience, biology, and information theory. The programme is scientific in the strict sense: every claim comes with a falsifier, and the core paper is head-to-head AIC against standard baselines.",
      },
    ],
    about: [
      {
        question: "Who is Mikhail Savchenko?",
        answer:
          "Independent researcher and writer. Runs the Neural Cosmology programme: three books in progress, one preprint released, an essay stream, and recorded lectures. Background: systems engineering. Current focus: galactic rotation curves, information-geometric models, and the architectural read of consciousness.",
      },
      {
        question: "Is this peer-reviewed?",
        answer:
          "The preprint is a v2 draft with a full reproducibility pipeline; it has not yet been submitted to arXiv or a refereed venue. The honest post-hoc caveat about correlation tests is baked into the manuscript itself. Peer review is welcomed — the contact address for reviewers is info@neuralcosmology.com.",
      },
      {
        question: "How can I cite this work?",
        answer:
          "For the preprint: Savchenko, M. (2026). Pointer Architecture: A Constrained Information-Geometric Model of Galactic Rotation Curves. Preprint. https://neuralcosmology.com/en/science/pointer-architecture. For essays, use the canonical URL on neuralcosmology.com and the publication date shown on the page. All research output is CC-BY 4.0.",
      },
    ],
  },
  ru: {
    science: [
      {
        question: "Что такое Pointer Architecture?",
        answer:
          "Pointer Architecture — это ограниченная информационно-геометрическая модель кривых вращения галактик. Она рассматривает гравитацию как градиент по полю плотности памяти и сравнивает три версии лоб-в-лоб — свободный pointer, ограниченный pointer с физическим приором на протяжённость гало, и NFW-бейзлайн — на выборке SPARC из 171 галактики.",
      },
      {
        question: "Какой главный эмпирический результат?",
        answer:
          "На выборке SPARC из 171 галактики ограниченный Pointer выигрывает AIC на 60 галактиках из 171 у NFW. Частичная корреляция между протяжённостью гало и предполагаемой информационной массой — ρ = +0.19 при q_FDR = 0.04. Четыре из шести структурных признаков остатков коррелируют с возрастом галактики при значимости, контролируемой по FDR.",
      },
      {
        question: "Чем это отличается от MOND или NFW?",
        answer:
          "MOND модифицирует ньютоновскую динамику на малых ускорениях. NFW предполагает гало холодной тёмной материи с конкретным профилем плотности. Pointer Architecture сохраняет стандартную гравитацию, но добавляет член плотности памяти в интеграл охваченной массы и сравнивает три модели при одинаковом числе параметров — то есть сравнение идёт на равных, а не с форой.",
      },
      {
        question: "Что будет опровержением модели?",
        answer:
          "Три независимых фальсификатора: (1) если знак ρ меняется на противоположный при возрастно-контролируемой пересэмплировке из LITTLE THINGS или THINGS, корреляция — шум; (2) если AIC-предпочтительные галактики коррелируют с артефактами обзора, а не с возрастом, результат — наблюдательный; (3) если reproducibility-пайплайн даёт существенно другие фиты при разумной переопределении параметров, результаты — over-fit. Каждый критерий отказа явно выписан в препринте.",
      },
      {
        question: "Доступны ли данные и код?",
        answer:
          "Да. Полный reproducibility-пайплайн — четыре Python-скрипта, фиты по каждой галактике, корреляционные таблицы, PCA и диагностика остатков — опубликован вместе с препринтом на github.com/neuralcosmology/pointer-architecture. Исходные данные SPARC не перепубликованы, их надо взять из первоисточника — Lelli, McGaugh, Schombert (2016).",
      },
      {
        question: "Как это связано с книгами?",
        answer:
          "Нон-фикшн «Небесный Код» излагает аргумент словами, глава за главой, с полной цепочкой рассуждений и ссылками. Препринт излагает ту же модель формально для академических рецензентов. Эти две поверхности связаны через schema.org workExample/subjectOf.",
      },
      {
        question: "Что означает «нейронная космология»?",
        answer:
          "Это рабочее название исследовательской программы, которая относится к реальности как к вычислительному субстрату и проверяет эту оптику на конкретных аномалиях в космологии, нейронауке, биологии и теории информации. Программа научная в строгом смысле: у каждого утверждения есть фальсификатор, а основной текст — это лоб-в-лоб AIC-сравнение со стандартными бейзлайнами.",
      },
    ],
    about: [
      {
        question: "Кто такой Михаил Савченко?",
        answer:
          "Независимый исследователь и писатель. Ведёт программу «Нейронная космология»: три книги в работе, один препринт выпущен, поток эссе и записанные лекции. Бэкграунд — системная инженерия. Текущий фокус: кривые вращения галактик, информационно-геометрические модели и архитектурное прочтение сознания.",
      },
      {
        question: "Это прошло peer review?",
        answer:
          "Препринт — это v2-драфт с полным reproducibility-пайплайном; пока не отправлен на arXiv или в рецензируемый журнал. Честная post-hoc оговорка про корреляционные тесты встроена прямо в текст. Peer review приветствуется — адрес для рецензентов: info@neuralcosmology.com.",
      },
      {
        question: "Как цитировать эту работу?",
        answer:
          "Для препринта: Savchenko, M. (2026). Pointer Architecture: A Constrained Information-Geometric Model of Galactic Rotation Curves. Preprint. https://neuralcosmology.com/en/science/pointer-architecture. Для эссе — каноническая ссылка на neuralcosmology.com и дата публикации со страницы. Все научные материалы — CC-BY 4.0.",
      },
    ],
  },
  pt: {
    science: [
      {
        question: "O que é a Pointer Architecture?",
        answer:
          "A Pointer Architecture é um modelo informacional-geométrico restrito para curvas de rotação galácticas. Trata a gravidade como um gradiente sobre um campo de densidade de memória e ajusta três versões concorrentes — pointer sem restrição, pointer restrito com prior físico sobre a extensão do halo, e um baseline NFW — em comparação direta na amostra SPARC de 171 galáxias.",
      },
      {
        question: "Qual é o principal resultado empírico?",
        answer:
          "Na amostra SPARC de 171 galáxias, o Pointer restrito vence no AIC em 60 das 171 galáxias contra NFW. A correlação parcial entre extensão do halo e massa informacional inferida é ρ = +0,19 com q_FDR = 0,04. Quatro de seis características estruturais dos resíduos correlacionam-se com a idade galáctica em significância controlada por FDR.",
      },
      {
        question: "Como difere de MOND ou NFW?",
        answer:
          "MOND modifica a dinâmica newtoniana em baixas acelerações. NFW postula um halo de matéria escura fria com um perfil de densidade específico. A Pointer Architecture mantém a gravidade padrão mas adiciona um termo de densidade de memória ao integral de massa incluída, e ajusta os três modelos com o mesmo número de parâmetros — comparações em paridade, não empilhadas.",
      },
      {
        question: "O que falsificaria o modelo?",
        answer:
          "Três falsificadores independentes: (1) se o sinal de ρ se inverter em uma reamostragem controlada por idade de LITTLE THINGS ou THINGS, a correlação é ruído; (2) se as galáxias preferidas pelo AIC se correlacionarem com artefatos de survey em vez da idade galáctica, o resultado é observacional; (3) se o pipeline de reprodutibilidade produzir ajustes materialmente diferentes sob reparametrização razoável, os resultados estão sobreajustados. Cada critério de rejeição está enumerado explicitamente no preprint.",
      },
      {
        question: "Os dados e o código estão disponíveis?",
        answer:
          "Sim. O pipeline completo de reprodutibilidade — quatro scripts Python, ajustes por galáxia, tabelas de correlação, PCA e diagnósticos de resíduos — está publicado junto com o preprint em github.com/neuralcosmology/pointer-architecture. Os dados-fonte SPARC não são rehosteados; vêm do lançamento autoritativo de Lelli, McGaugh, Schombert (2016).",
      },
      {
        question: "Como isto se relaciona com os livros?",
        answer:
          "O volume de não-ficção 'O Código Celestial' apresenta o argumento em linguagem simples, capítulo por capítulo, com a cadeia de raciocínio completa e referências. O preprint apresenta o mesmo modelo formalmente, para revisores acadêmicos. Os dois estão ligados via schema.org workExample/subjectOf.",
      },
      {
        question: "O que significa 'cosmologia neural'?",
        answer:
          "É o nome de trabalho de um programa de pesquisa que trata a realidade como um substrato computacional e testa essa leitura contra anomalias concretas em cosmologia, neurociência, biologia e teoria da informação. O programa é científico no sentido estrito: toda afirmação vem com um falsificador, e o paper central é uma comparação direta de AIC contra baselines padrão.",
      },
    ],
    about: [
      {
        question: "Quem é Mikhail Savchenko?",
        answer:
          "Pesquisador e escritor independente. Conduz o programa Cosmologia Neural: três livros em andamento, um preprint publicado, um fluxo de ensaios e palestras gravadas. Formação em engenharia de sistemas. Foco atual: curvas de rotação galácticas, modelos informacional-geométricos e a leitura arquitetural da consciência.",
      },
      {
        question: "Isto é peer-reviewed?",
        answer:
          "O preprint é um rascunho v2 com pipeline completo de reprodutibilidade; ainda não foi submetido ao arXiv ou a um periódico com revisão por pares. A ressalva honesta sobre testes post-hoc de correlação está embutida no próprio manuscrito. Peer review é bem-vindo — o endereço para revisores é info@neuralcosmology.com.",
      },
      {
        question: "Como citar este trabalho?",
        answer:
          "Para o preprint: Savchenko, M. (2026). Pointer Architecture: A Constrained Information-Geometric Model of Galactic Rotation Curves. Preprint. https://neuralcosmology.com/en/science/pointer-architecture. Para ensaios, use a URL canônica em neuralcosmology.com e a data de publicação mostrada na página. Toda a produção científica é CC-BY 4.0.",
      },
    ],
  },
  es: {
    science: [
      {
        question: "¿Qué es la Pointer Architecture?",
        answer:
          "La Pointer Architecture es un modelo informacional-geométrico restringido para curvas de rotación galácticas. Trata la gravedad como un gradiente sobre un campo de densidad de memoria y ajusta tres versiones en competencia — pointer sin restricción, pointer restringido con un prior físico sobre la extensión del halo, y una línea base NFW — en comparación directa sobre la muestra SPARC de 171 galaxias.",
      },
      {
        question: "¿Cuál es el resultado empírico principal?",
        answer:
          "Sobre la muestra SPARC de 171 galaxias, el Pointer restringido gana en AIC en 60 de las 171 galaxias frente a NFW. La correlación parcial entre la extensión del halo y la masa informacional inferida es ρ = +0,19 con q_FDR = 0,04. Cuatro de seis características estructurales de los residuos correlacionan con la edad galáctica a significación controlada por FDR.",
      },
      {
        question: "¿En qué se diferencia de MOND o NFW?",
        answer:
          "MOND modifica la dinámica newtoniana a aceleraciones bajas. NFW postula un halo de materia oscura fría con un perfil de densidad específico. La Pointer Architecture mantiene la gravedad estándar pero añade un término de densidad de memoria al integral de masa incluida, y ajusta los tres modelos con el mismo número de parámetros — las comparaciones están en paridad, no apiladas.",
      },
      {
        question: "¿Qué falsaría el modelo?",
        answer:
          "Tres falsadores independientes: (1) si el signo de ρ se invierte en un remuestreo controlado por edad de LITTLE THINGS o THINGS, la correlación es ruido; (2) si las galaxias preferidas por AIC correlacionan con artefactos del sondeo en vez de con la edad galáctica, el resultado es observacional; (3) si la tubería de reproducibilidad produce ajustes materialmente distintos bajo reparametrización razonable, los resultados están sobreajustados. El preprint enumera cada criterio de rechazo explícitamente.",
      },
      {
        question: "¿Están disponibles los datos y el código?",
        answer:
          "Sí. La tubería completa de reproducibilidad — cuatro scripts en Python, ajustes por galaxia, tablas de correlación, PCA y diagnósticos de residuos — se publica junto al preprint en github.com/neuralcosmology/pointer-architecture. Los datos fuente de SPARC no se rehospedan; vienen del lanzamiento autoritativo de Lelli, McGaugh, Schombert (2016).",
      },
      {
        question: "¿Cómo se relaciona con los libros?",
        answer:
          "El volumen de no ficción 'El Código Celestial' presenta el argumento en lenguaje llano, capítulo por capítulo, con la cadena completa de razonamiento y las referencias. El preprint presenta el mismo modelo formalmente para revisores académicos. Los dos están enlazados vía schema.org workExample/subjectOf.",
      },
      {
        question: "¿Qué significa 'cosmología neural'?",
        answer:
          "Es el nombre de trabajo de un programa de investigación que trata la realidad como un sustrato computacional y pone a prueba esa lectura contra anomalías concretas en cosmología, neurociencia, biología y teoría de la información. El programa es científico en sentido estricto: cada afirmación viene con un falsador, y el paper central es una comparación directa en AIC contra líneas base estándar.",
      },
    ],
    about: [
      {
        question: "¿Quién es Mikhail Savchenko?",
        answer:
          "Investigador y escritor independiente. Lleva el programa Cosmología Neural: tres libros en curso, un preprint publicado, un flujo de ensayos y charlas grabadas. Formación: ingeniería de sistemas. Foco actual: curvas de rotación galácticas, modelos informacional-geométricos y la lectura arquitectónica de la consciencia.",
      },
      {
        question: "¿Está revisado por pares?",
        answer:
          "El preprint es un borrador v2 con una tubería completa de reproducibilidad; aún no se ha enviado a arXiv ni a una revista con revisión por pares. La advertencia honesta sobre los tests post-hoc de correlación está integrada en el manuscrito. La revisión por pares es bienvenida — la dirección para revisores es info@neuralcosmology.com.",
      },
      {
        question: "¿Cómo citar este trabajo?",
        answer:
          "Para el preprint: Savchenko, M. (2026). Pointer Architecture: A Constrained Information-Geometric Model of Galactic Rotation Curves. Preprint. https://neuralcosmology.com/en/science/pointer-architecture. Para los ensayos, usa la URL canónica en neuralcosmology.com y la fecha de publicación mostrada en la página. Toda la producción científica es CC-BY 4.0.",
      },
    ],
  },
};

export const faq: FaqSet = faqByLocale.en;
