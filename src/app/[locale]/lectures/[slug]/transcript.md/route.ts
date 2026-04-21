import { notFound } from "next/navigation";
import { getAllSlugs, getLectureBySlug, getTranscript, hasTranscript } from "@/lib/lectures";
import { isSupportedLocale, SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/get-locale";

export const dynamic = "force-static";

export function generateStaticParams() {
  const slugs = getAllSlugs().filter((s) => hasTranscript(s));
  return SUPPORTED_LOCALES.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string; slug: string }> },
) {
  const { locale: raw, slug } = await params;
  const locale: SupportedLocale = isSupportedLocale(raw) ? raw : "en";
  const result = getTranscript(slug, locale);
  const lecture = getLectureBySlug(slug, locale);
  if (!result || !lecture) notFound();

  const canonicalUrl = `https://neuralcosmology.com/${locale}/lectures/${slug}`;
  const fallbackNote =
    result.locale !== locale
      ? `<!-- Transcript shown in ${result.locale} — no ${locale} version yet. -->\n`
      : "";
  const body = `<!-- Canonical: ${canonicalUrl} -->\n${fallbackNote}\n${result.content}`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "index, follow, max-snippet:-1",
      Link: `<${canonicalUrl}>; rel="canonical"`,
    },
  });
}
