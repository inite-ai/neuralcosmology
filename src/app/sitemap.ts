import type { MetadataRoute } from "next";
import { books } from "@/content/books";
import { papers } from "@/content/papers";
import { getAllSlugs } from "@/lib/essays";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/get-locale";

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

  return all.flatMap(({ path, priority }) =>
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
}
