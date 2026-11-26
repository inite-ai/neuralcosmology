import "server-only";
import { db } from "@/lib/db";
import { books } from "@/content/books";
import { getManifest, libraryLangs } from "@/lib/library";
import { pickLocalized } from "@/lib/i18n";

// Страница «Статистика»: свой счёт сайта (site_events) и, для книг «за контакт»,
// подтвердившие почту подписчики. Посетитель — человек в пределах суток (соль
// меняется в полночь UTC), поэтому «посетители» за месяц — сумма дней, не людей.

export const PERIODS = [7, 30, 90] as const;
export type Period = (typeof PERIODS)[number];
export const periodOf = (raw: string | undefined): Period => {
  const n = Number(raw);
  return (PERIODS as readonly number[]).includes(n) ? (n as Period) : 30;
};

const ZONE = "America/Sao_Paulo";

export type BookFunnel = {
  slug: string; title: string; free: boolean;
  page: number; opened: number; finishedFirst: number; signedUp: number; checkout: number; bought: number;
  chapters: { id: string; title: string; opened: number; read: number }[];
};

export async function siteStats(days: Period) {
  const sql = await db();
  const since = new Date(Date.now() - days * 86_400_000);
  const [daily, totals, sources, pages, countries, byBook, byChapter, signups, bookPages] = await Promise.all([
    sql<{ d: string; visitors: number; views: number }[]>`
      SELECT to_char((at AT TIME ZONE ${ZONE})::date, 'YYYY-MM-DD') AS d, count(DISTINCT visitor)::int AS visitors,
             count(*) FILTER (WHERE name = 'page')::int AS views
      FROM site_events WHERE at >= ${since} GROUP BY 1 ORDER BY 1`,
    sql<{ visitors: number; views: number; readers: number }[]>`
      SELECT count(DISTINCT visitor)::int AS visitors, count(*) FILTER (WHERE name = 'page')::int AS views,
             count(DISTINCT visitor) FILTER (WHERE name = 'chapter_open')::int AS readers
      FROM site_events WHERE at >= ${since}`,
    sql<{ source: string; visitors: number }[]>`
      SELECT source, count(DISTINCT visitor)::int AS visitors FROM site_events
      WHERE at >= ${since} AND name = 'page' AND source IS NOT NULL GROUP BY 1 ORDER BY 2 DESC LIMIT 15`,
    sql<{ path: string; views: number; visitors: number }[]>`
      SELECT path, count(*)::int AS views, count(DISTINCT visitor)::int AS visitors FROM site_events
      WHERE at >= ${since} AND name = 'page' AND path IS NOT NULL GROUP BY 1 ORDER BY 3 DESC, 2 DESC LIMIT 20`,
    sql<{ country: string; visitors: number }[]>`
      SELECT country, count(DISTINCT visitor)::int AS visitors FROM site_events
      WHERE at >= ${since} AND country IS NOT NULL GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
    sql<{ book: string; name: string; n: number }[]>`
      SELECT book, name, (CASE WHEN name IN ('checkout', 'purchase') THEN count(*) ELSE count(DISTINCT visitor) END)::int AS n
      FROM site_events WHERE at >= ${since} AND book IS NOT NULL AND name <> 'page' GROUP BY 1, 2`,
    sql<{ book: string; chapter: string; opened: number; read: number }[]>`
      SELECT book, chapter, count(DISTINCT visitor) FILTER (WHERE name = 'chapter_open')::int AS opened,
             count(DISTINCT visitor) FILTER (WHERE name = 'chapter_complete')::int AS read
      FROM site_events WHERE at >= ${since} AND chapter IS NOT NULL AND name IN ('chapter_open', 'chapter_complete') GROUP BY 1, 2`,
    sql<{ book: string; n: number }[]>`
      SELECT book, count(*)::int AS n FROM subscribers WHERE status = 'confirmed' AND confirmed_at >= ${since} AND book IS NOT NULL GROUP BY 1`,
    sql<{ path: string; visitors: number }[]>`
      SELECT path, count(DISTINCT visitor)::int AS visitors FROM site_events
      WHERE at >= ${since} AND name = 'page' AND path ~ '^/[a-z]{2}/books/[^/]+$' GROUP BY 1`,
  ]);

  const funnels: BookFunnel[] = books.map((b) => {
    const n = (name: string) => byBook.find((r) => r.book === b.slug && r.name === name)?.n ?? 0;
    const langs = libraryLangs(b.slug);
    const lang = langs.includes("ru") ? "ru" : langs[0];
    const chapters = ((lang && getManifest(b.slug, lang)?.chapters) || []).map((c) => {
      const row = byChapter.find((r) => r.book === b.slug && r.chapter === c.id);
      return { id: c.id, title: c.title, opened: row?.opened ?? 0, read: row?.read ?? 0 };
    });
    return {
      slug: b.slug,
      title: pickLocalized(b.titles, "ru"),
      free: b.freeForContact === true,
      page: bookPages.filter((p) => p.path.endsWith(`/books/${b.slug}`)).reduce((s, p) => s + p.visitors, 0),
      opened: n("chapter_open"),
      finishedFirst: chapters[0]?.read ?? 0,
      signedUp: signups.find((s) => s.book === b.slug)?.n ?? 0,
      checkout: n("checkout"),
      bought: n("purchase"),
      chapters,
    };
  });

  return {
    daily,
    totals: totals[0] ?? { visitors: 0, views: 0, readers: 0 },
    sources, pages, countries,
    books: funnels,
    library: { checkout: byBook.find((r) => r.book === "library" && r.name === "checkout")?.n ?? 0, bought: byBook.find((r) => r.book === "library" && r.name === "purchase")?.n ?? 0 },
  };
}
