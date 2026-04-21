import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import BookCard from "@/components/ui/BookCard";
import { books } from "@/content/books";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict, pickLocalized } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { itemList, breadcrumb } from "@/lib/schema";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const dict = getDict(locale);
  return {
    title: dict.books.indexTitle,
    description: dict.books.indexLead,
    alternates: {
      canonical: `https://neuralcosmology.com/${locale}/books`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `https://neuralcosmology.com/${l}/books`]),
      ),
    },
  };
}

export default async function BooksIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const dict = getDict(locale);
  const items = books.map((b) => ({
    name: pickLocalized(b.titles, locale),
    path: `/books/${b.slug}`,
  }));
  return (
    <PageShell
      eyebrow={dict.books.indexEyebrow}
      title={dict.books.indexTitle}
      lead={dict.books.indexLead}
    >
      <JsonLd
        id="books-collection"
        data={itemList(locale, dict.books.indexTitle, dict.books.indexLead, "/books", items)}
      />
      <JsonLd
        id="books-breadcrumb"
        data={breadcrumb(locale, [
          { name: dict.nav.home, path: "" },
          { name: dict.nav.books, path: "/books" },
        ])}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <BookCard key={book.slug} book={book} locale={locale} />
        ))}
      </div>
    </PageShell>
  );
}
