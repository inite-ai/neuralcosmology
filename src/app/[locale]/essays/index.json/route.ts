import { listEssays } from "@/lib/essays";
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
  const essays = listEssays(locale);
  const body = {
    "@context": "https://neuralcosmology.com/",
    locale,
    count: essays.length,
    items: essays.map((e) => ({
      slug: e.slug,
      title: e.title,
      description: e.description,
      date: e.date,
      author: e.author,
      tags: e.tags,
      locale: e.locale,
      availableLocales: e.availableLocales,
      readingTime: e.readingTime,
      url: `https://neuralcosmology.com/${locale}/essays/${e.slug}`,
      rawMarkdown: `https://neuralcosmology.com/${locale}/essays/${e.slug}/raw.md`,
    })),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
    },
  });
}
