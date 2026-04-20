"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

export default function Footer({ locale }: { locale: SupportedLocale }) {
  const dict = getDict(locale);
  const pathname = usePathname();
  if (pathname && /^\/[a-z]{2}\/read(\/|$)/.test(pathname)) return null;
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
