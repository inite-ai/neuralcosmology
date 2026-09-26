import type { Metadata } from "next";
import type { SupportedLocale } from "@/lib/get-locale";

// Превью ссылок (og:image / twitter:image) — одна фирменная карточка /api/og,
// у каждой страницы свой заголовок, подпись, раздел и картинка.

const BASE = "https://neuralcosmology.com";
const OG_LOCALE: Record<string, string> = { en: "en_US", ru: "ru_RU", pt: "pt_BR", es: "es_ES" };

export type OgKind = "answers" | "answer" | "home" | "books" | "book" | "chapter" | "essays" | "essay" | "lectures" | "lecture" | "science" | "preprint" | "about" | "page";

type Card = {
  title: string;
  subtitle?: string;
  kind: OgKind;
  locale: SupportedLocale | string;
  // Путь в public: /media/*.jpg, /covers/*.svg, /essays/covers/*.png
  image?: string | null;
};

export function ogImageUrl({ title, subtitle, kind, locale, image }: Card): string {
  const p = new URLSearchParams({ t: title.slice(0, 140), k: kind, l: locale });
  if (subtitle) p.set("s", subtitle.replace(/\s+/g, " ").slice(0, 220));
  if (image && image.startsWith("/")) p.set("i", image);
  return `${BASE}/api/og?${p}`;
}

// openGraph + twitter для страницы. Next.js не сливает openGraph родителя с дочерним,
// поэтому каждая страница отдаёт полный набор.
export function social(
  card: Card & { description: string; url: string; type?: "website" | "article" | "book" | "profile"; publishedTime?: string },
): Pick<Metadata, "openGraph" | "twitter"> {
  const img = { url: ogImageUrl({ ...card, subtitle: card.subtitle ?? card.description }), width: 1200, height: 630, alt: card.title };
  return {
    openGraph: {
      title: card.title,
      description: card.description,
      url: card.url,
      siteName: card.locale === "ru" ? "Нейронная космология" : "Neural Cosmology",
      type: card.type ?? "website",
      locale: OG_LOCALE[card.locale] ?? "en_US",
      alternateLocale: Object.values(OG_LOCALE).filter((l) => l !== (OG_LOCALE[card.locale] ?? "en_US")),
      ...(card.publishedTime ? { publishedTime: card.publishedTime } : {}),
      images: [img],
    },
    twitter: {
      card: "summary_large_image",
      title: card.title,
      description: card.description,
      images: [img.url],
    },
  };
}
