# Внешние ссылки, профили и упоминания — рабочий план

Продолжение `PLAYBOOK.md`. Там направления, здесь исполнение: по каждой площадке — зачем, как, какой текст вставить и на какую страницу сайта вести. Состояние на 2026-10-01.

## Где мы сейчас

- Google: sitemap скачан, 250 адресов. Главная `/ru`, `/en`, первые главы и страницы-ответы в индексе. Страницы книг, список эссе, препринт Pointer Architecture и `/es` — «просканировано, но не проиндексировано»: Google не видит причин считать сайт важным.
- Показы есть у страниц-ответов на хороших позициях: принцип Ландауэра (2,8), «Вселенная как нейросеть» (4,6), Левин (4,4), IIT (5,1). Объёмы — единицы в месяц.
- Внешних ссылок с трафиком — две. Около 700 спамных доменов висят с прошлых лет, Google их игнорирует.
- ChatGPT знает автора только на прямой вопрос.

Чего не хватает — подтверждений извне, что автор, программа, препринт и книги существуют и связаны. Поисковики и языковые модели собирают это из реестров (Wikidata, ORCID, DOI, каталоги книг) и из живых упоминаний. Отсюда порядок: сначала реестры (неделя), потом площадки с аудиторией (месяц), потом исследователи, подкасты и пресса (постоянно).

## Правила

1. **Одна сущность везде.** Имя, описание, ссылки — слово в слово из раздела «Канонические данные» ниже. Расхождения (другая должность, другое число демонстраций, «PhD» вместо «PhD в работе») ломают склейку сущности.
2. **Ссылаться на конкретную страницу**, которая отвечает на вопрос площадки, а не на главную. Таблица «Куда вести» ниже.
3. **Никаких бирж, PBN, прогонов по каталогам и обмена ссылками.** Каждое размещение — там, где его прочтёт живой человек.
4. **Каждое размещение записывать в трекер** в конце файла: площадка, дата, URL, на какую страницу ведёт. Через месяц по трекеру и Search Console видно, что работает.
5. **Сначала поправить своё**, потом раздавать (раздел 0).

---

## 0. Сначала поправить своё (30 минут)

| Что | Сейчас | Должно быть |
|---|---|---|
| Репозиторий Sixth | был `Mikefluff/sixth`, описание с устаревшими цифрами | **сделано 2026-10-01:** перенесён в `neuralcosmology/sixth`, описание и темы обновлены, CITATION.cff и `.zenodo.json` готовы |
| Организация `github.com/neuralcosmology` | была пустой | **сделано 2026-10-01:** название, описание, ссылка на сайт, README профиля |
| Синопсис «Академии Багов» в `books.ts` | исправлено 2026-10-01 | — |
| Telegram-канал `@neuralcosmology` | проверить описание | первая строка — ссылка `neuralcosmology.com`, закреп — пост со ссылкой на `/ru/books` и `/ru/answers` |
| LinkedIn `in/mikefluff` | проверить | в Featured — ссылки на `neuralcosmology.com/en/about` и препринт; в разделе Publications — препринт (после DOI) |
| X `@mikefluff` | проверить | в bio — `neuralcosmology.com` |
| Подпись в почте | — | `Mikhail Savchenko · neuralcosmology.com · ORCID 0009-0006-2873-9925` |

README профиля организации опубликован: https://github.com/neuralcosmology/.github/blob/main/profile/README.md

---

## Канонические данные (копировать отсюда)

**Имя:** Mikhail Savchenko · Михаил Савченко · (бизнес-бренд того же человека: Mike Fluff, mikefluff.com — упоминать только там, где речь о консалтинге).

**Программа:** Neural Cosmology · Нейронная космология · Cosmologia Neural (pt) · Cosmología Neural (es). Не «нейрокосмология».

**Био, одна строка**
- EN: AI engineer and writer; author of the Neural Cosmology research programme on consciousness and the universe as a learning network.
- RU: Инженер ИИ и писатель, автор исследовательской программы «Нейронная космология» о сознании и Вселенной как обучающейся сети.

