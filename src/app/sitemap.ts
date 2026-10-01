import type { MetadataRoute } from "next";
import { books } from "@/content/books";
import { papers } from "@/content/papers";
import { getAllSlugs as essaySlugs, getEssayBySlug } from "@/lib/essays";
import { getAllSlugs as lectureSlugs, getLectureBySlug } from "@/lib/lectures";
import { getAllAnswerSlugs, getAnswer } from "@/lib/answers";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/get-locale";
import { getManifest, libraryLangs } from "@/lib/library";
import { illustrations } from "@/lib/illustrations";

// Бесплатные главы читалки берутся с тома библиотеки, которого нет при сборке —
// sitemap строится на каждый запрос (дёшево, файл небольшой).
export const dynamic = "force-dynamic";

const BASE = "https://neuralcosmology.com";

type Entry = {
  path: string;
  priority: number;
  // Языки, на которых страница реально есть (по умолчанию — все).
  locales?: readonly string[];
  modified?: string;
};

const date = (iso?: string) => (iso && !Number.isNaN(Date.parse(iso)) ? new Date(iso) : undefined);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths: Entry[] = [
    { path: "", priority: 1.0 },
    { path: "/books", priority: 0.9 },
    { path: "/science", priority: 0.9 },
    { path: "/essays", priority: 0.8 },
    { path: "/answers", priority: 0.9 },
    { path: "/lectures", priority: 0.7 },
    { path: "/about", priority: 0.8 },
  ];
  const bookPaths: Entry[] = books.map((b) => ({
    path: `/books/${b.slug}`,
    priority: 0.8,
  }));
  const paperPaths: Entry[] = papers.map((p) => ({
    path: `/science/${p.slug}`,
    priority: 0.8,
  }));
  const essayPaths: Entry[] = essaySlugs().flatMap((slug) => {
    const e = getEssayBySlug(slug, DEFAULT_LOCALE);
    return e ? [{ path: `/essays/${slug}`, priority: 0.7, locales: e.availableLocales, modified: e.date }] : [];
  });
  const lecturePaths: Entry[] = lectureSlugs().flatMap((slug) => {
    const l = getLectureBySlug(slug, DEFAULT_LOCALE);
    return l ? [{ path: `/lectures/${slug}`, priority: 0.6, locales: l.availableLocales, modified: l.date }] : [];
  });

  const answerPaths: Entry[] = getAllAnswerSlugs().flatMap((slug) => {
    const a = getAnswer(slug, DEFAULT_LOCALE);
    return a ? [{ path: `/answers/${slug}`, priority: 0.9, locales: a.availableLocales, modified: a.updated }] : [];
  });

  const all: Entry[] = [...staticPaths, ...answerPaths, ...bookPaths, ...paperPaths, ...essayPaths, ...lecturePaths];

  // Только существующие переводы: страница без перевода отдаёт текст на другом языке
  // с каноническим адресом оригинала, в sitemap ей не место.
  const localised: MetadataRoute.Sitemap = all.flatMap(({ path, priority, locales = SUPPORTED_LOCALES, modified }) =>
    locales.map((locale) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: date(modified) ?? now,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${BASE}/${l}${path}`])),
          "x-default": `${BASE}/${locales.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : locales[0]}${path}`,
        },
      },
    })),
  );

  // AI-visibility surfaces (locale-agnostic, no hreflang alternates).
  // Discoverable identity files that LLM crawlers index alongside content.
  const aiSurfaces: { path: string; priority: number }[] = [
    { path: "/llms.txt", priority: 0.8 },
    { path: "/ai.json", priority: 0.8 },
    { path: "/identity.json", priority: 0.8 },
    { path: "/brand.txt", priority: 0.6 },
    { path: "/faq-ai.txt", priority: 0.6 },
    { path: "/.well-known/person.jsonld", priority: 0.7 },
  ];
  const aiEntries: MetadataRoute.Sitemap = aiSurfaces.map((s) => ({
    url: `${BASE}${s.path}`,
    lastModified: now,
    priority: s.priority,
  }));

  // Открытые главы онлайн-читалки: каждая на своём языке текста, с hreflang на ту же
  // главу в других переводах (id глав совпадают) и с иллюстрациями главы.
  const chapterEntries: MetadataRoute.Sitemap = books.flatMap((b) => {
    const langs = libraryLangs(b.slug);
    const has = (lang: (typeof langs)[number], id: string) => getManifest(b.slug, lang)?.chapters.some((c) => c.id === id && c.free);
    return langs.flatMap((lang) =>
      (getManifest(b.slug, lang)?.chapters ?? [])
        .filter((c) => c.free)
        .map((c) => {
          const peers = langs.filter((l) => has(l, c.id));
          const images = illustrations(b.slug, c.id).map((it) => `${BASE}/book/ill/${it.id}.webp`);
          return {
            url: `${BASE}/${lang}/read/${b.slug}/${c.id}`,
            lastModified: now,
            priority: 0.6,
            ...(peers.length > 1
              ? { alternates: { languages: Object.fromEntries(peers.map((l) => [l, `${BASE}/${l}/read/${b.slug}/${c.id}`])) } }
              : {}),
            ...(images.length ? { images } : {}),
          };
        }),
    );
  });

  return [...localised, ...chapterEntries, ...aiEntries];
}
