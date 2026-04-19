# Neurocosmology site — полный upgrade plan

**Current state**: Next.js 16 App Router marketing page с одним `/` route. Секции: Hero, WhatIs, CorePrinciples, Practices, Tablet, Lectures, CallToClarity. Tailwind 4, Framer Motion, tsParticles. Deploy через Docker + GitHub Actions + Traefik.

**Target state**: hub-сайт для трёх направлений — книги, наука, эссеистика — с единой идентичностью «neural cosmology» через все три.

---

## 0. Стратегические решения (принять до старта)

- **Язык по умолчанию**: EN на `/`, RU на `/ru`, PT-BR на `/pt` (в v2). В v1 только EN + RU.
- **Домены**: `neuralcosmology.com` (главный), можно держать `savchenko.com`/`mikefluff.com` как редиректы на `/about`.
- **Content source**: MDX-файлы в `content/` + TypeScript data-слой. Без CMS — overkill для автора.
- **Идентичность**: автор как «PhD + AI founder, пишет про нейронную космологию через науку, художку и эссе». Одно лицо на всех страницах.

---

## 1. Информационная архитектура (IA)

### Верхнеуровневая навигация (хедер)

```
Home · Books · Science · Essays · About
```

### URL-карта

```
/                        ← текущий лендинг (slight redesign под hub)
/books                   ← индекс книг, все 3 плюс forthcoming
/books/celestial-code    ← Небесный Код (non-fiction)
/books/bugs-academy      ← Академия Багов (sci-fi, готова)
/books/era-of-architects ← Эра Архитекторов (sequel, WIP)
/science                 ← research index
/science/pointer-architecture ← preprint лендинг: PDF, DOI, code, abstract, FAQ
/science/references      ← biblio: Vazza-Feletti, Vanchurin, Levin, Tononi, Hoffman, etc.
/essays                  ← blog-подобный список
/essays/[slug]           ← один long-form essay (rendered from MDX)
/about                   ← bio, фото, agent/publisher contact
/contact                 ← форма для agents/press/publishers
/ru/*                    ← ру-зеркало всех страниц
```

### Sitemap (SEO)

Обновить `public/sitemap.xml` динамически через `src/app/sitemap.ts` (Next 13+ API).

---

## 2. Data-слой

Создать `src/content/`:

```
src/content/
  books.ts                ← массив книг: slug, titles (en/ru/pt), cover, synopsis
  papers.ts               ← массив научных работ: preprint, journal, DOI, arxiv
  essays/
    loss-function.mdx     ← эссе "A Loss Function for the Universe"
    five-puzzles.mdx
    ...
```

**Book type** (`src/types/book.ts`):

```ts
export type Book = {
  slug: string
  titles: { en: string; ru: string; pt?: string }
  status: 'published' | 'forthcoming' | 'wip'
  genre: 'non-fiction' | 'sci-fi' | 'literary-sci-fi'
  pages: number
  coverImage: string
  synopsis: { en: string; ru: string }
  blurbs?: { author: string; affiliation: string; quote: string }[]
  buyLinks?: { label: string; url: string }[]
  sampleChapters?: string[]    // URLs to PDF samples
  publicationDate?: string
}
```

**Paper type** (`src/types/paper.ts`):

```ts
export type Paper = {
  slug: string
  title: string
  authors: string[]
  abstract: string
  preprintUrl?: string    // arXiv / Zenodo
  doi?: string
  pdfPath: string         // hosted PDF in /public/pdfs/
  codeUrl?: string        // GitHub / Zenodo code release
  dataUrl?: string
  status: 'preprint' | 'submitted' | 'published'
  venue?: string
  year: number
}
```

---

## 3. Новые страницы / компоненты

### 3.1 `/books` — индекс книг

Компонент: `src/components/sections/BooksIndex.tsx`

- Grid 3 × 1 на desktop, stack на mobile
- Каждая карточка: обложка, title, genre tag, status badge ("готова к печати", "в работе", "non-fiction"), 1-предложение synopsis
- Клик → `/books/[slug]`

