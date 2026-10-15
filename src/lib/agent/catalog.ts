import "server-only";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/get-locale";
import { books } from "@/content/books";
import { getChapterHtml, getManifest, leadIn, libraryLangs } from "@/lib/library";
import { ACTIVE_CURRENCIES, LIBRARY_ITEM, PRICES, priceCodeFor } from "@/content/pricing";
import { siteUrl } from "@/lib/auth";

// Каталог для агентов: что есть, на каких языках, что открыто, сколько стоит.

export type ChapterAccess = "free" | "lead-in" | "paid";

export function catalog() {
  const site = siteUrl();
  const prices = (item: string) =>
    ACTIVE_CURRENCIES.map((currency) => ({
      currency,
      amount: PRICES[item === LIBRARY_ITEM ? "library" : "book"][currency],
      priceCode: priceCodeFor(item, currency),
    }));
  return {
    site,
    name: "Neural Cosmology",
    author: "Mikhail Savchenko",
    languages: SUPPORTED_LOCALES,
    mcp: `${site}/mcp`,
    markdown: "Append .md to any page URL, or send Accept: text/markdown.",
    purchase: {
      how: "Call the MCP tool create_checkout with the item and the reader's email; give the reader the returned checkoutUrl. After paying, the reader signs in on the site with that email to read.",
      library: { item: LIBRARY_ITEM, prices: prices(LIBRARY_ITEM) },
    },
    books: books.map((b) => {
      const langs = libraryLangs(b.slug);
      return {
        slug: b.slug,
        titles: b.titles,
        hook: b.hook,
        status: b.status,
        genre: b.genre,
        urls: Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, `${site}/${l}/books/${b.slug}`])),
        online: langs.length > 0,
        prices: langs.length > 0 ? prices(b.slug) : [],
        editions: langs.map((lang) => {
          const m = getManifest(b.slug, lang);
          return {
            lang,
            chapters: (m?.chapters ?? []).map((c) => ({
              id: c.id,
              number: c.number,
              title: c.title,
              minutes: c.minutes,
              access: chapterAccess(b.slug, lang, c),
              url: `${site}/${lang}/read/${b.slug}/${c.id}`,
            })),
          };
        }),
      };
    }),
  };
}

export function chapterAccess(slug: string, lang: SupportedLocale, c: { id: string; free: boolean }): ChapterAccess {
  if (c.free) return "free";
  return leadIn(getChapterHtml(slug, lang, c.id)) ? "lead-in" : "paid";
}
