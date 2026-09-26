import type { Metadata } from "next";
import HomeShell from "@/components/home/HomeShell";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import { listLectures, getThumbnail } from "@/lib/lectures";
import { listEssays } from "@/lib/essays";
import { books } from "@/content/books";
import { papers } from "@/content/papers";

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
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `https://neuralcosmology.com/${locale}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `https://neuralcosmology.com/${l}`]),
      ),
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const recentLectures = listLectures(locale)
    .slice(0, 3)
    .map((l) => ({
      slug: l.slug,
      title: l.title,
      date: l.date,
      durationMinutes: l.durationMinutes,
      thumbnail: getThumbnail(l.videoUrl, l.cover),
    }));
  const counts: [number, number, number, number] = [
    books.length,
    papers.length,
    listEssays(locale).length,
    listLectures(locale).length,
  ];
  return <HomeShell locale={locale} recentLectures={recentLectures} counts={counts} />;
}