### 3.2 `/books/[slug]` — книжная страница

Layout:

```
[Hero с большой обложкой]
[Short hook / tagline — 1 предложение]
[Synopsis 200-300 слов]
[Sample chapters downloadable]
[Buy links / pre-order / "пишу издателям — пиши если интересуешься"]
[Blurbs (если есть)]
[Comparable titles]
[Back to /books]
```

Компонент: `src/components/sections/BookDetail.tsx`

### 3.3 `/science` — research index

Перечень препринтов, статей, заметок. Компонент: `src/components/sections/PapersIndex.tsx`.

Карточка каждой работы: название, authors, abstract teaser, venue badge (arXiv / Zenodo / journal), status badge, CTAs (PDF, code, DOI).

### 3.4 `/science/pointer-architecture` — главная страница препринта

Layout:

```
[Title]
[Authors]
[Status badge — preprint v2 / arXiv pending / Zenodo DOI]

[Abstract]

[CTAs: Read PDF · Download code · DOI · Cite this work]

[TL;DR — bullets на одну страницу]
- 3-model head-to-head on 171 SPARC galaxies
- Constrained Pointer wins AIC on 60/171
- Partial correlation on halo extent: ρ = +0.19, q_FDR = 0.04
- 4/6 residual-structure features correlated with age
- Full reproducibility pipeline released

[Methodology summary (collapsible)]

[Predictions + falsification criteria (7 hypotheses)]

[FAQ — честные ответы на вопросы "что это доказывает / не доказывает"]

[Companion book link → /books/celestial-code]
[References section → /science/references]
```

### 3.5 `/essays` — long-form writings

Blog-style. MDX-источник. Каждое эссе:

```
/essays/a-loss-function-for-the-universe
/essays/five-puzzles-one-shape
/essays/antimatter-as-commit-log
/essays/...
```

Плюс первое эссе, которое уже написано: `submissions/essay-pointer-architecture-en.md`. Перенести в MDX.

### 3.6 `/about` — автор

- Фото, имя, one-paragraph bio в стиле препринта (PhD + INITE + writing programme).
- Research affiliations (Neurah, etc.).
- Contact CTAs: email `mf@mikefluff.com`, X/LinkedIn ссылки, newsletter signup.
- Agent/publisher contact: "I am seeking representation for EN/PT-BR rights. Serious inquiries → mf@mikefluff.com."

### 3.7 `/contact` — форма

Minimal — agent/press/publisher. Fields: name, affiliation, purpose dropdown (rights inquiry / review copy / interview / other), message.

Backend: email relay через Resend / Postmark (лёгкая интеграция) → `mf@mikefluff.com`.

---

## 4. UI-система и компоненты

### Новые шэйр-компоненты:

- `Header.tsx` — persistent navigation (Home, Books, Science, Essays, About). Sticky sub top bar. Язык-switcher (EN/RU).
- `Footer.tsx` — links (social, GitHub, preprint, Zenodo, contact, book series), copyright.
- `BookCard.tsx`, `PaperCard.tsx`, `EssayCard.tsx` — общая карточка-паттерн.
- `Badge.tsx` (уже есть) — extend: `status`, `genre`, `language` vars.
- `PdfViewer.tsx` (optional) — embed PDF preview для препринта.

### Темы

- Dark theme (primary), как сейчас
- Light theme fallback (`prefers-color-scheme: light`) для лучшего reader-mode на эссе

### Typography

- Хорошая читаемая serif на long-form (`/essays/*`, `/books/*/synopsis`)
- Current sans-serif для UI
- `@next/font` с preload variable Inter + fraunces или Fraunces/Literata для serif

---

## 5. Контент — что нужно написать

### Для книг:

**Celestial Code (Небесный Код)**:
- Synopsis 300 слов EN + RU
- 3 sample chapters PDF (ch01, ch06, ch11) — выжимки
- One-line hook: "Пять независимых открытий в пяти разных областях складываются в одну картину — и эта картина проверяется на данных"
- Status: "в работе, 5.5 а.л. / target 8 а.л., ~март 2027"

