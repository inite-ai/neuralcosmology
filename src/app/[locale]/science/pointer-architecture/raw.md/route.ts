import { notFound } from "next/navigation";
import { getPaperBySlug } from "@/content/papers";
import { isSupportedLocale, SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/get-locale";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: raw } = await params;
  const locale: SupportedLocale = isSupportedLocale(raw) ? raw : "en";
  const paper = getPaperBySlug("pointer-architecture");
  if (!paper) notFound();

  const url = `https://neuralcosmology.com/${locale}/science/${paper.slug}`;
  const lines = [
    `# ${paper.title}`,
    "",
    `Authors: ${paper.authors.join(", ")}`,
    `Year: ${paper.year}`,
    `Status: ${paper.status}`,
    paper.venue ? `Venue: ${paper.venue}` : null,
    paper.doi ? `DOI: ${paper.doi}` : null,
    paper.pdfPath ? `PDF: https://neuralcosmology.com${paper.pdfPath}` : null,
    paper.codeUrl ? `Code: ${paper.codeUrl}` : null,
    `Canonical: ${url}`,
    paper.license ? `License: ${paper.license} (${paper.licenseUrl})` : null,
    "",
    "---",
    "",
    "## Abstract",
    "",
    paper.abstract,
    "",
  ];

  if (paper.tldr && paper.tldr.length) {
    lines.push("## TL;DR", "");
    paper.tldr.forEach((t) => lines.push(`- ${t}`));
    lines.push("");
  }

  if (paper.predictions && paper.predictions.length) {
    lines.push("## Predictions and falsifiers", "");
    paper.predictions.forEach((p, i) => lines.push(`${i + 1}. ${p}`));
    lines.push("");
  }

  if (paper.references && paper.references.length) {
    lines.push("## References", "");
    paper.references.forEach((r) => {
      const id = r.doi
        ? `doi:${r.doi}`
        : r.arxiv
          ? `arXiv:${r.arxiv}`
          : "";
      lines.push(
        `- ${r.authors} (${r.year}). ${r.title}. *${r.venue}*.${id ? ` ${id}` : ""}`,
      );
    });
    lines.push("");
  }

  lines.push(
    "## Citation",
    "",
    `Savchenko, M. (${paper.year}). ${paper.title}. Preprint.${paper.doi ? ` DOI: ${paper.doi}` : ""}`,
    "",
  );

  const body = lines.filter((l) => l !== null).join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
      "X-Robots-Tag": "index, follow, max-snippet:-1",
      Link: `<${url}>; rel="canonical"`,
    },
  });
}
