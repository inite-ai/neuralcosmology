import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getAllSlugs, getEssayBySlug } from "@/lib/essays";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return SUPPORTED_LOCALES.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const essay = getEssayBySlug(slug, locale);
  if (!essay) return {};
  const base = "https://neuralcosmology.com";
  return {
    title: essay.title,
    description: essay.description,
    alternates: {
      canonical: `${base}/${locale}/essays/${slug}`,
      languages: Object.fromEntries(
        essay.availableLocales.map((l) => [l, `${base}/${l}/essays/${slug}`]),
      ),
    },
    openGraph: {
      title: essay.title,
      description: essay.description,
      url: `${base}/${locale}/essays/${slug}`,
      type: "article",
      publishedTime: essay.date,
      authors: essay.author ? [essay.author] : undefined,
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

export default async function EssayPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const essay = getEssayBySlug(slug, locale);
  if (!essay) notFound();
  const dict = getDict(locale);

  const mdxOptions = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight],
    },
  };

  return (
    <main className="relative min-h-screen text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/${locale}/essays`}
          className="inline-block text-sm text-white/60 hover:text-white mb-8 transition-colors"
        >
          ← {dict.nav.essays}
        </Link>

        <div className="flex items-center gap-3 text-xs text-white/50 mb-4">
          <span>{formatDate(essay.date, locale)}</span>
          {essay.readingTime && (
            <>
              <span>·</span>
              <span>{essay.readingTime} min</span>
            </>
          )}
          {essay.locale !== locale && (
            <span className="uppercase tracking-wider text-amber-300/70">
              shown in {essay.locale}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight mb-4">
          {essay.title}
        </h1>

        {essay.description && (
          <p className="text-lg text-white/75 leading-relaxed mb-10 italic">
            {essay.description}
          </p>
        )}

        <article className="prose-essay text-white/85 leading-relaxed space-y-5">
          <MDXRemote source={essay.content} options={mdxOptions} />
        </article>

        {essay.tags && essay.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {essay.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider border border-white/10 bg-white/5 text-white/60"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