**Bugs Academy (Академия Багов)**:
- Synopsis EN + RU + PT-BR
- First 3 chapters sample PDF
- One-line hook: "Debugger спасает вселенную"
- Status: "готова, 11.5 а.л., 231 стр., ищет издателя"

**Era of Architects (Эра Архитекторов)**:
- Current synopsis + story-bible tease
- Status: "в работе, 1.0 а.л., 3/17 глав"

### Для науки:

- Pointer Architecture landing: уже есть весь материал из `preprints/pointer-architecture/`. Нужно только перенести abstract + key numbers + TL;DR в страницу.
- References page: список цитированных работ с 1-2 предложения про каждую.

### Для эссе:

- Migrate `submissions/essay-pointer-architecture-en.md` → `content/essays/a-loss-function-for-the-universe.mdx`
- 2-3 следующих эссе — можно пока placeholder.

### Для About:

- Bio 150-200 слов: PhD в [год], founder of INITE, published in [venues], forthcoming books, currently researching pointer architecture. Stylistically: Manson-adjacent ("physicist with questions, not prophet with answers").
- Фото (high quality headshot)

---

## 6. SEO + Social

- Per-page `metadata` export (Next 13+ App Router convention)
- Dynamic OG image через `/api/og?title=&subtitle=&type=` (расширить текущий)
- Structured data schemas:
  - Home: `WebSite`
  - Books: `Book` schema
  - Papers: `ScholarlyArticle`
  - Essays: `Article`
  - About: `Person`
- `robots.txt` — allow всё
- Sitemap: динамический в `src/app/sitemap.ts`
- Twitter card per page с правильным image

---

## 7. Technical additions

### MDX pipeline

```bash
npm i @next/mdx @mdx-js/loader @mdx-js/react
npm i remark-gfm rehype-slug rehype-pretty-code
```

Setup: `next.config.ts` → add MDX support, `content/**/*.mdx` readable from App Router via `contentlayer` (или вручную `fs.readFileSync` при build).

Рекомендую **Contentlayer** (typed MDX) если хочется чисто, или **fumadocs-mdx** (new gen).

### Search

Optional v2. Algolia DocSearch или Pagefind (статический, бесплатный).

### Analytics

Plausible (privacy-first) или Vercel Analytics. НЕ Google Analytics — портит vibe.

### Newsletter

Kit (formerly ConvertKit) embed или Substack embed. Reader signup.

### Forms

Resend + Server Action для `/contact` — лёгкий путь без backend.

---

## 8. Performance

- `next/image` для всех обложек и фото
- Lazy load Framer Motion секций (dynamic import)
- Remove tsParticles на всё кроме `/` — дорогое по бандлу
- Route-level code splitting (Next App Router делает автоматически)
- Preload critical fonts
- Lighthouse target: 95+ на всех страницах

---

## 9. Deployment

- Текущий pipeline (Docker + Traefik + GH Actions) остаётся
- Добавить preview deployments для PR через GitHub Actions
- ENV vars: `RESEND_API_KEY`, `KIT_API_KEY` (newsletter), `PLAUSIBLE_DOMAIN`

---

## 10. Прирост identity (polish)

- **Author wordmark**: один шрифт, одно написание "Mikhail Savchenko" / "Михаил Савченко" везде
- **Series brand**: "Neural Cosmology" как серия из трёх книг + research programme. На `/books` index объяснить, что это все одна вселенная с разных углов.
- **Voice**: "scientist with questions, not prophet with answers" (формулировка из RESEARCH-critics.md)
- **Favicon + webmanifest**: осовременить, сейчас в `public/favicons`
- **404 page**: кастомная, с юмором

---

## 11. Приоритизированный execution order

### Sprint 1 (MVP hub, 3-4 дня)

