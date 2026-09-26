import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { social, ogImageUrl } from "@/lib/og";
import { getAllAnswerSlugs, getAnswer } from "@/lib/answers";
import { getEssayBySlug } from "@/lib/essays";
import { getBookBySlug } from "@/content/books";
import { papers } from "@/content/papers";
import { answersUi } from "@/content/answers-ui";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict, pickLocalized } from "@/lib/i18n";
import { makeBookLink, linkifyBookMentions } from "@/components/essays/BookLink";
import AuthorBio from "@/components/essays/AuthorBio";
import JsonLd from "@/components/seo/JsonLd";
import { Sheet, Label, Headline, RowLink } from "@/components/system";
import { answerArticleSchema, breadcrumb, faqSchema } from "@/lib/schema";

const BASE = "https://neuralcosmology.com";

export function generateStaticParams() {
  const slugs = getAllAnswerSlugs();
  return SUPPORTED_LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const a = getAnswer(slug, locale);
  if (!a) return {};
  // Без перевода страница показывает оригинал — канонический адрес у оригинала.
  const url = `${BASE}/${a.locale}/answers/${slug}`;
  return {
    title: a.title,
    description: a.description,
    keywords: a.keywords,
    alternates: {
      canonical: url,
      types: { "text/markdown": `${url}/raw.md` },
      languages: {
        ...Object.fromEntries(a.availableLocales.map((l) => [l, `${BASE}/${l}/answers/${slug}`])),
        "x-default": `${BASE}/${a.availableLocales.includes("en") ? "en" : a.availableLocales[0]}/answers/${slug}`,
      },
    },
    ...social({ title: a.title, description: a.description, url, kind: "answer", locale: a.locale, type: "article", publishedTime: a.date, image: a.image }),
  };
}

export default async function AnswerPage({ params }: { params: Params }) {
  const { locale: raw, slug } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const a = getAnswer(slug, locale);
  if (!a) notFound();
  const dict = getDict(locale);
  const ui = answersUi[locale];
  const BookLink = makeBookLink(locale);
  const paper = papers[0];

  const further = [
    ...(a.paper && paper ? [{ href: `/${locale}/science/${paper.slug}`, title: ui.preprintTitle, meta: ui.preprint }] : []),
    ...a.essays
      .map((s) => getEssayBySlug(s, locale))
      .filter((e) => e !== null)
      .map((e) => ({ href: `/${locale}/essays/${e.slug}`, title: e.title, meta: ui.essay })),
    ...a.books
      .map((s) => getBookBySlug(s))
      .filter((b) => b !== undefined)
      .map((b) => ({ href: `/${locale}/books/${b.slug}`, title: pickLocalized(b.titles, locale), meta: ui.book })),
  ];

  return (
    <main className="pt-14">
      <JsonLd
        id="answer-article"
        data={answerArticleSchema({
          locale: a.locale,
          slug,
          title: a.title,
          question: a.question,
          answer: a.answer,
          description: a.description,
          datePublished: a.date,
          dateModified: a.updated,
          keywords: a.keywords,
          image: ogImageUrl({ title: a.title, subtitle: a.description, kind: "answer", locale: a.locale, image: a.image }),
          availableLocales: a.availableLocales,
        })}
      />
      {a.faq.length > 0 && <JsonLd id="answer-faq" data={faqSchema(a.locale, `/answers/${slug}`, [{ question: a.question, answer: a.answer }, ...a.faq])} />}
      <JsonLd
        id="answer-breadcrumb"
        data={breadcrumb(locale, [
          { name: dict.nav.home, path: "" },
          { name: ui.nav, path: "/answers" },
          { name: a.title, path: `/answers/${slug}` },
        ])}
      />
      <Sheet>
        <header className="pt-14 pb-10 md:px-10 md:pt-24 md:pb-14">
          <Label className="mb-5">
            <a href={`/${locale}/answers`} className="hover:text-fg transition-colors">{ui.eyebrow}</a>
            {a.locale !== locale && <span className="text-muted"> · {ui.shownIn}</span>}
          </Label>
          <Headline as="h1" size="display" className="max-w-5xl">
            {a.question}
          </Headline>
        </header>

        <section className="rule-t grid gap-6 py-10 md:grid-cols-[12rem_1fr] md:px-10 md:py-14">
          <Label tone="muted">{ui.short}</Label>
          <p id="short-answer" className="max-w-[62ch] font-display text-2xl leading-snug text-fg md:text-3xl">
            {a.answer}
          </p>
        </section>

        <section className="rule-t py-12 md:px-10 md:py-16">
          <article className="prose-essay mx-auto max-w-3xl text-fg leading-relaxed">
            <MDXRemote source={linkifyBookMentions(a.content)} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} components={{ BookLink }} />
          </article>
          <p className="mx-auto mt-10 max-w-3xl label text-muted">
            {ui.updated} {a.updated}
          </p>
        </section>

        {a.faq.length > 0 && (
          <section className="rule-t py-12 md:px-10 md:py-16">
            <Label className="mb-6">{ui.faq}</Label>
            <div className="grid grid-cols-1 gap-[0.5px] bg-line hairline md:grid-cols-2 [&>*]:bg-bg">
              {a.faq.map((f) => (
                <div key={f.question} className="p-7 md:p-10">
                  <h2 className="font-display text-xl leading-snug md:text-2xl">{f.question}</h2>
                  <p className="mt-4 text-fg-secondary">{f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {further.length > 0 && (
          <section className="rule-t py-12 md:px-10 md:py-16">
            <Label className="mb-4">{ui.further}</Label>
            <div className="rule-t">
              {further.map((f, i) => (
                <RowLink key={f.href} href={f.href} title={f.title} meta={f.meta} index={String(i + 1).padStart(2, "0")} />
              ))}
            </div>
          </section>
        )}

        <section className="rule-t py-12 md:px-10">
          <div className="mx-auto max-w-3xl">
            <AuthorBio locale={locale} />
          </div>
        </section>
      </Sheet>
    </main>
  );
}
