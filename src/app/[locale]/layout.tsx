import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { siteGraph } from "@/lib/schema";
import {
  SUPPORTED_LOCALES,
  isSupportedLocale,
  type SupportedLocale,
} from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

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
    title: { default: dict.meta.title, template: `%s | ${dict.meta.title}` },
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
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url,
      siteName: dict.siteName,
      type: "website",
      locale: dict.meta.ogLocale,
      alternateLocale: ["en_US", "ru_RU", "pt_BR", "es_ES"].filter(
        (l) => l !== dict.meta.ogLocale,
      ),
      images: [
        {
          url: `${base}/api/og?title=${encodeURIComponent(dict.meta.title)}&subtitle=${encodeURIComponent(dict.meta.description)}&kind=home`,
          width: 1200,
          height: 630,
          alt: dict.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [
        `${base}/api/og?title=${encodeURIComponent(dict.meta.title)}&subtitle=${encodeURIComponent(dict.meta.description)}&kind=home`,
      ],
    },
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
    <>
      <JsonLd id="site-graph" data={siteGraph(locale, dict.meta.title, dict.meta.description)} />
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
    </>
  );
}
