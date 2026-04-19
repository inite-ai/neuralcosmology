import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import PaperCard from "@/components/ui/PaperCard";
import { papers } from "@/content/papers";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

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
    title: dict.science.indexTitle,
    description: dict.science.indexLead,
    alternates: {
      canonical: `https://neuralcosmology.com/${locale}/science`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `https://neuralcosmology.com/${l}/science`]),
      ),
    },
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
  return (
    <PageShell
      eyebrow={dict.science.indexEyebrow}
      title={dict.science.indexTitle}
      lead={dict.science.indexLead}
    >
      <div className="grid gap-6">
        {papers.map((paper) => (
          <PaperCard key={paper.slug} paper={paper} locale={locale} />
        ))}
      </div>
    </PageShell>
  );
}
