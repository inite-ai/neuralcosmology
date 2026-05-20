"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

// Sister-site cross-promo strings. Kept inline (not in the central Dict) to
// avoid widening the typed dictionary for a single recurring blurb.
const SISTER: Record<SupportedLocale, { eyebrow: string; body: string; cta: string }> = {
  en: {
    eyebrow: "Sister practice",
    body: "Same author runs a business and consulting practice as Mike Fluff — AI automation, regulatory immunity, tech surgery, and courses.",
    cta: "Visit mikefluff.com",
  },
  ru: {
    eyebrow: "Сайт-побратим",
    body: "Тот же автор ведёт бизнес-практику как Майк Флафф — ИИ-автоматизация, регуляторный иммунитет, технологическая хирургия, курсы.",
    cta: "Открыть mikefluff.com",
  },
  pt: {
    eyebrow: "Site-irmão",
    body: "O mesmo autor conduz uma prática de negócios como Mike Fluff — automação com IA, imunidade regulatória, cirurgia tecnológica e cursos.",
    cta: "Abrir mikefluff.com",
  },
  es: {
    eyebrow: "Sitio hermano",
    body: "El mismo autor lleva una práctica de negocios como Mike Fluff — automatización con IA, inmunidad regulatoria, cirugía tecnológica y cursos.",
    cta: "Abrir mikefluff.com",
  },
};

export default function Footer({ locale }: { locale: SupportedLocale }) {
  const dict = getDict(locale);
  const pathname = usePathname();
  if (pathname && /^\/[a-z]{2}\/read(\/|$)/.test(pathname)) return null;
  const sister = SISTER[locale];
  const cols = [
    {
      title: dict.footer.columns.read,
      links: [
        { label: dict.footer.links.books, href: `/${locale}/books` },
        { label: dict.footer.links.essays, href: `/${locale}/essays` },
        { label: dict.nav.lectures, href: `/${locale}/lectures` },
        { label: dict.footer.links.science, href: `/${locale}/science` },
      ],
    },
    {
      title: dict.footer.columns.research,
      links: [
        {
          label: dict.footer.links.pointer,
          href: `/${locale}/science/pointer-architecture`,
        },
      ],
    },
    {
      title: dict.footer.columns.contact,
      links: [
        { label: dict.footer.links.about, href: `/${locale}/about` },
        { label: dict.footer.links.press, href: "mailto:info@neuralcosmology.com" },
        { label: "Telegram", href: "https://t.me/neuralcosmology" },
        { label: dict.footer.links.github, href: "https://github.com/neuralcosmology" },
      ],
    },
  ];

  return (
    <footer id="footer" className="w-full border-t border-white/10 bg-[#0a1026]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <div className="font-semibold tracking-tight text-white/90">
            neural<span className="text-indigo-300">cosmology</span>
          </div>
          <p className="mt-2 text-sm text-white/60 max-w-xs leading-relaxed">
            {dict.footer.tagline}
          </p>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <div className="text-xs uppercase tracking-widest text-white/50 mb-3">
              {col.title}
            </div>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/75 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/*
        Sister-site cross-promo. Site-wide one-line link to the author's
        business brand (mikefluff.com) — the highest-leverage cross-domain
        signal short of editorial body links. Real <a> tag with descriptive
        anchor text so it indexes as a topical link.
      */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.2em] text-indigo-300/70 mb-1">
              {sister.eyebrow}
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
              {sister.body}
            </p>
          </div>
          <a
            href="https://www.mikefluff.com"
            rel="me noopener"
            className="inline-flex shrink-0 items-center rounded-md border border-white/20 hover:border-white/40 text-white/85 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            {sister.cta} →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-white/5 text-xs text-white/50">
        <div>
          © {new Date().getFullYear()} Neuralcosmology. {dict.footer.copyright}
        </div>
        <div>
          <a href="mailto:info@neuralcosmology.com" className="hover:text-white transition-colors">
            info@neuralcosmology.com
          </a>
        </div>
      </div>
    </footer>
  );
}
