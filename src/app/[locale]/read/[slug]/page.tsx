import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  readables,
  getReadable,
  resolveReadablePath,
  resolveReadableTitle,
} from "@/lib/readables";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumb } from "@/lib/schema";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    readables.map((r) => ({ locale, slug: r.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const entry = getReadable(slug);
  if (!entry) return {};
  const title = resolveReadableTitle(entry, locale);
  return {
    title,
    alternates: {
      canonical: `https://neuralcosmology.com/${locale}/read/${slug}`,
    },
  };
}

export default async function ReadPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const entry = getReadable(slug);
  if (!entry) notFound();
  const dict = getDict(locale);
  const { path, locale: pdfLocale } = resolveReadablePath(entry, locale);
  if (!path) notFound();
  const title = resolveReadableTitle(entry, locale);
  const backHref =
    entry.kind === "book-demo" && entry.relatedSlug
      ? `/${locale}/books/${entry.relatedSlug}`
      : entry.kind === "preprint" && entry.relatedSlug
        ? `/${locale}/science/${entry.relatedSlug}`
        : `/${locale}`;

  const bcItems = [{ name: dict.nav.home, path: "" }];
  if (entry.kind === "book-demo" && entry.relatedSlug) {
    bcItems.push({ name: dict.nav.books, path: "/books" });
    bcItems.push({
      name: title.replace(/ — demo$/i, ""),
      path: `/books/${entry.relatedSlug}`,
    });
  } else if (entry.kind === "preprint" && entry.relatedSlug) {
    bcItems.push({ name: dict.nav.science, path: "/science" });
    bcItems.push({
      name: title,
      path: `/science/${entry.relatedSlug}`,
    });
  }
  bcItems.push({ name: dict.reader.download, path: `/read/${slug}` });

  return (
    <main
      className="flex flex-col bg-black text-white pt-14"
      style={{ height: "100vh" }}
    >
      <JsonLd id="read-breadcrumb" data={breadcrumb(locale, bcItems)} />
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 h-12 border-b border-white/10 bg-[#0a1026]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={backHref}
            className="text-xs sm:text-sm text-white/70 hover:text-white transition-colors whitespace-nowrap"
          >
            ← {dict.reader.back}
          </Link>
          <span className="hidden sm:inline text-white/20">·</span>
          <span className="text-xs sm:text-sm text-white/85 truncate">
            {title}
          </span>
          {pdfLocale !== locale && (
            <span className="text-[10px] uppercase tracking-wider text-amber-300/70 whitespace-nowrap">
              {dict.reader.shownIn} {pdfLocale}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={path}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center rounded-md border border-white/15 hover:border-white/30 text-white/75 hover:text-white px-3 py-1.5 text-xs transition-colors"
          >
            {dict.reader.openInNewTab}
          </a>
          <a
            href={path}
            download
            className="inline-flex items-center rounded-md bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-1.5 text-xs font-medium transition-colors"
          >
            {dict.reader.download}
          </a>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-black">
        <iframe
          src={`${path}#view=FitH`}
          title={title}
          className="w-full h-full"
          style={{ border: 0 }}
        />
      </div>
    </main>
  );
}
