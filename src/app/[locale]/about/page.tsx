import type { Metadata } from "next";
import Link from "next/link";
import { isSupportedLocale, SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { profilePageSchema, breadcrumb, faqSchema } from "@/lib/schema";
import { faqByLocale } from "@/content/faq";

// Sister-site bridge copy. Kept inline so we do not need to widen the typed
// Dict for a single recurring block on /about.
const SISTER_ABOUT: Record<SupportedLocale, { eyebrow: string; body: string; cta: string; rel: string }> = {
  en: {
    eyebrow: "Practitioner mode",
    body: "Outside the research desk I run a business and consulting practice as Mike Fluff — AI automation, regulatory immunity (PII handling, GDPR/LGPD/DPA, secure-by-design AI workflows), tech surgery, and three courses. Same person, different brand. For consulting work, courses, or applied AI engineering, that is the right door.",
    cta: "Open mikefluff.com",
    rel: "business and consulting practice (same author)",
  },
  ru: {
    eyebrow: "Практикующая ипостась",
    body: "За пределами исследовательского стола я веду бизнес-практику как Майк Флафф — ИИ-автоматизация, регуляторный иммунитет (PII, GDPR/LGPD/DPA, secure-by-design AI), технологическая хирургия, три курса. Тот же человек, другой бренд. Для консалтинга, курсов и applied AI-инженерии — это та дверь.",
    cta: "Открыть mikefluff.com",
    rel: "бизнес и консалтинг (тот же автор)",
  },
  pt: {
    eyebrow: "Modo praticante",
    body: "Fora da mesa de pesquisa, conduzo uma prática de negócios e consultoria como Mike Fluff — automação com IA, imunidade regulatória (PII, GDPR/LGPD/DPA, fluxos IA seguros por design), cirurgia tecnológica e três cursos. Mesma pessoa, marca diferente. Para consultoria, cursos ou engenharia de IA aplicada, é a porta certa.",
    cta: "Abrir mikefluff.com",
    rel: "negócios e consultoria (mesmo autor)",
  },
  es: {
    eyebrow: "Modo practicante",
    body: "Fuera de la mesa de investigación, llevo una práctica de negocios y consultoría como Mike Fluff — automatización con IA, inmunidad regulatoria (PII, GDPR/LGPD/DPA, flujos IA seguros por diseño), cirugía tecnológica y tres cursos. Misma persona, marca distinta. Para consultoría, cursos o ingeniería de IA aplicada, esa es la puerta.",
    cta: "Abrir mikefluff.com",
    rel: "negocios y consultoría (mismo autor)",
  },
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const dict = getDict(locale);
  return {
    title: dict.about.title,
    description: dict.about.bio[0],
    alternates: {
      canonical: `https://neuralcosmology.com/${locale}/about`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `https://neuralcosmology.com/${l}/about`]),
      ),
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isSupportedLocale(raw) ? raw : "en";
  const dict = getDict(locale);
  return (
    <main className="relative min-h-screen text-white pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
      <JsonLd
        id="about-profile"
        data={profilePageSchema(locale, dict.about.title, dict.about.bio[0])}
      />
      <JsonLd
        id="about-breadcrumb"
        data={breadcrumb(locale, [
          { name: dict.nav.home, path: "" },
          { name: dict.nav.about, path: "/about" },
        ])}
      />
      <JsonLd id="about-faq" data={faqSchema(locale, "/about", faqByLocale[locale].about)} />
      <div className="max-w-3xl mx-auto">
        <div className="text-xs uppercase tracking-[0.2em] text-indigo-300/80 mb-3">
          {dict.about.eyebrow}
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight mb-6">
          {dict.about.title}
        </h1>

        <div className="max-w-none text-white/80 leading-relaxed space-y-5">
          {dict.about.bio.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xs uppercase tracking-widest text-white/50 mb-3">
            {dict.about.agentsHeader}
          </h2>
          <p className="text-white/80 leading-relaxed">{dict.about.agentsBody}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="mailto:info@neuralcosmology.com?subject=Rights%20inquiry"
              className="inline-flex items-center rounded-md bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {dict.about.emailCta}
            </a>
            <Link
              href={`/${locale}/science/pointer-architecture`}
              className="inline-flex items-center rounded-md border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {dict.footer.links.pointer}
            </Link>
            <Link
              href={`/${locale}/books`}
              className="inline-flex items-center rounded-md border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {dict.nav.books}
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xs uppercase tracking-widest text-white/50 mb-4">FAQ</h2>
          <dl className="space-y-6">
            {faqByLocale[locale].about.map((f) => (
              <div key={f.question}>
                <dt className="text-white/90 font-medium mb-1.5">{f.question}</dt>
                <dd className="text-white/75 leading-relaxed text-sm">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/*
          Business-identity bridge. Explicit pointer to the author's other
          public-facing brand. Indexed body content with a descriptive anchor
          is the strongest cross-domain signal Google and LLM citation graphs
          recognise — well above JSON-LD sameAs.
        */}
        <section className="mt-10 rounded-2xl border border-emerald-300/20 bg-emerald-400/5 p-6">
          <h2 className="text-xs uppercase tracking-widest text-emerald-200/80 mb-3">
            {SISTER_ABOUT[locale].eyebrow}
          </h2>
          <p className="text-white/85 leading-relaxed">
            {SISTER_ABOUT[locale].body}
          </p>
          <div className="mt-4">
            <a
              href="https://www.mikefluff.com"
              rel="me noopener"
              className="inline-flex items-center rounded-md border border-emerald-300/30 hover:border-emerald-300/60 text-white/90 hover:text-white px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {SISTER_ABOUT[locale].cta} →
            </a>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xs uppercase tracking-widest text-white/50 mb-3">
            {dict.about.elsewhereHeader}
          </h2>
          <ul className="text-sm text-white/75 space-y-1.5">
            <li>
              <a
                href="https://www.mikefluff.com"
                rel="me noopener"
                className="hover:text-white transition-colors"
              >
                mikefluff.com — {SISTER_ABOUT[locale].rel}
              </a>
            </li>
            <li>
              <a
                href="https://t.me/neuralcosmology"
                className="hover:text-white transition-colors"
              >
                Telegram — @neuralcosmology
              </a>
            </li>
            <li>
              <a
                href="https://github.com/neuralcosmology"
                className="hover:text-white transition-colors"
              >
                GitHub — neuralcosmology
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/mikefluff/"
                rel="me noopener"
                className="hover:text-white transition-colors"
              >
                LinkedIn — Mikhail Savchenko
              </a>
            </li>
            <li>
              <a
                href="mailto:info@neuralcosmology.com"
                className="hover:text-white transition-colors"
              >
                info@neuralcosmology.com
              </a>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
