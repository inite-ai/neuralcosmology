"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import type { SupportedLocale } from "@/lib/get-locale";
import { SUPPORTED_LOCALES } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";
import { mainNav, menuLabel, accountLabel } from "@/components/layout/nav";

const localeLabel: Record<SupportedLocale, string> = { en: "EN", ru: "RU", pt: "PT", es: "ES" };

export function Wordmark({ locale, className }: { locale: SupportedLocale; className?: string }) {
  return (
    <Link
      href={`/${locale}`}
      className={cn("font-display text-[1.375rem] leading-none tracking-tight text-fg hover:text-primary transition-colors", className)}
    >
      Neural <em className="italic text-fg-secondary">Cosmology</em>
    </Link>
  );
}

export default function Header({ locale }: { locale: SupportedLocale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dict = getDict(locale);
  const m = menuLabel[locale];

  const nav = mainNav(locale);
  const isHome = /^\/[a-z]{2}\/?$/.test(pathname);
  // На главной (с md) шапка спрятана, пока виден scroll-hero — навигация живёт на кадре.
  const [heroPassed, setHeroPassed] = useState(!isHome);
  useEffect(() => {
    if (!isHome) {
      setHeroPassed(true);
      return;
    }
    const hero = document.querySelector("[data-hero]");
    const check = () => setHeroPassed(!hero || hero.getBoundingClientRect().bottom < 90);
    check();
    addEventListener("scroll", check, { passive: true });
    return () => removeEventListener("scroll", check);
  }, [isHome]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const pathWithoutLocale = (() => {
    const segs = pathname.split("/").filter(Boolean);
    if (segs[0] && (SUPPORTED_LOCALES as readonly string[]).includes(segs[0])) {
      return "/" + segs.slice(1).join("/");
    }
    return pathname;
  })();
  const switchHref = (l: SupportedLocale) => `/${l}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // У читалки своя панель — шапку сайта там не показываем.
  if (/^\/[a-z]{2}\/read\/[^/]+\/[^/]+/.test(pathname)) return null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-(--banner-h) z-50 bg-bg/92 backdrop-blur-xl rule-b transition-transform duration-300 ease-(--ease-soft)",
        !heroPassed && "md:-translate-y-[calc(100%+var(--banner-h))]",
      )}
    >
      <div className="px-5 md:px-10">
        <div className="mx-auto flex h-14 max-w-sheet items-stretch justify-between md:rails">
          <div className="flex items-center md:px-6">
            <Wordmark locale={locale} />
          </div>

          <nav className="hidden xl:flex items-stretch" aria-label="Main">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center rule-l px-4 label transition-colors hover:bg-bg-raised",
                  isActive(item.href) ? "text-primary" : "text-fg-secondary hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center rule-l px-3">
              {SUPPORTED_LOCALES.map((l) => (
                <Link
                  key={l}
                  href={switchHref(l)}
                  hrefLang={l}
                  className={cn(
                    "px-1.5 py-2 label transition-colors",
                    l === locale ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {localeLabel[l]}
                </Link>
              ))}
            </div>
            <Link
              href={`/${locale}/account`}
              className={cn("flex items-center rule-l px-4 label transition-colors hover:bg-bg-raised", isActive(`/${locale}/account`) ? "text-primary" : "text-fg-secondary hover:text-fg")}
            >
              {accountLabel[locale]}
            </Link>
            <div className="flex items-center rule-l pl-4 pr-4">
              <Link
                href={`/${locale}/books`}
                className="inline-flex h-9 items-center rounded-sm bg-fg px-5 label text-bg transition-colors hover:bg-primary"
              >
                {m.read}
              </Link>
            </div>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="xl:hidden -mr-2 inline-flex min-h-11 items-center gap-2 self-center px-2 label text-fg md:mr-4"
            aria-expanded={open}
            aria-controls="site-menu"
          >
            {m.open}
            <span aria-hidden className="flex flex-col gap-[5px]">
              <span className="block h-px w-5 bg-fg" />
              <span className="block h-px w-5 bg-fg" />
            </span>
          </button>
        </div>
      </div>

      {open &&
        createPortal(
          <div id="site-menu" role="dialog" aria-modal="true" aria-label={m.open} className="fixed inset-0 z-[70] flex flex-col bg-bg text-fg xl:hidden">
            <div className="flex h-14 shrink-0 items-center justify-between px-5 rule-b">
              <Wordmark locale={locale} />
              <button type="button" onClick={() => setOpen(false)} className="-mr-2 inline-flex min-h-11 items-center gap-3 px-2 label text-fg">
                {m.close}
                <span aria-hidden className="relative block h-5 w-5">
                  <span className="absolute left-0 top-1/2 block h-px w-5 rotate-45 bg-fg" />
                  <span className="absolute left-0 top-1/2 block h-px w-5 -rotate-45 bg-fg" />
                </span>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5" aria-label="Main">
              {[{ href: `/${locale}`, label: dict.nav.home }, ...nav, { href: `/${locale}/account`, label: accountLabel[locale] }].map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between gap-4 rule-b py-5",
                    (i === 0 ? pathname === item.href : isActive(item.href)) ? "text-primary" : "text-fg",
                  )}
                >
                  <span className="font-display text-[2.25rem] leading-none">{item.label}</span>
                  <span className="label text-muted">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              ))}
              <Link
                href={`/${locale}/books`}
                className="mt-8 flex min-h-12 items-center justify-center rounded-sm bg-fg label text-bg"
              >
                {m.read}
              </Link>
            </nav>
            <div className="flex shrink-0 items-center justify-between gap-4 rule-t px-5 py-4">
              <div className="flex">
                {SUPPORTED_LOCALES.map((l) => (
                  <Link
                    key={l}
                    href={switchHref(l)}
                    hrefLang={l}
                    className={cn(
                      "inline-flex min-h-11 min-w-11 items-center justify-center label",
                      l === locale ? "text-fg underline decoration-primary underline-offset-4" : "text-muted",
                    )}
                  >
                    {localeLabel[l]}
                  </Link>
                ))}
              </div>
              <a href="mailto:info@neuralcosmology.com" className="text-sm text-muted">
                info@neuralcosmology.com
              </a>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
