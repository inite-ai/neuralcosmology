"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string; count?: number };

// Разделы бэкофиса: колонка внутри листа, на телефоне — прокручиваемая строка.
export default function Nav({ base, items }: { base: string; items: NavItem[] }) {
  const path = usePathname();
  const list = useRef<HTMLUListElement>(null);
  // На телефоне открытый раздел мог уехать за край строки.
  useEffect(() => {
    const on = list.current?.querySelector<HTMLElement>("[aria-current]");
    const box = list.current?.parentElement;
    if (on && box && box.scrollWidth > box.clientWidth) box.scrollLeft = on.offsetLeft - 20;
  }, [path]);
  return (
    <nav aria-label="Разделы бэкофиса" className="-mx-5 overflow-x-auto px-5 md:mx-0 md:overflow-visible md:px-0">
      <ul ref={list} className="relative flex gap-1 md:block">
        {items.map((it) => {
          const on = it.href === base ? path === base : path.startsWith(it.href);
          return (
            <li key={it.href} className="shrink-0">
              <Link
                href={it.href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center justify-between gap-3 rounded-sm px-3 text-[0.9375rem] transition-colors md:min-h-10",
                  on ? "bg-fg text-bg" : "text-fg-secondary hover:bg-bg-sunk hover:text-fg",
                )}
              >
                {it.label}
                {it.count ? (
                  <span className={cn("min-w-5 rounded-full px-1.5 text-center text-xs leading-5 tabular-nums", on ? "bg-bg text-fg" : "bg-primary text-on-primary")}>{it.count}</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
