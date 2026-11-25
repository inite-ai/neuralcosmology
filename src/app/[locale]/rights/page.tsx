import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { books, coverFor, getBookBySlug, ogCoverFor } from "@/content/books";
import { RIGHTS } from "@/content/rights";
import { Sheet, Label } from "@/components/system";
import RightsForm from "@/components/books/RightsForm";
import { getDict, pickLocalized } from "@/lib/i18n";
import { libraryLangs } from "@/lib/library";
import { social } from "@/lib/og";
import { isSupportedLocale, SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/get-locale";

const BASE = "https://neuralcosmology.com";
const pick = (l: string): SupportedLocale => (isSupportedLocale(l) ? l : "en");

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = pick((await params).locale);
  const c = RIGHTS[locale];
  const url = `${BASE}/${locale}/rights`;
  return {
    title: c.title,
    description: c.lede,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, `${BASE}/${l}/rights`])),
    },
    ...social({ title: c.title, description: c.lede, url, kind: "page", locale }),
  };
}

export default async function RightsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ book?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isSupportedLocale(raw)) notFound();
  const locale = raw;
  const { book: wanted } = await searchParams;
  const c = RIGHTS[locale];
  const dict = getDict(locale);

  return (
    <main className="pt-14">
      <Sheet>
        <article className="px-5 py-14 md:px-10 md:py-20">
          <Label className="mb-4">{dict.footer.links.press}</Label>
          <h1 className="display-fluid text-balance">{c.title}</h1>
          <p className="mt-6 max-w-[62ch] text-lg text-fg-secondary">{c.lede}</p>

          <section aria-labelledby="rights-books" className="mt-16">
            <h2 id="rights-books" className="font-display text-2xl md:text-3xl">{c.booksHeading}</h2>
            <ul className="mt-8 space-y-12">
              {books.map((book) => {
                const title = pickLocalized(book.titles, locale);
                const langs = SUPPORTED_LOCALES.filter((l) => libraryLangs(book.slug).includes(l));
                return (
                  <li key={book.slug} className="grid grid-cols-[minmax(0,1fr)] gap-6 sm:grid-cols-[8.5rem_minmax(0,1fr)] md:gap-10">
                    <Link href={`/${locale}/books/${book.slug}`} className="block w-32 sm:w-auto">
                      <Image src={coverFor(book, locale)} alt={title} width={600} height={900} sizes="(min-width: 640px) 136px, 128px" className="h-auto w-full rounded-sm" />
                    </Link>
                    <div className="min-w-0 max-w-[62ch]">
                      <h3 className="font-display text-2xl">
                        <Link href={`/${locale}/books/${book.slug}`} className="transition-colors hover:text-primary">{title}</Link>
                      </h3>
                      <p className="mt-3 leading-relaxed text-fg-secondary">{pickLocalized(book.hook, locale)}</p>
                      <p className="mt-4 label text-muted">{pickLocalized(book.statusLabel, locale)}</p>
                      {langs.length > 0 && (
                        <p className="mt-1 label text-muted">{c.textIn(langs.map((l) => c.langNames[l]).join(", "))}</p>
                      )}
                      {book.comparables && book.comparables.length > 0 && (
                        <p className="mt-3 text-sm text-muted">
                          {c.comparables}: {book.comparables.join("; ")}
                        </p>
                      )}
                      <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-sm">
                        <span className="text-muted">{c.covers}:</span>
                        {SUPPORTED_LOCALES.map((l) => (
                          <a key={l} href={ogCoverFor(book.slug, l)} download className="text-fg underline decoration-line underline-offset-4 hover:text-primary">
                            {l.toUpperCase()}
                          </a>
                        ))}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="rights-author" className="mt-16 max-w-[62ch]">
            <h2 id="rights-author" className="font-display text-2xl md:text-3xl">{c.authorHeading}</h2>
            <p className="mt-4 leading-relaxed text-fg-secondary">{dict.about.bio[0]}</p>
            <Link href={`/${locale}/about`} className="mt-3 inline-block text-fg underline decoration-line underline-offset-4 hover:text-primary">
              {c.authorLink}
            </Link>
          </section>

          <section id="form" aria-labelledby="rights-form" className="mt-16 max-w-2xl scroll-mt-20">
            <h2 id="rights-form" className="font-display text-2xl md:text-3xl">{c.formHeading}</h2>
            <p className="mt-4 mb-8 leading-relaxed text-fg-secondary">{c.formLede}</p>
            <RightsForm
              locale={locale}
              initialBook={wanted && getBookBySlug(wanted) ? wanted : "all"}
              books={books.map((b) => ({ slug: b.slug, title: pickLocalized(b.titles, locale) }))}
              copy={c.form}
            />
          </section>
        </article>
      </Sheet>
    </main>
  );
}