1. Header + Footer с навигацией
2. `/books` index + 3 книжные landing pages (синопсисы + статусы)
3. `/science/pointer-architecture` landing (PDF download + abstract + TL;DR)
4. `/about` bio-страница
5. Обновлённый `/` — современный hero с CTAs на 3 направления (books / science / essays)

Результат: сайт уже можно показывать agents / publishers / academic endorsers.

### Sprint 2 (content + essays, 2-3 дня)

6. `/essays` + MDX pipeline
7. Перенос первого эссе "A Loss Function for the Universe"
8. `/science/references` — biblio
9. `/contact` форма

### Sprint 3 (i18n + polish, 2-3 дня)

10. `/ru/*` зеркала ключевых страниц
11. Dynamic OG images per page
12. Newsletter signup
13. Performance + Lighthouse pass

### Sprint 4 (nice-to-have, когда будет нужно)

14. Search (Pagefind)
15. PT-BR routes
16. PDF inline viewer
17. Interactive preprint annotations / comments
18. Blog/notes — когда будет писать чаще

---

## 12. Files to create in Sprint 1 (concrete TODOs)

```
src/components/layout/Header.tsx
src/components/layout/Footer.tsx
src/components/ui/BookCard.tsx
src/components/ui/PaperCard.tsx
src/content/books.ts                                 ← data
src/content/papers.ts                                ← data
src/app/books/page.tsx                               ← index
src/app/books/[slug]/page.tsx                        ← dynamic detail
src/app/science/page.tsx
src/app/science/pointer-architecture/page.tsx
src/app/about/page.tsx

public/covers/celestial-code.jpg                     ← cover art
public/covers/bugs-academy.jpg
public/covers/era-of-architects.jpg
public/pdfs/pointer-architecture-v2.pdf              ← copy from preprints/
public/pdfs/code-release.tar.gz                      ← code tarball
public/author-photo.jpg                              ← headshot

src/app/sitemap.ts                                   ← dynamic sitemap
```

---

## 13. Что в этом проекте уже хорошего (сохранить)

- Visual language (dark theme + particles + smooth motion) — keep for `/`
- Deployment pipeline
- SEO setup baseline
- Component library (Card/Badge/Button) — extend, не переписывать

---

## 14. Что можно выбросить/упростить

- `TabletSection.tsx` — если не укладывается в новый IA, выкинуть или перенести в `/essays`
- `PracticesSection.tsx` — переосмыслить: если это практики для readers of the book → `/books/celestial-code/practices`; если standalone content → `/essays/practices`
- `LecturesSection.tsx` — в `/talks` или `/about/talks` если будут записи

---

## 15. Open questions перед стартом

1. **Русский домен**: держим `neuralcosmology.com/ru` или отдельный типа `neuralcosmology.ru` / `neironnayakosmologiya.com`? Проще первое.
2. **Книги в русскоязычном сегменте**: ссылаться на Эксмо / Альпина когда появятся контракты, или пока просто "in progress"?
3. **Newsletter platform**: Substack vs Kit vs Beehiiv? (Substack = легче, но branding Substack. Kit = чище. Beehiiv = модно, дешёво.)
4. **Photo + cover art**: нужен фотосет и cover-дизайн для 3 книг. Это продакшен-уровень задача, подумать сколько времени/денег.
5. **Licensing для PDF препринта на сайте**: CC BY как в arxiv submission? Положить явно на странице.

---

## 16. Success criteria

- Agent заходит на сайт с URL-а из query letter → за 30 секунд понимает: кто автор, что за серия книг, и что есть серьёзная научная работа за ней.
- Academic endorser (Vanchurin / Verlinde) заходит на `/science/pointer-architecture` → получает PDF + code + DOI в один клик, видит ссылки на цитируемые работы.
- Читатель заходит по ссылке из соцсетей → попадает на эссе, читает, подписывается на newsletter.
- Журналист ищет autor → находит `/about` с bio, пресс-фото, цитатами и контактами.

Этот сайт — public HQ для всей программы. Если он хорош — всё остальное (query letters, endorsement asks, media pitches) работают в 2-3 раза эффективнее.
