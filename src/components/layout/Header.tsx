"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SupportedLocale } from "@/lib/get-locale";
import { SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

const localeLabel: Record<SupportedLocale, string> = {
  en: "EN",
  ru: "RU",
  pt: "PT",
  es: "ES",
};

export default function Header({ locale }: { locale: SupportedLocale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dict = getDict(locale);

  const nav = [
    { href: `/${locale}`, exact: true, label: dict.nav.home },
    { href: `/${locale}/books`, exact: false, label: dict.nav.books },
    { href: `/${locale}/science`, exact: false, label: dict.nav.science },
    { href: `/${locale}/essays`, exact: false, label: dict.nav.essays },
    { href: `/${locale}/lectures`, exact: false, label: dict.nav.lectures },
    { href: `/${locale}/about`, exact: false, label: dict.nav.about },
  ];

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const pathWithoutLocale = (() => {
    const segs = pathname.split("/").filter(Boolean);
    if (segs[0] && (SUPPORTED_LOCALES as readonly string[]).includes(segs[0])) {
      return "/" + segs.slice(1).join("/");
    }
    return pathname;
  })();

  const switchHref = (l: SupportedLocale) =>
    `/${l}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#0a1026]/70 border-b border-white/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
        <Link
          href={`/${locale}`}
          className="font-semibold tracking-tight text-white/90 hover:text-white transition-colors"
        >
          neural<span className="text-indigo-300">cosmology</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                isActive(item.href, item.exact)
                  ? "text-white bg-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/5",
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-0.5 border-l border-white/10 pl-2">
            {SUPPORTED_LOCALES.map((l) => (
              <Link
                key={l}
                href={switchHref(l)}
                className={cn(
                  "px-2 py-1 rounded text-[11px] tracking-wider transition-colors",
                  l === locale
                    ? "text-white bg-white/10"
                    : "text-white/50 hover:text-white hover:bg-white/5",
                )}
              >
                {localeLabel[l]}
              </Link>
            ))}
          </div>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md text-white/80 hover:text-white hover:bg-white/5"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1">
            <span className={cn("block h-0.5 w-5 bg-current transition-transform", open && "translate-y-1.5 rotate-45")} />
            <span className={cn("block h-0.5 w-5 bg-current transition-opacity", open && "opacity-0")} />
            <span className={cn("block h-0.5 w-5 bg-current transition-transform", open && "-translate-y-1.5 -rotate-45")} />
          </div>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-white/5 bg-[#0a1026]/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "py-2 px-2 rounded-md text-sm transition-colors",
                  isActive(item.href, item.exact)
                    ? "text-white bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/5",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/10">
              {SUPPORTED_LOCALES.map((l) => (
                <Link
                  key={l}
                  href={switchHref(l)}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-2 py-1 rounded text-xs tracking-wider transition-colors",
                    l === locale
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/5",
                  )}
                >
                  {localeLabel[l]}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
