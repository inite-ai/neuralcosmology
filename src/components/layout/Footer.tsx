"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SupportedLocale } from "@/lib/get-locale";
import { answersUi } from "@/content/answers-ui";
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
  if (pathname && /^\/[a-z]{2}\/read\/[^/]+\/[^/]+/.test(pathname)) return null;
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
        { label: answersUi[locale].nav, href: `/${locale}/answers` },
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
    <footer id="footer" className="bg-bg-sunk rule-t">
      <div className="px-5 md:px-10">
        <div className="rails mx-auto max-w-sheet">
          <div className="grid md:grid-cols-[1.3fr_2fr]">
            <div className="py-14 md:px-10 md:py-20">
              <Link
                href={`/${locale}`}
                className="block font-display text-[clamp(3.25rem,9vw,6.5rem)] leading-[0.92] tracking-[-0.02em] text-fg hover:text-primary transition-colors"
              >
                Neural
                <br />
                <em className="italic text-fg-secondary">Cosmology</em>
              </Link>
              <p className="mt-6 max-w-xs text-fg-secondary">{dict.footer.tagline}</p>
            </div>
            <div className="grid grid-cols-2 rule-t sm:grid-cols-3 md:border-t-0">
              {cols.map((col, i) => (
                <div
                  key={col.title}
                  className={`py-8 md:rule-l md:px-8 md:py-20 ${i === 2 ? "col-span-2 rule-t sm:col-span-1 sm:border-t-0" : ""}`}
                >
                  <p className="label text-muted mb-4">{col.title}</p>
                  <ul>
                    {col.links.map((l) => {
                      const external = /^(https?:|mailto:)/.test(l.href);
                      const cls = "inline-flex min-h-10 items-center text-fg-secondary hover:text-fg transition-colors";
                      return (
                        <li key={l.href}>
                          {external ? (
                            <a href={l.href} className={cls} rel="noopener noreferrer" target={l.href.startsWith("http") ? "_blank" : undefined}>
                              {l.label}
                            </a>
                          ) : (
                            <Link href={l.href} className={cls}>
                              {l.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/*
            Sister-site cross-promo: сквозная тематическая ссылка на бизнес-бренд
            автора (mikefluff.com) с rel="me" — сигнал сущности для поисковиков.
          */}
          <div className="flex flex-col gap-4 rule-t py-8 md:flex-row md:items-center md:justify-between md:px-10">
            <div className="min-w-0">
              <p className="label text-primary mb-2">{sister.eyebrow}</p>
              <p className="max-w-2xl text-sm leading-relaxed text-fg-secondary">{sister.body}</p>
            </div>
            <a
              href="https://www.mikefluff.com"
              rel="me noopener"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-sm hairline border-fg/70 px-5 label text-fg hover:bg-fg hover:text-bg transition-colors"
            >
              {sister.cta} →
            </a>
          </div>

          <div className="flex flex-col gap-2 rule-t py-6 label text-muted sm:flex-row sm:items-center sm:justify-between md:px-10">
            <span>
              © {new Date().getFullYear()} Neural Cosmology. {dict.footer.copyright}
            </span>
            <a href="mailto:info@neuralcosmology.com" className="hover:text-fg transition-colors normal-case tracking-normal">
              info@neuralcosmology.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
