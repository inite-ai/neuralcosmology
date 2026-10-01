// Сторожит опыты в главах: место (разрыв сцены) есть в русском оригинале, виджет
// известен, заголовок и подпись есть на четырёх языках, id уникальны.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const base = join(root, "content/interactive");
const LANGS = ["ru", "en", "pt", "es"];
const widgets = readFileSync(join(root, "src/components/reader/widgets/ChapterWidgets.tsx"), "utf8");
const lib =
  process.env.LIBRARY_DIR ??
  (existsSync(join(root, ".env.local")) ? readFileSync(join(root, ".env.local"), "utf8").match(/^LIBRARY_DIR=(.*)$/m)?.[1]?.trim() : undefined);
const errors = [];
const ids = new Set();
let total = 0;

for (const book of readdirSync(base).filter((d) => statSync(join(base, d)).isDirectory())) {
  for (const f of readdirSync(join(base, book)).filter((f) => f.endsWith(".json"))) {
    const chapter = f.slice(0, -5);
    const file = lib && join(lib, book, "ru", `${chapter}.html`);
    const html = file && existsSync(file) ? readFileSync(file, "utf8") : null;
    if (lib && !html) errors.push(`${book}/${chapter}: no such chapter in the library`);
    const scenes = html ? (html.match(/<hr class="scene"\s*\/?>/g) ?? []).length : null;
    for (const it of JSON.parse(readFileSync(join(base, book, f), "utf8")).items) {
      total++;
      if (ids.has(it.id)) errors.push(`duplicate id ${it.id}`);
      ids.add(it.id);
      if (it.book !== book || it.chapter !== chapter) errors.push(`${it.id}: book/chapter do not match its file`);
      if (scenes !== null && it.scene > scenes) errors.push(`${it.id}: scene ${it.scene}, but ru/${chapter} has ${scenes} breaks`);
      if (it.at && it.at !== "start" && it.at !== "end") errors.push(`${it.id}: at must be start or end`);
      if (!widgets.includes(`${JSON.stringify(it.widget)}:`) && !widgets.includes(`${it.widget}:`)) errors.push(`${it.id}: unknown widget ${it.widget}`);
      for (const l of LANGS) {
        if (!it.title?.[l]) errors.push(`${it.id}: title missing in ${l}`);
        if (!it.caption?.[l]) errors.push(`${it.id}: caption missing in ${l}`);
      }
    }
  }
}
for (const e of errors) console.error(`error ${e}`);
console.log(`${total} interactive inserts, ${errors.length} errors`);
process.exit(errors.length ? 1 : 0);
