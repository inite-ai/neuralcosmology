import Link from "next/link";
import type { Paper } from "@/types/paper";
import type { SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

const statusLabelByLocale: Record<SupportedLocale, Record<Paper["status"], string>> = {
  en: { preprint: "Preprint", submitted: "Submitted", published: "Published" },
  ru: { preprint: "Препринт", submitted: "На рецензии", published: "Опубликовано" },
  pt: { preprint: "Preprint", submitted: "Submetido", published: "Publicado" },
  es: { preprint: "Preprint", submitted: "Enviado", published: "Publicado" },
};

export default function PaperCard({
  paper,
  locale,
}: {
  paper: Paper;
  locale: SupportedLocale;
}) {
  const dict = getDict(locale);
  return (
    <Link
      href={`/${locale}/science/${paper.slug}`}
      className="group grid gap-6 bg-bg p-7 transition-colors hover:bg-bg-raised md:grid-cols-[10rem_1fr_auto] md:gap-10 md:p-10"
    >
      <div className="flex flex-row flex-wrap gap-x-4 gap-y-1 md:flex-col">
        <span className="label text-primary">{statusLabelByLocale[locale][paper.status]}</span>
        <span className="label text-muted">{paper.year}</span>
        {paper.venue && <span className="label text-muted">{paper.venue}</span>}
      </div>
      <div>
        <h3 className="font-display text-[1.75rem] leading-[1.1] md:text-[2.125rem] group-hover:text-primary transition-colors">
          {paper.title}
        </h3>
        <p className="mt-2 text-sm text-muted">{paper.authors.join(", ")}</p>
        <p className="mt-4 max-w-[70ch] text-fg-secondary line-clamp-4">{paper.abstract}</p>
      </div>
      <span className="label text-fg self-end group-hover:text-primary transition-colors">{dict.science.cardCta}</span>
    </Link>
  );
}
