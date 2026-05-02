import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
  const [hero, ...rest] = essays;

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
        <div className="space-y-16">
          {hero && (
            <Link
              href={`/${locale}/essays/${hero.slug}`}
              className="group block rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-950/40 via-slate-900/30 to-slate-950/40 hover:border-white/25 transition-colors"
            >
              <div className="grid md:grid-cols-5 gap-0">
                <div className="md:col-span-3 relative aspect-[16/10] md:aspect-auto md:min-h-[360px] overflow-hidden bg-slate-950">
                  {hero.cover ? (
                    <Image
                      src={hero.cover}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 60vw, 100vw"
                      priority
                      className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.18),transparent_70%)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent md:bg-gradient-to-l md:from-slate-950/80 md:via-slate-950/20 md:to-transparent" />
                </div>
                <div className="md:col-span-2 p-7 sm:p-9 flex flex-col justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] border border-indigo-300/40 bg-indigo-500/10 text-indigo-200">
                        {dict.essays.eyebrow}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight text-white group-hover:text-indigo-100 transition-colors mb-3">
                      {hero.title}
                    </h2>
                    {hero.description && (
                      <p className="text-sm sm:text-base text-white/70 leading-relaxed line-clamp-4">
                        {hero.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-5 border-t border-white/10 text-xs text-white/55">
                    <div className="flex items-center gap-3">
                      <span>{formatDate(hero.date, locale)}</span>
                      {hero.readingTime && (
                        <>
                          <span className="text-white/25">·</span>
                          <span>{hero.readingTime} min</span>
                        </>
                      )}
                    </div>
                    <span className="text-indigo-300/90 group-hover:text-indigo-200 transition-colors">
                      {dict.books.readMore} →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-12">
              {rest.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/${locale}/essays/${e.slug}`}
                    className="group block focus-visible:outline-none"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-slate-950 mb-5">
                      {e.cover ? (
                        <Image
                          src={e.cover}
                          alt=""
                          fill
                          sizes="(min-width: 640px) 45vw, 100vw"
                          className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-[radial-gradient(ellipse_at_30%_30%,rgba(99,102,241,0.2),transparent_60%),radial-gradient(ellipse_at_70%_70%,rgba(45,212,191,0.12),transparent_60%)]" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-white/50 mb-2">
                      <span>{formatDate(e.date, locale)}</span>
                      {e.readingTime && (
                        <>
                          <span className="text-white/25">·</span>
                          <span>{e.readingTime} min</span>
                        </>
                      )}
                      {e.locale !== locale && (
                        <span className="ml-auto text-amber-300/70 uppercase tracking-wider">
                          {e.locale}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug mb-2 group-hover:text-indigo-100 transition-colors">
                      {e.title}
                    </h3>
                    {e.description && (
                      <p className="text-sm text-white/65 leading-relaxed line-clamp-3">
                        {e.description}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </PageShell>
  );
}
