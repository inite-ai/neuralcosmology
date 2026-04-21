import { faqByLocale } from "@/content/faq";
import { isSupportedLocale, SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/get-locale";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: raw } = await params;
  const locale: SupportedLocale = isSupportedLocale(raw) ? raw : "en";
  const set = faqByLocale[locale];
  const body = {
    "@context": "https://neuralcosmology.com/",
    locale,
    sections: {
      science: {
        url: `https://neuralcosmology.com/${locale}/science/pointer-architecture`,
        entries: set.science,
      },
      about: {
        url: `https://neuralcosmology.com/${locale}/about`,
        entries: set.about,
      },
    },
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
    },
  });
}
