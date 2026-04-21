import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { listEssays } from "@/lib/essays";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { itemList, breadcrumb } from "@/lib/schema";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const dict = getDict(locale);
  return {
    title: dict.essays.title,
    description: dict.essays.lead,
    alternates: {
      canonical: `https://neuralcosmology.com/${locale}/essays`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `https://neuralcosmology.com/${l}/essays`]),
      ),
      types: {
        "application/rss+xml": `https://neuralcosmology.com/${locale}/essays/rss.xml`,
      },
    },
  };
}

function formatDate(iso: string, locale: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function EssaysIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const dict = getDict(locale);
  const essays = listEssays(locale);

  const items = essays.map((e) => ({ name: e.title, path: `/essays/${e.slug}` }));
  return (
    <PageShell
      eyebrow={dict.essays.eyebrow}
      title={dict.essays.title}
      lead={dict.essays.lead}
    >
      <JsonLd
        id="essays-collection"
        data={itemList(locale, dict.essays.title, dict.essays.lead, "/essays", items)}
      />
      <JsonLd
        id="essays-breadcrumb"
        data={breadcrumb(locale, [
          { name: dict.nav.home, path: "" },
          { name: dict.nav.essays, path: "/essays" },
        ])}
      />
      {essays.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/70 leading-relaxed">
          <p>{dict.essays.placeholderBody}</p>
        </div>
      ) : (
        <ul className="grid gap-4">
          {essays.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/${locale}/essays/${e.slug}`}
                className="group block rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-white/20 transition-colors p-6"
              >
                <div className="flex items-center gap-3 text-xs text-white/50 mb-2">
                  <span>{formatDate(e.date, locale)}</span>
                  {e.readingTime && (
                    <>
                      <span>·</span>
                      <span>{e.readingTime} min</span>
                    </>
                  )}
                  {e.locale !== locale && (
                    <span className="ml-auto text-amber-300/70 uppercase tracking-wider">
                      {e.locale}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-snug mb-2">
                  {e.title}
                </h2>
                {e.description && (
                  <p className="text-sm text-white/70 leading-relaxed">
                    {e.description}
                  </p>
                )}
                <div className="mt-3 text-xs text-indigo-300/80 group-hover:text-indigo-200 transition-colors">
                  {dict.books.readMore}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
