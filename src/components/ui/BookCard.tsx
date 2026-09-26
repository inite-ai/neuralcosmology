import Link from "next/link";
import Image from "next/image";
import type { Book } from "@/types/book";
import type { SupportedLocale } from "@/lib/get-locale";
import { getDict, pickLocalized } from "@/lib/i18n";

// Ячейка книги: обложка → жанр/статус → название → хук. Без скруглений и теней.
export default function BookCard({ book, locale, index }: { book: Book; locale: SupportedLocale; index?: number }) {
  const dict = getDict(locale);
  const genreLabel = {
    "non-fiction": dict.books.genre.nonFiction,
    "sci-fi": dict.books.genre.sciFi,
    "literary-sci-fi": dict.books.genre.literarySciFi,
  } as const;
  const title = pickLocalized(book.titles, locale);

  return (
    <Link href={`/${locale}/books/${book.slug}`} className="group flex flex-col bg-bg p-5 md:p-7 transition-colors hover:bg-bg-raised">
      <div className="relative aspect-[3/4] overflow-hidden bg-bg-sunk hairline">
        <Image
          src={book.coverImage}
          alt={title}
          fill
          sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 ease-(--ease-soft) group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-6 flex items-baseline justify-between gap-3">
        <span className="label text-primary">{genreLabel[book.genre]}</span>
        {index !== undefined && <span className="label text-muted">{String(index + 1).padStart(2, "0")}</span>}
      </div>
      <h3 className="mt-3 font-display text-[1.75rem] leading-[1.08] group-hover:text-primary transition-colors">{title}</h3>
      <p className="mt-3 text-base text-fg-secondary">{pickLocalized(book.hook, locale)}</p>
      <p className="mt-auto pt-5 text-sm text-muted">{pickLocalized(book.statusLabel, locale)}</p>
    </Link>
  );
}
