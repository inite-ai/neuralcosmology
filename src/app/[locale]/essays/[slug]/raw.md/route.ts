import { notFound } from "next/navigation";
import { getAllSlugs, getEssayBySlug } from "@/lib/essays";
import { isSupportedLocale, SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/get-locale";

export const dynamic = "force-static";

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return SUPPORTED_LOCALES.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string; slug: string }> },
) {
  const { locale: raw, slug } = await params;
  const locale: SupportedLocale = isSupportedLocale(raw) ? raw : "en";
  const essay = getEssayBySlug(slug, locale);
  if (!essay) notFound();

  const url = `https://neuralcosmology.com/${locale}/essays/${slug}`;
  const header = [
    `# ${essay.title}`,
    "",
    essay.description ? `> ${essay.description}` : null,
    "",
    `Author: ${essay.author || "Mikhail Savchenko"}`,
    essay.date ? `Date: ${essay.date}` : null,
    `Canonical: ${url}`,
    essay.tags && essay.tags.length ? `Tags: ${essay.tags.join(", ")}` : null,
    `Locale: ${essay.locale}`,
    essay.availableLocales.length > 1
      ? `Translations: ${essay.availableLocales.join(", ")}`
      : null,
    "License: CC-BY-4.0 (https://creativecommons.org/licenses/by/4.0/)",
    "",
    "---",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  const body = `${header}${essay.content.trim()}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
      "X-Robots-Tag": "index, follow, max-snippet:-1",
      Link: `<${url}>; rel="canonical"`,
    },
  });
}
