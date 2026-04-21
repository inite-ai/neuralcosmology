import type { Metadata } from "next";
import Link from "next/link";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
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
  const locale = isSupportedLocale(raw) ? raw : "en";
  const dict = getDict(locale);
  return {
    title: dict.about.title,
    description: dict.about.bio[0],
    alternates: {
      canonical: `https://neuralcosmology.com/${locale}/about`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `https://neuralcosmology.com/${l}/about`]),
      ),
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const dict = getDict(locale);
  return (
    <main className="relative min-h-screen text-white pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-xs uppercase tracking-[0.2em] text-indigo-300/80 mb-3">
          {dict.about.eyebrow}
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight mb-6">
          {dict.about.title}
        </h1>

        <div className="max-w-none text-white/80 leading-relaxed space-y-5">
          {dict.about.bio.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xs uppercase tracking-widest text-white/50 mb-3">
            {dict.about.agentsHeader}
          </h2>
          <p className="text-white/80 leading-relaxed">{dict.about.agentsBody}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="mailto:info@neuralcosmology.com?subject=Rights%20inquiry"
              className="inline-flex items-center rounded-md bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {dict.about.emailCta}
            </a>
            <Link
              href={`/${locale}/science/pointer-architecture`}
              className="inline-flex items-center rounded-md border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {dict.footer.links.pointer}
            </Link>
            <Link
              href={`/${locale}/books`}
              className="inline-flex items-center rounded-md border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {dict.nav.books}
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xs uppercase tracking-widest text-white/50 mb-3">
            {dict.about.elsewhereHeader}
          </h2>
          <ul className="text-sm text-white/75 space-y-1.5">
            <li>
              <a
                href="https://t.me/neuralcosmology"
                className="hover:text-white transition-colors"
              >
                Telegram — @neuralcosmology
              </a>
            </li>
            <li>
              <a
                href="https://github.com/neuralcosmology"
                className="hover:text-white transition-colors"
              >
                GitHub — neuralcosmology
              </a>
            </li>
            <li>
              <a
                href="mailto:info@neuralcosmology.com"
                className="hover:text-white transition-colors"
              >
                info@neuralcosmology.com
              </a>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
