import Link from "next/link";
import type { SupportedLocale } from "@/lib/get-locale";

/**
 * AuthorBio — recurring author-card at the end of every essay.
 *
 * Each essay page ships one of these. The descriptive cross-domain anchor
 * to mikefluff.com is the highest-leverage SEO/AEO move per essay: each
 * post creates one real body link with topical anchor text.
 */

type Copy = { who: string; bridge: string; mikefluff: string; about: string };

const COPY: Record<SupportedLocale, Copy> = {
  en: {
    who: "Mikhail Savchenko — independent researcher and writer. ~20 years AI engineering, PhD in progress. Runs the Neural Cosmology research programme: one preprint (Pointer Architecture), five books in progress, and a growing body of essays and recorded lectures.",
    bridge: "Same person also runs the business and consulting practice",
    mikefluff: "Mike Fluff",
    about: "About the author",
  },
  ru: {
    who: "Михаил Савченко — независимый исследователь и писатель. ~20 лет инженерной работы с ИИ, PhD в работе. Ведёт исследовательскую программу «Нейронная космология»: препринт (Pointer Architecture), пять книг в работе, эссе и записанные лекции.",
    bridge: "Тот же человек ведёт бизнес-практику",
    mikefluff: "Mike Fluff",
    about: "Об авторе",
  },
  pt: {
    who: "Mikhail Savchenko — pesquisador e escritor independente. ~20 anos de engenharia de IA, doutorado em andamento. Conduz o programa de pesquisa Cosmologia Neural: um preprint (Pointer Architecture), cinco livros em andamento, ensaios e palestras gravadas.",
    bridge: "A mesma pessoa também conduz a prática de negócios e consultoria",
    mikefluff: "Mike Fluff",
    about: "Sobre o autor",
  },
  es: {
    who: "Mikhail Savchenko — investigador y escritor independiente. ~20 años de ingeniería de IA, doctorado en curso. Lleva el programa de investigación Cosmología Neural: un preprint (Pointer Architecture), cinco libros en curso, ensayos y conferencias grabadas.",
    bridge: "La misma persona también lleva la práctica de negocios y consultoría",
    mikefluff: "Mike Fluff",
    about: "Sobre el autor",
  },
};

export default function AuthorBio({ locale }: { locale: SupportedLocale }) {
  const c = COPY[locale];
  return (
    <aside className="mt-16 border border-line bg-bg-raised p-6">
      <div className="text-xs uppercase tracking-widest text-muted mb-3">
        {c.about}
      </div>
      <p className="text-fg leading-relaxed">{c.who}</p>
      <p className="text-fg-secondary leading-relaxed mt-3">
        {c.bridge}{" "}
        <a
          href="https://www.mikefluff.com"
          rel="me noopener"
          className="text-primary hover:text-primary underline underline-offset-2 decoration-indigo-400/40 hover:decoration-indigo-200/80 transition-colors"
        >
          {c.mikefluff}
        </a>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/${locale}/about`}
          className="inline-flex items-center rounded-sm border border-fg/40 hover:border-fg/40 text-fg hover:text-fg px-4 py-2 text-sm transition-colors"
        >
          {c.about} →
        </Link>
        <a
          href="https://www.mikefluff.com"
          rel="me noopener"
          className="inline-flex items-center rounded-sm border border-fg/40 hover:border-fg/40 text-fg hover:text-fg px-4 py-2 text-sm transition-colors"
        >
          mikefluff.com →
        </a>
      </div>
    </aside>
  );
}
