import "server-only";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Lang, SceneInsert } from "@/lib/illustrations";

// Интерактив в книгах: опыты, которые читатель запускает прямо в главе. Источник —
// content/interactive/<book>/<chapter>.json, как у иллюстраций: в HTML главы ничего
// не вписывается, вставка встаёт при выдаче страницы в начало или конец сцены
// русского оригинала. Сервер ставит рамку с заголовком и подписью (её видят поиск
// и читатели без JS), клиент (ChapterWidgets) оживляет её, когда она подходит к экрану.
// Проверка: npm run interactive:check.

export type Widget = "physarum" | "double-slit" | "landauer" | "life" | "rule110" | "yarbus" | "blind-spot";

export type InteractiveItem = {
  id: string;
  book: string;
  chapter: string;
  scene: number;
  at?: "start" | "end";
  widget: Widget;
  title: Record<Lang, string>;
  caption: Record<Lang, string>;
  props?: Record<string, unknown>;
};

const dir = join(process.cwd(), "content/interactive");
const cache = new Map<string, InteractiveItem[]>();

export function interactive(book: string, chapter: string): InteractiveItem[] {
  const key = `${book}/${chapter}`;
  if (process.env.NODE_ENV === "production" && cache.has(key)) return cache.get(key)!;
  const f = join(dir, book, `${chapter}.json`);
  const items = existsSync(f) ? (JSON.parse(readFileSync(f, "utf8")).items as InteractiveItem[]) : [];
  cache.set(key, items);
  return items;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const KICKER: Record<Lang, string> = { ru: "Опыт", en: "Try it", pt: "Experimente", es: "Pruébelo" };

function frame(it: InteractiveItem, lang: Lang): string {
  const props = it.props ? ` data-props="${esc(JSON.stringify(it.props))}"` : "";
  return (
    `<figure class="nc-x" id="x-${esc(it.id)}" data-x="${esc(it.id)}" data-w="${it.widget}" data-lang="${lang}"${props}>` +
    `<div class="nc-x-head"><span class="nc-x-kicker">${KICKER[lang]}</span><span class="nc-x-title">${esc(it.title[lang] ?? it.title.en)}</span></div>` +
    `<div class="nc-x-mount"></div>` +
    `<figcaption>${esc(it.caption[lang] ?? it.caption.en)}</figcaption>` +
    `</figure>`
  );
}

export function interactiveInserts(items: InteractiveItem[], lang: Lang): SceneInsert[] {
  return items.map((it) => ({ scene: it.scene, at: it.at ?? "end", html: frame(it, lang) }));
}
