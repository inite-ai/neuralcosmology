"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SupportedLocale } from "@/lib/get-locale";

// Хром страницы по образцу editorial-landing: анонс-бар, переключатель темы,
// «попросить ИИ пересказать», кольцевой курсор.

const READER_ROUTE = /^\/[a-z]{2}\/read\/[^/]+\/[^/]+/;
const BANNER_ID = "library-2026-09";

const BANNER: Record<SupportedLocale, { lead: string; more: string; cta: string; close: string }> = {
  en: { lead: "New: the online library.", more: "Opening chapters of all four books are free.", cta: "Start reading", close: "Dismiss" },
  ru: { lead: "Новое: онлайн-библиотека.", more: "Первые главы всех четырёх книг — бесплатно.", cta: "Читать", close: "Закрыть" },
  pt: { lead: "Novo: a biblioteca online.", more: "Os primeiros capítulos dos quatro livros são gratuitos.", cta: "Ler agora", close: "Fechar" },
  es: { lead: "Nuevo: la biblioteca en línea.", more: "Los primeros capítulos de los cuatro libros son gratis.", cta: "Leer", close: "Cerrar" },
};

export function AnnouncementBar({ locale }: { locale: SupportedLocale }) {
  const pathname = usePathname();
  const t = BANNER[locale];
  const inReader = READER_ROUTE.test(pathname);

  // Клиентская навигация в читалку и обратно: отступ под баннер синхронизируем здесь.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem("nc-banner") === BANNER_ID;
    } catch {}
    document.documentElement.classList.toggle("banner-off", dismissed || inReader);
  }, [inReader]);

  const dismiss = () => {
    try {
      localStorage.setItem("nc-banner", BANNER_ID);
    } catch {}
    document.documentElement.classList.add("banner-off");
  };

  if (inReader) return null;
  return (
    <div className="announcement fixed inset-x-0 top-0 z-[60] flex h-(--banner-h) items-center justify-center overflow-hidden bg-bg rule-b px-12 text-sm text-fg [.banner-off_&]:hidden">
      <p className="truncate">
        <span>{t.lead}</span>
        <span className="mx-2 hidden text-muted sm:inline">·</span>
        <span className="hidden text-muted sm:inline">{t.more}</span>
        <span className="mx-2 text-muted">·</span>
        <Link href={`/${locale}/books`} className="underline decoration-primary underline-offset-4 hover:text-primary">
          {t.cta}
        </Link>
      </p>
      <button
        type="button"
        aria-label={t.close}
        onClick={dismiss}
        className="absolute right-2 inline-flex h-9 w-9 items-center justify-center text-muted hover:text-fg"
      >
        ×
      </button>
    </div>
  );
}

export function ThemeToggle({ label }: { label: string }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const cl = document.documentElement.classList;
      setDark(cl.contains("dark") || (!cl.contains("light") && mq.matches));
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  if (READER_ROUTE.test(pathname)) return null;
  // Переключаем от фактической темы; явный выбор запоминаем, иначе действует система.
  const toggle = () => {
    const next = dark ? "light" : "dark";
    const cl = document.documentElement.classList;
    cl.remove("dark", "light");
    cl.add(next);
    setDark(next === "dark");
    try {
      localStorage.setItem("nc-theme", next);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={dark}
      className="fixed right-4 bottom-4 z-50 flex h-11 w-11 items-center justify-center rounded-full hairline bg-bg text-fg transition-colors hover:border-fg md:right-6 md:bottom-6"
    >
      {!dark ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}

// ---------- AI summary ----------

const Svg = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <svg width="18" height="18" viewBox="0 0 64 64" fill="none" stroke="currentColor" role="img" aria-label={label}>
    {children}
  </svg>
);

const aiMarks = {
  chatgpt: (
    <Svg label="ChatGPT">
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <rect key={r} x="26" y="10" width="12" height="26" rx="6" transform={`rotate(${r} 32 32)`} strokeWidth={3} />
      ))}
    </Svg>
  ),
  claude: (
    <Svg label="Claude">
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M32 32V8" transform={`rotate(${i * 30} 32 32)`} strokeWidth={5} />
      ))}
    </Svg>
  ),
  perplexity: (
    <Svg label="Perplexity">
      <path d="M32 6v52M14 16l18 14 18-14M14 16v22l18-8M50 16v22l-18-8M14 38l18 16 18-16M14 38v12M50 38v12" strokeWidth={3.5} />
    </Svg>
  ),
};

const AI: Record<SupportedLocale, { label: string; prompt: (url: string) => string }> = {
  en: {
    label: "Ask an AI to summarise this page",
    prompt: (u) => `Summarise ${u} for me: what Neural Cosmology claims, what evidence it cites, and how it can be falsified. Cite the page.`,
  },
  ru: {
    label: "Попросить ИИ пересказать страницу",
    prompt: (u) => `Перескажи мне ${u}: что утверждает Нейронная космология, на какие данные опирается и как её можно опровергнуть. Ссылайся на страницу.`,
  },
  pt: {
    label: "Pedir a uma IA um resumo desta página",
    prompt: (u) => `Resuma ${u} para mim: o que a Cosmologia Neural afirma, quais evidências cita e como pode ser refutada. Cite a página.`,
  },
  es: {
    label: "Pedir a una IA un resumen de esta página",
    prompt: (u) => `Resúmeme ${u}: qué afirma la Cosmología Neural, qué evidencia cita y cómo puede refutarse. Cita la página.`,
  },
};

export function AiSummary({ locale, className }: { locale: SupportedLocale; className?: string }) {
  const t = AI[locale];
  const q = encodeURIComponent(t.prompt(`https://neuralcosmology.com/${locale}`));
  const targets = [
    { href: `https://chatgpt.com/?q=${q}`, mark: aiMarks.chatgpt },
    { href: `https://claude.ai/new?q=${q}`, mark: aiMarks.claude },
    { href: `https://www.perplexity.ai/search?q=${q}`, mark: aiMarks.perplexity },
  ];
  return (
    <div className={className}>
      <p className="text-sm opacity-80">{t.label}</p>
      <div className="mt-1 flex gap-1">
        {targets.map((x) => (
          <a
            key={x.href}
            href={x.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center -ml-2 first:ml-[-0.6rem] opacity-75 transition-opacity hover:opacity-100"
          >
            {x.mark}
          </a>
        ))}
      </div>
    </div>
  );
}

// ---------- Cursor ----------

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    const d = dot.current!;
    const r = ring.current!;
    let x = -100,
      y = -100,
      rx = x,
      ry = y,
      scale = 1,
      target = 1,
      raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      target = (e.target as Element).closest("a, button, summary, input, textarea, label") ? 1.55 : 1;
      d.style.opacity = r.style.opacity = "1";
    };
    const leave = () => (d.style.opacity = r.style.opacity = "0");
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      scale += (target - scale) * 0.18;
      d.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
      r.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <>
      <div ref={ring} aria-hidden className="pointer-events-none fixed top-0 left-0 z-[100] h-9 w-9 rounded-full border border-white opacity-0 mix-blend-difference" />
      <div ref={dot} aria-hidden className="pointer-events-none fixed top-0 left-0 z-[100] h-2 w-2 rounded-full bg-white opacity-0 mix-blend-difference" />
    </>
  );
}
