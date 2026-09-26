import type { Metadata } from "next";
import { social } from "@/lib/og";
import PageShell from "@/components/layout/PageShell";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { listAnswers } from "@/lib/answers";
import { answersUi } from "@/content/answers-ui";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import { itemList, breadcrumb } from "@/lib/schema";

const BASE = "https://neuralcosmology.com";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const ui = answersUi[locale];
  return {
    title: ui.title,
    description: ui.lead,
    alternates: {
      canonical: `${BASE}/${locale}/answers`,
      languages: {
        ...Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, `${BASE}/${l}/answers`])),
        "x-default": `${BASE}/en/answers`,
      },
    },
    ...social({ title: ui.title, description: ui.lead, url: `${BASE}/${locale}/answers`, kind: "answers", locale }),
  };
}

export default async function AnswersIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const ui = answersUi[locale];
  const dict = getDict(locale);
  const answers = listAnswers(locale);
  return (
    <PageShell eyebrow={ui.eyebrow} title={ui.title} lead={ui.lead}>
      <JsonLd id="answers-list" data={itemList(locale, ui.title, ui.lead, "/answers", answers.map((a) => ({ name: a.question, path: `/answers/${a.slug}` })))} />
      <JsonLd id="answers-breadcrumb" data={breadcrumb(locale, [{ name: dict.nav.home, path: "" }, { name: ui.nav, path: "/answers" }])} />
      <section className="rule-t pb-10 md:px-10 md:pb-14">
        <div>
          {answers.map((a, i) => (
            <Link key={a.slug} href={`/${locale}/answers/${a.slug}`} className="group grid grid-cols-[2rem_1fr_auto] gap-x-4 rule-b py-6 md:grid-cols-[3rem_1fr_auto]">
              <span className="label text-muted pt-1.5">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block font-display text-2xl leading-snug transition-colors group-hover:text-primary md:text-3xl">{a.question}</span>
                <span className="mt-3 block max-w-[70ch] text-fg-secondary">{a.answer}</span>
              </span>
              <ArrowRight className="mt-2 h-4 w-4 text-muted transition-transform group-hover:translate-x-1" strokeWidth={1} aria-hidden />
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
