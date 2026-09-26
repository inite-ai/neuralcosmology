import type { Metadata } from "next";
import { social } from "@/lib/og";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { books, getBookBySlug } from "@/content/books";
import { Sheet, Label, Headline } from "@/components/system";
import { isSupportedLocale, SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/get-locale";
import { getDict, pickLocalized } from "@/lib/i18n";
import { getManifest, resolveBookLang } from "@/lib/library";
import { paywallEnabled } from "@/lib/access";
import { pricing } from "@/content/pricing";
import TocList from "@/components/reader/TocList";
import ContinueReading from "@/components/reader/ContinueReading";
import JsonLd from "@/components/seo/JsonLd";
import { bookSchema, breadcrumb } from "@/lib/schema";

// Оглавление приходит из экспорта LaTeX на диске сервера — перечитываем раз в 5 минут.
export const revalidate = 300;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    books.map((b) => ({ locale, slug: b.slug })),
  );
}

// Что получает читатель: объём, бесплатные главы, цена книги и всей библиотеки.
const OFFER: Record<SupportedLocale, { free: (n: number, t: number) => string; hours: (h: number) => string; forever: string; library: string }> = {
  en: { free: (n, t) => `${n} of ${t} chapters free`, hours: (h) => `≈ ${h} h of reading`, forever: "one payment, access forever, online and on any device", library: "All four books" },
  ru: { free: (n, t) => `${n} из ${t} глав бесплатно`, hours: (h) => `≈ ${h} ч чтения`, forever: "разовая оплата, доступ навсегда, онлайн на любом устройстве", library: "Все четыре книги" },
  pt: { free: (n, t) => `${n} de ${t} capítulos grátis`, hours: (h) => `≈ ${h} h de leitura`, forever: "pagamento único, acesso para sempre, online em qualquer dispositivo", library: "Os quatro livros" },
  es: { free: (n, t) => `${n} de ${t} capítulos gratis`, hours: (h) => `≈ ${h} h de lectura`, forever: "pago único, acceso para siempre, en línea en cualquier dispositivo", library: "Los cuatro libros" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const book = getBookBySlug(slug);
  if (!book) return {};
  const title = pickLocalized(book.titles, locale);
  const hook = pickLocalized(book.hook, locale);
  const base = "https://neuralcosmology.com";
  return {
    title,
    description: hook,
    alternates: {
      canonical: `${base}/${locale}/books/${slug}`,
      languages: {
        ...Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, `${base}/${l}/books/${slug}`])),
        "x-default": `${base}/en/books/${slug}`,
      },
    },
    ...social({ title, description: hook, url: `${base}/${locale}/books/${slug}`, kind: "book", locale, type: "book", image: `/og/covers/${slug}.png` }),
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const book = getBookBySlug(slug);
  if (!book) notFound();
  const dict = getDict(locale);
  const title = pickLocalized(book.titles, locale);
  const hook = pickLocalized(book.hook, locale);
  const synopsis = pickLocalized(book.synopsis, locale);
  const statusLabel = pickLocalized(book.statusLabel, locale);
  const L = dict.library;
  const readLang = resolveBookLang(book.slug, locale);
  const manifest = readLang ? getManifest(book.slug, readLang) : null;
  const lockedGate = paywallEnabled() ? ("purchase" as const) : ("login" as const);
  const chapters = manifest?.chapters ?? [];
  const freeCount = chapters.filter((c) => c.free).length;
  const hours = manifest ? Math.max(1, Math.round((manifest.words ?? 0) / 200 / 60)) : 0;
  const forSale = lockedGate === "purchase" && chapters.some((c) => !c.free);
  const O = OFFER[locale];

  const genreLabel = {
    "non-fiction": dict.books.genre.nonFiction,
    "sci-fi": dict.books.genre.sciFi,
    "literary-sci-fi": dict.books.genre.literarySciFi,
  } as const;

  const secondaryTitles = [
    { loc: "en" as const, value: book.titles.en },
    { loc: "ru" as const, value: book.titles.ru },
    { loc: "pt" as const, value: book.titles.pt },
  ].filter((t) => t.value && t.loc !== locale) as { loc: string; value: string }[];

  const availableTranslations = SUPPORTED_LOCALES.filter((l) => l !== locale && book.titles[l])
    .map((l) => ({
      locale: l,
      title: book.titles[l] as string,
      url: `https://neuralcosmology.com/${l}/books/${book.slug}`,
    }));

  return (
    <main className="pt-14">
      <JsonLd
        id="book-schema"
        data={bookSchema({
          locale,
          slug: book.slug,
          title,
          description: hook,
          synopsis,
          genre: genreLabel[book.genre],
          status: book.status,
          coverImage: book.coverImage,
          availableTranslations,
          publicationDate: book.publicationDate,
          pages: book.pages,
          license: book.license,
          licenseUrl: book.licenseUrl,
          companionPaperSlug: book.companionPaperSlug,
          offer: forSale ? { price: pricing.book.amount, currency: pricing.book.currency } : undefined,
          readUrl: chapters[0] ? `https://neuralcosmology.com/${readLang}/read/${book.slug}/${chapters[0].id}` : undefined,
        })}
      />
      <JsonLd
        id="book-breadcrumb"
        data={breadcrumb(locale, [
          { name: dict.nav.home, path: "" },
          { name: dict.nav.books, path: "/books" },
          { name: title, path: `/books/${book.slug}` },
        ])}
      />
      <Sheet>
        <div className="flex items-center justify-between rule-b py-4 md:px-10">
          <Link href={`/${locale}/books`} className="inline-flex min-h-10 items-center label text-muted hover:text-fg transition-colors">
            {dict.books.allBooks}
          </Link>
          <span className="label text-muted">{genreLabel[book.genre]}</span>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="py-10 md:px-10 lg:rule-r lg:py-16">
            <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden hairline lg:max-w-none">
              <Image src={book.coverImage} alt={title} fill sizes="(min-width: 1024px) 460px, 90vw" className="object-cover" priority />
            </div>
          </div>

          <div className="pb-14 md:px-10 lg:py-16">
            <Label className="mb-5">{statusLabel}</Label>
            <Headline as="h1" size="display">{title}</Headline>

            {secondaryTitles.length > 0 && (
              <p className="mt-4 text-sm text-muted">
                {secondaryTitles.map((t, i) => (
                  <span key={t.loc}>
                    {i > 0 && " · "}
                    <span className="label">{t.loc}</span> <span className="text-fg-secondary">{t.value}</span>
                  </span>
                ))}
              </p>
            )}

            <p className="mt-8 font-display text-[1.625rem] italic leading-snug text-fg md:text-[1.875rem]">{hook}</p>
            <p className="mt-6 max-w-[62ch] text-fg-secondary md:text-lg">{synopsis}</p>

            {chapters.length > 0 && (
              <p className="mt-8 label text-muted">
                {O.free(freeCount, chapters.length)} · {O.hours(hours)}
                {forSale && <> · {O.forever}</>}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {manifest && manifest.chapters.length > 0 && (
                <ContinueReading
                  slug={book.slug}
                  lang={readLang!}
                  hrefBase={`/${locale}/read/${book.slug}`}
                  firstId={manifest.chapters[0].id}
                  chapterIds={manifest.chapters.map((c) => c.id)}
                  labels={{ start: L.readOnline, continue: L.continueReading }}
                  className="inline-flex min-h-11 items-center justify-center rounded-sm bg-fg px-6 label text-bg transition-colors hover:bg-primary"
                />
              )}
              {manifest && lockedGate === "purchase" && manifest.chapters.some((c) => !c.free) && (
                <a
                  href={`/api/checkout?${new URLSearchParams({
                    item: book.slug,
                    returnTo: `/${locale}/read/${book.slug}/${(manifest.chapters.find((c) => !c.free) ?? manifest.chapters[0]).id}`,
                  })}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-sm hairline border-fg/70 px-6 label text-fg transition-colors hover:bg-fg hover:text-bg"
                >
                  {L.gatePurchaseCta} · {pricing.book.label}
                </a>
              )}
              {forSale && (
                <a
                  href={`/api/checkout?${new URLSearchParams({ item: "library", returnTo: `/${locale}/books` })}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-sm px-4 label text-primary transition-colors hover:text-fg"
                >
                  {O.library} · {pricing.library.label}
                </a>
              )}
              {[
                { url: "mailto:info@neuralcosmology.com?subject=Rights%20inquiry", label: dict.books.rightsInquiry },
                ...(book.sampleChapters ?? []),
                ...(book.buyLinks ?? []),
              ].map((l) => (
                <a key={l.url} href={l.url} className="inline-flex min-h-11 items-center justify-center px-2 label text-muted transition-colors hover:text-fg">
                  {l.label} →
                </a>
              ))}
            </div>

            {book.blurbs && book.blurbs.length > 0 && (
              <div className="mt-12 space-y-6">
                {book.blurbs.map((b, i) => (
                  <figure key={i} className="rule-l border-primary pl-5">
                    <blockquote className="font-display text-xl italic text-fg">“{b.quote}”</blockquote>
                    <figcaption className="mt-2 label text-muted">
                      {b.author}
                      {b.affiliation && `, ${b.affiliation}`}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}

            {book.comparables && (
              <div className="mt-12 rule-t pt-6">
                <p className="label text-muted mb-3">{dict.books.comparableHeader}</p>
                <ul className="space-y-1.5 text-fg-secondary">
                  {book.comparables.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {manifest && manifest.chapters.length > 0 && (
          <section id="contents" className="rule-t py-14 md:px-10 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
              <div>
                <Label className="mb-4">{L.contents}</Label>
                <Headline>{L.inLibrary}</Headline>
                <p className="mt-5 label text-muted">
                  {manifest.chapters.length} · {manifest.version && `${L.version} ${manifest.version}`}
                  {readLang !== locale && ` · ${dict.reader.shownIn} ${readLang}`}
                </p>
              </div>
              <div className="rule-t">
                <TocList
                  variant="page"
                  items={manifest.chapters.map((c) => ({
                    id: c.id,
                    title: c.title,
                    number: c.number,
                    part: c.part,
                    minutes: c.minutes,
                    free: c.free,
                    gate: c.free ? "open" : lockedGate,
                  }))}
                  slug={book.slug}
                  lang={readLang!}
                  hrefBase={`/${locale}/read/${book.slug}`}
                  labels={L}
                />
              </div>
            </div>
          </section>
        )}
      </Sheet>
    </main>
  );
}
