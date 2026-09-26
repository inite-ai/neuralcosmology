import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Marcellus, Forum, Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import RevealObserver from "@/components/system/RevealObserver";
import Analytics from "@/components/analytics/Analytics";
import { verification } from "@/content/verification";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  AnnouncementBar,
  Cursor,
  ThemeToggle,
} from "@/components/layout/chrome";
import JsonLd from "@/components/seo/JsonLd";
import { siteGraph } from "@/lib/schema";
import {
  SUPPORTED_LOCALES,
  isSupportedLocale,
  type SupportedLocale,
} from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import { social } from "@/lib/og";
import { seoTitle } from "@/content/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

// Заголовки как в образце: Marcellus (латиница) + Forum (кириллица) —
// одна и та же классическая «расклёшенная» антиква, 400, без жирного.
const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

const forum = Forum({
  variable: "--font-forum",
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  weight: "400",
  display: "swap",
});

// Корневой layout сайта: <html lang> берётся из сегмента [locale], поэтому страницы
// остаются статическими (раньше язык читался из заголовков запроса и всё становилось динамическим).
const baseMetadata: Metadata = {
  metadataBase: new URL("https://neuralcosmology.com"),
  title: "Neural Cosmology — Mikhail Savchenko",
  description:
    "Public HQ for the Neural Cosmology programme: four books, one preprint, a growing body of essays.",
  authors: [{ name: "Mikhail Savchenko", url: "https://neuralcosmology.com" }],
  creator: "Mikhail Savchenko",
  publisher: "Mikhail Savchenko",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicons/icon.svg", type: "image/svg+xml" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const THEME_LABEL: Record<SupportedLocale, string> = {
  en: "Switch light / dark",
  ru: "Светлая / тёмная тема",
  pt: "Tema claro / escuro",
  es: "Tema claro / oscuro",
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: SupportedLocale = isSupportedLocale(raw) ? raw : "en";
  const dict = getDict(locale);
  const base = "https://neuralcosmology.com";
  const url = `${base}/${locale}`;
  return {
    ...baseMetadata,
    verification: {
      yandex: verification.yandex || undefined,
      other: verification.bing
        ? { "msvalidate.01": verification.bing }
        : undefined,
    },
    title: {
      default: seoTitle[locale].home,
      template: `%s | ${seoTitle[locale].suffix}`,
    },
    description: dict.meta.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${base}/en`,
        ru: `${base}/ru`,
        pt: `${base}/pt`,
        es: `${base}/es`,
        "x-default": `${base}/en`,
      },
    },
    ...social({
      title: seoTitle[locale].home,
      description: dict.meta.description,
      url,
      kind: "home",
      locale,
    }),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isSupportedLocale(raw)) notFound();
  const locale: SupportedLocale = raw;
  const dict = getDict(locale);
  return (
    <html
      lang={locale === "pt" ? "pt-BR" : locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${marcellus.variable} ${forum.variable}`}
    >
      <head>
        {/* Анимации проявления включаются только при живом JS */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('nc-theme');if(t==='dark'||t==='light')d.classList.add(t);if(localStorage.getItem('nc-banner')==='library-2026-09')d.classList.add('banner-off')}catch(e){}if(/^\\/[a-z]{2}\\/read\\/[^/]+\\/[^/]+/.test(location.pathname))d.classList.add('banner-off')})()",
          }}
        />
        {/*
          IndieWeb rel="me" chain: bidirectional identity claim across the
          author's domains and social profiles. Combined with reciprocal
          rel="me" on the linked properties (notably mikefluff.com), this is a
          publicly verifiable "this is also me" signal for IndieAuth,
          Mastodon-style verification, and LLM crawlers that build
          author-identity graphs.
        */}
        <link rel="me" href="https://www.mikefluff.com/" />
        <link rel="me" href="https://t.me/neuralcosmology" />
        <link rel="me" href="https://t.me/mikefluff" />
        <link rel="me" href="https://github.com/neuralcosmology" />
        <link rel="me" href="https://github.com/mikefluff" />
        <link rel="me" href="https://twitter.com/mikefluff" />
        <link rel="me" href="https://www.linkedin.com/in/mikefluff/" />
      </head>
      <body className="bg-bg text-fg antialiased">
        <JsonLd
          id="site-graph"
          data={siteGraph(locale, dict.meta.title, dict.meta.description)}
        />
        <AnnouncementBar locale={locale} />
        <Header locale={locale} />
        {children}
        <Footer locale={locale} />
        <ThemeToggle label={THEME_LABEL[locale]} />
        <Cursor />
        <RevealObserver />
        <Analytics />
      </body>
    </html>
  );
}
