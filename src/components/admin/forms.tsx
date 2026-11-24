"use client";
import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import type { Result } from "@/lib/admin/actions";

const base = "inline-flex min-h-10 items-center justify-center rounded-sm px-4 text-sm transition-colors disabled:opacity-50";

export function Submit({ children, tone = "main", className }: { children: ReactNode; tone?: "main" | "quiet"; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn(base, tone === "main" ? "bg-fg text-bg hover:bg-primary" : "hairline text-fg hover:bg-fg hover:text-bg", className)}>
      {children}
    </button>
  );
}

/** Форма, которая говорит, что вышло: ошибка словами или «Сохранено». */
export function Form({ action, children, reset, className }: { action: (s: Result, f: FormData) => Promise<Result>; children: ReactNode; reset?: boolean; className?: string }) {
  const [state, run] = useActionState(action, {} as Result);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (reset && state.ok) ref.current?.reset();
  }, [state, reset]);
  return (
    <form ref={ref} action={run} className={className}>
      {children}
      <p role="status" aria-live="polite" className={cn("text-sm", state.error ? "text-[#b3261e] dark:text-[#f2a3a3]" : "text-primary", !state.error && !state.ok && "sr-only")}>
        {state.error ?? state.ok ?? ""}
      </p>
    </form>
  );
}

/** Необратимое — в два шага, без системных окон. */
export function Danger({ action, values, children, ask }: { action: (f: FormData) => Promise<void>; values: Record<string, string>; children: ReactNode; ask: string }) {
  const [sure, setSure] = useState(false);
  if (!sure)
    return (
      <button type="button" onClick={() => setSure(true)} className={cn(base, "px-2 text-muted underline decoration-line-soft underline-offset-4 hover:text-fg")}>
        {children}
      </button>
    );
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      {Object.entries(values).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <span className="text-sm text-fg-secondary">{ask}</span>
      <Submit tone="quiet">{children}</Submit>
      <button type="button" onClick={() => setSure(false)} className={cn(base, "px-2 text-muted hover:text-fg")}>Отмена</button>
    </form>
  );
}

export function Act({ action, values, children, tone = "quiet" }: { action: (f: FormData) => Promise<void>; values: Record<string, string>; children: ReactNode; tone?: "main" | "quiet" }) {
  return (
    <form action={action}>
      {Object.entries(values).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <Submit tone={tone}>{children}</Submit>
    </form>
  );
}
