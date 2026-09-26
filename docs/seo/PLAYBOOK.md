# Продвижение neuralcosmology.com — плейбук

Исходная точка на 2026-09-26: 0 показов в GSC за полгода, DR 1.7 (708 доменов, реальных с трафиком — 2), 0 органических ключей, ChatGPT упоминает сайт только на прямой вопрос об авторе. Замер: `node scripts/seo-report.mjs --ai` → `docs/seo/reports/`.

## Что уже сделано в коде

- Динамические OG-карточки на всех страницах (`/api/og`), `<html lang>` по локали, www → apex, hreflang + x-default, sitemap только с реальными переводами.
- Раздел `/answers`: 7 страниц-ответов × 4 языка (прямой ответ, разбор, FAQ, ссылки на препринт, эссе, книги), Article + FAQPage + speakable, markdown-версии `/raw.md`, llms.txt.
- Поисковые `<title>` разделов под спрос (`src/content/seo.ts`), H1 не тронуты.
- IndexNow пингуется после каждого деплоя (Bing, Yandex, Seznam).
- Препринт на сайте переведён на PA v9.0 (SPARC убран отовсюду: страница препринта, FAQ, эссе, ответы, llms.txt). Код — `github.com/Mikefluff/sixth`, туда добавлены CITATION.cff (с ORCID), homepage и topics.

## Что нужно сделать тебе (аккаунты)

### 1. Яндекс.Вебмастер и Bing (10 минут)
1. webmaster.yandex.ru → добавить `https://neuralcosmology.com` → способ «Метатег» → скопировать `content`.
2. `! gh variable set YANDEX_VERIFICATION -R inite-ai/neuralcosmology -b <код>` → любой пуш задеплоит метатег → «Проверить».
3. В Вебмастере: «Индексирование → Файлы Sitemap» → `https://neuralcosmology.com/sitemap.xml`; «Регион» — не указывать (международный сайт).
4. Bing Webmaster Tools → «Import from Google Search Console» (одна кнопка), либо `BING_VERIFICATION` так же, как Яндекс.

### 2. Zenodo DOI для препринта (15 минут, самый важный научный сигнал)
1. zenodo.org → войти через GitHub → Settings → GitHub → включить `Mikefluff/sixth`.
2. На GitHub создать релиз `v9.0` в `sixth` — Zenodo сам выпустит DOI (CITATION.cff уже там). PDF препринта v9.0 можно загрузить на Zenodo отдельной записью типа Preprint.
3. Прислать DOI — я пропишу его в `papers.ts`, JSON-LD, llms.txt и на странице препринта.
4. Опционально: перенести `sixth` в организацию `neuralcosmology` (Settings → Transfer). Старые ссылки GitHub редиректит сам. Организация сейчас пустая, а rel="me" на сайте ссылается на неё.

### 3. ORCID + Google Scholar (20 минут)
- ORCID уже есть (0009-0006-2873-9925, добавлен в sameAs сайта): в Works добавить препринт (после DOI — импорт по DOI), в Websites — neuralcosmology.com и mikefluff.com.
- scholar.google.com → «Мой профиль» → добавить статью вручную. Google Scholar индексирует и страницу `/science/pointer-architecture` (на ней есть метатеги `citation_*` и разметка ScholarlyArticle).

### 4. Wikidata (главный рычаг узнаваемости в LLM)
Создать элементы через QuickStatements (quickstatements.toolforge.org, нужен аккаунт Wikidata). Заменить `LAST` по порядку, если создаёшь по одному.

```
CREATE
LAST	Len	"Mikhail Savchenko"
LAST	Lru	"Михаил Савченко"
LAST	Den	"AI engineer and writer; author of the Neural Cosmology research programme"
LAST	Dru	"инженер ИИ и писатель, автор исследовательской программы «Нейронная космология»"
LAST	P31	Q5
LAST	P106	Q36180
LAST	P106	Q1650915
LAST	P856	"https://neuralcosmology.com/en/about"
LAST	P2037	"Mikefluff"
LAST	P2002	"mikefluff"
LAST	P6634	"mikefluff"
LAST	P496	"0009-0006-2873-9925"
```

