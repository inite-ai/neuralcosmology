import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getAllSlugs, getLectureBySlug, getEmbedUrl, getThumbnail, hasTranscript } from "@/lib/lectures";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { videoObjectSchema, breadcrumb } from "@/lib/schema";

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
  const lecture = getLectureBySlug(slug, locale);
  if (!lecture) return {};
  const base = "https://neuralcosmology.com";
  return {
    title: lecture.title,
    description: lecture.description,
    alternates: {
      canonical: `${base}/${locale}/lectures/${slug}`,
      languages: Object.fromEntries(
        lecture.availableLocales.map((l) => [l, `${base}/${l}/lectures/${slug}`]),
      ),
    },
    openGraph: {
      title: lecture.title,
      description: lecture.description,
      url: `${base}/${locale}/lectures/${slug}`,
      type: "video.other",
      publishedTime: lecture.date,
      images: [
        {
          url: `${base}/api/og?title=${encodeURIComponent(lecture.title)}&subtitle=${encodeURIComponent(lecture.description)}&kind=lecture`,
          width: 1200,
          height: 630,
          alt: lecture.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: lecture.title,
      description: lecture.description,
      images: [
        `${base}/api/og?title=${encodeURIComponent(lecture.title)}&subtitle=${encodeURIComponent(lecture.description)}&kind=lecture`,
      ],
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

export default async function LecturePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const lecture = getLectureBySlug(slug, locale);
  if (!lecture) notFound();
  const dict = getDict(locale);

  const mdxOptions = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight],
    },
  };
  const embed = lecture.videoUrl ? getEmbedUrl(lecture.videoUrl) : null;
  const thumb = getThumbnail(lecture.videoUrl, lecture.cover);
  const transcriptExists = hasTranscript(slug, locale);
  const transcriptUrl = transcriptExists
    ? `https://neuralcosmology.com/${locale}/lectures/${slug}/transcript.md`
    : undefined;

  return (
    <main className="relative min-h-screen text-white pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
      <JsonLd
        id="lecture-schema"
        data={videoObjectSchema({
          locale,
          slug,
          title: lecture.title,
          description: lecture.description,
          uploadDate: lecture.date,
          durationMinutes: lecture.durationMinutes,
          thumbnailUrl: thumb,
          embedUrl: embed,
          contentUrl: lecture.videoUrl,
          transcriptUrl,
        })}
      />
      <JsonLd
        id="lecture-breadcrumb"
        data={breadcrumb(locale, [
          { name: dict.nav.home, path: "" },
          { name: dict.nav.lectures, path: "/lectures" },
          { name: lecture.title, path: `/lectures/${slug}` },
        ])}
      />
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/${locale}/lectures`}
          className="inline-block text-sm text-white/60 hover:text-white mb-8 transition-colors"
        >
          ← {dict.lecturesPage.backToIndex}
        </Link>

        <div className="flex items-center gap-3 text-xs text-white/50 mb-4">
          <span>{formatDate(lecture.date, locale)}</span>
          {lecture.durationMinutes && (
            <>
              <span>·</span>
              <span>
                {lecture.durationMinutes} {dict.lecturesPage.durationSuffix}
              </span>
            </>
          )}
          {lecture.locale !== locale && (
            <span className="uppercase tracking-wider text-amber-300/70">
              shown in {lecture.locale}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight mb-4">
          {lecture.title}
        </h1>

        {lecture.description && (
          <p className="text-lg text-white/75 leading-relaxed mb-8">
            {lecture.description}
          </p>
        )}

        {embed && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black mb-10">
            <iframe
              src={embed}
              title={lecture.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}

        {lecture.content.trim() && (
          <article className="prose-essay text-white/85 leading-relaxed space-y-5">
            <MDXRemote source={lecture.content} options={mdxOptions} />
          </article>
        )}

        {transcriptExists && (
          <div className="mt-8">
            <a
              href={`/${locale}/lectures/${slug}/transcript.md`}
              className="inline-flex items-center rounded-md border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {dict.lecturesPage.transcript} (markdown)
            </a>
          </div>
        )}

        {lecture.tags && lecture.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {lecture.tags.map((t) => (
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
