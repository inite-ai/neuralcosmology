import Link from "next/link";
import type { ReactNode } from "react";
import type { SupportedLocale } from "@/lib/get-locale";

export function makeBookLink(locale: SupportedLocale) {
  return function BookLink({
    slug,
    children,
  }: {
    slug: string;
    children: ReactNode;
  }) {
    return (
      <Link
        href={`/${locale}/books/${slug}`}
        className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4 decoration-1 transition-colors"
      >
        {children}
      </Link>
    );
  };
}

/**
 * Patterns that mark a book reference inside essay prose. Each pattern is a
 * regex that matches the exact *spelling* of the title (any inflected form)
 * and maps to a book slug. Runs over the MDX source before parsing so the
 * resulting JSX is a valid MDX tag.
 */
const BOOK_PATTERNS: { re: RegExp; slug: string }[] = [
  // Russian — Небесный Код in any inflected form, inside quotes or as *emphasis*
  { re: /«(Небесн[а-яё]*\s+Код[а-яё]*)»/g, slug: "celestial-code" },
  { re: /\*(Небесный\s+Код)\*/g, slug: "celestial-code" },
  { re: /"(Небесн[а-яё]*\s+Код[а-яё]*)"/g, slug: "celestial-code" },
  // Russian — Академия Багов
  { re: /«(Академ[а-яё]*\s+Багов)»/g, slug: "bugs-academy" },
  { re: /\*(Академия\s+Багов)\*/g, slug: "bugs-academy" },
  // Russian — Эра Архитекторов
  { re: /«(Эр[а-яё]*\s+Архитекторов)»/g, slug: "era-of-architects" },
  { re: /\*(Эра\s+Архитекторов)\*/g, slug: "era-of-architects" },
  // English — Celestial Code
  { re: /\*(The\s+Celestial\s+Code|Celestial\s+Code)\*/g, slug: "celestial-code" },
  { re: /"(The\s+Celestial\s+Code|Celestial\s+Code)"/g, slug: "celestial-code" },
  // English — Bugs Academy
  { re: /\*(Bugs\s+Academy)\*/g, slug: "bugs-academy" },
  { re: /"(Bugs\s+Academy)"/g, slug: "bugs-academy" },
  // English — Era of Architects
  { re: /\*(Era\s+of\s+Architects)\*/g, slug: "era-of-architects" },
  { re: /"(Era\s+of\s+Architects)"/g, slug: "era-of-architects" },
];

/**
 * Wrap the first occurrence of every book title in the essay source with a
 * <BookLink slug="..."> tag pointing at the book detail page. Leaves the
 * matched text unchanged — the link wraps around it.
 */
export function linkifyBookMentions(source: string): string {
  let out = source;
  for (const { re, slug } of BOOK_PATTERNS) {
    out = out.replace(re, (match) => `<BookLink slug="${slug}">${match}</BookLink>`);
  }
  return out;
}
