import { listLectures, getThumbnail, hasTranscript } from "@/lib/lectures";
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
  const lectures = listLectures(locale);
  const body = {
    "@context": "https://neuralcosmology.com/",
    locale,
    count: lectures.length,
    items: lectures.map((l) => ({
      slug: l.slug,
      title: l.title,
      description: l.description,
      date: l.date,
      videoUrl: l.videoUrl,
      durationMinutes: l.durationMinutes,
      tags: l.tags,
      locale: l.locale,
      availableLocales: l.availableLocales,
      thumbnail: getThumbnail(l.videoUrl, l.cover),
      url: `https://neuralcosmology.com/${locale}/lectures/${l.slug}`,
      transcriptUrl: hasTranscript(l.slug, locale)
        ? `https://neuralcosmology.com/${locale}/lectures/${l.slug}/transcript.md`
        : undefined,
    })),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
    },
  });
}
