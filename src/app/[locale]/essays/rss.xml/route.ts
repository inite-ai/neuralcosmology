import { listEssays } from "@/lib/essays";
import { isSupportedLocale, SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

const BASE = "https://neuralcosmology.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: raw } = await params;
  const locale: SupportedLocale = isSupportedLocale(raw) ? raw : "en";
  const dict = getDict(locale);
  const essays = listEssays(locale);
  const feedUrl = `${BASE}/${locale}/essays/rss.xml`;
  const siteUrl = `${BASE}/${locale}/essays`;

  const items = essays
    .map((e) => {
      const url = `${BASE}/${locale}/essays/${e.slug}`;
      const pubDate = e.date ? new Date(e.date).toUTCString() : new Date().toUTCString();
      return `
    <item>
      <title>${escapeXml(e.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(e.description || "")}</description>
      ${e.author ? `<author>${escapeXml(e.author)}</author>` : ""}
      ${(e.tags || []).map((t) => `<category>${escapeXml(t)}</category>`).join("")}
    </item>`.trim();
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(dict.meta.title)} — ${escapeXml(dict.essays.title)}</title>
    <link>${siteUrl}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(dict.essays.lead)}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
    },
  });
}