**Био, абзац (EN)**
> Mikhail Savchenko has spent twenty years in AI engineering and is working on a PhD. Neural Cosmology is his research programme on consciousness: it asks whether the brain, the cosmic web and living matter run on one computational substrate, and it states in advance what would prove it wrong. The programme's formal core is the Pointer Architecture preprint (v9.0) with a working implementation, the Sixth language. He writes books and essays in Russian and English. neuralcosmology.com

**Био, абзац (RU)**
> Михаил Савченко двадцать лет занимается инженерией ИИ и пишет PhD. «Нейронная космология» — его исследовательская программа о сознании: она проверяет, не работают ли мозг, космическая паутина и живая материя на одном вычислительном субстрате, и заранее называет, что её опровергнет. Формальное ядро программы — препринт Pointer Architecture (v9.0) с работающей реализацией на языке Sixth. Пишет книги и эссе на русском и английском. neuralcosmology.com

**Препринт:** «Pointer Architecture: An Operational Discrete Substrate from First Difference to Holographic Dark Energy», Mikhail Savchenko, 2026, v9.0. Страница: `https://neuralcosmology.com/en/science/pointer-architecture`. Код: `https://github.com/neuralcosmology/sixth`.

**Профили:** ORCID `0009-0006-2873-9925` · GitHub `Mikefluff`, `neuralcosmology` · LinkedIn `in/mikefluff` · X `@mikefluff` · Telegram `@neuralcosmology` (канал), `@mikefluff`.

### Книги

| Книга | Статус | Описание EN (до 300 знаков) | Описание RU |
|---|---|---|---|
| The Celestial Code / Небесный Код | нон-фикшн, первые главы открыты | Five discoveries from five fields — the brain's wiring and the cosmic web, information as physics, bioelectric memory of form, quantum biology, learning as a law of nature — read as one picture that can be checked against data. Companion to the Pointer Architecture preprint. | Пять открытий из пяти областей — устройство мозга и космическая паутина, информация как физика, биоэлектрическая память формы, квантовая биология, обучение как закон природы — сложены в одну картину, которую можно проверить на данных. Книга-спутник препринта Pointer Architecture. |
| Conscious Selection / Осознанный Отбор | нон-фикшн, второй том | Almost everything the world could show an observer is discarded before anything is chosen: vision squeezed into two degrees, memory rewritten on recall, the environment keeping only stable quantum states. The author tests the idea on the eye, memory, physics and his own failed measurements. | Почти всё, что мир мог бы показать наблюдателю, отсеивается раньше выбора: зрение ужато до двух градусов, память переписывается при каждом обращении, среда оставляет только устойчивые квантовые состояния. Автор проверяет эту мысль на глазе, памяти, физике и на собственных проваленных измерениях. |
| Bugs Academy / Академия Багов | роман, завершён | A Moscow quantum physicist who sees the folds of reality is taken to an Academy for people like him, where an ageless teacher shows that the world is a running system with its own maintainers. Science fiction with real physics and a missing mother at its centre. | Московский физик-квантовик видит складки реальности, и его забирают в Академию для таких же «багов», где нестареющий учитель показывает, что мир — работающая система со своими сисадминами. Фантастика с настоящей физикой и пропавшей матерью в центре сюжета. |
| Era of Architects / Эра Архитекторов | роман, сиквел, выходит по главам | Seven years later the door is open, Moscow's traffic jams have vanished and a state institute is "awakening" the population. A father who sees the threads between people tries to keep his daughter out of a programme built for children like her. | Через семь лет после открытия двери из Москвы пропали пробки, а государственный институт «пробуждает» население. Отец, который видит нити между людьми, пытается уберечь дочь от программы, придуманной для таких детей, как она. |

### Куда вести

