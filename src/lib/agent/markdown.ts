import "server-only";
import TurndownService from "turndown";
import { SUPPORTED_LOCALES, isSupportedLocale, type SupportedLocale } from "@/lib/get-locale";
import { getAnswer, listAnswers } from "@/lib/answers";
import { getEssayBySlug, listEssays } from "@/lib/essays";
import { getTranscript, listLectures } from "@/lib/lectures";
import { experiments, getExperiment } from "@/lib/interactive";
import { experimentView } from "@/lib/experiments";
import { books, getBookBySlug } from "@/content/books";
import { getChapterHtml, getManifest, leadIn, resolveBookLang } from "@/lib/library";
import { ACTIVE_CURRENCIES, PRICES, formatPrice } from "@/content/pricing";
import { siteUrl } from "@/lib/auth";

// Markdown-версии страниц для ИИ-агентов: тот же контент, что видит читатель,
// без вёрстки. Отдаётся по /<путь>.md и по Accept: text/markdown (middleware
// переписывает запрос на /md/<путь>). Платные главы — только открытое начало,
// как гостю, плюс как купить.

export const BRAND: Record<SupportedLocale, string> = {
  en: "Neural Cosmology",
  ru: "Нейронная космология",
  pt: "Cosmologia Neural",
  es: "Cosmología Neural",
};

const UI = {
  answers: { en: "Answers", ru: "Ответы", pt: "Respostas", es: "Respuestas" },
  essays: { en: "Essays", ru: "Эссе", pt: "Ensaios", es: "Ensayos" },
  books: { en: "Books", ru: "Книги", pt: "Livros", es: "Libros" },
  experiments: { en: "Experiments", ru: "Опыты", pt: "Experimentos", es: "Experimentos" },
  lectures: { en: "Lectures", ru: "Лекции", pt: "Palestras", es: "Conferencias" },
  chapters: { en: "Chapters", ru: "Главы", pt: "Capítulos", es: "Capítulos" },
  faq: { en: "FAQ", ru: "Вопросы и ответы", pt: "Perguntas frequentes", es: "Preguntas frecuentes" },
  free: { en: "free", ru: "бесплатно", pt: "grátis", es: "gratis" },
  leadIn: { en: "opening open", ru: "начало открыто", pt: "início aberto", es: "inicio abierto" },
  paid: { en: "paid", ru: "платная", pt: "paga", es: "de pago" },
} as const;

export type MarkdownDoc = { title: string; body: string; canonical: string };

const turndown = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced" });
// Служебная вёрстка ридера (вставки опытов, кнопки) агенту не нужна.
turndown.remove(["script", "style", "button", "svg", "noscript", "iframe"] as (keyof HTMLElementTagNameMap)[]);

export function htmlToMarkdown(html: string): string {
  return turndown.turndown(html).replace(/\n{3,}/g, "\n\n").trim();
}

/** MDX сайта — это markdown плюс <BookLink>; ссылку на книгу делаем обычной. */
function mdxToMarkdown(content: string, locale: SupportedLocale): string {
  return content
    .replace(
      /<BookLink\s+slug="([^"]+)"\s*>([\s\S]*?)<\/BookLink>/g,
      (_, slug: string, text: string) => `[${text.trim()}](${abs(`/${locale}/books/${slug}`)})`,
    )
    .replace(/\]\((\/[^)]+)\)/g, (_, path: string) => `](${abs(path)})`)
    .trim();
}

const abs = (path: string) => `${siteUrl()}${path}`;
const mdUrl = (path: string) => `${abs(path)}.md`;
const pick = <T,>(m: Partial<Record<SupportedLocale, T>> & { en: T }, l: SupportedLocale): T => m[l] ?? m.en;

function doc(title: string, path: string, parts: (string | null | undefined | false)[]): MarkdownDoc {
  const head = [`# ${title}`, "", `Source: ${abs(path)}`];
  return {
    title,
    canonical: abs(path),
    body: [...head, "", ...parts.filter((p): p is string => typeof p === "string")].join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n",
  };
}

function priceLine(item: "book" | "library", locale: SupportedLocale): string {
  const prices = ACTIVE_CURRENCIES.map((c) => formatPrice(PRICES[item][c], c)).join(" / ");
  const label = {
    book: { en: "Online access to this book", ru: "Онлайн-доступ к книге", pt: "Acesso online a este livro", es: "Acceso en línea a este libro" },
    library: { en: "The whole library", ru: "Вся библиотека", pt: "A biblioteca inteira", es: "Toda la biblioteca" },
  }[item];
  return `${label[locale]}: ${prices}`;
}

