import type { Metadata } from "next";
import { Price, CurrencyPicker } from "@/components/pricing/Price";
import { social } from "@/lib/og";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookBySlug } from "@/content/books";
import { isSupportedLocale, type SupportedLocale } from "@/lib/get-locale";
import { getDict, pickLocalized } from "@/lib/i18n";
import { getChapterHtml, getManifest, libraryLangs, resolveBookLang, type LibraryChapter } from "@/lib/library";
import { getSession, authConfigured } from "@/lib/auth";
import { chapterGate, lockedGate, type Gate } from "@/lib/access";
import { allowPaidView, registerMark, watermark } from "@/lib/protect";
import { CURRENCY_COOKIE, LIBRARY_ITEM, PRICES, currencyFromAcceptLanguage, isCurrency, kindOf } from "@/content/pricing";
import { cookies, headers } from "next/headers";
import { purchaseTxId, recordPurchase } from "@/lib/ga-server";
import { capiUser } from "@/lib/meta-capi";
import ReaderChrome from "@/components/reader/ReaderChrome";
import ReaderInteractive from "@/components/reader/ReaderInteractive";
import { aiConfigured } from "@/lib/reader/ai";
import ReaderPrefsScript from "@/components/reader/ReaderPrefsScript";
import { readerFont } from "@/components/reader/font";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumb } from "@/lib/schema";
import { countScenes, illustrations, imageObject, leadIllustration, placeAtScenes, withIllustrations } from "@/lib/illustrations";
import { interactive, interactiveInserts } from "@/lib/interactive";
import ChapterWidgets from "@/components/reader/widgets/ChapterWidgets";
import Subscribe from "@/components/subscribe/Subscribe";
import ChapterTracker from "@/components/reader/ChapterTracker";

export const dynamic = "force-dynamic";

const BASE = "https://neuralcosmology.com";

type Params = Promise<{ locale: string; slug: string; chapter: string }>;

function load(rawLocale: string, slug: string, chapterId: string) {
  const locale: SupportedLocale = isSupportedLocale(rawLocale) ? rawLocale : "en";
  const book = getBookBySlug(slug);
  const lang = resolveBookLang(slug, locale);
  if (!book || !lang) return null;
  const manifest = getManifest(slug, lang);
  if (!manifest) return null;
  const index = manifest.chapters.findIndex((c) => c.id === chapterId);
  if (index < 0) return null;
  return { locale, book, lang, manifest, index, chapter: manifest.chapters[index] };
}

function chapterLabel(c: LibraryChapter, word: string) {
  return c.number ? `${word} ${c.number}. ${c.title}` : c.title;
}

const THROTTLE: Record<string, { label: string; body: string }> = {
  en: { label: "Pause", body: "Too many chapters opened in a few minutes. Reading continues in about ten minutes." },
  ru: { label: "Пауза", body: "Слишком много глав открыто за несколько минут. Чтение продолжится примерно через десять минут." },
  pt: { label: "Pausa", body: "Muitos capítulos abertos em poucos minutos. A leitura continua em cerca de dez minutos." },
  es: { label: "Pausa", body: "Demasiados capítulos abiertos en pocos minutos. La lectura continúa en unos diez minutos." },
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: raw, slug, chapter: id } = await params;
  const d = load(raw, slug, id);
  if (!d) return {};
  const bookTitle = pickLocalized(d.book.titles, d.lang);
  const title = `${d.chapter.title} — ${bookTitle}`;
  // Если книги нет на языке интерфейса, канонической считаем версию на языке текста.
  const canonical = `${BASE}/${d.lang}/read/${slug}/${id}`;
  // Та же глава на других языках текста: id глав одинаковы во всех переводах.
  const langs = libraryLangs(slug).filter((l) => getManifest(slug, l)?.chapters.some((c) => c.id === id));
  const languages = langs.length > 1
    ? { ...Object.fromEntries(langs.map((l) => [l, `${BASE}/${l}/read/${slug}/${id}`])), "x-default": `${BASE}/${langs.includes("en") ? "en" : langs[0]}/read/${slug}/${id}` }
    : undefined;
  // Превью ссылки — иллюстрация главы, если она есть; иначе обложка книги.
  const lead = leadIllustration(illustrations(slug, id));
  const image = lead ? `/book/ill/${lead.id}.og.jpg` : `/og/covers/${slug}.png`;
  return {
    title,
    description: d.chapter.excerpt,
    alternates: { canonical, ...(languages ? { languages } : {}) },
    robots: d.chapter.free ? { index: true, follow: true } : { index: false, follow: true },
    ...social({ title: d.chapter.title, subtitle: bookTitle, description: d.chapter.excerpt, url: canonical, kind: "chapter", locale: d.lang, type: "article", image }),
  };
}

