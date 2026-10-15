#!/usr/bin/env node
/**
 * Берёт из inite-shared модули, которые нужны сайту, и кладёт их тарболами в
 * vendor/, как обычные npm-пакеты.
 *
 * Сайты inite.* в pnpm-workspace подключают inite-shared целиком. Этот сайт
 * на npm и собирается из своей папки, а пакеты inite-shared тянут
 * workspace-зависимости, которых npm не знает. Поэтому собираем только
 * самостоятельные модули (они ничего не импортируют из workspace) и даём
 * пакетам те же имена и подпути, что в inite-shared: код сайта пишет
 * `@inite/billing/purchases`, как написал бы в workspace.
 *
 * Источник — main на GitHub, а не рабочая копия: в ней могут быть чужие
 * правки. INITE_SHARED_REF собирает другую ветку или PR, чтобы проверить сайт
 * с изменением до мержа (такие тарболы не коммитим).
 *
 *   node scripts/sync-inite-shared.mjs                    # ~/Documents/inite-shared
 *   node scripts/sync-inite-shared.mjs /path/to/inite-shared
 *   INITE_SHARED_REF=pull/28/head node scripts/sync-inite-shared.mjs
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const shared = path.resolve(process.argv[2] ?? path.join(os.homedir(), "Documents", "inite-shared"));

// Пакет inite-shared → подпути, которые берём, и их внешние зависимости.
const MODULES = [
  { pkg: "billing", name: "@inite/billing", entries: { "./purchases": "src/purchases.ts" }, deps: [] },
  { pkg: "mcp", name: "@inite/mcp", entries: { "./site": "src/site/index.ts" }, deps: [] },
  // @inite/auth/agent не берём: он на jose 5 (KeyLike), сайт на jose 6 и
  // проверяет токены агентов сам (src/lib/auth.ts, verifyAgentToken).
  { pkg: "content", name: "@inite/content", entries: { "./ai": "src/ai/agents.ts" }, deps: [] },
];

const run = (cmd, args, cwd) => {
  try {
    return execFileSync(cmd, args, { cwd, stdio: ["ignore", "pipe", "inherit"] }).toString().trim();
  } catch (error) {
    console.error(error.stdout?.toString() ?? error.message);
    process.exit(1);
  }
};

const ref = process.env.INITE_SHARED_REF ?? "main";
run("git", ["fetch", "-q", "origin", ref], shared);
const commit = run("git", ["rev-parse", "--short", "FETCH_HEAD"], shared);
// Внутри проекта, но не в node_modules: так tsc находит типы зависимостей
// сайта и при этом собирает все файлы модуля (из node_modules он их не пишет).
const work = path.join(root, ".inite-shared-build");
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });
const archive = path.join(work, "src.tar");
execFileSync("git", ["archive", "-o", archive, commit, ...MODULES.map((m) => `packages/${m.pkg}`)], { cwd: shared });
execFileSync("tar", ["-xf", archive, "-C", work]);

const tsc = path.join(root, "node_modules", ".bin", "tsc");
const vendor = path.join(root, "vendor");
fs.mkdirSync(vendor, { recursive: true });
const pj = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

/** Node ESM требует расширения: ./oauth → ./oauth.js в собранном коде. */
function addExtensions(dir) {
  for (const f of fs.readdirSync(dir, { recursive: true })) {
    const file = path.join(dir, f);
    if (!/\.(js|d\.ts)$/.test(file)) continue;
    const src = fs.readFileSync(file, "utf8");
    const out = src.replace(/(from\s+["'])(\.\.?\/[^"']+?)(["'])/g, (m, a, p, b) =>
      /\.(js|json)$/.test(p) ? m : `${a}${p}.js${b}`,
    );
    if (out !== src) fs.writeFileSync(file, out);
  }
}

for (const m of MODULES) {
  const dir = path.join(work, "packages", m.pkg);
  const source = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
  const out = path.join(work, "out", m.pkg);
  run(
    tsc,
    [
      ...Object.values(m.entries).map((e) => path.join(dir, e)),
      "--outDir", path.join(out, "dist"),
      "--rootDir", path.join(dir, "src"),
      "--declaration", "--strict", "--skipLibCheck",
      "--target", "es2022", "--lib", "es2022,dom", "--module", "esnext", "--moduleResolution", "bundler",
      "--types", "node",
    ],
    root,
  );
  addExtensions(path.join(out, "dist"));
  const exports = {};
  for (const [sub, entry] of Object.entries(m.entries)) {
    const rel = `./dist/${path.relative("src", entry).replace(/\.ts$/, "")}`;
    exports[sub] = { types: `${rel}.d.ts`, import: `${rel}.js`, default: `${rel}.js` };
  }
  const dependencies = Object.fromEntries(m.deps.map((d) => [d, source.dependencies[d]]));
  fs.writeFileSync(
    path.join(out, "package.json"),
    JSON.stringify(
      {
        name: m.name,
        version: source.version,
        description: `${source.description} (vendored subset: ${Object.keys(m.entries).join(", ")})`,
        type: "module",
        files: ["dist", "README.md"],
        exports,
        dependencies,
      },
      null,
      2,
    ) + "\n",
  );
  if (fs.existsSync(path.join(dir, "README.md"))) fs.copyFileSync(path.join(dir, "README.md"), path.join(out, "README.md"));

  const prefix = `inite-${m.pkg}-`;
  for (const f of fs.readdirSync(vendor)) if (f.startsWith(prefix)) fs.rmSync(path.join(vendor, f));
  const tarball = run("npm", ["pack", "--pack-destination", vendor, "--silent"], out).split("\n").pop();
  // Коммит в имени: npm кэширует file:-тарболы по пути, и пересобранный
  // пакет под тем же именем поставился бы старым.
  const packed = tarball.replace(/\.tgz$/, `-${commit}.tgz`);
  fs.renameSync(path.join(vendor, tarball), path.join(vendor, packed));
  pj.dependencies[m.name] = `file:vendor/${packed}`;
}

fs.writeFileSync(path.join(vendor, "inite-shared.SOURCE"), `inite-shared ${commit}${ref === "main" ? "" : ` (${ref})`}\n`);
fs.writeFileSync(path.join(root, "package.json"), JSON.stringify(pj, null, 2) + "\n");
fs.rmSync(work, { recursive: true, force: true });
// npm ставит file:-тарбол по хешу из package-lock: пересобранный под тем же
// именем пакет иначе остался бы старым. Забываем прежние записи и установку.
const lockPath = path.join(root, "package-lock.json");
const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
for (const m of MODULES) {
  delete lock.packages?.[`node_modules/${m.name}`];
  fs.rmSync(path.join(root, "node_modules", m.name), { recursive: true, force: true });
}
fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + "\n");
run("npm", ["install", "--no-audit", "--no-fund"], root);
console.log(`inite-shared ${commit} → vendor/: ${MODULES.map((m) => Object.keys(m.entries).map((s) => m.name + s.slice(1))).flat().join(", ")}`);
