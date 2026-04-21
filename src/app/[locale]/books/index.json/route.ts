import { books } from "@/content/books";
import { isSupportedLocale, SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/get-locale";
import { pickLocalized } from "@/lib/i18n";

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
    count: books.length,
    items: books.map((b) => ({
      slug: b.slug,
      title: pickLocalized(b.titles, locale),
      titles: b.titles,
      hook: pickLocalized(b.hook, locale),
      synopsis: pickLocalized(b.synopsis, locale),
      status: b.status,
      statusLabel: pickLocalized(b.statusLabel, locale),
      genre: b.genre,
      pages: b.pages,
      publicationDate: b.publicationDate,
      coverImage: `https://neuralcosmology.com${b.coverImage}`,
      companionPaperSlug: b.companionPaperSlug,
      url: `https://neuralcosmology.com/${locale}/books/${b.slug}`,
    })),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
    },
  });
}
