export type BookStatus = "published" | "forthcoming" | "wip";
export type BookGenre = "non-fiction" | "sci-fi" | "literary-sci-fi";
export type Locale = "en" | "ru" | "pt";

export type Blurb = {
  author: string;
  affiliation?: string;
  quote: string;
};

export type BuyLink = {
  label: string;
  url: string;
};

export type Book = {
  slug: string;
  titles: Partial<Record<Locale, string>> & { en: string };
  hook: Partial<Record<Locale, string>> & { en: string };
  synopsis: Partial<Record<Locale, string>> & { en: string };
  status: BookStatus;
  statusLabel: Partial<Record<Locale, string>> & { en: string };
  genre: BookGenre;
  pages?: number;
  coverImage: string;
  publicationDate?: string;
  blurbs?: Blurb[];
  buyLinks?: BuyLink[];
  sampleChapters?: { label: string; url: string }[];
  comparables?: string[];
};
