import { notFound } from "next/navigation";
import { getAllAnswerSlugs, getAnswer } from "@/lib/answers";
import { isSupportedLocale, SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/get-locale";

// Markdown-версия страницы-ответа для ИИ-краулеров: вопрос, прямой ответ, текст, FAQ.
export const dynamic = "force-static";

export function generateStaticParams() {
  const slugs = getAllAnswerSlugs();
  return SUPPORTED_LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale: SupportedLocale = isSupportedLocale(raw) ? raw : "en";
  const a = getAnswer(slug, locale);
  if (!a) notFound();
  const url = `https://neuralcosmology.com/${a.locale}/answers/${slug}`;
  const body = [
    `# ${a.question}`,
    "",
    `> ${a.answer}`,
    "",
    "Author: Mikhail Savchenko",
    `Updated: ${a.updated}`,
    `Canonical: ${url}`,
    `Locale: ${a.locale}`,
    `Translations: ${a.availableLocales.join(", ")}`,
    "License: CC-BY-4.0 (https://creativecommons.org/licenses/by/4.0/)",
    "",
    "---",
    "",
    a.content.replace(/<BookLink slug="[^"]+">([^<]+)<\/BookLink>/g, "$1").trim(),
    "",
    ...(a.faq.length ? ["## FAQ", "", ...a.faq.flatMap((f) => [`### ${f.question}`, "", f.answer, ""])] : []),
  ].join("\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
      "X-Robots-Tag": "index, follow, max-snippet:-1",
      Link: `<${url}>; rel="canonical"`,
    },
  });
}
