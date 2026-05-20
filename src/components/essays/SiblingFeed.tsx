import { fetchSiblingPosts } from "@/lib/sibling-feed";
import type { SupportedLocale } from "@/lib/get-locale";

/**
 * SiblingFeed — small "Latest from mikefluff.com/blog" card on the essays
 * index. Body-text cross-domain links with topical anchors — strong
 * SEO/AEO signal per index render.
 */

const COPY: Record<SupportedLocale, { eyebrow: string; title: string; cta: string }> = {
  en: {
    eyebrow: "From the practice",
    title: "Latest field notes at mikefluff.com",
    cta: "All notes →",
  },
  ru: {
    eyebrow: "Из практики",
    title: "Свежие полевые заметки на mikefluff.com",
    cta: "Все заметки →",
  },
  pt: {
    eyebrow: "Da prática",
    title: "Notas de campo recentes em mikefluff.com",
    cta: "Todas as notas →",
  },
  es: {
    eyebrow: "Desde la práctica",
    title: "Notas de campo recientes en mikefluff.com",
    cta: "Todas las notas →",
  },
};

export default async function SiblingFeed({ locale }: { locale: SupportedLocale }) {
  const posts = await fetchSiblingPosts(
    `https://www.mikefluff.com/${locale}/blog/rss.xml`,
    3,
  );
  if (posts.length === 0) return null;
  const c = COPY[locale];
  return (
    <section className="mt-20 border-t border-white/10 pt-10">
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-indigo-300/70 mb-1">
            {c.eyebrow}
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white/90 tracking-tight">
            {c.title}
          </h2>
        </div>
        <a
          href={`https://www.mikefluff.com/${locale}/blog`}
          rel="me noopener"
          className="text-sm text-white/70 hover:text-white whitespace-nowrap transition-colors"
        >
          {c.cta}
        </a>
      </div>
      <ul className="grid sm:grid-cols-3 gap-4">
        {posts.map((p) => (
          <li key={p.link}>
            <a
              href={p.link}
              rel="noopener"
              className="block h-full rounded-xl border border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.06] p-4 transition-colors"
            >
              <div className="text-sm text-white/85 font-medium leading-snug line-clamp-3">
                {p.title}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