export default async function ChapterPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ purchased?: string; item?: string }>;
}) {
  const { locale: raw, slug, chapter: id } = await params;
  // Вернулись со страницы оплаты — права перечитываем из биллинга без кэша.
  const sp = await searchParams;
  const fresh = sp.purchased === "1";
  const d = load(raw, slug, id);
  if (!d) notFound();
  const { locale, book, lang, manifest, index, chapter } = d;
  const dict = getDict(locale);
  const L = dict.library;

  const session = await getSession();
  const gate = await chapterGate(chapter, slug, session, fresh);
  const locked = await lockedGate(slug, session);
  // Покупка подтверждена сервером: после оплаты глава открылась → GA4 (Measurement Protocol).
  const boughtItem = sp.item === LIBRARY_ITEM ? LIBRARY_ITEM : slug;
  const txId = fresh && session && gate === "open" && !chapter.free ? purchaseTxId(session.sub, boughtItem) : null;
  if (txId && session) {
    const jar = await cookies();
    const h = await headers();
    const picked = jar.get(CURRENCY_COOKIE)?.value;
    const cur = isCurrency(picked) ? picked : currencyFromAcceptLanguage(h.get("accept-language"));
    const url = `https://neuralcosmology.com/${raw}/read/${slug}/${id}`;
    const meta = { ...capiUser(h, (n) => jar.get(n)?.value), email: session.email, url };
    await recordPurchase(session.sub, boughtItem, PRICES[kindOf(boughtItem)][cur], cur, jar.get("_ga")?.value, meta);
  }
  const source = gate === "open" ? getChapterHtml(slug, lang, chapter.id) : null;
  if (gate === "open" && source === null) notFound();
  // Платная глава: персональный водяной знак и лимит на выкачивание.
  const paid = gate === "open" && !chapter.free && session !== null;
  const throttled = paid && !allowPaidView(session.sub);
  if (paid && !throttled) await registerMark(session.sub, session.email);
  const marked = source && paid ? (throttled ? null : watermark(source, session.sub)) : source;
  // Иллюстрации размечены по разрывам сцен русского оригинала.
  // Опыты (content/interactive) встают так же, по сценам оригинала.
  const figures = illustrations(slug, chapter.id);
  const widgets = interactive(slug, chapter.id);
  const sourceScenes = figures.length || widgets.length ? countScenes(lang === "ru" ? source : getChapterHtml(slug, "ru", chapter.id)) : 0;
  const html = marked && placeAtScenes(withIllustrations(marked, figures, lang, sourceScenes), interactiveInserts(widgets, lang), sourceScenes);

  const bookTitle = pickLocalized(book.titles, lang);
  const hrefBase = `/${locale}/read/${slug}`;
  const here = `${hrefBase}/${chapter.id}`;
  const prev = manifest.chapters[index - 1];
  const next = manifest.chapters[index + 1];
  const loginHref = `/api/auth/login?returnTo=${encodeURIComponent(here)}`;

  const toc = manifest.chapters.map((c) => ({
    id: c.id,
    title: c.title,
    number: c.number,
    part: c.part,
    minutes: c.minutes,
    free: c.free,
    gate: (c.free ? "open" : locked) as Gate,
  }));

  return (
    <main>
      <JsonLd
        id="chapter-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "Chapter",
          name: chapter.title,
          position: index + 1,
          inLanguage: lang,
          url: `${BASE}${here}`,
          isAccessibleForFree: chapter.free,
          ...(figures.length ? { image: figures.map((f) => imageObject(f, lang)) } : {}),
          ...(chapter.free ? {} : { hasPart: { "@type": "WebPageElement", isAccessibleForFree: false, cssSelector: ".reader-locked" } }),
          isPartOf: { "@type": "Book", name: bookTitle, url: `${BASE}/${locale}/books/${slug}` },
          author: { "@type": "Person", name: "Mikhail Savchenko", url: BASE },
        }}
      />
      <JsonLd
        id="chapter-breadcrumb"
        data={breadcrumb(locale, [
          { name: dict.nav.home, path: "" },
          { name: dict.nav.books, path: "/books" },
          { name: bookTitle, path: `/books/${slug}` },
          { name: chapter.title, path: `/read/${slug}/${chapter.id}` },
        ])}
      />
      <ReaderChrome
        fontClass={readerFont.variable}
        bootstrap={<ReaderPrefsScript />}
        slug={slug}
        lang={lang}
        hrefBase={hrefBase}
        currentId={chapter.id}
        bookTitle={bookTitle}
        bookHref={`/${locale}/books/${slug}`}
        chapterLabel={chapterLabel(chapter, L.chapter)}
        toc={toc}
        labels={{ ...L, minutes: L.minutes }}
        account={
          authConfigured()
            ? {
                signedIn: !!session,
                email: session?.email,
                loginHref,
                logoutHref: `/api/auth/logout?returnTo=${encodeURIComponent(here)}`,
              }
            : null
        }
        trackProgress={gate === "open"}
      >
        <article className="mx-auto max-w-[38rem] pt-12 sm:pt-20" lang={lang}>
          <header className="mb-12 sm:mb-16">
            <div className="flex items-baseline justify-between gap-4 r-rule-b pb-4">
              <span className="label text-[var(--r-accent)]">{chapter.part ?? bookTitle}</span>
              <span className="label text-[var(--r-muted)]">
                {chapter.minutes} {L.minutes}
                {lang !== locale && ` · ${dict.reader.shownIn} ${lang}`}
              </span>
            </div>
            {chapter.number && (
              <p className="mt-10 font-display text-[clamp(3.5rem,12vw,5.5rem)] leading-none text-[var(--r-accent)]">
                {String(chapter.number).padStart(2, "0")}
              </p>
            )}
            <h1 className={`font-display text-[clamp(2.25rem,7vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-balance ${chapter.number ? "mt-4" : "mt-10"}`}>
              {chapter.title}
            </h1>
          </header>

          {html !== null ? (
            <>
              <div id="nc-recap-slot" />
              {figures.some((f) => f.kind === "archive") && <PlateFilter />}
              <div className="reader-prose" dangerouslySetInnerHTML={{ __html: html }} />
              {widgets.length > 0 && <ChapterWidgets />}
              <ChapterTracker book={slug} chapter={chapter.id} />
              {txId && <span hidden data-nc-tx={txId} />}
              {chapter.free && !session && <Subscribe locale={locale} book={slug} source="free-chapter" />}
              <ReaderInteractive
                book={slug}
                lang={lang}
                chapter={chapter.id}
                locale={locale}
                bookTitle={bookTitle}
                signedIn={!!session}
                loginHref={loginHref}
                aiEnabled={aiConfigured()}
                chapterIndex={index}
              />
            </>
          ) : throttled ? (
            <div className="reader-locked mt-4 r-hair bg-[var(--r-panel)] p-7 sm:p-10">
              <p className="label text-[var(--r-accent)]">{THROTTLE[locale].label}</p>
              <p className="mt-4 max-w-[46ch] text-[var(--r-soft)]">{THROTTLE[locale].body}</p>
            </div>
          ) : (
            <>
              <div className="reader-prose reader-teaser" dangerouslySetInnerHTML={{ __html: withIllustrations(chapter.teaser, figures, lang, sourceScenes, true) }} />
              <div className="reader-locked mt-4 r-hair bg-[var(--r-panel)] p-7 sm:p-10">
                <p className="label text-[var(--r-accent)]">{gate === "login" ? L.afterSignIn : L.afterPurchase}</p>
                <h2 className="mt-4 font-display text-[1.875rem] leading-[1.1] sm:text-[2.25rem]">
                  {gate === "login" ? L.gateLoginTitle : L.gatePurchaseTitle}
                </h2>
                <p className="mt-4 max-w-[46ch] text-[var(--r-soft)]">
                  {gate === "login" ? L.gateLoginBody : L.gatePurchaseBody}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {gate === "login" ? (
                    <a href={loginHref} className="inline-flex min-h-12 items-center justify-center rounded-sm bg-[var(--r-fg)] px-6 label text-[var(--r-bg)] transition-opacity hover:opacity-85">
                      {L.gateLoginCta}
                    </a>
                  ) : (
                    <>
                      <a href={checkoutHref(slug, here)} className="inline-flex min-h-12 items-center justify-center rounded-sm bg-[var(--r-fg)] px-6 label text-[var(--r-bg)] transition-opacity hover:opacity-85">
                        {L.gatePurchaseCta} · <Price item="book" />
                      </a>
                      <a href={checkoutHref(LIBRARY_ITEM, here)} className="inline-flex min-h-12 items-center justify-center rounded-sm border-[0.5px] border-[var(--r-fg)] px-6 label text-[var(--r-fg)] transition-colors hover:bg-[var(--r-fg)] hover:text-[var(--r-bg)]">
                        {L.gateBuyLibrary} · <Price item="library" />
                      </a>
                    </>
                  )}
                </div>
                {gate !== "login" && <CurrencyPicker className="mt-4 block label text-[var(--r-soft)]" />}
                {gate === "purchase" && !session && (
                  <a href={loginHref} className="mt-4 inline-block label text-[var(--r-soft)] underline decoration-[0.5px] underline-offset-4 hover:text-[var(--r-fg)]">
                    {L.gateHaveIt}
                  </a>
                )}
              </div>
              <Subscribe locale={locale} book={slug} source="gate" />
            </>
          )}

          <nav className="mt-20 grid gap-[0.5px] r-hair bg-[var(--r-line)] sm:grid-cols-2">
            {prev ? (
              <Link href={`${hrefBase}/${prev.id}`} className="group bg-[var(--r-bg)] p-6 transition-colors hover:bg-[var(--r-panel)]">
                <span className="label text-[var(--r-muted)]">← {L.prev}</span>
                <span className="mt-3 block font-display text-xl leading-snug group-hover:text-[var(--r-accent)]">{prev.title}</span>
              </Link>
            ) : (
              <span className="hidden bg-[var(--r-bg)] sm:block" />
            )}
            {next ? (
              <Link href={`${hrefBase}/${next.id}`} className="group bg-[var(--r-bg)] p-6 text-right transition-colors hover:bg-[var(--r-panel)]">
                <span className="label text-[var(--r-muted)]">{L.next} →</span>
                <span className="mt-3 block font-display text-xl leading-snug group-hover:text-[var(--r-accent)]">{next.title}</span>
              </Link>
            ) : (
              <Link href={`/${locale}/books/${slug}`} className="group bg-[var(--r-bg)] p-6 text-right transition-colors hover:bg-[var(--r-panel)]">
                <span className="label text-[var(--r-muted)]">{L.endOfBook}</span>
                <span className="mt-3 block font-display text-xl leading-snug group-hover:text-[var(--r-accent)]">{L.backToBook} →</span>
              </Link>
            )}
          </nav>
        </article>
      </ReaderChrome>
    </main>
  );
}

function checkoutHref(item: string, returnTo: string): string {
  return `/api/checkout?${new URLSearchParams({ item, returnTo })}`;
}

// Тонирует архивные фото в палитру сайта: яркость → от ночного индиго к бумаге.
function PlateFilter() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <filter id="nc-plate" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.04 0.22 0.55 0.93" />
          <feFuncG type="table" tableValues="0.05 0.24 0.56 0.91" />
          <feFuncB type="table" tableValues="0.11 0.36 0.66 0.88" />
        </feComponentTransfer>
      </filter>
    </svg>
  );
}
