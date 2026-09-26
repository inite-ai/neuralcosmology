import type { ReactNode } from "react";
import { Sheet, Label, Headline } from "@/components/system";

/** «Первая часть — вторая часть» или «Фраза. Фраза.» → курсивная вторая часть. */
export function splitTitle(title: string): [string, string | undefined] {
  const dash = title.match(/^(.+?)\s+[—–]\s+(.+)$/);
  if (dash) return [dash[1], dash[2]];
  const dot = title.match(/^(.+?[.!?])\s+(.+)$/);
  if (dot) return [dot[1], dot[2]];
  return [title, undefined];
}

// Внутренние страницы: лист с линейками, шапка-полоса с меткой и заголовком,
// дальше — полосы секций (children оборачивают себя в Band).
export default function PageShell({
  eyebrow,
  title,
  lead,
  aside,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  const [main, em] = splitTitle(title);
  return (
    <main className="pt-14">
      <Sheet>
        <header className="grid gap-8 pt-14 pb-12 md:px-10 md:pt-24 md:pb-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-4xl">
            {eyebrow && <Label className="mb-5">{eyebrow}</Label>}
            <Headline as="h1" size="display" em={em}>
              {main}
            </Headline>
            {lead && <p className="mt-6 max-w-[60ch] text-fg-secondary md:text-lg">{lead}</p>}
          </div>
          {aside}
        </header>
        {children}
      </Sheet>
    </main>
  );
}
