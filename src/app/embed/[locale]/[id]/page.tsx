import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Standalone from "@/components/reader/widgets/Standalone";
import { experimentsUi } from "@/content/experiments-ui";
import { experimentView } from "@/lib/experiments";
import { experiments, getExperiment } from "@/lib/interactive";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";

// Опыт в рамке на чужом сайте: сам опыт и строка «откуда», ссылка ведёт на страницу опыта.

const BASE = "https://neuralcosmology.com";
type Params = Promise<{ locale: string; id: string }>;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) => experiments().map((it) => ({ locale, id: it.id })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isSupportedLocale(locale)) return {};
  const it = getExperiment(id);
  const v = it && experimentView(it, locale);
  if (!v) return {};
  return { title: v.seo?.title ?? v.title, alternates: { canonical: `${BASE}/${locale}/experiments/${id}` } };
}

export default async function EmbedPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const it = getExperiment(id);
  const v = it && experimentView(it, locale);
  if (!v) notFound();
  const ui = experimentsUi[locale];
  const href = `${BASE}/${locale}/experiments/${id}?utm_source=embed&utm_medium=iframe&utm_campaign=${id}`;
  return (
    <main className="reader px-3 py-3">
      <div className="reader-prose">
        <figure className="nc-x nc-x--try" style={{ margin: 0 }} data-x={v.id} data-w={v.widget}>
          <div className="nc-x-mount">
            <Standalone widget={v.widget} lang={locale} props={v.props} />
          </div>
          <figcaption>
            {ui.embedFrom(v.bookTitle)} ·{" "}
            <a href={href} target="_blank" rel="noopener" className="underline decoration-[0.5px] underline-offset-4">
              {ui.embedOpen} ↗
            </a>
          </figcaption>
        </figure>
      </div>
    </main>
  );
}
