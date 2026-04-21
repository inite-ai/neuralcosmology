import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import { listLectures, getThumbnail } from "@/lib/lectures";
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
    title: dict.lecturesPage.title,
    description: dict.lecturesPage.lead,
    alternates: {
      canonical: `https://neuralcosmology.com/${locale}/lectures`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `https://neuralcosmology.com/${l}/lectures`]),
      ),
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

export default async function LecturesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const dict = getDict(locale);
  const lectures = listLectures(locale);

  const items = lectures.map((l) => ({ name: l.title, path: `/lectures/${l.slug}` }));
  return (
    <PageShell
      eyebrow={dict.lecturesPage.eyebrow}
      title={dict.lecturesPage.title}
      lead={dict.lecturesPage.lead}
    >
      <JsonLd
        id="lectures-collection"
        data={itemList(
          locale,
          dict.lecturesPage.title,
          dict.lecturesPage.lead,
          "/lectures",
          items,
        )}
      />
      <JsonLd
        id="lectures-breadcrumb"
        data={breadcrumb(locale, [
          { name: dict.nav.home, path: "" },
          { name: dict.nav.lectures, path: "/lectures" },
        ])}
      />
      {lectures.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/70 leading-relaxed">
          <p>{dict.lecturesPage.placeholderBody}</p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 items-stretch">
          {lectures.map((l) => {
            const thumb = getThumbnail(l.videoUrl, l.cover);
            return (
              <li key={l.slug} className="flex">
                <Link
                  href={`/${locale}/lectures/${l.slug}`}
                  className="group flex flex-col h-full w-full rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-white/20 transition-colors overflow-hidden"
                >
                  {thumb && (
                    <div className="relative aspect-video bg-black/40">
                      <Image
                        src={thumb}
                        alt={l.title}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        sizes="(min-width: 640px) 50vw, 100vw"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  )}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 text-xs text-white/50 mb-2">
                      <span>{formatDate(l.date, locale)}</span>
                      {l.durationMinutes && (
                        <>
                          <span>·</span>
                          <span>
                            {l.durationMinutes} {dict.lecturesPage.durationSuffix}
                          </span>
                        </>
                      )}
                      {l.locale !== locale && (
                        <span className="ml-auto text-amber-300/70 uppercase tracking-wider">
                          {l.locale}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug mb-2">
                      {l.title}
                    </h2>
                    {l.description && (
                      <p className="text-sm text-white/70 leading-relaxed">
                        {l.description}
                      </p>
                    )}
                    <div className="mt-3 text-xs text-indigo-300/80 group-hover:text-indigo-200 transition-colors">
                      {dict.lecturesPage.watchCta} →
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