function purchaseNote(slug: string, locale: SupportedLocale): string {
  return [
    "## How to get the full text",
    "",
    `- ${priceLine("book", locale)}.`,
    `- ${priceLine("library", locale)}.`,
    `- A reader buys at ${abs(`/${locale}/books/${slug}`)}.`,
    `- An AI agent can open a checkout for a reader with the \`create_checkout\` tool of the MCP server at ${abs("/mcp")} (item \`${slug}\` or \`library\`, the reader's email); the reader pays by the link it returns, then signs in on the site with that email to read.`,
  ].join("\n");
}

// ---------- pages ----------

function home(locale: SupportedLocale): MarkdownDoc {
  const section = (key: keyof typeof UI, path: string) => `- [${UI[key][locale]}](${mdUrl(`/${locale}/${path}`)})`;
  return doc(BRAND[locale], `/${locale}`, [
    "Research programme, books and essays by Mikhail Savchenko on consciousness, cosmology and computation.",
    "",
    section("answers", "answers"),
    section("essays", "essays"),
    section("books", "books"),
    section("experiments", "experiments"),
    "",
    `Machine-readable: catalog ${abs("/catalog.json")}, full text ${abs("/llms-full.txt")}, MCP ${abs("/mcp")}.`,
    `Other languages: ${SUPPORTED_LOCALES.filter((l) => l !== locale).map((l) => mdUrl(`/${l}`)).join(", ")}`,
  ]);
}

function answersIndex(locale: SupportedLocale): MarkdownDoc {
  const list = listAnswers(locale).map((a) => `- [${a.question}](${mdUrl(`/${locale}/answers/${a.slug}`)}): ${a.answer}`);
  return doc(`${UI.answers[locale]} · ${BRAND[locale]}`, `/${locale}/answers`, list);
}

function answer(locale: SupportedLocale, slug: string): MarkdownDoc | null {
  const a = getAnswer(slug, locale);
  if (!a) return null;
  const faq = a.faq.length
    ? [`## ${UI.faq[locale]}`, "", ...a.faq.flatMap((f) => [`### ${f.question}`, "", f.answer, ""])].join("\n")
    : null;
  return doc(a.title, `/${locale}/answers/${slug}`, [`**${a.question}** ${a.answer}`, "", mdxToMarkdown(a.content, locale), "", faq]);
}

function essaysIndex(locale: SupportedLocale): MarkdownDoc {
  const list = listEssays(locale).map((e) => `- [${e.title}](${mdUrl(`/${locale}/essays/${e.slug}`)}): ${e.description}`);
  return doc(`${UI.essays[locale]} · ${BRAND[locale]}`, `/${locale}/essays`, list);
}

function essay(locale: SupportedLocale, slug: string): MarkdownDoc | null {
  const e = getEssayBySlug(slug, locale);
  if (!e) return null;
  return doc(e.title, `/${locale}/essays/${slug}`, [e.author ? `By ${e.author}, ${e.date}` : e.date, "", mdxToMarkdown(e.content, locale)]);
}

function booksIndex(locale: SupportedLocale): MarkdownDoc {
  const list = books.map((b) => `- [${pick(b.titles, locale)}](${mdUrl(`/${locale}/books/${b.slug}`)}): ${pick(b.hook, locale)}`);
  return doc(`${UI.books[locale]} · ${BRAND[locale]}`, `/${locale}/books`, [...list, "", priceLine("library", locale)]);
}

function book(locale: SupportedLocale, slug: string): MarkdownDoc | null {
  const b = getBookBySlug(slug);
  if (!b) return null;
  const lang = resolveBookLang(slug, locale);
  const manifest = lang ? getManifest(slug, lang) : null;
  const chapters = manifest
    ? [
        `## ${UI.chapters[locale]}`,
        "",
        ...manifest.chapters.map((c) => {
          const html = c.free ? null : getChapterHtml(slug, manifest.lang, c.id);
          const state = c.free ? UI.free[locale] : leadIn(html) ? UI.leadIn[locale] : UI.paid[locale];
          const n = c.number != null ? `${c.number}. ` : "";
          return `- [${n}${c.title}](${mdUrl(`/${manifest.lang}/read/${slug}/${c.id}`)}) (${state}, ${c.minutes} min)`;
        }),
      ].join("\n")
    : null;
  return doc(pick(b.titles, locale), `/${locale}/books/${slug}`, [
    `*${pick(b.hook, locale)}*`,
    "",
    pick(b.synopsis, locale),
    "",
    pick(b.statusLabel, locale),
    manifest ? "" : null,
    manifest ? priceLine("book", locale) : null,
    "",
    chapters,
  ]);
}