| Тема площадки | Страница |
|---|---|
| вселенная как нейросеть, космическая паутина и мозг | `/en/answers/is-the-universe-a-neural-network`, `/en/answers/cosmic-web` |
| теории сознания, IIT, трудная проблема | `/en/answers/integrated-information-theory`, `/en/answers/hard-problem-of-consciousness`, `/en/answers/panpsychism` |
| квантовое сознание | `/en/answers/is-consciousness-quantum` |
| симуляция | `/en/answers/is-the-universe-a-simulation` |
| информация и физика, Ландауэр | `/en/answers/landauer-principle` |
| Левин, биоэлектричество, регенерация | `/en/answers/michael-levin-bioelectricity` |
| тёмная материя, кривые вращения | `/en/answers/galaxy-rotation-curves-without-dark-matter` |
| язык Sixth, Forth, эзотерические языки, искусственная жизнь | GitHub `sixth`, `/en/science/pointer-architecture` |
| книги, чтение, фантастика | `/ru/books/bugs-academy`, первые главы `/ru/read/<книга>/ch01` |
| автор | `/en/about` |

Русские площадки — те же адреса с `/ru/`, португальские — `/pt/`, испанские — `/es/`.

---

## 1. Реестры и научная идентичность (неделя 1, самый сильный сигнал для LLM)

### 1.1 Zenodo → DOI препринта
Зачем: DOI делает препринт цитируемым объектом. От него питаются Crossref, OpenAlex, Semantic Scholar, Google Scholar, Wikidata.
1. zenodo.org → Log in with GitHub → Settings → GitHub → включить `sixth`.
2. Выпустить релиз `v9.0` в `sixth` → Zenodo выдаёт DOI на код.
3. Отдельно: New upload → Resource type: Publication / Preprint → PDF v9.0. Поля:
   - Title: Pointer Architecture: An Operational Discrete Substrate from First Difference to Holographic Dark Energy
   - Authors: Savchenko, Mikhail (ORCID 0009-0006-2873-9925)
   - Description: абстракт со страницы препринта
   - Keywords: pointer architecture; computational substrate; emergence; holographic dark energy; integrated information; consciousness; Forth; neural cosmology
   - Related identifiers: `isSupplementedBy` → DOI релиза sixth; `isDocumentedBy` → `https://neuralcosmology.com/en/science/pointer-architecture`
   - License: CC BY 4.0
4. Прислать оба DOI — я пропишу их в `papers.ts`, JSON-LD (ScholarlyArticle.identifier, sameAs), `citation_doi`, llms.txt, CITATION.cff.

### 1.2 arXiv
Зачем: главный канал видимости для физиков; поисковики и модели считают arXiv авторитетным.
- Категории: основная `gr-qc` или `hep-th` (holographic dark energy, algebraic observers), кросс-листинг `cs.LO` (формальный субстрат), `q-bio.NC` (Φ_PA).
- Нужен endorsement от автора, публиковавшегося в категории. Кого просить: авторов работ из списка литературы препринта, с которыми есть пересечение, — вежливое письмо с PDF и одной фразой, почему именно они (`kit/08`).
- Если endorsement не найдётся быстро — не ждать: Zenodo + PhilArchive + OSF дают DOI и индексацию уже сейчас.

### 1.3 Другие репозитории препринтов (бесплатно, каждый — отдельная индексируемая запись)
| Площадка | Почему подходит | Что загрузить |
|---|---|---|
| PhilArchive / PhilPapers | философия сознания; PhilPapers — главный каталог философов, его читают модели | препринт с акцентом на Φ_PA и трудную проблему; профиль автора в PhilPeople |
| OSF Preprints | DOI, принимает междисциплинарное | препринт, ссылка на Zenodo-код |
| ResearchGate | профиль + публикация; запросы полного текста приводят людей | препринт, связать с ORCID |
| Academia.edu | крупный, хорошо индексируется | препринт + эссе в английских версиях |
| SSRN | только если найдётся подходящая сеть (Cognitive Science Network) | препринт |
| Preprints.org (MDPI) | DOI, индексация в Google Scholar, модерация мягкая | препринт |

Везде одинаковые метаданные из раздела 1.1 и ссылка на страницу препринта на сайте.

### 1.4 ORCID (уже есть, дозаполнить)
- Works: импорт по DOI из Zenodo; вручную — 4 книги (type: Book, URL на `/en/books/<slug>`).
- Websites & social links: neuralcosmology.com, mikefluff.com, github.com/neuralcosmology.
- Keywords: consciousness; cosmology; computational substrate; integrated information; artificial intelligence.
- Biography: абзац EN из канонических данных.
- Employment/Education: только то, что подтверждается (PhD — «in progress»).

