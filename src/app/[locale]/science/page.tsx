import type { Metadata } from "next";
import { social } from "@/lib/og";
import { seoTitle } from "@/content/seo";
import PageShell from "@/components/layout/PageShell";
import Plate from "@/components/system/Plate";
import PaperCard from "@/components/ui/PaperCard";
import { papers } from "@/content/papers";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
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
    title: seoTitle[locale].science,
    description: dict.science.indexLead,
    alternates: {
      canonical: `https://neuralcosmology.com/${locale}/science`,
      languages: {
        ...Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, `https://neuralcosmology.com/${l}/science`])),
        "x-default": `https://neuralcosmology.com/en/science`,
      },
    },
    ...social({ title: seoTitle[locale].science, description: dict.science.indexLead, url: `https://neuralcosmology.com/${locale}${"/science"}`, kind: "science", locale }),
  };
}

export default async function ScienceIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const dict = getDict(locale);
  const items = papers.map((p) => ({ name: p.title, path: `/science/${p.slug}` }));
  return (
    <PageShell
      eyebrow={dict.science.indexEyebrow}
      title={dict.science.indexTitle}
      lead={dict.science.indexLead}
    >
      <JsonLd
        id="science-collection"
        data={itemList(locale, dict.science.indexTitle, dict.science.indexLead, "/science", items)}
      />
      <JsonLd
        id="science-breadcrumb"
        data={breadcrumb(locale, [
          { name: dict.nav.home, path: "" },
          { name: dict.nav.science, path: "/science" },
        ])}
      />
      <section className="rule-t py-10 md:px-10 md:py-14">
        <div className="grid gap-[0.5px] hairline bg-line">
          {papers.map((paper) => (
            <PaperCard key={paper.slug} paper={paper} locale={locale} />
          ))}
        </div>
      </section>
      <section className="rule-t">
        <div className="relative aspect-[16/9] md:aspect-[21/9]">
          <Plate id="landauer" fill className="absolute inset-0" caption="PL. 03 · 1 bit = kT ln 2" sizes="(min-width: 1280px) 1200px, 100vw" />
        </div>
      </section>
    </PageShell>
  );
}
