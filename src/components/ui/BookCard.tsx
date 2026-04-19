import Link from "next/link";
import Image from "next/image";
import type { Book } from "@/types/book";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SupportedLocale } from "@/lib/get-locale";
import { getDict, pickLocalized } from "@/lib/i18n";

const statusStyle: Record<Book["status"], string> = {
  published: "border-emerald-400/40 text-emerald-200",
  forthcoming: "border-amber-400/40 text-amber-200",
  wip: "border-indigo-400/40 text-indigo-200",
};

export default function BookCard({
  book,
  locale,
}: {
  book: Book;
  locale: SupportedLocale;
}) {
  const dict = getDict(locale);
  const genreLabel = {
    "non-fiction": dict.books.genre.nonFiction,
    "sci-fi": dict.books.genre.sciFi,
    "literary-sci-fi": dict.books.genre.literarySciFi,
  } as const;

  const title = pickLocalized(book.titles, locale);
  const hook = pickLocalized(book.hook, locale);
  const statusLabel = pickLocalized(book.statusLabel, locale);

  return (
    <Link
      href={`/${locale}/books/${book.slug}`}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-white/20 transition-colors overflow-hidden"
    >
      <div className="relative aspect-[3/4] bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900">
        <Image
          src={book.coverImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2 flex-wrap">
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
        <h3 className="text-xl font-semibold text-white tracking-tight">{title}</h3>
        <p className="text-sm text-white/70 leading-relaxed">{hook}</p>
        <div className="mt-2 text-xs text-indigo-300/80 group-hover:text-indigo-200 transition-colors">
          {dict.books.readMore}
        </div>
      </div>
    </Link>
  );
}
