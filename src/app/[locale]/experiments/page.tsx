import type { Metadata } from "next";
import Link from "next/link";
import { Sheet, Label, Headline } from "@/components/system";
import JsonLd from "@/components/seo/JsonLd";
import { experimentsUi } from "@/content/experiments-ui";
import { experimentView } from "@/lib/experiments";
import { experiments } from "@/lib/interactive";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import { social } from "@/lib/og";
import { breadcrumb } from "@/lib/schema";

// Витрина опытов: вход в книги через то, что можно потрогать.

export const dynamic = "force-dynamic";
const BASE = "https://neuralcosmology.com";
type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const ui = experimentsUi[locale];
  const url = `${BASE}/${locale}/experiments`;
  return {
    title: ui.metaTitle,
    description: ui.metaDescription,
    alternates: { canonical: url, languages: { ...Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, `${BASE}/${l}/experiments`])), "x-default": `${BASE}/en/experiments` } },
    ...social({ title: ui.title, subtitle: ui.lead, description: ui.metaDescription, url, kind: "experiments", locale }),
  };
}

export default async function ExperimentsPage({ params }: { params: Params }) {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const ui = experimentsUi[locale];
  const dict = getDict(locale);
  const list = experiments().map((it) => experimentView(it, locale)).filter((v) => v !== null);

  return (
    <main className="pt-14">
      <JsonLd
        id="experiments-list"
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: ui.title,
          itemListElement: list.map((v, i) => ({ "@type": "ListItem", position: i + 1, url: `${BASE}/${locale}/experiments/${v.id}`, name: v.title })),
        }}
      />
      <JsonLd id="experiments-breadcrumb" data={breadcrumb(locale, [{ name: dict.nav.home, path: "" }, { name: ui.nav, path: "/experiments" }])} />
      <Sheet>
        <header className="pt-14 pb-10 md:px-10 md:pt-24 md:pb-14">
          <Label className="mb-5">{ui.count(list.length)}</Label>
          <Headline as="h1" size="display" className="max-w-5xl">{ui.title}</Headline>
          <p className="mt-8 max-w-[62ch] text-lg text-fg-secondary md:text-xl">{ui.lead}</p>
        </header>
        <section className="rule-t py-10 md:px-10 md:py-14">
          <ul className="grid grid-cols-1 gap-[0.5px] bg-line hairline sm:grid-cols-2 lg:grid-cols-3 [&>*]:bg-bg">
            {list.map((v) => (
              <li key={v.id}>
                <Link href={`/${locale}/experiments/${v.id}`} className="group block h-full">
                  <div className="relative aspect-[3/2] overflow-hidden bg-line-soft">
                    {v.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100" />
                    )}
                  </div>
                  <div className="p-6">
                    <p className="label text-muted">{v.bookTitle}</p>
                    <h2 className="mt-2 font-display text-2xl leading-snug group-hover:text-primary">{v.title}</h2>
                    <p className="mt-3 line-clamp-3 text-sm text-fg-secondary">{v.caption}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Sheet>
    </main>
  );
}