### 1.5 Google Scholar, Semantic Scholar, OpenAlex
- Google Scholar: создать профиль, добавить препринт вручную. Страница `/en/science/pointer-architecture` уже несёт метатеги `citation_*` — Scholar подхватит её сам, профиль ускоряет склейку.
- Semantic Scholar: после DOI появится запись → «Claim author page».
- OpenAlex подтягивается автоматически из Crossref/DataCite; проверить через месяц `api.openalex.org/authors?search=Mikhail Savchenko`.

### 1.6 Software Heritage и каталоги кода
- softwareheritage.org → Save code now → `github.com/neuralcosmology/sixth`. Вечный архив с SWHID — его тоже можно указать в препринте.
- Papers with Code закрыт; вместо него — Hugging Face Papers (после arXiv): страница статьи + ссылка на код.

### 1.7 Wikidata (главный рычаг для узнаваемости в ChatGPT, Gemini, Google Knowledge Graph)
Wikidata не требует «значимости» уровня Википедии, но требует проверяемых источников: сайт, ORCID, DOI. Создавать по порядку, после каждого шага записывать полученный Q-номер.

**Шаг 1. Автор.** quickstatements.toolforge.org → New batch → V1:
```
CREATE
LAST	Len	"Mikhail Savchenko"
LAST	Lru	"Михаил Савченко"
LAST	Lpt	"Mikhail Savchenko"
LAST	Les	"Mikhail Savchenko"
LAST	Den	"AI engineer and writer; author of the Neural Cosmology research programme"
LAST	Dru	"инженер ИИ и писатель, автор исследовательской программы «Нейронная космология»"
LAST	Dpt	"engenheiro de IA e escritor, autor do programa de investigação Cosmologia Neural"
LAST	Des	"ingeniero de IA y escritor, autor del programa de investigación Cosmología Neural"
LAST	Aen	"Mike Fluff"
LAST	Aru	"Майк Флафф"
LAST	P31	Q5
LAST	P106	Q36180
LAST	P106	Q82594
LAST	P1412	Q7737
LAST	P1412	Q1860
LAST	P856	"https://neuralcosmology.com/en/about"
LAST	P496	"0009-0006-2873-9925"
LAST	P2037	"Mikefluff"
LAST	P2002	"mikefluff"
LAST	P6634	"mikefluff"
LAST	P3789	"neuralcosmology"
```
Q-номер автора дальше обозначен `QAUTHOR`.

**Шаг 2. Препринт** (после DOI):
```
CREATE
LAST	Len	"Pointer Architecture: An Operational Discrete Substrate from First Difference to Holographic Dark Energy"
LAST	Den	"2026 preprint by Mikhail Savchenko"
LAST	Dru	"препринт Михаила Савченко, 2026"
LAST	P31	Q580922
LAST	P50	QAUTHOR
LAST	P1476	en:"Pointer Architecture: An Operational Discrete Substrate from First Difference to Holographic Dark Energy"
LAST	P577	+2026-00-00T00:00:00Z/9
LAST	P407	Q1860
LAST	P356	"<DOI>"
LAST	P953	"https://neuralcosmology.com/en/science/pointer-architecture"
```

**Шаг 3. Язык Sixth:**
```
CREATE
LAST	Len	"Sixth"
LAST	Den	"Forth-like programming language, reference implementation of Pointer Architecture"
LAST	Dru	"Forth-подобный язык программирования, эталонная реализация Pointer Architecture"
LAST	P31	Q9143
LAST	P178	QAUTHOR
LAST	P1324	"https://github.com/neuralcosmology/sixth"
LAST	P856	"https://neuralcosmology.com/en/science/pointer-architecture"
LAST	P348	"9.0"
```

