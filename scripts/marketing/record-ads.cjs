// Записывает опыты с https://neuralcosmology.com/<lang>/experiments/<id> для рекламных роликов.
// node scripts/marketing/record-ads.cjs ru [id]  → marketing/rec/<lang>-<id>.json + webm;
// затем python3 scripts/marketing/compose-ads.py ru → marketing/ads/*.mp4 (1:1 и 9:16).
// Нужен playwright (npm i --no-save playwright) и ffmpeg.
const { chromium } = require("playwright");
const fs = require("fs");
const EXE = process.env.CHROME_PATH; // путь к Chrome/Chromium; пусто — Playwright берёт свой
const W = 1000, H = 1000;
const wait = (p, ms) => p.waitForTimeout(ms);
const btn = (p, id, text) => p.locator(`#x-${id} button:has-text("${text}")`).first();
const box = async (p, id) => p.locator(`#x-${id} canvas, #x-${id} svg, #x-${id} .nc-yarbus`).first().boundingBox();
const SCEN = {
  "cc-ch02-physarum": async (p, id) => { await wait(p, 5000); const b = await box(p, id); for (const [x, y] of [[0.2, 0.3], [0.8, 0.7], [0.5, 0.2]]) { await p.mouse.click(b.x + b.width * x, b.y + b.height * y); await wait(p, 2200); } await wait(p, 2000); },
  "cc-ch03-double-slit": async (p, id) => { await wait(p, 6500); await p.locator(`#x-${id} button`).filter({ hasText: /^(смотрим|looking)$/ }).click(); await wait(p, 6500); },
  "cc-ch04-murmuration": async (p, id) => { await wait(p, 2500); const b = await box(p, id); for (let i = 0; i < 60; i++) { const t = i / 60; await p.mouse.move(b.x + b.width * (0.1 + 0.8 * t), b.y + b.height * (0.5 + 0.3 * Math.sin(t * 6))); await wait(p, 120); } await wait(p, 2000); },
  "cc-comp-rule110": async (p) => { await wait(p, 11000); },
  "cc-comp-life": async (p) => { await wait(p, 11000); },
  "cs-ch06-hot-fullerenes": async (p, id) => { await wait(p, 4000); const s = p.locator(`#x-${id} input[type=range]`); for (const v of [1500, 2000, 2400, 2800, 3000]) { await s.fill(String(v)); await wait(p, 1700); } },
  "ba-ch01-qubit": async (p, id) => { await wait(p, 1200); for (let i = 0; i < 6; i++) { await btn(p, id, "100").click(); await wait(p, 1300); } },
  "cc-ch05-planaria": async (p, id) => { await wait(p, 1500); await p.locator(`#x-${id} button`).nth(1).click(); await wait(p, 2000); await p.locator(`#x-${id} button`).nth(0).click(); await wait(p, 2600); await p.locator(`#x-${id} button`).nth(0).click(); await wait(p, 3000); },
};
(async () => {
  const lang = process.argv[2] || "ru";
  const only = process.argv[3];
  const b = await chromium.launch(EXE ? { executablePath: EXE } : {});
  for (const [id, run] of Object.entries(SCEN)) {
    if (only && only !== id) continue;
    const ctx = await b.newContext({ viewport: { width: W, height: H }, colorScheme: "dark", recordVideo: { dir: `marketing/rec/${lang}-${id}`, size: { width: W, height: H } }, timezoneId: "America/Sao_Paulo", locale: lang });
    const p = await ctx.newPage();
    const t0 = Date.now();
    await p.goto(`https://neuralcosmology.com/${lang}/experiments/${id}`, { waitUntil: "networkidle" });
    await p.addStyleTag({ content: "header, nav, [role=banner], .fixed { display:none !important } " });
    const fig = p.locator(`#x-${id}`);
    await fig.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await wait(p, 600);
    const start = (Date.now() - t0) / 1000;
    await run(p, id);
    const r = await p.locator(`#x-${id} .nc-x-mount`).boundingBox();
    const end = (Date.now() - t0) / 1000;
    await ctx.close();
    const v = fs.readdirSync(`marketing/rec/${lang}-${id}`).find((f) => f.endsWith(".webm"));
    fs.writeFileSync(`marketing/rec/${lang}-${id}.json`, JSON.stringify({ file: `marketing/rec/${lang}-${id}/${v}`, start, end, r }));
    console.log(id, start.toFixed(1), end.toFixed(1), JSON.stringify(r));
  }
  await b.close();
})();
