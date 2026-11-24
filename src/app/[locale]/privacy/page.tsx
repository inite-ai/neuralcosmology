import type { Metadata } from "next";
import { isSupportedLocale, SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/get-locale";
import { PRIVACY, PRIVACY_UPDATED } from "@/content/privacy";
import { Sheet, Label } from "@/components/system";

const pick = (l: string): SupportedLocale => (isSupportedLocale(l) ? l : "en");
const BASE = "https://neuralcosmology.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = pick((await params).locale);
  const d = PRIVACY[locale];
  return {
    title: d.title,
    description: d.lede,
    alternates: {
      canonical: `${BASE}/${locale}/privacy`,
      languages: Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, `${BASE}/${l}/privacy`])),
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const d = PRIVACY[pick((await params).locale)];
  return (
    <main className="pt-14">
      <Sheet>
        <article className="px-5 py-14 md:px-10 md:py-20">
          <Label className="mb-4">{d.updated}: {PRIVACY_UPDATED}</Label>
          <h1 className="display-fluid text-balance">{d.title}</h1>
          <p className="mt-6 max-w-[62ch] text-lg text-fg-secondary">{d.lede}</p>
          {d.sections.map((s) => (
            <section key={s.h} className="mt-10 max-w-[66ch]">
              <h2 className="font-display text-2xl">{s.h}</h2>
              {s.p.map((p) => <p key={p} className="mt-3 leading-relaxed text-fg-secondary">{p}</p>)}
            </section>
          ))}
        </article>
      </Sheet>
    </main>
  );
}
