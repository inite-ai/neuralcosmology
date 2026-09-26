import type { Metadata } from "next";
import { social } from "@/lib/og";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaperBySlug } from "@/content/papers";
import { Badge } from "@/components/ui/badge";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { scholarlyArticleSchema, breadcrumb, datasetSchema, faqSchema } from "@/lib/schema";
import { faqByLocale } from "@/content/faq";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

const paper = getPaperBySlug("pointer-architecture");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const base = "https://neuralcosmology.com";
  const title = paper?.title ?? "Pointer Architecture";
  const description = paper?.abstract.slice(0, 180) ?? "";
  return {
    title,
    description,
    alternates: {
      canonical: `${base}/${locale}/science/pointer-architecture`,
      languages: {
        ...Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, `${base}/${l}/science/pointer-architecture`])),
        "x-default": `${base}/en/science/pointer-architecture`,
      },
    },
    ...social({ title, description, url: `${base}/${locale}/science/pointer-architecture`, kind: "preprint", locale, type: "article" }),
    // Highwire-теги: по ним Google Scholar распознаёт научную работу.
    other: {
      citation_title: title,
      citation_author: "Savchenko, Mikhail",
      citation_publication_date: String(paper?.year ?? 2026),
      citation_online_date: String(paper?.year ?? 2026),
      ...(paper?.pdfPath ? { citation_pdf_url: `${base}${paper.pdfPath}` } : {}),
      citation_abstract_html_url: `${base}/${locale}/science/pointer-architecture`,
      citation_language: "en",
      citation_keywords: "galaxy rotation curves; SPARC; dark matter; information geometry",
    },
  };
}

export default async function PointerArchitecturePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  if (!paper) notFound();
  const dict = getDict(locale);

  return (
    <main className="relative min-h-screen text-fg pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
      <JsonLd
        id="paper-schema"
        data={scholarlyArticleSchema({
          locale,
          slug: paper.slug,
          title: paper.title,
          abstract: paper.abstract,
          authors: paper.authors,
          year: paper.year,
          doi: paper.doi,
          pdfPath: paper.pdfPath,
          codeUrl: paper.codeUrl,
          venue: paper.venue,
          references: paper.references,
          license: paper.license,
          licenseUrl: paper.licenseUrl,
          companionBookSlug: paper.companionBookSlug,
        })}
      />
      {paper.dataset && (
        <JsonLd
          id="paper-dataset"
          data={datasetSchema({
            locale,
            paperSlug: paper.slug,
            name: paper.dataset.name,
            description: paper.dataset.description,
            distributions: paper.dataset.distributions,
            license: paper.dataset.license,
            licenseUrl: paper.dataset.licenseUrl,
            version: paper.dataset.version,
            keywords: paper.dataset.keywords,
            codeUrl: paper.codeUrl,
          })}
        />
      )}
      <JsonLd
        id="paper-breadcrumb"
        data={breadcrumb(locale, [
          { name: dict.nav.home, path: "" },
          { name: dict.nav.science, path: "/science" },
          { name: paper.title, path: `/science/${paper.slug}` },
        ])}
      />
      <JsonLd
        id="paper-faq"
        data={faqSchema(locale, `/science/${paper.slug}`, faqByLocale[locale].science)}
      />
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/${locale}/science`}
          className="inline-block text-sm text-muted hover:text-fg mb-8 transition-colors"
        >
          {dict.science.allResearch}
        </Link>

        <div className="flex items-center gap-2 flex-wrap mb-4">
          <Badge variant="outline" className="border-primary/50 text-primary bg-transparent">
            {dict.science.preprintBadge}
          </Badge>
          {paper.venue && (
            <Badge variant="outline" className="border-fg/40 text-fg-secondary bg-transparent">
              {paper.venue}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-normal tracking-tight leading-tight mb-5">
          {paper.title}
        </h1>

        <div className="text-muted text-sm mb-8">
          {paper.authors.join(", ")} · {paper.year}
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {paper.pdfPath && (
            <Link
              href={`/${locale}/read/pointer-architecture`}
              className="inline-flex items-center rounded-sm bg-fg text-bg hover:bg-primary px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {dict.science.readPdf}
            </Link>
          )}
          {paper.codeUrl && (
            <a
              href={paper.codeUrl}
              className="inline-flex items-center rounded-sm border border-fg/40 hover:border-fg/40 text-fg hover:text-fg px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {dict.science.codeRelease}
            </a>
          )}
          {paper.doi && (
            <a
              href={`https://doi.org/${paper.doi}`}
              className="inline-flex items-center rounded-sm border border-fg/40 hover:border-fg/40 text-fg hover:text-fg px-5 py-2.5 text-sm font-medium transition-colors"
            >
              DOI
            </a>
          )}
          <a
            href="mailto:info@neuralcosmology.com?subject=Pointer%20Architecture%20—%20peer%20review"
            className="inline-flex items-center rounded-sm border border-fg/40 hover:border-fg/40 text-fg hover:text-fg px-5 py-2.5 text-sm font-medium transition-colors"
          >
            {dict.science.contactReview}
          </a>
        </div>

        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-widest text-muted mb-3">
            {dict.science.abstractHeader}
          </h2>
          <p className="text-fg leading-relaxed">{paper.abstract}</p>
        </section>

        {paper.tldr && (
          <section className="mb-12">
            <h2 className="text-xs uppercase tracking-widest text-muted mb-3">
              {dict.science.tldrHeader}
            </h2>
            <ul className="space-y-2">
              {paper.tldr.map((t) => (
                <li key={t} className="flex gap-3 text-fg leading-relaxed">
                  <span className="text-primary shrink-0">·</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {paper.predictions && (
          <section className="mb-12">
            <h2 className="text-xs uppercase tracking-widest text-muted mb-3">
              {dict.science.predictionsHeader}
            </h2>
            <ol className="space-y-2 list-decimal list-inside text-fg leading-relaxed marker:text-primary">
              {paper.predictions.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
          </section>
        )}

        {paper.companionBookSlug && (
          <section className="mb-12 border border-line bg-bg-raised p-6">
            <div className="text-xs uppercase tracking-widest text-muted mb-2">
              {dict.science.companionHeader}
            </div>
            <p className="text-fg leading-relaxed mb-3">
              {dict.science.companionBody}
            </p>
            <Link
              href={`/${locale}/books/${paper.companionBookSlug}`}
              className="text-primary hover:text-primary text-sm transition-colors"
            >
              {dict.science.companionCta}
            </Link>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-widest text-muted mb-3">
            {dict.science.citeHeader}
          </h2>
          <pre className="text-xs bg-bg-sunk border border-line p-4 overflow-x-auto text-fg-secondary">
{`Savchenko, M. (${paper.year}). ${paper.title}. Preprint.${paper.doi ? `\nDOI: ${paper.doi}` : ""}`}
          </pre>
        </section>

        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-widest text-muted mb-4">FAQ</h2>
          <dl className="space-y-6">
            {faqByLocale[locale].science.map((f) => (
              <div key={f.question}>
                <dt className="text-fg font-medium mb-1.5">{f.question}</dt>
                <dd className="text-fg-secondary leading-relaxed text-sm">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
