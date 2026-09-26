import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Примитивы системы "The Plate Room" (DESIGN.md → Layout / Components).
// Mobile first: базовые классы — телефон, md/lg только раскрывают.

/** Лист 1200px с 0.5px-линейками (линейки появляются с md). */
export function Sheet({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="px-5 md:px-10">
      <div className={cn("rails mx-auto max-w-sheet", className)}>{children}</div>
    </div>
  );
}

/** Полоса листа: правило сверху, ритм секции, внутренний отступ от линеек. */
export function Band({
  children,
  id,
  flush,
  className,
}: {
  children: ReactNode;
  id?: string;
  flush?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("rule-t", !flush && "py-18 md:px-10 lg:py-32", className)}
    >
      {children}
    </section>
  );
}

export function Label({
  children,
  tone = "accent",
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  tone?: "accent" | "muted";
  className?: string;
  as?: "p" | "span" | "div";
}) {
  return (
    <Tag className={cn("label", tone === "accent" ? "text-primary" : "text-muted", className)}>
      {children}
    </Tag>
  );
}

type HeadlineProps = {
  children: ReactNode;
  /** Вторая часть фразы — курсивом, с новой строки на широких экранах. */
  em?: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "display" | "headline";
  delay?: number;
  className?: string;
};

/** Заголовок с blur-in. Marcellus/Forum, вторая часть — курсив. */
export function Headline({ children, em, as: Tag = "h2", size = "headline", delay = 0, className }: HeadlineProps) {
  return (
    <Tag
      className={cn(
        "reveal text-balance",
        size === "display" ? "display-fluid" : "headline-fluid",
        className,
      )}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
      {em && (
        <>
          {" "}
          <em className="italic text-fg-secondary">{em}</em>
        </>
      )}
    </Tag>
  );
}

/** Блок заголовка секции: метка → заголовок → подзаголовок. */
export function Heading({
  label,
  title,
  em,
  sub,
  as,
  className,
}: {
  label?: ReactNode;
  title: ReactNode;
  em?: ReactNode;
  sub?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {label && <Label className="mb-4">{label}</Label>}
      <Headline as={as} em={em}>
        {title}
      </Headline>
      {sub && <p className="mt-5 max-w-[60ch] text-fg-secondary md:text-lg">{sub}</p>}
    </div>
  );
}

type ButtonProps = {
  href: string;
  variant?: "paper" | "rule";
  external?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href">;

const buttonBase =
  "inline-flex min-h-11 md:min-h-10 items-center justify-center gap-2 rounded-sm px-5 label transition-[background-color,color,opacity] duration-(--duration-micro) ease-(--ease-soft)";

export function Button({ href, variant = "paper", external, className, children, ...rest }: ButtonProps) {
  const v =
    variant === "paper"
      ? "bg-fg text-bg hover:bg-primary"
      : "hairline border-fg/70 text-fg hover:bg-fg hover:text-bg";
  const cls = cn(buttonBase, v, className);
  const isExternal = external ?? /^(https?:|mailto:)/.test(href);
  if (isExternal) {
    return (
      <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" {...rest}>
        {children}
        {href.startsWith("http") && <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.25} aria-hidden />}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...(rest as object)}>
      {children}
    </Link>
  );
}

/** Ячейка сетки с общими 0.5px-границами. Сетка задаётся родителем через CellGrid. */
export function Cell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-7 md:p-10", className)}>{children}</div>;
}

/**
 * Сетка ячеек без зазоров: границы рисуются так, чтобы соседние ячейки
 * делили одну 0.5px-линию при любом числе колонок.
 */
export function CellGrid({
  children,
  cols = "md:grid-cols-2",
  className,
}: {
  children: ReactNode;
  cols?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-[0.5px] bg-line hairline [&>*]:bg-bg",
        cols,
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Строка-ссылка во всю ширину: заголовок слева, мета и стрелка справа. */
export function RowLink({
  href,
  title,
  meta,
  index,
  className,
}: {
  href: string;
  title: ReactNode;
  meta?: ReactNode;
  index?: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 rule-b py-5 transition-colors hover:text-primary",
        className,
      )}
    >
      <span className="label text-muted w-8">{index}</span>
      <span className="font-display text-xl leading-snug md:text-2xl">{title}</span>
      <span className="flex items-center gap-3 label text-muted">
        {meta && <span className="hidden sm:inline">{meta}</span>}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1} aria-hidden />
      </span>
    </Link>
  );
}

/** Текстовая ссылка со стрелкой — «читать дальше». */
export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const external = /^https?:/.test(href);
  const Icon = external ? ArrowUpRight : ArrowRight;
  const content = (
    <>
      <span>{children}</span>
      <Icon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.25} aria-hidden />
    </>
  );
  const cls = cn("group inline-flex min-h-11 items-center gap-2 label text-fg hover:text-primary transition-colors", className);
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {content}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
