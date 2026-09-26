import type { SupportedLocale } from "@/lib/get-locale";
import { Sheet } from "@/components/system";
import {
  HomeHero,
  HomeDirections,
  HomeWhatIs,
  HomeAnomalies,
  HomeBooks,
  HomeTablet,
  HomePractices,
  HomeLectures,
  HomePractitioner,
  HomeContact,
  HomeMarquee,
  HomeFaq,
  type RecentLecture,
} from "@/components/home/sections";

export type { RecentLecture };

// Главная: герой во всю ширину, дальше — один лист с линейками,
// секции разделены 0.5px-правилами (DESIGN.md → Layout).
export default function HomeShell({
  locale,
  recentLectures = [],
  counts,
}: {
  locale: SupportedLocale;
  recentLectures?: RecentLecture[];
  counts: [number, number, number, number];
}) {
  return (
    <main id="main-container" className="pt-14 md:pt-0">
      <HomeHero locale={locale} />
      <Sheet>
        <HomeMarquee locale={locale} />
        <HomeDirections locale={locale} />
        <HomeAnomalies locale={locale} />
        <HomeWhatIs locale={locale} />
        <HomeBooks locale={locale} />
        <HomeTablet locale={locale} />
        <HomePractices locale={locale} />
        <HomeLectures locale={locale} recent={recentLectures} />
        <HomePractitioner locale={locale} />
        <HomeFaq locale={locale} />
        <HomeContact locale={locale} counts={counts} />
      </Sheet>
    </main>
  );
}
