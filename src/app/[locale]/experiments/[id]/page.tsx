import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sheet, Label, Headline, Button, RowLink } from "@/components/system";
import JsonLd from "@/components/seo/JsonLd";
import Standalone from "@/components/reader/widgets/Standalone";
import ChapterTracker from "@/components/reader/ChapterTracker";
import Subscribe from "@/components/subscribe/Subscribe";
import { experimentsUi } from "@/content/experiments-ui";
import { experimentView } from "@/lib/experiments";
import { experiments, getExperiment } from "@/lib/interactive";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import { ogImageUrl, social } from "@/lib/og";
import { breadcrumb } from "@/lib/schema";

// Опыт на своей странице: сам опыт, откуда он (глава и книга), вход в текст,
// подписка и другие опыты. Посадочная для посевов и рекламы.

export const dynamic = "force-dynamic";
const BASE = "https://neuralcosmology.com";
type Params = Promise<{ locale: string; id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: raw, id } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const it = getExperiment(id);
  const v = it && experimentView(it, locale);
  if (!v) return {};
  const url = `${BASE}/${locale}/experiments/${id}`;
  return {
    title: `${v.title} — ${experimentsUi[locale].nav}`,
    description: v.caption,
    alternates: { canonical: url, languages: { ...Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, `${BASE}/${l}/experiments/${id}`])), "x-default": `${BASE}/en/experiments/${id}` } },
    ...social({ title: v.title, subtitle: v.bookTitle, description: v.caption, url, kind: "experiment", locale, image: v.ogImage }),
  };
}

export default async function ExperimentPage({ params }: { params: Params }) {
  const { locale: raw, id } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const it = getExperiment(id);
  const v = it && experimentView(it, locale);
  if (!v) notFound();
  const ui = experimentsUi[locale];
  const dict = getDict(locale);
  const others = experiments().filter((x) => x.id !== id).map((x) => experimentView(x, locale)).filter((x) => x !== null);
  const sameBook = others.filter((x) => x.bookSlug === v.bookSlug);
  const more = [...sameBook, ...others.filter((x) => x.bookSlug !== v.bookSlug)].slice(0, 6);
  const url = `${BASE}/${locale}/experiments/${id}`;

  return (
    <main className="pt-14">
      <JsonLd
        id="experiment"
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: v.title,
          description: v.caption,
          url,
          inLanguage: locale,
          learningResourceType: "interactive simulation",
          interactivityType: "active",
          isAccessibleForFree: true,
          image: ogImageUrl({ title: v.title, subtitle: v.bookTitle, kind: "experiment", locale, image: v.ogImage }),
          author: { "@type": "Person", name: "Mikhail Savchenko", url: `${BASE}/${locale}/about` },
          isPartOf: { "@type": "Book", name: v.bookTitle, url: `${BASE}/${locale}/books/${v.bookSlug}` },
        }}
      />
      <JsonLd id="experiment-breadcrumb" data={breadcrumb(locale, [{ name: dict.nav.home, path: "" }, { name: ui.nav, path: "/experiments" }, { name: v.title, path: `/experiments/${id}` }])} />
      <Sheet>
        <header className="pt-14 pb-8 md:px-10 md:pt-20 md:pb-10">
          <Label className="mb-5">
            <Link href={`/${locale}/experiments`} className="transition-colors hover:text-fg">{ui.nav}</Link>
            <span className="text-muted"> · {v.bookTitle}</span>
          </Label>
          <Headline as="h1" size="display" className="max-w-5xl">{v.title}</Headline>
        </header>

        <section className="rule-t py-8 md:px-10 md:py-12">
          <div className="reader mx-auto max-w-3xl">
            <div className="reader-prose">
              <figure className="nc-x nc-x--try" id={`x-${v.id}`} data-x={v.id} data-w={v.widget}>
                <div className="nc-x-mount">
                  <Standalone widget={v.widget} lang={locale} props={v.props} />
                </div>
                <figcaption>{v.caption}</figcaption>
              </figure>
            </div>
          </div>
          <ChapterTracker />
        </section>

        {v.chapter && (
          <section className="rule-t grid gap-6 py-10 md:grid-cols-[12rem_1fr] md:px-10 md:py-14">
            <Label tone="muted">{ui.fromChapter}</Label>
            <div className="max-w-[62ch]">
              <p className="label text-muted">
                {v.bookTitle}
                {v.chapter.number ? ` · ${ui.chapter} ${v.chapter.number}` : ""}
              </p>
              <h2 className="mt-2 font-display text-3xl leading-snug">{v.chapter.title}</h2>
              {v.chapter.excerpt && <p className="mt-4 text-fg-secondary">{v.chapter.excerpt}</p>}
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={v.href}>{v.chapter.free ? ui.readFree : ui.read} →</Button>
                <Button href={`/${locale}/books/${v.bookSlug}`} variant="rule">{ui.book}</Button>
              </div>
            </div>
          </section>
        )}

        <section className="rule-t py-4 md:px-10">
          <div className="mx-auto max-w-3xl">
            <Subscribe locale={locale} book={v.bookSlug} source={`experiment:${id}`} />
          </div>
        </section>

        <section className="rule-t mt-10 py-12 md:px-10 md:py-16">
          <Label className="mb-4">{ui.more}</Label>
          <div className="rule-t">
            {more.map((x, i) => (
              <RowLink key={x.id} href={`/${locale}/experiments/${x.id}`} title={x.title} meta={x.bookTitle} index={String(i + 1).padStart(2, "0")} />
            ))}
          </div>
          <p className="mt-8">
            <Link href={`/${locale}/experiments`} className="label text-fg-secondary underline decoration-[0.5px] underline-offset-4 hover:text-fg">{ui.all} →</Link>
          </p>
        </section>
      </Sheet>
    </main>
  );
}