**Шаг 4. Книги** (по одной; для «Академии Багов» и «Эры» жанр — научная фантастика Q24925, для двух нон-фикшн — `P136` не ставить, а `P921` (main subject) → consciousness Q11891 и cosmology Q338):
```
CREATE
LAST	Lru	"Академия Багов"
LAST	Len	"Bugs Academy"
LAST	Dru	"научно-фантастический роман Михаила Савченко"
LAST	Den	"science fiction novel by Mikhail Savchenko"
LAST	P31	Q7725634
LAST	P50	QAUTHOR
LAST	P407	Q7737
LAST	P136	Q24925
LAST	P1476	ru:"Академия Багов"
LAST	P856	"https://neuralcosmology.com/ru/books/bugs-academy"
```
То же для «Небесного Кода» (`celestial-code`), «Осознанного Отбора» (`conscious-selection`), «Эры Архитекторов» (`era-of-architects`). «Эре» добавить `P155` (follows) → Q «Академии Багов».

**Шаг 5. Связать:** автору — `P800` (notable work) → Q всех книг и препринта. К каждому утверждению добавить источник: `S854` (reference URL) → страница сайта, например `QAUTHOR	P496	"0009-0006-2873-9925"	S854	"https://orcid.org/0009-0006-2873-9925"`.

QID-ы, которые стоит перепроверить в интерфейсе перед запуском (поиском по названию): Q82594 (computer scientist), Q9143 (programming language), Q11891 (consciousness), Q338 (cosmology). Остальные стандартные: Q5 человек, Q36180 писатель, Q580922 препринт, Q7725634 литературное произведение, Q24925 научная фантастика, Q7737 русский, Q1860 английский.

После этого: прислать Q-номера — я добавлю `https://www.wikidata.org/wiki/Q…` в sameAs Person и Organization, в identity.json и person.jsonld.

### 1.8 Панель знаний Google
Когда появятся Wikidata и несколько упоминаний, по запросу «Mikhail Savchenko Neural Cosmology» может появиться панель. Её можно подтвердить кнопкой «Claim this knowledge panel» (вход через Search Console того же домена).

### 1.9 Вебмастеры (если ещё не сделано, см. PLAYBOOK)
Яндекс.Вебмастер и Bing Webmaster Tools — sitemap и «переобход» ключевых страниц. В Search Console вручную «Запросить индексирование» для: `/ru/books/celestial-code`, `/ru/books/bugs-academy`, `/en/science/pointer-architecture`, `/ru/essays`, `/en/essays`, `/es`. Лимит — около десяти в день.

---

## 2. Книжные площадки (недели 1–3)

Каждая площадка — отдельная индексируемая страница книги со ссылкой на сайт, и место, где книгу находят читатели.

### Русскоязычные
| Площадка | Что | Как |
|---|---|---|
| **Author.Today** | главная площадка для фантастики в рунете | выложить «Академию Багов» целиком или по главам с продажей; в профиле автора и в аннотации — ссылка на сайт и на «Эру Архитекторов» как продолжение |
| **ЛитРес: Самиздат** | ЛитРес даёт органический трафик и попадает в выдачу по названию | EPUB/FB2 «Академии Багов» (`make ga-epub-ru`), аннотация RU из таблицы, бесплатный ISBN выдают сами |
| **Ridero** | печать по требованию, ISBN, раздача в ЛитРес/Ozon/Wildberries | та же книга, обложка в печатном формате |
| **Fantlab.ru** | база фантастики, её читают все, кто ищет фантастику; страница автора и произведения | после выхода на любой площадке — заявка на добавление автора и книги через форму «Добавить произведение» (нужна ссылка на издание) |
| **LiveLib** | крупнейшая соцсеть читателей | книга появится после ЛитРес; дальше — попросить первых читателей оставить отзыв |
| **Литнет** | фантастика, большая аудитория | альтернатива или дополнение к Author.Today |
| **Букмейт / Яндекс Книги** | через ЛитРес или Ridero | раздача автоматически |
| **Пикабу (сообщество «Книжная лига»)** | живая аудитория | пост-рассказ о книге с отрывком, а не реклама |

