import type { SupportedLocale } from "@/lib/get-locale";
import { SUPPORTED_LOCALES } from "@/lib/get-locale";

export const SITE_URL = "https://neuralcosmology.com";
export const AUTHOR_NAME = "Mikhail Savchenko";
export const AUTHOR_URL = `${SITE_URL}/en/about`;
export const AUTHOR_SAME_AS = [
  "https://t.me/neuralcosmology",
  "https://github.com/neuralcosmology",
];
export const SITE_NAME = "Neural Cosmology";
export const SITE_DESCRIPTION =
  "Public HQ for the Neural Cosmology programme: books, preprints, essays, lectures — a falsifiable research programme by Mikhail Savchenko.";

function localeUrl(locale: SupportedLocale, path = ""): string {
  return `${SITE_URL}/${locale}${path}`;
}

export function personNode() {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    url: AUTHOR_URL,
    sameAs: AUTHOR_SAME_AS,
    jobTitle: "Independent researcher, writer",
    knowsAbout: [
      "cosmology",
      "galactic rotation curves",
      "information geometry",
      "consciousness",
      "neuroscience",
      "theoretical physics",
    ],
  } as const;
}

export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/favicons/android-chrome-512x512.png`,
      width: 512,
      height: 512,
    },
    founder: { "@id": `${SITE_URL}/#person` },
    sameAs: AUTHOR_SAME_AS,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "editorial",
        email: "info@neuralcosmology.com",
        availableLanguage: ["en", "ru", "pt", "es"],
      },
    ],
  } as const;
}

export function websiteNode(locale: SupportedLocale, name: string, description: string) {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name,
    description,
    inLanguage: SUPPORTED_LOCALES.map((l) => l),
    publisher: { "@id": `${SITE_URL}/#organization` },
    author: { "@id": `${SITE_URL}/#person` },
    about: { "@id": `${SITE_URL}/#person` },
    workTranslation: SUPPORTED_LOCALES.filter((l) => l !== locale).map((l) => localeUrl(l)),
  } as const;
}

export function siteGraph(locale: SupportedLocale, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [personNode(), organizationNode(), websiteNode(locale, name, description)],
  } as const;
}

export function breadcrumb(
  locale: SupportedLocale,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: localeUrl(locale, it.path),
    })),
  } as const;
}

export function itemList(
  locale: SupportedLocale,
  name: string,
  description: string,
  path: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${localeUrl(locale, path)}#collection`,
    url: localeUrl(locale, path),
    name,
    description,
    inLanguage: locale,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: localeUrl(locale, it.path),
        name: it.name,
      })),
    },
  } as const;
}

export function bookSchema(args: {
  locale: SupportedLocale;
  slug: string;
  title: string;
  description: string;
  synopsis: string;
  genre: string;
  status: "published" | "forthcoming" | "wip";
  coverImage: string;
  availableTranslations: { locale: string; title: string; url: string }[];
  publicationDate?: string;
  pages?: number;
  isbn?: string;
  license?: string;
  licenseUrl?: string;
  companionPaperSlug?: string;
}) {
  const url = localeUrl(args.locale, `/books/${args.slug}`);
  const cover = args.coverImage.startsWith("http")
    ? args.coverImage
    : `${SITE_URL}${args.coverImage}`;
  const bookStatus = {
    published: "https://schema.org/Published",
    forthcoming: "https://schema.org/Forthcoming",
    wip: "https://schema.org/Draft",
  }[args.status];
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${url}#book`,
    name: args.title,
    headline: args.title,
    url,
    inLanguage: args.locale,
    description: args.description,
    abstract: args.synopsis,
    genre: args.genre,
    bookFormat: "https://schema.org/EBook",
    creativeWorkStatus: bookStatus,
    image: cover,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    datePublished: args.publicationDate,
    numberOfPages: args.pages,
    isbn: args.isbn,
    workTranslation: args.availableTranslations.map((t) => ({
      "@type": "Book",
      name: t.title,
      inLanguage: t.locale,
      url: t.url,
    })),
    license: args.licenseUrl,
    creditText: args.license,
    subjectOf: args.companionPaperSlug
      ? { "@id": `${SITE_URL}/${args.locale}/science/${args.companionPaperSlug}#article` }
      : undefined,
  } as const;
}

type Ref = {
  id: string;
  authors: string;
  year: number;
  title: string;
  venue: string;
  doi?: string;
  arxiv?: string;
};

