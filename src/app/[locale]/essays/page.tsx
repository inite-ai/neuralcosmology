import type { Metadata } from "next";
import { social } from "@/lib/og";
import { seoTitle } from "@/content/seo";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import { listEssays } from "@/lib/essays";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import SiblingFeed from "@/components/essays/SiblingFeed";
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
    title: seoTitle[locale].essays,
    description: dict.essays.lead,
    alternates: {
      canonical: `https://neuralcosmology.com/${locale}/essays`,
      languages: {
        ...Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, `https://neuralcosmology.com/${l}/essays`])),
        "x-default": `https://neuralcosmology.com/en/essays`,
      },
      types: {
        "application/rss+xml": `https://neuralcosmology.com/${locale}/essays/rss.xml`,
      },
    },
    ...social({ title: seoTitle[locale].essays, description: dict.essays.lead, url: `https://neuralcosmology.com/${locale}${"/essays"}`, kind: "essays", locale }),
  };
}

function formatDate(iso: string, locale: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function EssaysIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const dict = getDict(locale);
  const essays = listEssays(locale);

  const items = essays.map((e) => ({ name: e.title, path: `/essays/${e.slug}` }));
  const [hero, ...rest] = essays;

  return (
    <PageShell
      eyebrow={dict.essays.eyebrow}
      title={dict.essays.title}
      lead={dict.essays.lead}
    >
      <JsonLd
        id="essays-collection"
        data={itemList(locale, dict.essays.title, dict.essays.lead, "/essays", items)}
      />
      <JsonLd
        id="essays-breadcrumb"
        data={breadcrumb(locale, [
          { name: dict.nav.home, path: "" },
          { name: dict.nav.essays, path: "/essays" },
        ])}
      />
      {essays.length === 0 ? (
        <section className="rule-t py-14 md:px-10">
          <p className="max-w-[60ch] text-fg-secondary">{dict.essays.placeholderBody}</p>
        </section>
      ) : (
        <>
          {hero && (
            <section className="rule-t">
              <Link href={`/${locale}/essays/${hero.slug}`} className="group grid lg:grid-cols-[1.4fr_1fr]">
                <div className="relative aspect-[16/10] overflow-hidden bg-bg-sunk lg:aspect-auto lg:min-h-[480px]">
                  {hero.cover && (
                    <Image
                      src={hero.cover}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 700px, 100vw"
                      priority
                      className="object-cover transition-transform duration-700 ease-(--ease-soft) group-hover:scale-[1.02]"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-6 py-10 md:px-10 lg:rule-l lg:py-14">
                  <div className="flex items-center gap-3 label text-muted">
                    <span className="text-primary">01</span>
                    <span>{formatDate(hero.date, locale)}</span>
                    {hero.readingTime && <span>· {hero.readingTime} min</span>}
                  </div>
                  <h2 className="font-display text-[2.25rem] leading-[1.05] md:text-[2.75rem] group-hover:text-primary transition-colors">
                    {hero.title}
                  </h2>
                  {hero.description && <p className="text-fg-secondary line-clamp-5">{hero.description}</p>}
                  <span className="mt-auto label text-fg group-hover:text-primary transition-colors">{dict.books.readMore}</span>
                </div>
              </Link>
            </section>
          )}

          {rest.length > 0 && (
            <section className="rule-t py-10 md:px-10 md:py-14">
              <ul className="grid gap-[0.5px] hairline bg-line sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((e, i) => (
                  <li key={e.slug} className="bg-bg">
                    <Link href={`/${locale}/essays/${e.slug}`} className="group flex h-full flex-col p-5 md:p-6 transition-colors hover:bg-bg-raised">
                      <div className="relative aspect-[16/10] overflow-hidden bg-bg-sunk">
                        {e.cover && (
                          <Image
                            src={e.cover}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw"
                            className="object-cover transition-transform duration-700 ease-(--ease-soft) group-hover:scale-[1.03]"
                          />
                        )}
                      </div>
                      <div className="mt-5 flex items-center gap-3 label text-muted">
                        <span className="text-primary">{String(i + 2).padStart(2, "0")}</span>
                        <span>{formatDate(e.date, locale)}</span>
                        {e.readingTime && <span>· {e.readingTime} min</span>}
                        {e.locale !== locale && <span className="ml-auto">{e.locale}</span>}
                      </div>
                      <h3 className="mt-3 font-display text-[1.625rem] leading-[1.1] group-hover:text-primary transition-colors">{e.title}</h3>
                      {e.description && <p className="mt-3 text-base text-fg-secondary line-clamp-3">{e.description}</p>}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="rule-t py-10 md:px-10 md:py-14">
            <SiblingFeed locale={locale} />
          </section>
        </>
      )}
    </PageShell>
  );
}
