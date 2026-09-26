import type { Metadata } from "next";
import { social } from "@/lib/og";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getAllSlugs, getEssayBySlug } from "@/lib/essays";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import { makeBookLink, linkifyBookMentions } from "@/components/essays/BookLink";
import AuthorBio from "@/components/essays/AuthorBio";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema, breadcrumb } from "@/lib/schema";

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
      canonical: `${base}/${essay.locale}/essays/${slug}`,
      languages: Object.fromEntries(
        essay.availableLocales.map((l) => [l, `${base}/${l}/essays/${slug}`]),
      ),
    },
    ...social({ title: essay.title, description: essay.description, url: `${base}/${essay.locale}/essays/${slug}`, kind: "essay", locale: essay.locale, type: "article", publishedTime: essay.date, image: essay.cover ? essay.cover.replace(/^\/essays\/covers\/(.+)\.\w+$/, "/og/essays/$1.jpg") : null }),
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
  const BookLink = makeBookLink(locale);
  const mdxSource = linkifyBookMentions(essay.content);

  return (
    <main className="relative min-h-screen text-fg pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
      <JsonLd
        id="essay-schema"
        data={articleSchema({
          locale,
          slug,
          title: essay.title,
          description: essay.description,
          datePublished: essay.date,
          author: essay.author,
          tags: essay.tags,
          availableLocales: essay.availableLocales,
          readingTime: essay.readingTime,
          license: "CC-BY-4.0",
          licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
          cover: essay.cover,
        })}
      />
      <JsonLd
        id="essay-breadcrumb"
        data={breadcrumb(locale, [
          { name: dict.nav.home, path: "" },
          { name: dict.nav.essays, path: "/essays" },
          { name: essay.title, path: `/essays/${slug}` },
        ])}
      />
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/${locale}/essays`}
          className="inline-block text-sm text-muted hover:text-fg mb-8 transition-colors"
        >
          ← {dict.nav.essays}
        </Link>

        {essay.cover && (
          <div className="relative aspect-[16/9] overflow-hidden border border-line bg-bg-sunk mb-10">
            <Image
              src={essay.cover}
              alt=""
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none" />
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-muted mb-4">
          <span>{formatDate(essay.date, locale)}</span>
          {essay.readingTime && (
            <>
              <span>·</span>
              <span>{essay.readingTime} min</span>
            </>
          )}
          {essay.locale !== locale && (
            <span className="uppercase tracking-wider text-muted">
              shown in {essay.locale}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-normal tracking-tight leading-tight mb-4">
          {essay.title}
        </h1>

        {essay.description && (
          <p className="text-lg text-fg-secondary leading-relaxed mb-10 italic">
            {essay.description}
          </p>
        )}

        <article className="prose-essay text-fg leading-relaxed space-y-5">
          <MDXRemote source={mdxSource} options={mdxOptions} components={{ BookLink }} />
        </article>

        {essay.tags && essay.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {essay.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider border border-line bg-bg-raised text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <AuthorBio locale={locale} />
      </div>
    </main>
  );
}