### Международные
| Площадка | Что | Как |
|---|---|---|
| **Goodreads** | профиль автора (Author Program), 4 книги | добавить книги вручную (ISBN не обязателен), ссылка «Read online» → `/en/books/<slug>`; био EN |
| **Open Library** | открытый каталог Internet Archive, его данные используют модели | любой может добавить автора и книги; в поле «Links» — страницы книг на сайте |
| **LibraryThing**, **StoryGraph** | каталоги читателей | добавить книги, ссылки на сайт |
| **Royal Road** | серийная фантастика на английском | «Bugs Academy» по главам (EN-перевод есть), в конце каждой — ссылка на полную книгу на сайте |
| **Wattpad**, **Tapas** (проза) | то же для другой аудитории | по желанию |
| **Amazon KDP + Author Central** | когда решится вопрос издания; Author Central даёт страницу автора на Amazon | EPUB EN, био EN, ссылка на сайт в профиле |
| **Google Books Partner Center** | книги в Google Books, превью и ссылка на сайт | загрузить PDF/EPUB с ознакомительным фрагментом |
| **BookBub** | профиль автора | после Amazon |

ISBN: бесплатно — через Ridero (RU) или Amazon KDP (ASIN). С ISBN книга попадает в WorldCat и каталоги библиотек.

---

## 3. Код и технические сообщества (недели 2–4)

Sixth — самый «ссылочный» актив: технари охотно ссылаются на необычные языки и проверяемый код.

| Площадка | Что сделать | Ссылка |
|---|---|---|
| **Esolang wiki** (esolangs.org) | статья о Sixth (`kit/06`): синтаксис, примитивы, пример, ссылка на репозиторий и препринт | GitHub + страница препринта |
| **Rosetta Code** | добавить Sixth как язык и решить 10–20 типовых задач (Hello world, FizzBuzz, Fibonacci, Towers of Hanoi) | страница языка ссылается на репозиторий |
| **awesome-списки на GitHub** | PR в awesome-forth, awesome-esolangs, awesome-concatenative, awesome-artificial-life (`kit/07`) | GitHub sixth |
| **r/Forth**, **comp.lang.forth**, форум forth-ev.de | пост «A Forth-like language where 40 demos build observers from one distinction» с кодом | GitHub |
| **Concatenative wiki** (concatenative.org) | добавить Sixth в список языков | GitHub |
| **Racket Discourse** (Sixth написан на Racket) | «Show & Tell» | GitHub |
| **Hacker News** — Show HN | «Show HN: Sixth – a Forth-like language with a pre-registered log of its failures» (`kit/05`) | GitHub, в первом комментарии — препринт |
| **Lobsters** | нужно приглашение; теги `plt`, `science` | GitHub |
| **Хабр** | статья «Язык из 38 примитивов, на котором из одного различия вырастают время, пространство и наблюдатели» (`kit/04`); хабы: Программирование, Научно-популярное, Ненормальное программирование | GitHub + `/ru/answers/is-the-universe-a-neural-network` |
| **dev.to**, **Medium** | кросспост EN-версии статьи с canonical на сайт | то же |
| **Artificial Life** — сообщество ISAL, рассылка | короткое письмо о демонстрациях автопоэзиса и космогенеза на субстрате | препринт |

---

## 4. Наука о сознании и философия (недели 2–6)

| Площадка | Формат | Куда вести |
|---|---|---|
| **LessWrong** | link post или пост о проверяемости теорий сознания с явными фальсификаторами (Φ_PA, P1–P5) | `/en/science/pointer-architecture` |
| **Effective Altruism Forum / AI Alignment Forum** | только если пост про P1–P2 (Φ трансформеров, KV-кэш) — это вопрос о сознании ИИ | препринт |
| **Essentia Foundation** | гостевое эссе (они в выдаче по теме brain–cosmic web) | `/en/answers/is-the-universe-a-neural-network` |
| **IAI News**, **Aeon/Psyche**, **Nautilus**, **Big Think**, **The Conversation** (нужна академическая аффилиация) | питч эссе (`kit/09`) | страница-ответ по теме эссе |
| **Qualia Research Institute**, **Models of Consciousness** (конференция), **ASSC**, **The Science of Consciousness (Tucson)** | подача тезиса; программа конференции публикуется и индексируется | препринт |
| **PhilPapers** | раздел 1.3 | — |
| **Reddit**: r/consciousness, r/cosmology, r/Physics (weekly threads), r/philosophyofmind, r/slatestarcodex, r/singularity (для P1–P2), r/Futurology | ответы в тредах, где страница-ответ закрывает вопрос; свой пост — не чаще раза в месяц на сабреддит | страницы-ответы |
| **Physics Stack Exchange**, **Philosophy SE**, **Psychology & Neuroscience SE** | полные ответы по существу; ссылка — только как источник, если страница даёт то, чего нет в ответе | страницы-ответы |
| **Quora** (EN, PT, ES) | ответы на вопросы «Is the universe a neural network?», «What is IIT?» и т. п. с выдержкой и ссылкой | страницы-ответы на языке Quora |
| **FQXi** | конкурс эссе (тема меняется), публикуются все эссе участников | эссе |

