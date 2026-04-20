import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { books, getBookBySlug } from "@/content/books";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict, pickLocalized } from "@/lib/i18n";
import { getReadable } from "@/lib/readables";

const statusStyle = {
  published: "border-emerald-400/40 text-emerald-200",
  forthcoming: "border-amber-400/40 text-amber-200",
  wip: "border-indigo-400/40 text-indigo-200",
} as const;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    books.map((b) => ({ locale, slug: b.slug })),
  );
}

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
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `${base}/${l}/books/${slug}`]),
      ),
    },
    openGraph: {
      title,
      description: hook,
      url: `${base}/${locale}/books/${slug}`,
      type: "book",
      images: book.coverImage ? [{ url: book.coverImage }] : undefined,
    },
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

  return (
    <main className="relative min-h-screen text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href={`/${locale}/books`}
          className="inline-block text-sm text-white/60 hover:text-white mb-8 transition-colors"
        >
          {dict.books.allBooks}
        </Link>

        <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:items-start">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900 shadow-2xl shadow-black/40">
            <Image
              src={book.coverImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Badge variant="outline" className="border-white/20 text-white/70 bg-transparent">
                {genreLabel[book.genre]}
              </Badge>
              <Badge
                variant="outline"
                className={cn("bg-transparent", statusStyle[book.status])}
              >
                {statusLabel}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight mb-4">
              {title}
            </h1>

            {secondaryTitles.length > 0 && (
              <div className="text-white/50 text-sm mb-4">
                {secondaryTitles.map((t, i) => (
                  <span key={t.loc}>
                    {i > 0 && " · "}
                    <span className="uppercase tracking-wider text-white/40">{t.loc}</span>:{" "}
                    <span className="text-white/70">{t.value}</span>
                  </span>
                ))}
              </div>
            )}

            <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-6 italic">
              {hook}
            </p>

            <div className="text-white/75 leading-relaxed">
              <p>{synopsis}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {getReadable(`${book.slug}-demo`) && (
                <Link
                  href={`/${locale}/read/${book.slug}-demo`}
                  className="inline-flex items-center rounded-md bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  {dict.books.readDemo}
                </Link>
              )}
              <a
                href="mailto:info@neuralcosmology.com?subject=Rights%20inquiry"
                className="inline-flex items-center rounded-md border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-5 py-2.5 text-sm font-medium transition-colors"
              >
                {dict.books.rightsInquiry}
              </a>
              {book.sampleChapters?.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  className="inline-flex items-center rounded-md border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  {s.label}
                </a>
              ))}
              {book.buyLinks?.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  className="inline-flex items-center rounded-md border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>

            {book.blurbs && book.blurbs.length > 0 && (
              <div className="mt-10 space-y-4">
                {book.blurbs.map((b, i) => (
                  <figure key={i} className="border-l-2 border-indigo-400/40 pl-4">
                    <blockquote className="text-white/80 italic">“{b.quote}”</blockquote>
                    <figcaption className="text-sm text-white/50 mt-1">
                      — {b.author}
                      {b.affiliation && <span className="text-white/40">, {b.affiliation}</span>}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}

            {book.comparables && (
              <div className="mt-10">
                <div className="text-xs uppercase tracking-widest text-white/50 mb-2">
                  {dict.books.comparableHeader}
                </div>
                <ul className="text-sm text-white/70 space-y-1">
                  {book.comparables.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
