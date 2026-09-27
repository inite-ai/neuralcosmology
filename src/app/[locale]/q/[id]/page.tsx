import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sheet, Label, Button } from "@/components/system";
import { getBookBySlug } from "@/content/books";
import { dbConfigured } from "@/lib/db";
import { isSupportedLocale, type SupportedLocale } from "@/lib/get-locale";
import { pickLocalized } from "@/lib/i18n";
import { getManifest } from "@/lib/library";
import { social } from "@/lib/og";
import { authorName, excerpt } from "@/lib/reader/quote";
import { getShare } from "@/lib/reader/share";

// Страница цитаты по короткой ссылке «Поделиться»: цитата, автор, книга и вход
// в текст ровно с того абзаца. Превью в соцсетях — карточка с этой цитатой.

export const dynamic = "force-dynamic";

const BASE = "https://neuralcosmology.com";

const T: Record<SupportedLocale, { read: string; book: string; chapter: string }> = {
  ru: { read: "Читать с этого места", book: "О книге", chapter: "Глава" },
  en: { read: "Read from here", book: "About the book", chapter: "Chapter" },
  pt: { read: "Ler a partir daqui", book: "Sobre o livro", chapter: "Capítulo" },
  es: { read: "Leer desde aquí", book: "Sobre el libro", chapter: "Capítulo" },
};

type Params = Promise<{ locale: string; id: string }>;

async function load(id: string) {
  if (!dbConfigured()) return null;
  const s = await getShare(id).catch(() => null);
  const book = s && getBookBySlug(s.book);
  if (!s || !book) return null;
  const chapter = getManifest(s.book, s.lang)?.chapters.find((c) => c.id === s.chapter);
  if (!chapter) return null;
  return { s, book, chapter, bookTitle: pickLocalized(book.titles, s.lang) };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const d = await load(id);
  if (!d) return {};
  const author = authorName(d.s.lang);
  const title = `${author} — ${d.bookTitle}`;
  const description = excerpt(d.s.quote, 200);
  const url = `${BASE}/${d.s.lang}/q/${d.s.id}`;
  const image = { url: `${BASE}/api/quote-card?id=${d.s.id}`, width: 1200, height: 630, alt: description };
  const base = social({ title, subtitle: d.bookTitle, description, url, kind: "chapter", locale: d.s.lang, type: "article" });
  return {
    title,
    description,
    alternates: { canonical: url },
    // Цитаты — копии текста глав; в поиск идут сами главы.
    robots: { index: false, follow: true },
    openGraph: { ...base.openGraph, images: [image] },
    twitter: { ...base.twitter, images: [image.url] },
  };
}

export default async function QuotePage({ params }: { params: Params }) {
  const { locale: raw, id } = await params;
  const d = await load(id);
  if (!d) notFound();
  const { s, chapter, bookTitle } = d;
  const t = T[isSupportedLocale(raw) ? raw : s.lang];
  const guillemets = s.lang === "ru" || s.lang === "es";
  const paras = s.quote.split("\n\n");
  // Цитата, оборванная на запятой или тире, заканчивается многоточием.
  paras[paras.length - 1] = paras[paras.length - 1].replace(/[\s,;:—–-]+$/, "…");
  const readHref = `/${s.lang}/read/${s.book}/${s.chapter}#a-${s.anchor}`;

  return (
    <main className="pt-14">
      <Sheet>
        <section className="py-18 md:px-10 md:py-28">
          <Label className="mb-8">
            {bookTitle}
            {chapter.number ? ` · ${t.chapter} ${chapter.number}. ${chapter.title}` : ` · ${chapter.title}`}
          </Label>
          <blockquote lang={s.lang} className="max-w-[34ch] font-display text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.2] text-pretty">
            {paras.map((p, i) => (
              <p key={i} className={i ? "mt-[0.6em]" : undefined}>
                {i === 0 && (guillemets ? "«" : "“")}
                {p}
                {i === paras.length - 1 && (guillemets ? "»" : "”")}
              </p>
            ))}
          </blockquote>
          <p className="mt-8 text-fg-secondary md:text-lg">
            — {authorName(s.lang)}, <Link href={`/${s.lang}/books/${s.book}`} className="italic hover:text-primary">{bookTitle}</Link>
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Button href={readHref}>{t.read} →</Button>
            <Button href={`/${s.lang}/books/${s.book}`} variant="rule">{t.book}</Button>
          </div>
        </section>
      </Sheet>
    </main>
  );
}
