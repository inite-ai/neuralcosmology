import { MIKEFLUFF, OTHER_BOOKS_COPY, otherBooks } from "@/content/other-books";
import type { SupportedLocale } from "@/lib/get-locale";

// Книги автора на mikefluff.com: обычные ссылки в HTML, на языке читателя.
export default function AlsoByAuthor({ locale, checker = false }: { locale: SupportedLocale; checker?: boolean }) {
  const t = OTHER_BOOKS_COPY[locale];
  return (
    <div>
      <p className="label text-muted mb-4">{t.label}</p>
      <ul className="space-y-3">
        {otherBooks.map((b) => (
          <li key={b.slug}>
            <a href={`${MIKEFLUFF}/${locale}/books/${b.slug}`} className="font-display text-xl text-fg hover:text-primary transition-colors">
              {b.titles[locale]}
            </a>
            <span className="text-fg-secondary"> — {b.about[locale]}</span>
          </li>
        ))}
        {checker && (
          <li>
            <a href={`${MIKEFLUFF}/${locale}/ai-text-checker`} className="font-display text-xl text-fg hover:text-primary transition-colors">
              {t.checker}
            </a>
            <span className="text-fg-secondary"> — {t.checkerAbout}</span>
          </li>
        )}
      </ul>
      <a href={`${MIKEFLUFF}/${locale}/books`} className="mt-5 inline-flex min-h-10 items-center label text-primary hover:text-fg transition-colors">
        {t.all} →
      </a>
    </div>
  );
}