После — книги (`P31 Q7725634` literary work, `P50` → элемент автора, `P407` язык: Q7737 русский / Q1860 английский, `P136` Q24925 science fiction для романов, `P856` страница книги) и препринт (`P31 Q580922` preprint, `P50`, `P1476` заголовок, `P577` 2026, `P356` DOI после Zenodo). Заголовок препринта: «Pointer Architecture: An Operational Discrete Substrate from First Difference to Holographic Dark Energy». Факты должны совпадать с сайтом слово в слово.

### 5. Книжные витрины
- **Goodreads**: Author Program → профиль автора, добавить 4 книги со ссылкой «Read online» на `/books/<slug>`.
- **ЛитРес: Самиздат** и **Author.Today**: выложить «Академию Багов» (роман завершён) — ознакомительный фрагмент + ссылка на читалку. Это главная точка открытия книг в рунете.
- **Amazon KDP** — когда будет решение по изданию.

## Ссылки и упоминания (реальные, не биржи)

Цель на 3 месяца: 15–20 доменов с трафиком. Каждая площадка — со ссылкой на конкретную страницу-ответ, а не на главную.

| Площадка | Что | Куда ссылаться |
|---|---|---|
| Хабр | «Sixth: язык, на котором 40 демонстраций строят физику из одного различия (646 проверок)» | `/ru/answers/is-the-universe-a-neural-network`, GitHub sixth |
| Hacker News (Show HN) | «Show HN: Sixth – a Forth-like language where 40 demos build observers and time from one distinction» | GitHub sixth + `/en/science/pointer-architecture` |
| Essentia Foundation | гостевое эссе про brain–cosmic web (они уже в выдаче по теме) | `/en/answers/is-the-universe-a-neural-network` |
| IAI / Aeon / Nautilus (питч) | эссе о фальсифицируемости теорий сознания | `/en/answers/hard-problem-of-consciousness` |
| Medium (публикации Predict, The Startup) | кросспост эссе с canonical на сайт | эссе |
| Reddit r/cosmology, r/Physics (Weekly), r/consciousness, r/slatestarcodex | ответы в тредах по теме, со ссылкой только когда она отвечает на вопрос | страницы-ответы |
| Подкасты | Mind Chat (Goff/Frankish), Theories of Everything (Curt Jaimungal), «Наука и сознание» — питч: «AI-инженер, который публично проверяет свою гипотезу» | about |
| Дзен, VC.ru | адаптации эссе на русском | `/ru/answers/*` |
| Telegram | посты с карточками цитат из читалки (кнопка «Поделиться» уже делает OG-картинку) | главы читалки |

Правило: никаких бирж ссылок и PBN. 700 спам-доменов уже висят — Google их игнорирует, disavow не нужен, но новые покупные ссылки навредят.

## Контент-план (следующие страницы-ответы)

По спросу из DataForSEO (US, в месяц): simulation theory 9.9k, panpsychism 9.9k, cosmic web 8.1k, Michael Levin 6.6k, consciousness + quantum 2.9k, hard problem 1.9k, bioelectricity 1.6k, IIT 1.3k, galaxy rotation curves 590, Landauer 480.

Дальше: «What is the cosmic web?» (8.1k, почти без конкурентов с данными), «Is consciousness quantum?» (2.9k, эссе уже есть), «Integrated information theory explained» (1.3k), «What is dark matter?», «Near-death experiences: what neuroscience knows» (эссе dance-of-limits). Каждая — 4 языка сразу.

## Ритм

- Еженедельно: `node scripts/seo-report.mjs` (бесплатно).
- Ежемесячно: `node scripts/seo-report.mjs --ai` (~$0.05) — упоминания в ChatGPT по 6 тематическим вопросам.
- Каждая новая страница: попадает в sitemap и IndexNow автоматически при деплое.

## Продажи книг

