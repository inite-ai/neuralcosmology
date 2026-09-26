import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AnnouncementBar, Cursor, ThemeToggle } from "@/components/layout/chrome";
import JsonLd from "@/components/seo/JsonLd";
import { siteGraph } from "@/lib/schema";
import {
  SUPPORTED_LOCALES,
  isSupportedLocale,
  type SupportedLocale,
} from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import { social } from "@/lib/og";

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
    ...social({ title: dict.meta.title, description: dict.meta.description, url, kind: "home", locale }),
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
      <AnnouncementBar locale={locale} />
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
      <ThemeToggle label={THEME_LABEL[locale]} />
      <Cursor />
    </>
  );
}