---

## 5. Подкасты, видео и пресса (постоянно)

Подкаст — лучший тип упоминания: страница эпизода со ссылкой, транскрипт, который читают модели, и аудитория, которая ищет имя.

**EN:** Theories of Everything (Curt Jaimungal), Mind Chat (Philip Goff, Keith Frankish), Michael Levin's guests lists (Levin часто ходит в подкасты — их ведущие ищут смежных гостей), The Jim Rutt Show, Machine Learning Street Talk, Brain Inspired (Paul Middlebrooks), Sean Carroll's Mindscape (дальний прицел), Closer To Truth.

**RU:** «Наука и сознание», «Проект Сколково / Сколтех», «Учёные против мифов» (лекция), «ПостНаука» (ролик), каналы «Физика от Побединского», «Хакнем», Дзен-каналы о науке, Telegram «Пятый элемент», «Чердак».

**PT/ES:** «Ciência Suja», «Naruhodo» (BR), «Ciencia de Sofá», «Coffee Break: Señal y Ruido» (ES).

Питчи и адресаты — `kit/09`. Отдельная страница «Press & podcasts» на сайте (могу сделать) с медиакитом: био трёх длин, фото, темы, ссылки — облегчает приглашение.

Лекции: если записи лежат на YouTube/VK/Rutube — в описании каждого ролика первой строкой ссылка на соответствующую страницу `/lectures/<slug>` и на `/answers` по теме.

---

## 6. Русскоязычные медиа и соцсети (недели 2–6)

| Площадка | Формат | Куда |
|---|---|---|
| **VC.ru** | «Как я сделал онлайн-библиотеку с ИИ-компаньоном и иллюстрациями за неделю» (инженерный кейс) | `/ru/books` |
| **Дзен** | адаптации страниц-ответов (не копия: свой заход, ссылка на полную версию) | `/ru/answers/*` |
| **Telegram** | каталоги: tgstat.ru, telemetr.io (добавить канал); взаимные упоминания с научно-популярными каналами 1–20 тыс. подписчиков; посты с карточками цитат из читалки | главы, ответы |
| **Habr Q&A**, **Хабр-комментарии** под статьями о сознании ИИ | по делу, ссылка при необходимости | ответы |
| **Пикабу** «Наука», «Книжная лига» | пост-история | книги |

---

## 7. Исследователи, на чью работу опирается программа (недели 3–8)

Письмо-уведомление «я использовал вашу работу так-то, вот проверяемый результат» — не просьба о ссылке. Реальный исход: ответ, обсуждение, иногда упоминание в их блоге, твиттере или списке «related work», приглашение на семинар.

| Кому | Связь с программой |
|---|---|
| Franco Vazza (Болонья), Alberto Feletti (Верона) | сравнение мозга и космической паутины — глава 1–2 «Небесного Кода», ответ про космическую паутину |
| Vitaly Vanchurin (Миннесота) | «The world as a neural network» — PA продолжает с места, где он останавливается |
| Michael Levin (Tufts) | биоэлектричество и память формы; лаборатория открыта к междисциплинарным контактам |
| Joseph Burchett, Oskar Elek (UC Santa Cruz) | алгоритм слизевика для космической паутины |
| Lee Cronin, Sara Walker | теория сборки (глава 7 «Осознанного отбора») |
| Giulio Tononi, Larissa Albantakis | IIT и Φ — Φ_PA с проверяемыми предсказаниями |
| Karl Friston | принцип свободной энергии (глава 5 «Осознанного отбора») |
| Stephen Wolfram / Jonathan Gorard | Wolfram model, гиперграфовые переписывания — Sixth близок по духу; у Wolfram Physics есть сообщество и форум |
| Авторы из списка литературы препринта (Witten, Chandrasekaran–Longo–Penington–Witten и др.) | кандидаты в endorsement arXiv; писать коротко и только тем, чья работа реально использована |

