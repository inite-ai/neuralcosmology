#!/usr/bin/env node
/**
 * Отпечаток того, что видит агент на /mcp: инструменты, ресурсы, шаблоны и
 * промпты. Версия MCP-сервера (server.json → serverInfo.version) должна
 * меняться ровно тогда, когда меняется эта поверхность, а не с каждым
 * релизом сайта: иначе реестр и агенты видят «новый сервер» каждый день.
 *
 *   node scripts/mcp-surface.mjs https://neuralcosmology.com          # проверить
 *   node scripts/mcp-surface.mjs http://localhost:3000 --write         # записать после поднятия версии
 *
 * Правила: поверхность изменилась, а версия прежняя — ошибка; версия поднята,
 * а поверхность та же — тоже ошибка. Добавили инструмент или поле — минорная
 * часть, изменили или убрали существующее — мажорная, поправили поведение без
 * изменения схем — патч: поверхность та же, поэтому без новой схемы можно
 * поднять только патч-часть (и записать её через --write).
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const [base = "http://localhost:3000", flag] = process.argv.slice(2);
const root = process.cwd();
const fileOf = (f) => path.join(root, f);
const serverJson = JSON.parse(fs.readFileSync(fileOf("server.json"), "utf8"));
const recordPath = fileOf("mcp-surface.json");

let id = 0;
async function rpc(method, params = {}) {
  const res = await fetch(`${base.replace(/\/$/, "")}/mcp`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", "User-Agent": "neuralcosmology-mcp-surface/1.0" },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }),
  });
  const body = await res.json();
  if (body.error) throw new Error(`${method}: ${body.error.message}`);
  return body.result;
}

/** JSON с отсортированными ключами: порядок полей в ответе не должен менять отпечаток. */
const canonical = (v) =>
  Array.isArray(v) ? `[${v.map(canonical).join(",")}]` : v && typeof v === "object"
    ? `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(",")}}`
    : JSON.stringify(v);

const init = await rpc("initialize", { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "mcp-surface", version: "1" } });
const surface = {
  capabilities: init.capabilities,
  tools: (await rpc("tools/list")).tools,
  resources: (await rpc("resources/list")).resources,
  resourceTemplates: (await rpc("resources/templates/list")).resourceTemplates,
  prompts: (await rpc("prompts/list").catch(() => ({ prompts: [] }))).prompts,
};
const sha256 = createHash("sha256").update(canonical(surface)).digest("hex");
const live = init.serverInfo.version;
const declared = serverJson.version;
const record = fs.existsSync(recordPath) ? JSON.parse(fs.readFileSync(recordPath, "utf8")) : null;

/** 1.1.0 → 1.1: при той же поверхности разрешена только смена патч-части. */
const minor = (v) => String(v).split(".").slice(0, 2).join(".");
const problems = [];
if (live !== declared) problems.push(`serverInfo.version ${live} differs from server.json ${declared}`);
if (flag === "--write") {
  if (record && record.sha256 !== sha256 && record.version === declared) problems.push(`the surface changed: raise "version" in server.json before writing`);
  if (record && record.sha256 === sha256 && minor(record.version) !== minor(declared))
    problems.push(`server.json says ${declared}, but nothing an agent sees changed since ${record.version}: only the patch part may change`);
  if (!problems.length) {
    fs.writeFileSync(recordPath, JSON.stringify({ version: declared, sha256, tools: surface.tools.map((t) => t.name) }, null, 2) + "\n");
    console.log(`mcp-surface.json: ${declared} ${sha256.slice(0, 12)} (${surface.tools.length} tools)`);
  }
} else if (!record) {
  problems.push("no mcp-surface.json: run with --write");
} else {
  if (record.sha256 !== sha256 && record.version === declared) problems.push(`what agents see changed since ${record.version}, but the version did not: raise it in server.json and run --write`);
  if (record.version !== declared) problems.push(`server.json says ${declared}, mcp-surface.json ${record.version}: run --write`);
}
if (problems.length) {
  for (const p of problems) console.error(`✗ ${p}`);
  process.exit(1);
}
if (flag !== "--write") console.log(`✓ MCP ${declared}, surface ${sha256.slice(0, 12)} (${surface.tools.length} tools)`);