export function scholarlyArticleSchema(args: {
  locale: SupportedLocale;
  slug: string;
  title: string;
  abstract: string;
  authors: string[];
  year: number;
  doi?: string;
  pdfPath?: string;
  codeUrl?: string;
  venue?: string;
  references?: Ref[];
  license?: string;
  licenseUrl?: string;
  companionBookSlug?: string;
}) {
  const url = localeUrl(args.locale, `/science/${args.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${url}#article`,
    url,
    headline: args.title,
    name: args.title,
    description: args.abstract,
    abstract: args.abstract,
    inLanguage: "en",
    datePublished: `${args.year}-01-01`,
    author: args.authors.map((n) =>
      n === AUTHOR_NAME ? { "@id": `${SITE_URL}/#person` } : { "@type": "Person", name: n },
    ),
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    identifier: args.doi
      ? [{ "@type": "PropertyValue", propertyID: "doi", value: args.doi }]
      : undefined,
    sameAs: args.doi ? `https://doi.org/${args.doi}` : undefined,
    encoding: args.pdfPath
      ? {
          "@type": "MediaObject",
          contentUrl: `${SITE_URL}${args.pdfPath}`,
          encodingFormat: "application/pdf",
        }
      : undefined,
    codeRepository: args.codeUrl,
    publication: args.venue,
    license: args.licenseUrl,
    creditText: args.license,
    citation: args.references?.map((r) => ({
      "@type": "ScholarlyArticle",
      name: r.title,
      author: r.authors,
      datePublished: String(r.year),
      publication: r.venue,
      identifier: r.doi
        ? [{ "@type": "PropertyValue", propertyID: "doi", value: r.doi }]
        : r.arxiv
          ? [{ "@type": "PropertyValue", propertyID: "arxiv", value: r.arxiv }]
          : undefined,
      sameAs: r.doi
        ? `https://doi.org/${r.doi}`
        : r.arxiv
          ? `https://arxiv.org/abs/${r.arxiv}`
          : undefined,
    })),
    workExample: args.companionBookSlug
      ? { "@id": `${SITE_URL}/${args.locale}/books/${args.companionBookSlug}#book` }
      : undefined,
  } as const;
}

export function datasetSchema(args: {
  locale: SupportedLocale;
  paperSlug: string;
  name: string;
  description: string;
  distributions: { name: string; url: string; format: string }[];
  license: string;
  licenseUrl: string;
  version: string;
  keywords: string[];
  codeUrl?: string;
}) {
  const url = localeUrl(args.locale, `/science/${args.paperSlug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    url,
    name: args.name,
    description: args.description,
    inLanguage: "en",
    creator: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isAccessibleForFree: true,
    license: args.licenseUrl,
    creditText: args.license,
    version: args.version,
    keywords: args.keywords,
    variableMeasured: ["chi-squared", "AIC", "BIC", "halo extent", "composite galactic age", "partial correlation"],
    isBasedOn: {
      "@type": "Dataset",
      name: "SPARC — Spitzer Photometry and Accurate Rotation Curves",
      url: "http://astroweb.cwru.edu/SPARC/",
      creator: "Lelli, McGaugh & Schombert (2016)",
    },
    codeRepository: args.codeUrl,
    distribution: args.distributions.map((d) => ({
      "@type": "DataDownload",
      name: d.name,
      contentUrl: d.url,
      encodingFormat: d.format,
    })),
    citation: {
      "@id": `${url}#article`,
    },
  } as const;
}

export function articleSchema(args: {
  locale: SupportedLocale;
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  author?: string;
  tags?: string[];
  availableLocales: string[];
  readingTime?: number;
  license?: string;
  licenseUrl?: string;
}) {
  const url = localeUrl(args.locale, `/essays/${args.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: url,
    headline: args.title,
    name: args.title,
    description: args.description,
    inLanguage: args.locale,
    datePublished: args.datePublished,
    dateModified: args.datePublished,
    keywords: args.tags?.join(", "),
    wordCount: args.readingTime ? args.readingTime * 220 : undefined,
    timeRequired: args.readingTime ? `PT${args.readingTime}M` : undefined,
    author:
      args.author && args.author !== AUTHOR_NAME
        ? { "@type": "Person", name: args.author }
        : { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    image: `${SITE_URL}/api/og?title=${encodeURIComponent(args.title)}&subtitle=${encodeURIComponent(args.description)}&kind=essay`,
    workTranslation: args.availableLocales
      .filter((l) => l !== args.locale)
      .map((l) => ({
        "@type": "BlogPosting",
        inLanguage: l,
        url: `${SITE_URL}/${l}/essays/${args.slug}`,
      })),
    license: args.licenseUrl,
    creditText: args.license,
  } as const;
}

export function videoObjectSchema(args: {
  locale: SupportedLocale;
  slug: string;
  title: string;
  description: string;
  uploadDate: string;
  durationMinutes?: number;
  thumbnailUrl?: string | null;
  embedUrl?: string | null;
  contentUrl?: string;
  transcriptUrl?: string;
}) {
  const url = localeUrl(args.locale, `/lectures/${args.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${url}#video`,
    url,
    name: args.title,
    description: args.description,
    inLanguage: args.locale,
    uploadDate: args.uploadDate,
    duration: args.durationMinutes ? `PT${args.durationMinutes}M` : undefined,
    thumbnailUrl: args.thumbnailUrl || undefined,
    embedUrl: args.embedUrl || undefined,
    contentUrl: args.contentUrl,
    transcript: args.transcriptUrl,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  } as const;
}

export function faqSchema(
  locale: SupportedLocale,
  path: string,
  entries: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${localeUrl(locale, path)}#faq`,
    inLanguage: locale,
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: e.answer,
      },
    })),
  } as const;
}

export function profilePageSchema(locale: SupportedLocale, title: string, bio: string) {
  const url = localeUrl(locale, "/about");
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profile`,
    url,
    name: title,
    description: bio,
    inLanguage: locale,
    mainEntity: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  } as const;
}
