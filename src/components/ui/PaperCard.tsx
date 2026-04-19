import Link from "next/link";
import type { Paper } from "@/types/paper";
import { Badge } from "@/components/ui/badge";
import type { SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

const statusStyle: Record<Paper["status"], string> = {
  preprint: "border-indigo-400/40 text-indigo-200",
  submitted: "border-amber-400/40 text-amber-200",
  published: "border-emerald-400/40 text-emerald-200",
};

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
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-white/20 transition-colors p-6"
    >
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <Badge variant="outline" className={`bg-transparent ${statusStyle[paper.status]}`}>
          {statusLabelByLocale[locale][paper.status]}
        </Badge>
        {paper.venue && (
          <Badge variant="outline" className="border-white/20 text-white/70 bg-transparent">
            {paper.venue}
          </Badge>
        )}
        <span className="text-xs text-white/50 ml-auto">{paper.year}</span>
      </div>
      <h3 className="text-xl font-semibold text-white tracking-tight leading-snug mb-2">
        {paper.title}
      </h3>
      <div className="text-xs text-white/60 mb-3">{paper.authors.join(", ")}</div>
      <p className="text-sm text-white/70 leading-relaxed line-clamp-4">{paper.abstract}</p>
      <div className="mt-4 text-xs text-indigo-300/80 group-hover:text-indigo-200 transition-colors">
        {dict.science.cardCta}
      </div>
    </Link>
  );
}
