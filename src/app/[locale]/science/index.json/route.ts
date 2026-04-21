import { papers } from "@/content/papers";
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
  const body = {
    "@context": "https://neuralcosmology.com/",
    locale,
    count: papers.length,
    items: papers.map((p) => ({
      slug: p.slug,
      title: p.title,
      authors: p.authors,
      year: p.year,
      status: p.status,
      venue: p.venue,
      abstract: p.abstract,
      tldr: p.tldr,
      predictions: p.predictions,
      doi: p.doi,
      pdfUrl: p.pdfPath ? `https://neuralcosmology.com${p.pdfPath}` : undefined,
      codeUrl: p.codeUrl,
      license: p.license,
      url: `https://neuralcosmology.com/${locale}/science/${p.slug}`,
      rawMarkdown: `https://neuralcosmology.com/${locale}/science/${p.slug}/raw.md`,
      references: p.references?.length,
      companionBookSlug: p.companionBookSlug,
    })),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
    },
  });
}
