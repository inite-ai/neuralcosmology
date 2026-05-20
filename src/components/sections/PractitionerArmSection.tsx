import Link from "next/link";
import type { SupportedLocale } from "@/lib/get-locale";

/**
 * PractitionerArmSection — home-page reciprocal feature card pointing to
 * mikefluff.com (the author's business/consulting brand).
 *
 * Hand-curated body copy with a descriptive cross-domain anchor — strong
 * SEO/AEO topical link that appears on every locale's home page.
 */

const COPY: Record<SupportedLocale, {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  cta: string;
  ctaSecondary: string;
}> = {
  en: {
    eyebrow: "Also the practitioner",
    title: "Where the same discipline meets client work",
    body: "Outside the research desk, the same person runs a business and consulting practice as Mike Fluff — Business Doctor. AI automation, regulatory immunity (PII handling, GDPR/LGPD/DPA, secure-by-design AI workflows), tech surgery, and three courses. Same epistemic habits, applied at client tempo.",
    bullets: [
      "AI automation & integration",
      "Regulatory immunity (AI privacy / compliance architecture)",
      "Three courses ($19 each)",
    ],
    cta: "Visit mikefluff.com",
    ctaSecondary: "Read the bridge essay",
  },
  ru: {
    eyebrow: "И практика",
    title: "Где та же дисциплина встречается с клиентской работой",
    body: "За рамками исследовательского стола тот же человек ведёт бизнес-практику как Mike Fluff — Business Doctor. ИИ-автоматизация, регуляторный иммунитет (PII, GDPR/LGPD/DPA, secure-by-design AI), технологическая хирургия, три курса. Те же эпистемические привычки в клиентском темпе.",
    bullets: [
      "ИИ-автоматизация и интеграции",
      "Регуляторный иммунитет (privacy/compliance для AI)",
      "Три курса ($19 каждый)",
    ],
    cta: "Открыть mikefluff.com",
    ctaSecondary: "Эссе-мост",
  },
  pt: {
    eyebrow: "Também o praticante",
    title: "Onde a mesma disciplina encontra o trabalho com clientes",
    body: "Fora da mesa de pesquisa, a mesma pessoa conduz uma prática de negócios como Mike Fluff — Business Doctor. Automação com IA, imunidade regulatória (PII, GDPR/LGPD/DPA, fluxos IA seguros por design), cirurgia tecnológica e três cursos. Mesmos hábitos epistêmicos no ritmo do cliente.",
    bullets: [
      "Automação com IA e integrações",
      "Imunidade regulatória (privacidade/compliance para IA)",
      "Três cursos ($19 cada)",
    ],
    cta: "Abrir mikefluff.com",
    ctaSecondary: "Ler o ensaio-ponte",
  },
  es: {
    eyebrow: "También el practicante",
    title: "Donde la misma disciplina encuentra el trabajo con clientes",
    body: "Fuera de la mesa de investigación, la misma persona lleva una práctica de negocios como Mike Fluff — Business Doctor. Automatización con IA, inmunidad regulatoria (PII, GDPR/LGPD/DPA, flujos IA seguros por diseño), cirugía tecnológica y tres cursos. Mismos hábitos epistémicos al ritmo del cliente.",
    bullets: [
      "Automatización con IA e integraciones",
      "Inmunidad regulatoria (privacidad/compliance para IA)",
      "Tres cursos ($19 cada uno)",
    ],
    cta: "Abrir mikefluff.com",
    ctaSecondary: "Leer el ensayo-puente",
  },
};

export default function PractitionerArmSection({ locale }: { locale: SupportedLocale }) {
  const c = COPY[locale];
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="rounded-3xl border border-emerald-300/15 bg-gradient-to-br from-emerald-400/5 via-transparent to-indigo-400/5 p-6 sm:p-10">
        <div className="text-[10px] uppercase tracking-[0.25em] text-emerald-200/70 mb-3">
          {c.eyebrow}
        </div>
        <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white leading-tight mb-4 max-w-3xl">
          {c.title}
        </h2>
        <p className="text-white/80 leading-relaxed max-w-3xl mb-6">
          {c.body}
        </p>
        <ul className="grid sm:grid-cols-3 gap-3 mb-8">
          {c.bullets.map((b) => (
            <li
              key={b}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
            >
              {b}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.mikefluff.com"
            rel="me noopener"
            className="inline-flex items-center rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 text-sm font-medium transition-colors"
          >
            {c.cta} →
          </a>
          <Link
            href={`/${locale}/essays/falsifiers-in-research-and-regulated-ai`}
            className="inline-flex items-center rounded-md border border-white/20 hover:border-white/40 text-white/85 hover:text-white px-5 py-2.5 text-sm font-medium transition-colors"
          >
            {c.ctaSecondary} →
          </Link>
        </div>
      </div>
    </div>
  );
}
