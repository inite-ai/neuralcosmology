#!/usr/bin/env node
/**
 * SEO / AEO замер neuralcosmology.com — одна команда, отчёт в docs/seo/reports/<дата>.md.
 *
 *   node scripts/seo-report.mjs            # GSC + Ahrefs
 *   node scripts/seo-report.mjs --ai       # + проверка ответов ChatGPT через DataForSEO (платно, ~$0.05)
 *
 * Ключи не в репозитории: ~/.config/inite/gsc.json (OAuth refresh token),
 * ~/.config/inite/ahrefs.env, ~/.config/inite/dataforseo.env. Значения не печатаются.
 *
 * Базовая точка 2026-09-26: 0 показов в GSC за полгода, DR 1.7, 708 доменов — все спам.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

const SITE = "sc-domain:neuralcosmology.com";
const DOMAIN = "neuralcosmology.com";
const CFG = path.join(homedir(), ".config", "inite");
const today = new Date().toISOString().slice(0, 10);
const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

// Страницы, чьё присутствие в индексе проверяем каждый раз.
const KEY_URLS = [
  "/en", "/ru", "/en/answers", "/ru/answers",
  "/en/answers/is-the-universe-a-neural-network", "/en/answers/galaxy-rotation-curves-without-dark-matter",
  "/ru/answers/is-the-universe-a-neural-network", "/en/books", "/ru/books", "/en/books/celestial-code",
  "/ru/books/bugs-academy", "/en/science/pointer-architecture", "/ru/read/bugs-academy/preface", "/en/about",
].map((p) => `https://${DOMAIN}${p}`);

// Тематические вопросы для ИИ-видимости: упоминают ли ассистенты сайт или автора.
const AI_PROMPTS = [
  "Is the universe a neural network? Who is researching this?",
  "Can galaxy rotation curves be explained without dark matter? What are the newest alternatives?",
  "Books about consciousness and the universe written by scientists",
  "What experiments test whether the universe processes information like a brain?",
  "Вселенная — нейросеть: кто это исследует?",
  "Who is Mikhail Savchenko, author of Neural Cosmology?",
];

async function env(file) {
  const out = {};
  for (const line of (await readFile(path.join(CFG, file), "utf8")).split("\n")) {
    const m = line.match(/^\s*(?:export\s+)?([A-Z_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

// ---------- Google Search Console ----------
async function gscToken() {
  const t = JSON.parse(await readFile(path.join(CFG, "gsc.json"), "utf8"));
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: t.client_id, client_secret: t.client_secret, refresh_token: t.refresh_token, grant_type: "refresh_token" }),
  }).then((r) => r.json());
  if (!r.access_token) throw new Error("GSC: no access token");
  return r.access_token;
}

async function gsc(token) {
  const api = (p, body) =>
    fetch(`https://searchconsole.googleapis.com/${p}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json());
  const sa = (dims, rowLimit = 25) =>
    api(`webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, { startDate: daysAgo(30), endDate: daysAgo(2), dimensions: dims, rowLimit });
  const [total, queries, pages, countries] = await Promise.all([sa([], 1), sa(["query"]), sa(["page"]), sa(["country"], 10)]);
  const index = [];
  for (const url of KEY_URLS) {
    const r = await api("v1/urlInspection/index:inspect", { inspectionUrl: url, siteUrl: SITE });
    index.push({ url, state: r.inspectionResult?.indexStatusResult?.coverageState ?? r.error?.message ?? "?" });
  }
  return { total: total.rows?.[0] ?? { clicks: 0, impressions: 0 }, queries: queries.rows ?? [], pages: pages.rows ?? [], countries: countries.rows ?? [], index };
}

// ---------- Ahrefs ----------
async function ahrefs() {
  const { AHREFS_API_KEY } = await env("ahrefs.env");
  const get = (ep, params) =>
    fetch(`https://api.ahrefs.com/v3/site-explorer/${ep}?${new URLSearchParams({ target: DOMAIN, date: today, ...params })}`, {
      headers: { Authorization: `Bearer ${AHREFS_API_KEY}` },
    }).then((r) => r.json());
  const [dr, stats, metrics, refs] = await Promise.all([
    get("domain-rating", {}),
    get("backlinks-stats", { mode: "domain" }),
    get("metrics", { mode: "domain" }),
    get("refdomains", { mode: "domain", limit: "1000", select: "domain,domain_rating,dofollow_links,traffic_domain,first_seen", order_by: "traffic_domain:desc" }),
  ]);
  // Реальные ссылки: у донора есть органический трафик. SEO-биржи и .shop-сетки его не имеют.
  const real = (refs.refdomains ?? []).filter((r) => (r.traffic_domain ?? 0) > 0);
  return { dr: dr.domain_rating?.domain_rating, refdomains: stats.metrics?.live_refdomains, orgKeywords: metrics.metrics?.org_keywords, orgTraffic: metrics.metrics?.org_traffic, real };
}

// ---------- ИИ-видимость (DataForSEO → ChatGPT) ----------
async function aiVisibility() {
  const { DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD } = await env("dataforseo.env");
  const auth = `Basic ${Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString("base64")}`;
  const out = [];
  for (const prompt of AI_PROMPTS) {
    const r = await fetch("https://api.dataforseo.com/v3/ai_optimization/chat_gpt/llm_responses/live", {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify([{ user_prompt: prompt, model_name: "gpt-4o-mini", web_search: true }]),
    }).then((r) => r.json());
    const sections = (r.tasks?.[0]?.result?.[0]?.items ?? []).flatMap((i) => i.sections ?? []);
    const text = sections.map((s) => s.text ?? "").join("\n");
    const urls = sections.flatMap((s) => (s.annotations ?? []).map((a) => a.url));
    out.push({
      prompt,
      mentioned: /neural ?cosmology|нейронн\w* космолог|savchenko|савченко/i.test(text),
      cited: urls.some((u) => u?.includes(DOMAIN)),
      sources: [...new Set(urls.map((u) => { try { return new URL(u).hostname; } catch { return null; } }).filter(Boolean))].slice(0, 6),
    });
  }
  return out;
}

// ---------- отчёт ----------
const withAi = process.argv.includes("--ai");
const lines = [`# SEO / AEO — ${today}`, ""];
try {
  const g = await gsc(await gscToken());
  lines.push("## Google Search Console (30 дней)", "", `Клики ${g.total.clicks} · показы ${g.total.impressions}${g.total.position ? ` · средняя позиция ${g.total.position.toFixed(1)}` : ""}`, "");
  if (g.queries.length) lines.push("| Запрос | Клики | Показы | Позиция |", "|---|---|---|---|", ...g.queries.map((r) => `| ${r.keys[0]} | ${r.clicks} | ${r.impressions} | ${r.position.toFixed(1)} |`), "");
  if (g.pages.length) lines.push("| Страница | Клики | Показы |", "|---|---|---|", ...g.pages.map((r) => `| ${r.keys[0].replace(`https://${DOMAIN}`, "")} | ${r.clicks} | ${r.impressions} |`), "");
  lines.push("### Индекс ключевых страниц", "", ...g.index.map((i) => `- ${i.url.replace(`https://${DOMAIN}`, "")} — ${i.state}`), "");
} catch (e) {
  lines.push(`GSC: ошибка — ${e.message}`, "");
}
try {
  const a = await ahrefs();
  lines.push("## Ahrefs", "", `DR ${a.dr} · доменов всего ${a.refdomains} · **с трафиком ${a.real.length}** · органических ключей ${a.orgKeywords} · трафик ${a.orgTraffic}`, "");
  if (a.real.length) lines.push(...a.real.slice(0, 20).map((r) => `- ${r.domain} (DR ${r.domain_rating}, трафик ${r.traffic_domain}, dofollow ${r.dofollow_links}, с ${r.first_seen?.slice(0, 10)})`), "");
} catch (e) {
  lines.push(`Ahrefs: ошибка — ${e.message}`, "");
}
if (withAi) {
  try {
    const ai = await aiVisibility();
    lines.push("## ИИ-видимость (ChatGPT с поиском)", "", `Упоминают ${ai.filter((x) => x.mentioned).length}/${ai.length} · цитируют сайт ${ai.filter((x) => x.cited).length}/${ai.length}`, "");
    lines.push(...ai.map((x) => `- ${x.mentioned ? "✓" : "·"}${x.cited ? " 🔗" : ""} ${x.prompt} — источники: ${x.sources.join(", ") || "—"}`), "");
  } catch (e) {
    lines.push(`ИИ-видимость: ошибка — ${e.message}`, "");
  }
}
const dir = path.join(process.cwd(), "docs", "seo", "reports");
await mkdir(dir, { recursive: true });
const file = path.join(dir, `${today}.md`);
await writeFile(file, lines.join("\n"));
console.log(lines.join("\n"));
console.log(`\n→ ${path.relative(process.cwd(), file)}`);