function chapter(locale: SupportedLocale, slug: string, id: string, opts: MarkdownOptions): MarkdownDoc | null {
  const b = getBookBySlug(slug);
  const manifest = getManifest(slug, locale);
  const c = manifest?.chapters.find((x) => x.id === id);
  if (!b || !manifest || !c) return null;
  const html = getChapterHtml(slug, locale, id);
  if (!html) return null;
  const path = `/${locale}/read/${slug}/${id}`;
  const title = `${c.number != null ? `${c.number}. ` : ""}${c.title} · ${pick(b.titles, locale)}`;
  if (c.free || opts.unlocked?.(slug)) return doc(title, path, [htmlToMarkdown(html)]);
  const opening = leadIn(html);
  return doc(title, path, [
    opening ? htmlToMarkdown(opening) : c.excerpt,
    "",
    "---",
    "",
    opening
      ? "*The rest of this chapter is part of the paid edition.*"
      : "*This chapter is part of the paid edition.*",
    "",
    purchaseNote(slug, locale),
  ]);
}

function experimentsIndex(locale: SupportedLocale): MarkdownDoc {
  const list = experiments()
    .map((it) => experimentView(it, locale))
    .filter((v): v is NonNullable<typeof v> => !!v)
    .map((v) => `- [${v.seo?.title ?? v.title}](${mdUrl(`/${locale}/experiments/${v.id}`)}): ${v.seo?.description ?? v.caption}`);
  return doc(`${UI.experiments[locale]} · ${BRAND[locale]}`, `/${locale}/experiments`, list);
}

function experiment(locale: SupportedLocale, id: string): MarkdownDoc | null {
  const it = getExperiment(id);
  const v = it ? experimentView(it, locale) : null;
  if (!v) return null;
  const about = v.about
    ? [
        `## ${v.about.heading}`,
        "",
        ...v.about.body.flatMap((p) => [p, ""]),
        v.about.faq.length ? `## ${UI.faq[locale]}\n\n${v.about.faq.map((f) => `### ${f.question}\n\n${f.answer}`).join("\n\n")}` : "",
        v.about.related.length ? v.about.related.map((r) => `- [${r.title}](${abs(r.href)})`).join("\n") : "",
      ].join("\n")
    : null;
  return doc(v.seo?.title ?? v.title, `/${locale}/experiments/${id}`, [
    v.caption,
    "",
    `Interactive experiment (runs in the browser): ${abs(`/${locale}/experiments/${id}`)}`,
    v.chapter ? `From the book *${v.bookTitle}*, chapter [${v.chapter.title}](${mdUrl(`/${v.lang}/read/${v.bookSlug}/${v.chapter.id}`)}).` : null,
    "",
    v.passage.length ? v.passage.map((p) => `> ${p}`).join("\n>\n") : null,
    "",
    about,
  ]);
}

function lecture(locale: SupportedLocale, slug: string): MarkdownDoc | null {
  const meta = listLectures(locale).find((l) => l.slug === slug);
  const t = getTranscript(slug, locale);
  if (!meta && !t) return null;
  return doc(meta?.title ?? slug, `/${locale}/lectures/${slug}`, [meta?.description, "", t ? t.content : null]);
}

function lecturesIndex(locale: SupportedLocale): MarkdownDoc {
  const list = listLectures(locale).map((l) => `- [${l.title}](${mdUrl(`/${locale}/lectures/${l.slug}`)})${l.description ? `: ${l.description}` : ""}`);
  return doc(`${UI.lectures[locale]} · ${BRAND[locale]}`, `/${locale}/lectures`, list);
}

/** Markdown for a site path (`/ru/answers/x`), or null when there is no such page. */
export type MarkdownOptions = {
  /** Books the reader owns: their chapters come in full. */
  unlocked?: (slug: string) => boolean;
};

export function markdownFor(pathname: string, opts: MarkdownOptions = {}): MarkdownDoc | null {
  const parts = pathname.replace(/\.md$/, "").split("/").filter(Boolean);
  if (parts.length === 0) return home("en");
  const [l, section, a, b] = parts;
  if (!isSupportedLocale(l)) return null;
  const locale = l;
  if (!section) return home(locale);
  switch (section) {
    case "answers":
      return a ? answer(locale, a) : answersIndex(locale);
    case "essays":
      return a ? essay(locale, a) : essaysIndex(locale);
    case "books":
      return a ? book(locale, a) : booksIndex(locale);
    case "read":
      return a && b ? chapter(locale, a, b, opts) : a ? book(locale, a) : null;
    case "experiments":
      return a ? experiment(locale, a) : experimentsIndex(locale);
    case "lectures":
      return a ? lecture(locale, a) : lecturesIndex(locale);
    default:
      return null;
  }
}
