import Link from "next/link";
import type { ReactNode } from "react";
import { PAGE, type BookStat } from "@/lib/admin/data";
import { cn } from "@/lib/utils";

/** Поле формы. Здесь, а не в forms.tsx: константу из клиентского модуля сервер не видит. */
export const field = "w-full rounded-sm hairline bg-bg-raised px-3 py-2 text-[0.9375rem] text-fg outline-none transition-colors placeholder:text-muted focus:border-primary";

export const when = (d: Date | null | undefined) =>
  d ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(d) : "";
export const day = (d: Date | null | undefined) =>
  d ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" }).format(d) : "";

/** 1 глава, 2 главы, 5 глав. */
export const plural = (n: number, one: string, few: string, many: string) => {
  const r = new Intl.PluralRules("ru").select(n);
  return `${n} ${r === "one" ? one : r === "few" ? few : many}`;
};

export const KIND: Record<string, string> = { contact: "Вопрос", rights: "Права", press: "Пресса" };
export const STATUS: Record<string, string> = { new: "Новое", answered: "Отвечено", in_talks: "Переговоры", won: "Договорились", lost: "Не сложилось", spam: "Спам" };
export const SUB: Record<string, string> = { confirmed: "Подтверждён", pending: "Ждёт подтверждения", unsubscribed: "Отписан" };

export function Title({ children, lead, aside }: { children: ReactNode; lead?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[2rem] leading-tight md:text-[2.5rem]">{children}</h1>
        {lead && <p className="mt-2 max-w-[60ch] text-fg-secondary">{lead}</p>}
      </div>
      {aside}
    </header>
  );
}

export function Part({ title, children, aside, className }: { title: ReactNode; children: ReactNode; aside?: ReactNode; className?: string }) {
  return (
    <section className={cn("mt-10", className)}>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export const Empty = ({ children }: { children: ReactNode }) => <p className="rounded-sm bg-bg-sunk px-5 py-6 text-fg-secondary">{children}</p>;

export const Tag = ({ children, on }: { children: ReactNode; on?: boolean }) => (
  <span className={cn("inline-block whitespace-nowrap rounded-full px-2.5 text-xs leading-6", on ? "bg-primary text-on-primary" : "bg-bg-sunk text-fg-secondary")}>{children}</span>
);

/** Выбор среза: ссылки, чтобы срез можно было открыть и сохранить адресом. */
export function Tabs({ items }: { items: { href: string; label: string; n?: number; on: boolean }[] }) {
  return (
    <div className="mb-5 flex flex-wrap gap-1">
      {items.map((t) => (
        <Link key={t.href} href={t.href} aria-current={t.on ? "true" : undefined} className={cn("inline-flex min-h-10 items-center gap-2 rounded-sm px-3 text-sm transition-colors", t.on ? "bg-bg-sunk text-fg" : "text-muted hover:text-fg")}>
          {t.label}
          {t.n !== undefined && <span className="tabular-nums text-muted">{t.n}</span>}
        </Link>
      ))}
    </div>
  );
}

export function Search({ q, placeholder, keep = {} }: { q?: string; placeholder: string; keep?: Record<string, string | undefined> }) {
  return (
    <form className="mb-5 flex max-w-xl gap-2" role="search">
      {Object.entries(keep).map(([k, v]) => v && <input key={k} type="hidden" name={k} value={v} />)}
      <input name="q" type="search" defaultValue={q} placeholder={placeholder} aria-label={placeholder} className="w-full rounded-sm hairline bg-bg-raised px-3 py-2 text-[0.9375rem] outline-none focus:border-primary" />
      <button type="submit" className="min-h-10 rounded-sm hairline px-4 text-sm hover:bg-fg hover:text-bg">Найти</button>
    </form>
  );
}

export function Pager({ page, total, href }: { page: number; total: number; href: (p: number) => string }) {
  const last = Math.max(1, Math.ceil(total / PAGE));
  if (last < 2) return null;
  const cls = "inline-flex min-h-10 items-center rounded-sm hairline px-4 text-sm hover:bg-fg hover:text-bg";
  return (
    <div className="mt-6 flex items-center gap-3">
      {page > 1 && <Link className={cls} href={href(page - 1)}>Раньше</Link>}
      <span className="text-sm text-muted tabular-nums">{page} из {last}</span>
      {page < last && <Link className={cls} href={href(page + 1)}>Дальше</Link>}
    </div>
  );
}

/**
 * Срез книги. Столбик — глава; светлая часть — открыли, тёмная — дочитали.
 * Цветная черта внизу — глава открыта всем. Обрыв виден сразу.
 */
export function Core({ book, tall, href }: { book: BookStat; tall?: boolean; href?: string }) {
  const max = Math.max(1, ...book.chapters.map((c) => c.opened));
  const h = tall ? 168 : 56;
  const body = (
    <div
      role="img"
      aria-label={`${book.title}: открыли и дочитали по главам. ${book.chapters.map((c) => `${c.title}: ${c.opened} и ${c.read}`).join("; ")}`}
      className="flex items-end gap-px overflow-hidden"
      style={{ height: h }}
    >
      {book.chapters.map((c) => (
        <div key={c.id} title={`${c.number != null ? `${c.number}. ` : ""}${c.title}: открыли ${c.opened}, дочитали ${c.read}`} className="group relative flex h-full min-w-0 flex-1 flex-col justify-end">
          <div className="relative w-full bg-line-soft/60 transition-colors group-hover:bg-line-soft" style={{ height: `${Math.max(c.opened ? 4 : 0, (c.opened / max) * (h - 4))}px` }}>
            <div className="absolute inset-x-0 bottom-0 bg-fg group-hover:bg-primary" style={{ height: c.opened ? `${(c.read / c.opened) * 100}%` : 0 }} />
          </div>
          <div className={cn("h-[3px] w-full", c.free ? "bg-primary" : "bg-line-soft")} />
        </div>
      ))}
    </div>
  );
  return href ? <Link href={href} className="block">{body}</Link> : body;
}

/** Где читатели останавливаются: самый большой обрыв между соседними главами. */
export function drop(b: BookStat) {
  let worst: { from: BookStat["chapters"][number]; to: BookStat["chapters"][number]; lost: number } | null = null;
  for (let i = 1; i < b.chapters.length; i++) {
    const from = b.chapters[i - 1], to = b.chapters[i], lost = from.opened - to.opened;
    if (lost > 0 && from.opened >= 3 && (!worst || lost > worst.lost)) worst = { from, to, lost };
  }
  return worst;
}
