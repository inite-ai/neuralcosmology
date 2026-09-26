import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookBySlug } from "@/content/books";
import { isSupportedLocale, type SupportedLocale } from "@/lib/get-locale";
import { getDict, pickLocalized } from "@/lib/i18n";
import { getChapterHtml, getManifest, resolveBookLang, type LibraryChapter } from "@/lib/library";
import { getSession, authConfigured } from "@/lib/auth";
import { chapterGate, lockedGate, type Gate } from "@/lib/access";
import { LIBRARY_ITEM, pricing } from "@/content/pricing";
import ReaderChrome from "@/components/reader/ReaderChrome";
import ReaderPrefsScript from "@/components/reader/ReaderPrefsScript";
import { readerFont } from "@/components/reader/font";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumb } from "@/lib/schema";

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

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: raw, slug, chapter: id } = await params;
  const d = load(raw, slug, id);
  if (!d) return {};
  const bookTitle = pickLocalized(d.book.titles, d.lang);
  const title = `${d.chapter.title} — ${bookTitle}`;
  // Если книги нет на языке интерфейса, канонической считаем версию на языке текста.
  const canonical = `${BASE}/${d.lang}/read/${slug}/${id}`;
  return {
    title,
    description: d.chapter.excerpt,
    alternates: { canonical },
    robots: d.chapter.free ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description: d.chapter.excerpt,
      url: canonical,
      type: "article",
      images: [
        `${BASE}/api/og?title=${encodeURIComponent(d.chapter.title)}&subtitle=${encodeURIComponent(bookTitle)}&kind=book`,
      ],
    },
  };
}

export default async function ChapterPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ purchased?: string }>;
}) {
  const { locale: raw, slug, chapter: id } = await params;
  // Вернулись со страницы оплаты — права перечитываем из биллинга без кэша.
  const fresh = (await searchParams).purchased === "1";
  const d = load(raw, slug, id);
  if (!d) notFound();
  const { locale, book, lang, manifest, index, chapter } = d;
  const dict = getDict(locale);
  const L = dict.library;

  const session = await getSession();
  const gate = await chapterGate(chapter, slug, session, fresh);
  const locked = await lockedGate(slug, session);
  const html = gate === "open" ? getChapterHtml(slug, lang, chapter.id) : null;
  if (gate === "open" && html === null) notFound();

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
        <article className="mx-auto max-w-[40rem] pt-10 sm:pt-16" lang={lang}>
          <header className="mb-10 sm:mb-14 text-center">
            {chapter.part && (
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--r-muted)] mb-4">
                {chapter.part}
              </div>
            )}
            {chapter.number && (
              <div className="text-sm text-[var(--r-accent)] mb-2">
                {L.chapter} {chapter.number}
              </div>
            )}
            <h1 className="font-[family-name:var(--font-reader)] text-3xl sm:text-4xl font-semibold leading-tight">
              {chapter.title}
            </h1>
            <div className="mt-4 text-xs text-[var(--r-muted)]">
              {chapter.minutes} {L.minutes}
              {lang !== locale && (
                <span className="ml-2 uppercase tracking-wider">
                  · {dict.reader.shownIn} {lang}
                </span>
              )}
            </div>
          </header>

          {html !== null ? (
            <div className="reader-prose" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <>
              <div
                className="reader-prose reader-teaser"
                dangerouslySetInnerHTML={{ __html: chapter.teaser }}
              />
              <div className="reader-locked mt-2 rounded-xl border border-[var(--r-faint)] bg-[var(--r-panel)] p-6 sm:p-8 text-center">
                <h2 className="text-lg font-semibold mb-2">
                  {gate === "login" ? L.gateLoginTitle : L.gatePurchaseTitle}
                </h2>
                <p className="text-sm text-[var(--r-muted)] mb-6 max-w-md mx-auto leading-relaxed">
                  {gate === "login" ? L.gateLoginBody : L.gatePurchaseBody}
                </p>
                {gate === "login" ? (
                  <a
                    href={loginHref}
                    className="inline-flex items-center rounded-md bg-[var(--r-accent-strong)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
                  >
                    {L.gateLoginCta}
                  </a>
                ) : (
                  <div className="flex flex-wrap justify-center gap-3">
                    <a
                      href={checkoutHref(slug, here)}
                      className="inline-flex items-center rounded-md bg-[var(--r-accent-strong)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
                    >
                      {L.gatePurchaseCta} · {pricing.book.label}
                    </a>
                    <a
                      href={checkoutHref(LIBRARY_ITEM, here)}
                      className="inline-flex items-center rounded-md border border-[var(--r-faint)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--r-faint)]"
                    >
                      {L.gateBuyLibrary} · {pricing.library.label}
                    </a>
                  </div>
                )}
              </div>
            </>
          )}

          <nav className="mt-16 flex items-stretch gap-3 border-t border-[var(--r-faint)] pt-8 text-sm">
            {prev ? (
              <Link
                href={`${hrefBase}/${prev.id}`}
                className="flex-1 rounded-lg p-3 hover:bg-[var(--r-faint)]"
              >
                <div className="text-xs text-[var(--r-muted)]">← {L.prev}</div>
                <div className="mt-1 line-clamp-2">{prev.title}</div>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
            {next ? (
              <Link
                href={`${hrefBase}/${next.id}`}
                className="flex-1 rounded-lg p-3 text-right hover:bg-[var(--r-faint)]"
              >
                <div className="text-xs text-[var(--r-muted)]">{L.next} →</div>
                <div className="mt-1 line-clamp-2">{next.title}</div>
              </Link>
            ) : (
              <Link
                href={`/${locale}/books/${slug}`}
                className="flex-1 rounded-lg p-3 text-right hover:bg-[var(--r-faint)]"
              >
                <div className="text-xs text-[var(--r-muted)]">{L.endOfBook}</div>
                <div className="mt-1">{L.backToBook} →</div>
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