### Что есть сейчас
- Онлайн-читалка с пейволлом: книга $15, вся библиотека $50 (INITE Billing, только USD-цены).
- «Академия Багов» — единственная завершённая книга (28 глав, ≈ 7 ч, бесплатно 6 первых). «Небесный Код» ~70%, «Осознанный Отбор» — черновик, «Эра Архитекторов» — 3 из 17 глав.
- EPUB/FB2 собираются из LaTeX (`make ga-epub-ru`, `make ga-fb2-ru` в godacademy) — готовы для площадок, нужна пересборка из актуальных исходников.
- С 2026-09-26 работает GA4 (`G-3QLFL17GG2`): read_chapter → begin_checkout → purchase, share. Отчёт «Воронка» строится в GA → Explore.

### Что мешает продавать
1. **Нет рублёвой оплаты.** Основная аудитория русскоязычная, книги в первую очередь на русском, а цены только в USD через Stripe. В биллинге есть адаптер Lava (российские карты, RUB) — нужно завести RUB-цены в каталоге (`neuralcosmology-book-<slug>-rub`, `neuralcosmology-library-rub`) и включить Lava для сервиса `neuralcosmology`. Ориентир цены: книга 490–690 ₽, библиотека 1 490–1 990 ₽. Я подключу выбор валюты по языку/стране, как только цены появятся в биллинге.
2. **Продаётся незавершённое.** $15 за книгу, в которой 3 главы из 17, и $50 за «библиотеку», где готова одна книга, — слабое предложение. Варианты: продавать «Академию Багов» как флагман; остальные — «ранний доступ» (дешевле или в составе библиотеки с явной пометкой «главы выходят по мере написания»), либо временно убрать их из продажи.
3. **Нет контакта с читателем после бесплатных глав.** Кто дочитал бесплатную часть и не купил — уходит навсегда. Нужен захват: «оставьте email/подпишитесь в Telegram — пришлём, когда выйдет новая глава», и серия писем. Регистрация (inite-auth) уже даёт email — не хватает рассылки.
4. **Нет социальных доказательств.** Ни одного отзыва/цитаты читателя на страницах книг. Поле `blurbs` в books.ts уже есть — нужно 3–5 честных отзывов первых читателей.

### План запуска «Академии Багов» (4 недели)
1. **Неделя 0 — техника.** RUB-цены + Lava; пересборка EPUB/FB2; промокод запуска в биллинге (модуль promo-codes: −30% на 2 недели, `LAUNCH30`); 10–20 бесплатных доступов для первых читателей-рецензентов.
2. **Неделя 1 — первые читатели.** Раздать доступ ядру (Telegram-канал, друзья, IT-сообщество) в обмен на честный отзыв; собрать 3–5 цитат в `blurbs`.
3. **Неделя 2 — запуск.** Пост в Telegram-канале с карточкой цитаты (кнопка «Поделиться» в читалке уже делает OG-картинку), статья на Хабре про Sixth/субстрат со ссылкой на роман как художественную версию идеи, пост на VC.ru «как я сделал свою онлайн-библиотеку с ИИ-компаньоном».
4. **Недели 2–4 — площадки.** Author.Today (фрагмент + ссылка на полную версию или продажа там же), ЛитРес: Самиздат (EPUB/FB2, ЛитРес даёт органический трафик), Ridero (печать по требованию). На EN: Royal Road (serial-формат, бесплатные главы → ссылка на сайт), Goodreads, позже Amazon KDP.
5. **Постоянно.** Раз в 1–2 недели — новая глава «Небесного Кода» или «Эры Архитекторов» с анонсом в канале и письмом подписчикам: регулярные выходы глав — главный повод возвращаться и покупать библиотеку.

### Партнёрка
В биллинге есть модуль affiliates (реферальные ссылки, комиссии, выплаты). Для книг это сарафан с мотивацией: читатель делится ссылкой и получает, например, 30% с покупки. Включается на стороне биллинга, на сайте — ссылка «Поделиться и заработать» в кабинете.
