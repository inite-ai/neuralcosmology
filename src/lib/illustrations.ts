import "server-only";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Иллюстрации книг. Источник — content/illustrations/<book>/<chapter>.json (+ style.json);
// картинки — public/book/ill/<id>.webp. В HTML главы ничего не вписывается: фигуры
// встают при выдаче страницы после N-го разрыва сцены русского оригинала
// (scene 0 — перед текстом). Если в переводе разрывов другое число, место
// пересчитывается пропорционально. Проверка: npm run illustrations:check.

export type Lang = "ru" | "en" | "pt" | "es";

export type Illustration = {
  id: string;
  book: string;
  chapter: string;
  scene: number;
  kind: "generated" | "archive";
  status: "draft" | "approved";
  prompt?: string;
  alt: Partial<Record<Lang, string>>;
  caption?: Partial<Record<Lang, string>>;
  source?: { page: string; download: string; author: string; license: string; licenseUrl?: string };
  width?: number;
  height?: number;
  placeholder?: string;
};

const dir = join(process.cwd(), "content/illustrations");
const pub = join(process.cwd(), "public/book/ill");
const cache = new Map<string, Illustration[]>();

/** Иллюстрации главы, у которых уже есть картинка. */
export function illustrations(book: string, chapter: string): Illustration[] {
  const key = `${book}/${chapter}`;
  if (process.env.NODE_ENV === "production" && cache.has(key)) return cache.get(key)!;
  const f = join(dir, book, `${chapter}.json`);
  const items = existsSync(f)
    ? (JSON.parse(readFileSync(f, "utf8")).items as Illustration[]).filter((it) => existsSync(join(pub, `${it.id}.webp`)))
    : [];
  cache.set(key, items);
  return items;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CREDIT: Record<Lang, string> = { ru: "Источник", en: "Source", pt: "Fonte", es: "Fuente" };

function figure(it: Illustration, lang: Lang, cover: boolean): string {
  const w = it.width ?? 1600;
  const h = it.height ?? 1067;
  const alt = it.alt[lang] ?? it.alt.en ?? it.alt.ru ?? "";
  const caption = it.caption?.[lang] ?? it.caption?.en;
  const s = it.source;
  const credit = s
    ? ` <span class="nc-credit">${CREDIT[lang]}: <a href="${esc(s.page)}" target="_blank" rel="noopener noreferrer">${esc(s.author)}</a>, ${
        s.licenseUrl ? `<a href="${esc(s.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(s.license)}</a>` : esc(s.license)
      }</span>`
    : "";
  const bg = it.placeholder ? `;background-image:url(${it.placeholder})` : "";
  return (
    `<figure class="nc-fig nc-fig--${it.kind}${cover ? " nc-fig--cover" : ""}" data-ill="${esc(it.id)}">` +
    `<div class="nc-fig-img" style="aspect-ratio:${w}/${h}${bg}">` +
    `<img src="/book/ill/${esc(it.id)}.webp" alt="${esc(alt)}" width="${w}" height="${h}" loading="${cover ? "eager" : "lazy"}" decoding="async" />` +
    `</div>` +
    (caption || credit ? `<figcaption>${caption ? esc(caption) : ""}${credit}</figcaption>` : "") +
    `</figure>`
  );
}

const SCENE = /<hr class="scene"\s*\/?>/g;

/** Вставка в главу: в начало сцены (сразу после разрыва) или в её конец (перед следующим). */
export type SceneInsert = { scene: number; at?: "start" | "end"; html: string };

/**
 * Расставляет вставки по сценам. sourceScenes — число разрывов в русском оригинале
 * (по нему размечены места); в переводе с другим числом разрывов место берётся
 * пропорционально. Сцена 0 — до первого разрыва.
 */
export function placeAtScenes(html: string, inserts: SceneInsert[], sourceScenes: number): string {
  if (!inserts.length) return html;
  const hrs = [...html.matchAll(SCENE)].map((m) => ({ from: m.index!, to: m.index! + m[0].length }));
  const map = (scene: number) =>
    sourceScenes === hrs.length || !sourceScenes ? scene : Math.max(1, Math.round((scene * hrs.length) / sourceScenes));
  const pos = (x: SceneInsert) => {
    if (x.at === "end") {
      const n = x.scene <= 0 ? 0 : map(x.scene);
      if (n > hrs.length) return -1;
      return n < hrs.length ? hrs[n].from : html.length;
    }
    if (x.scene <= 0) return 0;
    if (!hrs.length) return -1;
    return hrs[Math.min(map(x.scene), hrs.length) - 1].to;
  };
  const placed = inserts
    .map((x, i) => ({ p: pos(x), i, html: x.html }))
    .filter((x) => x.p >= 0)
    .sort((a, b) => b.p - a.p || b.i - a.i);
  let out = html;
  for (const x of placed) out = out.slice(0, x.p) + x.html + out.slice(x.p);
  return out;
}

/** Вставляет иллюстрации в HTML главы (в начало своих сцен). */
export function withIllustrations(html: string, items: Illustration[], lang: Lang, sourceScenes: number, onlyCover = false): string {
  return placeAtScenes(
    html,
    items.filter((it) => !onlyCover || it.scene === 0).map((it) => ({ scene: it.scene, html: figure(it, lang, it.scene === 0) })),
    sourceScenes,
  );
}

export const countScenes = (html: string | null) => (html ? (html.match(SCENE) ?? []).length : 0);

/** Иллюстрация для превью главы: открывающая, иначе первая по тексту. */
export function leadIllustration(items: Illustration[]): Illustration | null {
  return items.find((it) => it.scene === 0) ?? [...items].sort((a, b) => a.scene - b.scene)[0] ?? null;
}

const SITE = "https://neuralcosmology.com";

/** schema.org ImageObject: подпись, автор и лицензия (Google показывает их в «Картинках»). */
export function imageObject(it: Illustration, lang: Lang) {
  const s = it.source;
  return {
    "@type": "ImageObject",
    contentUrl: `${SITE}/book/ill/${it.id}.webp`,
    width: it.width,
    height: it.height,
    caption: it.caption?.[lang] ?? it.alt[lang] ?? it.alt.en,
    description: it.alt[lang] ?? it.alt.en,
    ...(s
      ? { creditText: s.author, creator: { "@type": "Person", name: s.author }, license: s.licenseUrl ?? s.page, acquireLicensePage: s.page, copyrightNotice: `${s.author}, ${s.license}` }
      : { creditText: "Neural Cosmology", creator: { "@type": "Organization", name: "Neural Cosmology", url: SITE } }),
  };
}
