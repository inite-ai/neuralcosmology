import Image from "next/image";
import Link from "next/link";
import type { SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import { books } from "@/content/books";
import { pickLocalized } from "@/lib/i18n";
import { faqByLocale } from "@/content/faq";
import type { CSSProperties, ReactNode } from "react";
import { Waypoints, Flame, Zap, Network } from "lucide-react";
import { Band, Button, ArrowLink, CellGrid, Heading, Headline, Label } from "@/components/system";
import Plate, { type PlateId } from "@/components/system/Plate";
import ContactForm from "@/components/home/ContactForm";
import ScrollHero from "@/components/home/ScrollHero";
import { AiSummary } from "@/components/layout/chrome";
import { mainNav, readLabel } from "@/components/layout/nav";

// Секции главной. Серверные компоненты, mobile first: сначала телефон
// (одна колонка, 20px поля), md/lg только раскрывают сетку.

/** «Первая фраза. Вторая фраза.» → [первая, вторая] для курсивной второй части. */
function splitClause(text: string): [string, string | undefined] {
  const m = text.match(/^(.+?[.!?])\s+(.+)$/);
  return m ? [m[1], m[2]] : [text, undefined];
}

const pad = (n: number) => String(n).padStart(2, "0");

const AUTHOR: Record<SupportedLocale, string> = {
  en: "Mikhail Savchenko",
  ru: "Михаил Савченко",
  pt: "Mikhail Savchenko",
  es: "Mikhail Savchenko",
};

// ---------- Hero ----------

export function HomeHero({ locale }: { locale: SupportedLocale }) {
  const t = getDict(locale).home.hero;
  const nav = getDict(locale).nav;
  const [claim, clause] = splitClause(t.subhead);

  const card = (
    <div className="hero-glass w-full p-6 md:w-[560px] md:p-8">
      <p className="label opacity-75">
        {t.headline} · {AUTHOR[locale]}
      </p>
      <h1 className="mt-4 font-display text-[clamp(2.125rem,7.5vw,3rem)] leading-[1.04] tracking-[-0.02em] text-balance">
        {claim} {clause && <em className="italic opacity-80">{clause}</em>}
      </h1>
      <p className="mt-4 hidden text-base leading-relaxed opacity-80 sm:block">{t.subheadExtra}</p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link
          href={`/${locale}/science`}
          className="inline-flex min-h-11 items-center justify-center rounded-sm border border-current/60 label opacity-90 transition-opacity hover:opacity-100 md:min-h-10"
        >
          {nav.science}
        </Link>
        <Link
          href={`/${locale}/books`}
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-fg label text-bg transition-colors hover:bg-primary md:min-h-10"
        >
          {readLabel(locale)}
        </Link>
      </div>
      <AiSummary locale={locale} className="mt-5" />
    </div>
  );

  const pills = (
    <div className="flex items-center gap-2">
      <Link href={`/${locale}`} className="hero-glass flex h-11 items-center rounded-sm px-4 font-display text-[1.375rem] leading-none">
        Neural <em className="ml-1.5 italic opacity-80">Cosmology</em>
      </Link>
      <nav aria-label="Hero" className="hero-glass flex h-11 items-center rounded-sm pl-2 pr-1.5 label">
        {mainNav(locale)
          .slice(0, 3)
          .map((l) => (
            <Link key={l.href} href={l.href} className="px-3 py-2 opacity-85 hover:opacity-100">
              {l.label} ▸
            </Link>
          ))}
        <Link href={`/${locale}/about`} className="ml-1 inline-flex h-8 items-center rounded-sm bg-fg px-3 text-bg hover:bg-primary">
          {nav.about}
        </Link>
      </nav>
    </div>
  );

  return <ScrollHero card={card} pills={pills} />;
}

// ---------- Marquee: источники ----------

const SOURCES = [
  "Vazza & Feletti · 2020",
  "Landauer · 1961",
  "Bérut et al. · Nature 2012",
  "Levin Lab · Tufts",
  "Vanchurin · 2020",
  "Tononi · IIT",
  "Pointer Architecture · v9.0",
  "Witten · crossed product",
];

export function HomeMarquee({ locale }: { locale: SupportedLocale }) {
  const lead = getDict(locale).home.corePrinciples.axioms[0];
  return (
    <section className="rule-t py-8 md:py-10" aria-label={lead}>
      <p className="mb-6 px-0 text-center label text-muted md:px-10">{lead}</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-[marquee_42s_linear_infinite] gap-14 motion-reduce:animate-none">
          {[...SOURCES, ...SOURCES].map((s, i) => (
            <span key={i} className="whitespace-nowrap font-display text-2xl italic text-fg-secondary md:text-[1.75rem]">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Directions ----------

export function HomeDirections({ locale }: { locale: SupportedLocale }) {
  const h = getDict(locale).hero;
  const items = [
    { key: "books", href: `/${locale}/books` },
    { key: "science", href: `/${locale}/science` },
    { key: "essays", href: `/${locale}/essays` },
  ] as const;
  return (
    <Band id="directions" flush>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {items.map((it, i) => (
          <Link
            key={it.key}
            href={it.href}
            className="group flex flex-col gap-4 rule-b p-7 md:border-b-0 md:p-10 md:[&:not(:last-child)]:rule-r transition-colors hover:bg-bg-raised"
          >
            <div className="flex items-baseline justify-between">
              <Label>{h.directionsEyebrow[it.key]}</Label>
              <span className="label text-muted">{pad(i + 1)}</span>
            </div>
            <h3 className="font-display text-[1.75rem] leading-tight md:text-3xl">{h.directionsTitle[it.key]}</h3>
            <p className="text-fg-secondary text-base">{h.directionsBlurb[it.key]}</p>
            <span className="mt-auto pt-2 label text-fg group-hover:text-primary transition-colors">
              {h.exploreCta} →
            </span>
          </Link>
        ))}
      </div>
    </Band>
  );
}

// ---------- GridImage: картинка с сеткой 0.5px и карточкой в ячейке ----------

export function GridImage({
  plate,
  cols,
  rows,
  card,
  imgPosition = "object-center",
  caption,
  children,
}: {
  plate: PlateId;
  cols: number[];
  rows: number[];
  card: { left: number; right: number; top: number; bottom: number };
  imgPosition?: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <Band flush>
      <div className="md:relative md:h-[82vh] md:min-h-[640px]">
        <div className="relative aspect-[4/3] md:absolute md:inset-0 md:aspect-auto">
          <Plate id={plate} fill className="absolute inset-0" imgClassName={imgPosition} sizes="(min-width: 1280px) 1200px, 100vw" caption={caption} />
        </div>
        <div aria-hidden className="absolute inset-0 hidden md:block">
          {cols.map((c) => (
            <span key={`c${c}`} className="absolute top-0 bottom-0 w-0 border-l-[0.5px] border-white/35" style={{ left: `${c}%` }} />
          ))}
          {rows.map((r) => (
            <span key={`r${r}`} className="absolute right-0 left-0 h-0 border-t-[0.5px] border-white/35" style={{ top: `${r}%` }} />
          ))}
        </div>
        <div
          className="flex flex-col justify-center bg-bg py-10 rule-t md:absolute md:top-(--t) md:right-(--r) md:bottom-(--b) md:left-(--l) md:border-0 md:p-10 lg:p-12"
          style={{ "--l": `${card.left}%`, "--r": `${100 - card.right}%`, "--t": `${card.top}%`, "--b": `${100 - card.bottom}%` } as CSSProperties}
        >
          {children}
        </div>
      </div>
    </Band>
  );
}

// ---------- What is ----------

export function HomeWhatIs({ locale }: { locale: SupportedLocale }) {
  const t = getDict(locale).home.whatIs;
  const [claim, clause] = splitClause(t.lead1);
  return (
    <GridImage plate="neurons" cols={[52]} rows={[14, 90]} card={{ left: 52, right: 98, top: 14, bottom: 90 }} imgPosition="object-[30%_50%]" caption="PL. 02 · cortex">
      <Label className="mb-4">{t.title}</Label>
      <Headline em={clause} className="max-w-[22ch] !text-[clamp(1.875rem,3.2vw,2.5rem)]">
        {claim}
      </Headline>
      <p className="mt-6 text-fg-secondary">{t.leadMechanism}</p>
      <div className="mt-6 flex flex-wrap gap-x-6">
        <ArrowLink href={`/${locale}/science/pointer-architecture`}>Pointer Architecture</ArrowLink>
        <ArrowLink href={`/${locale}/essays`}>{getDict(locale).nav.essays}</ArrowLink>
      </div>
    </GridImage>
  );
}

/** Полноэкранный кадр с заголовком поверх. */
export function PhotoHeadline({
  plate,
  label,
  title,
  em,
  sub,
  position = "bottom-left",
  imgPosition = "object-center",
}: {
  plate: PlateId;
  label?: string;
  title: ReactNode;
  em?: ReactNode;
  sub?: string;
  position?: "center" | "bottom-left";
  imgPosition?: string;
}) {
  const center = position === "center";
  return (
    <Band flush>
      <div className={`relative flex min-h-[560px] overflow-hidden text-[#f3f1ea] md:h-[84vh] ${center ? "items-center justify-center" : "items-end"}`}>
        <Plate id={plate} fill className="absolute inset-0" imgClassName={imgPosition} sizes="(min-width: 1280px) 1200px, 100vw" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: center
              ? "linear-gradient(rgb(0 0 0 / .45), rgb(0 0 0 / .15) 45%, rgb(0 0 0 / .55))"
              : "linear-gradient(90deg, rgb(0 0 0 / .6), rgb(0 0 0 / .08) 62%), linear-gradient(transparent 40%, rgb(0 0 0 / .6))",
          }}
        />
        <div className={`relative ${center ? "px-6 text-center" : "max-w-[46rem] p-7 md:p-12"}`}>
          {label && <p className="label mb-4 text-[#f3f1ea]/75">{label}</p>}
          <Headline size={center ? "display" : "headline"} em={em} className={center ? "mx-auto max-w-[16ch] [&_em]:text-[#f3f1ea]/80" : "max-w-[20ch] [&_em]:text-[#f3f1ea]/80"}>
            {title}
          </Headline>
          {sub && <p className="mt-5 max-w-[46ch] whitespace-pre-line text-[#f3f1ea]/80 md:text-lg">{sub}</p>}
        </div>
      </div>
    </Band>
  );
}

// ---------- Five anomalies: ячейки с линейными иконками ----------

const ANOMALY_ICONS = [
  <Waypoints key="w" className="h-11 w-11" strokeWidth={0.75} />,
  <Flame key="f" className="h-11 w-11" strokeWidth={0.75} />,
  <Zap key="z" className="h-11 w-11" strokeWidth={0.75} />,
  <Network key="n" className="h-11 w-11" strokeWidth={0.75} />,
  <span key="phi" className="font-display text-5xl leading-none">Φ</span>,
];

const EVIDENCE: Record<SupportedLocale, string> = { en: "Evidence", ru: "Данные", pt: "Evidências", es: "Evidencia" };

export function HomeAnomalies({ locale }: { locale: SupportedLocale }) {
  const t = getDict(locale).home.corePrinciples;
  const axioms = t.axioms.slice(1);
  const cell = (a: string, i: number) => {
    const m = a.match(/^(.*?)\s*\(([^()]*)\)\s*\.?\s*(.*)$/);
    const body = m ? (m[3] ? `${m[1].replace(/[.,;]?$/, ".")} ${m[3]}` : m[1].replace(/[,;]?$/, "")) : a;
    return (
      <div key={i} className="flex flex-col gap-6 bg-bg p-7 md:p-10">
        <div className="flex items-start justify-between text-fg">
          {ANOMALY_ICONS[i]}
          <span className="label text-primary">{pad(i + 1)}</span>
        </div>
        <p className="text-fg md:text-[1.0625rem]">{body}</p>
        {m && <p className="mt-auto font-mono text-xs text-muted">{m[2]}</p>}
      </div>
    );
  };
  return (
    <Band id="core-principles">
      <Heading label={`${EVIDENCE[locale]} · ${pad(axioms.length)}`} title={`${t.title}.`} em={getDict(locale).home.whatIs.lead2.split(". ").slice(-1)[0]} />
      <div className="mt-14 hairline bg-line">
        <div className="grid gap-[0.5px] md:grid-cols-3">{axioms.slice(0, 3).map((a, i) => cell(a, i))}</div>
        <div className="mt-[0.5px] grid gap-[0.5px] md:grid-cols-2">{axioms.slice(3).map((a, i) => cell(a, i + 3))}</div>
      </div>
    </Band>
  );
}

// ---------- Stats ----------

const STAT_LABELS: Record<SupportedLocale, [string, string, string, string]> = {
  en: ["books", "preprint", "essays", "lectures"],
  ru: ["книги", "препринт", "эссе", "лекции"],
  pt: ["livros", "preprint", "ensaios", "palestras"],
  es: ["libros", "preprint", "ensayos", "conferencias"],
};

export function HomeStats({ locale, counts }: { locale: SupportedLocale; counts: [number, number, number, number] }) {
  const l = STAT_LABELS[locale];
  return (
    <div className="mt-14 grid grid-cols-2 gap-[0.5px] hairline bg-line md:grid-cols-4">
      {counts.map((n, i) => (
        <div key={l[i]} className="bg-bg px-4 py-10 text-center md:py-14">
          <p className="font-display text-[clamp(3rem,10vw,4.5rem)] leading-none">{n}</p>
          <p className="mt-5 label text-muted">{l[i]}</p>
        </div>
      ))}
    </div>
  );
}

// ---------- Tablet: ten commandments ----------

export function HomeTablet({ locale }: { locale: SupportedLocale }) {
  const t = getDict(locale).home.tablet;
  return (
    <>
      <PhotoHeadline plate="observatory" position="center" label={t.subtitle} title={t.title} sub={t.disclaimer} imgPosition="object-[70%_50%]" />
      <Band id="tablet" className="overflow-hidden">
        {/* Телефон и планшет: горизонтальный ряд со снапом. Десктоп: сетка 5×2. */}
        <ol className="snap-row -mx-5 flex gap-3 overflow-x-auto px-5 md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-[0.5px] lg:overflow-visible lg:bg-line lg:px-0 lg:hairline">
          {t.commandments.map((c, i) => (
            <li key={i} className="flex w-[78vw] max-w-80 shrink-0 flex-col gap-4 hairline bg-bg p-7 sm:w-[46vw] lg:w-auto lg:max-w-none lg:border-0 lg:p-8">
              <span className="number-fluid text-primary">{pad(i + 1)}</span>
              <h3 className="font-display text-2xl leading-tight">{c.title}</h3>
              <ul className="space-y-1.5 text-base text-fg-secondary">
                {c.desc.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <p className="mt-4 label text-muted lg:hidden">
          {pad(1)} — {pad(t.commandments.length)} →
        </p>
      </Band>
    </>
  );
}

// ---------- Practices ----------

export function HomePractices({ locale }: { locale: SupportedLocale }) {
  const t = getDict(locale).home.practices;
  return (
    <Band id="practices">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <Heading label={pad(t.list.length)} title={t.title} />
          <Button href="https://t.me/neuralcosmology" variant="rule" className="mt-8">
            {t.cta}
          </Button>
        </div>
        <ol className="rule-t">
          {t.list.map((p, i) => (
            <li key={i} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-3 rule-b py-5">
              <span className="label text-primary">{pad(i + 1)}</span>
              <span className="font-display text-xl leading-snug md:text-2xl">{p}</span>
            </li>
          ))}
        </ol>
      </div>
    </Band>
  );
}

// ---------- Lectures ----------

export type RecentLecture = {
  slug: string;
  title: string;
  date: string;
  durationMinutes?: number;
  thumbnail: string | null;
};

function formatDate(iso: string, locale: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

export function HomeLectures({ locale, recent }: { locale: SupportedLocale; recent: RecentLecture[] }) {
  const dict = getDict(locale);
  const t = dict.home.lectures;
  return (
    <Band id="lectures">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Heading label={t.title} title={recent.length ? dict.lecturesPage.title : t.headline} sub={recent.length ? undefined : t.sub} />
        <ArrowLink href={`/${locale}/lectures`}>{t.seeAll.replace(/\s*→$/, "")}</ArrowLink>
      </div>
      {recent.length > 0 ? (
        <CellGrid cols="md:grid-cols-3" className="mt-12">
          {recent.map((l) => (
            <Link key={l.slug} href={`/${locale}/lectures/${l.slug}`} className="group flex flex-col">
              {l.thumbnail && (
                <div className="relative aspect-video overflow-hidden bg-bg-sunk">
                  <Image
                    src={l.thumbnail}
                    alt={l.title}
                    fill
                    unoptimized
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover grayscale-[35%] transition duration-500 group-hover:grayscale-0"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-7">
                <span className="label text-muted">
                  {formatDate(l.date, locale)}
                  {l.durationMinutes ? ` · ${l.durationMinutes} ${dict.lecturesPage.durationSuffix}` : ""}
                </span>
                <h3 className="font-display text-2xl leading-tight group-hover:text-primary transition-colors">{l.title}</h3>
              </div>
            </Link>
          ))}
        </CellGrid>
      ) : (
        <Button href="https://t.me/neuralcosmology" variant="rule" className="mt-8">
          {t.cta}
        </Button>
      )}
    </Band>
  );
}

// ---------- Books: номерные ячейки, обложка выходит за край ----------

const GENRE: Record<SupportedLocale, { nf: string; fic: string }> = {
  en: { nf: "Non-fiction line", fic: "Fiction line" },
  ru: { nf: "Нон-фикшн", fic: "Художественная линия" },
  pt: { nf: "Não ficção", fic: "Linha de ficção" },
  es: { nf: "No ficción", fic: "Línea de ficción" },
};

export function HomeBooks({ locale }: { locale: SupportedLocale }) {
  const dict = getDict(locale);
  const L = dict.library;
  return (
    <Band id="books">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Heading label={dict.books.indexEyebrow} title={dict.books.indexTitle} />
        <ArrowLink href={`/${locale}/books`}>{dict.books.allBooks.replace(/^←\s*/, "")}</ArrowLink>
      </div>
      <div className="mt-14 grid gap-[0.5px] hairline bg-line md:grid-cols-2">
        {books.map((b, i) => {
          const title = pickLocalized(b.titles, locale);
          const fiction = b.genre !== "non-fiction";
          return (
            <article key={b.slug} className="group relative flex min-h-[26rem] flex-col bg-bg p-7 pb-10 md:min-h-[30rem] md:p-10">
              <div className="flex items-baseline justify-between">
                <span className="number-fluid text-primary">{pad(i + 1)}</span>
                <span className="label text-muted">{fiction ? GENRE[locale].fic : GENRE[locale].nf}</span>
              </div>
              <h3 className="mt-10 max-w-[12ch] sm:max-w-[58%] font-display text-[2rem] leading-[1.05] md:text-[2.5rem]">
                <Link href={`/${locale}/books/${b.slug}`} className="hover:text-primary transition-colors">
                  {title}
                </Link>
              </h3>
              <p className="mt-4 max-w-[26ch] text-fg-secondary sm:max-w-[58%]">{pickLocalized(b.hook, locale)}</p>
              <p className="mt-4 max-w-[28ch] sm:max-w-[58%] text-sm text-muted">
                {pickLocalized(b.statusLabel, locale)}
              </p>
              <div className="mt-auto flex flex-wrap gap-x-6 pt-8">
                <ArrowLink href={`/${locale}/read/${b.slug}`}>{L.readOnline}</ArrowLink>
                <ArrowLink href={`/${locale}/books/${b.slug}`}>{dict.books.readMore.replace(/\s*→$/, "")}</ArrowLink>
              </div>
              {/* Обложка — «объект», выступающий за границу ячейки */}
              <Link
                href={`/${locale}/books/${b.slug}`}
                aria-hidden
                tabIndex={-1}
                className="absolute right-6 bottom-8 hidden w-[34%] max-w-44 rotate-[4deg] shadow-[0_24px_60px_-20px_rgb(0_0_0/.7)] transition-transform duration-700 ease-(--ease-soft) group-hover:-translate-y-2 group-hover:rotate-[2deg] sm:block md:-right-3 md:bottom-auto md:top-24 lg:-right-5"
              >
                <Image src={b.coverImage} alt="" width={600} height={800} sizes="200px" className="h-auto w-full" />
              </Link>
            </article>
          );
        })}
      </div>
    </Band>
  );
}

// ---------- FAQ: ячейки с плюсом ----------

const FAQ_TITLE: Record<SupportedLocale, { label: string; title: string; em: string }> = {
  en: { label: "FAQ", title: "Questions people ask.", em: "Answered plainly." },
  ru: { label: "Вопросы", title: "Что обычно спрашивают.", em: "Отвечаю прямо." },
  pt: { label: "Perguntas", title: "O que costumam perguntar.", em: "Respostas diretas." },
  es: { label: "Preguntas", title: "Lo que suelen preguntar.", em: "Respuestas directas." },
};

export function HomeFaq({ locale }: { locale: SupportedLocale }) {
  const set = faqByLocale[locale];
  const items = [...set.science.slice(0, 3), ...set.about.slice(0, 3)];
  const t = FAQ_TITLE[locale];
  return (
    <Band id="faq">
      <Heading label={t.label} title={t.title} em={t.em} />
      <div className="mt-12 grid gap-[0.5px] hairline bg-line md:grid-cols-2">
        {items.map((f) => (
          <details key={f.question} className="group bg-bg [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 md:px-8">
              <span className="text-[1.0625rem] text-fg">{f.question}</span>
              <span aria-hidden className="relative h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-45">
                <span className="absolute left-0 top-1/2 h-px w-4 bg-fg" />
                <span className="absolute left-1/2 top-0 h-4 w-px bg-fg" />
              </span>
            </summary>
            <p className="px-6 pb-7 text-fg-secondary md:px-8">{f.answer}</p>
          </details>
        ))}
      </div>
    </Band>
  );
}

// ---------- Practitioner arm (mikefluff.com) ----------

const PRACTICE: Record<SupportedLocale, { eyebrow: string; title: string; body: string; bullets: string[]; cta: string; ctaSecondary: string }> = {
  en: {
    eyebrow: "The applied side",
    title: "Where the same discipline meets client work",
    body: "Away from the research desk, the same person runs a business and consulting practice as Mike Fluff, Business Doctor: AI automation, regulatory immunity (PII handling, GDPR/LGPD/DPA, secure-by-design AI workflows), tech surgery and three courses. The same scientific habits, applied at the pace of client work.",
    bullets: ["AI automation & integration", "Regulatory immunity (AI privacy / compliance architecture)", "Three courses ($19 each)"],
    cta: "Visit mikefluff.com",
    ctaSecondary: "The essay that links the two",
  },
  ru: {
    eyebrow: "Прикладная сторона",
    title: "Где та же дисциплина встречается с клиентской работой",
    body: "Помимо исследований, тот же человек ведёт бизнес-практику под именем Mike Fluff, Business Doctor: ИИ-автоматизация, регуляторный иммунитет (персональные данные, GDPR/LGPD/DPA, ИИ, безопасный по построению), технологическая хирургия, три курса. Та же научная дисциплина, только в темпе клиентской работы.",
    bullets: ["ИИ-автоматизация и интеграции", "Регуляторный иммунитет (защита данных и соответствие требованиям для ИИ)", "Три курса ($19 каждый)"],
    cta: "Открыть mikefluff.com",
    ctaSecondary: "Эссе о том, как это связано",
  },
  pt: {
    eyebrow: "O lado aplicado",
    title: "Onde a mesma disciplina encontra o trabalho com clientes",
    body: "Longe da mesa de pesquisa, a mesma pessoa conduz uma prática de negócios e consultoria como Mike Fluff, Business Doctor: automação com IA, imunidade regulatória (dados pessoais, GDPR/LGPD/DPA, fluxos de IA seguros desde a concepção), cirurgia tecnológica e três cursos. Os mesmos hábitos científicos, no ritmo do trabalho com clientes.",
    bullets: ["Automação com IA e integrações", "Imunidade regulatória (privacidade/compliance para IA)", "Três cursos ($19 cada)"],
    cta: "Abrir mikefluff.com",
    ctaSecondary: "O ensaio que liga os dois lados",
  },
  es: {
    eyebrow: "El lado aplicado",
    title: "Donde la misma disciplina encuentra el trabajo con clientes",
    body: "Lejos de la mesa de investigación, la misma persona lleva una práctica de negocios y consultoría como Mike Fluff, Business Doctor: automatización con IA, inmunidad regulatoria (datos personales, GDPR/LGPD/DPA, flujos de IA seguros desde el diseño), cirugía tecnológica y tres cursos. Los mismos hábitos científicos, al ritmo del trabajo con clientes.",
    bullets: ["Automatización con IA e integraciones", "Inmunidad regulatoria (privacidad/compliance para IA)", "Tres cursos ($19 cada uno)"],
    cta: "Abrir mikefluff.com",
    ctaSecondary: "El ensayo que une ambos lados",
  },
};

export function HomePractitioner({ locale }: { locale: SupportedLocale }) {
  const c = PRACTICE[locale];
  return (
    <>
    <PhotoHeadline plate="landauer" label={c.eyebrow} title={c.title} imgPosition="object-[70%_50%]" />
    <Band id="practitioner-arm">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <p className="max-w-[60ch] text-fg-secondary md:text-lg">{c.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="https://www.mikefluff.com" rel="me noopener">
              {c.cta}
            </Button>
            <Button href={`/${locale}/essays/falsifiers-in-research-and-regulated-ai`} variant="rule">
              {c.ctaSecondary}
            </Button>
          </div>
        </div>
        <ul className="rule-t self-end">
          {c.bullets.map((b, i) => (
            <li key={i} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-3 rule-b py-4">
              <span className="label text-primary">{pad(i + 1)}</span>
              <span className="text-fg">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </Band>
    </>
  );
}

// ---------- Call to clarity (contact) ----------

export function HomeContact({ locale, counts }: { locale: SupportedLocale; counts: [number, number, number, number] }) {
  const t = getDict(locale).home.callToClarity;
  return (
    <>
    <Band id="call-to-clarity">
      <div className="mx-auto max-w-2xl text-center">
        <Label className="mb-5">{t.title}</Label>
        <Headline size="display" className="mx-auto max-w-[14ch]">
          {t.headline}
        </Headline>
        <p className="reveal mx-auto mt-6 max-w-[48ch] text-fg-secondary md:text-lg" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
          {t.body}
        </p>
      </div>
      <div className="mx-auto max-w-2xl">
        <ContactForm locale={locale} />
      </div>
    </Band>
    <Band>
      <Headline className="mx-auto max-w-[20ch] text-center" em={NUMBERS[locale].em}>
        {NUMBERS[locale].title}
      </Headline>
      <HomeStats locale={locale} counts={counts} />
    </Band>
    </>
  );
}

const NUMBERS: Record<SupportedLocale, { title: string; em: string }> = {
  en: { title: "The programme,", em: "by the numbers." },
  ru: { title: "Программа", em: "в цифрах." },
  pt: { title: "O programa", em: "em números." },
  es: { title: "El programa", em: "en cifras." },
};