Шаблоны — `kit/08`.

---

## 8. Перекрёстные ссылки своих активов

- **mikefluff.com:** на странице «Обо мне» и в футере — блок «Research: Neural Cosmology» со ссылкой на `neuralcosmology.com/en/about`; в блоге — кейс про онлайн-библиотеку. Это уже связанная сущность (sameAs), но видимая ссылка добавляет переход и анкор.
- **Другие сайты INITE** (inite.ai, inite.studio и т. д.), где автор упоминается: строка об авторе со ссылкой.
- **Профили на всех площадках** из разделов 1–6: поле «Website» — `neuralcosmology.com`, поле «About» — био из канонических данных.
- **Email-рассылка** (когда появится): ссылка в подписи на последнюю главу или ответ.

---

## 9. Готовые тексты

Все тексты вынесены в `kit/` и сверены с репозиторием и сайтом: Wikidata (`01`), Zenodo (`02`), профили (`03`), статья для Хабра (`04`), Show HN и англоязычные посты (`05`), Esolang wiki и Rosetta Code (`06`), awesome-списки (`07`), письма исследователям (`08`), питчи (`09`), ответы для Reddit, Quora и SE (`10`).

Цифры: препринт v9.0 — 38 примитивов, 40 демонстраций, 646 проверок; репозиторий сейчас — 49 примитивов, 197 демонстраций, 2500 проверок, 52 заранее зарегистрированных цикла. О статье говорить первыми, о коде — вторыми.

---

## 10. Порядок работ

| Неделя | Что | Время |
|---|---|---|
| 1 | Раздел 0; Zenodo (DOI); ORCID; Wikidata шаги 1, 3, 4; Search Console «запросить индексирование»; Яндекс/Bing | 3–4 ч |
| 1–2 | PhilArchive, OSF, ResearchGate, Academia.edu; Google Scholar; Software Heritage; Wikidata шаг 2 после DOI | 2 ч |
| 2 | Goodreads, Open Library; Author.Today; ЛитРес Самиздат (EPUB) | 3 ч |
| 2–3 | Esolang wiki, Rosetta Code, PR в awesome-списки, r/Forth | 3 ч |
| 3 | Хабр (статья), затем Show HN через 2–3 дня | 1 день |
| 3–4 | письма исследователям (5–8 штук), запрос endorsement arXiv | 2 ч |
| 4+ | Reddit, Quora, SE — 2–3 ответа в неделю; питчи подкастам — 3 в неделю; Дзен/VC — раз в 2 недели | постоянно |
| ежемесячно | `node scripts/seo-report.mjs --ai`, Search Console, трекер ниже | 30 мин |

Ожидаемый эффект: через 2–4 недели после Wikidata, DOI и ORCID модели начинают отвечать на вопрос о программе без подсказки имени; через 1–3 месяца после Хабра, HN и книжных площадок — первые десятки доменов с реальным трафиком, после чего Google обычно переводит «просканировано, но не проиндексировано» в индекс.

---

## 11. Что могу сделать я (в коде и текстах)

- Вписать DOI, Q-номера Wikidata, профили Goodreads, PhilPeople, ResearchGate и т. д. в sameAs, JSON-LD, identity.json, llms.txt, страницу «Об авторе» — как только они появятся.
- Сделать страницу «Press & podcasts» с медиакитом.
- ~~Статья для Хабра, Show HN, Esolang wiki, письма, питчи, ответы~~ — готовы в `kit/` (2026-10-01).
- Подготовить EPUB/FB2 «Академии Багов» из актуальных исходников и аннотации для площадок.
- Написать статью Esolang wiki целиком, с примерами из демонстраций.
- ~~Исправить синопсис «Академии Багов» на сайте~~ — сделано 2026-10-01 во всех четырёх языках.

---

## Трекер

| Дата | Площадка | Что | URL размещения | Ведёт на | Статус |
|---|---|---|---|---|---|
| | | | | | |
