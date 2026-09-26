import type { MetadataRoute } from "next";
import { books } from "@/content/books";
import { papers } from "@/content/papers";
import { getAllSlugs } from "@/lib/essays";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/get-locale";
import { getManifest, libraryLangs } from "@/lib/library";

// Бесплатные главы читалки берутся с диска сервера — пересобираем раз в час.
export const revalidate = 3600;

const BASE = "https://neuralcosmology.com";

type Entry = {
  path: string;
  priority: number;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths: Entry[] = [
    { path: "", priority: 1.0 },
    { path: "/books", priority: 0.9 },
    { path: "/science", priority: 0.9 },
    { path: "/essays", priority: 0.8 },
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
  const essayPaths: Entry[] = getAllSlugs().map((slug) => ({
    path: `/essays/${slug}`,
    priority: 0.7,
  }));

  const all: Entry[] = [...staticPaths, ...bookPaths, ...paperPaths, ...essayPaths];

  const localised: MetadataRoute.Sitemap = all.flatMap(({ path, priority }) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: now,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            SUPPORTED_LOCALES.map((l) => [l, `${BASE}/${l}${path}`]),
          ),
          "x-default": `${BASE}/${DEFAULT_LOCALE}${path}`,
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

  // Открытые главы онлайн-читалки: каждая на своём языке текста, без hreflang —
  // переводы глав не совпадают один к одному.
  const chapterEntries: MetadataRoute.Sitemap = books.flatMap((b) =>
    libraryLangs(b.slug).flatMap((lang) =>
      (getManifest(b.slug, lang)?.chapters ?? [])
        .filter((c) => c.free)
        .map((c) => ({
          url: `${BASE}/${lang}/read/${b.slug}/${c.id}`,
          lastModified: now,
          priority: 0.6,
        })),
    ),
  );

  return [...localised, ...chapterEntries, ...aiEntries];
}
