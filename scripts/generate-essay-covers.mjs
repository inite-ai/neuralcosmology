#!/usr/bin/env node
/**
 * Generate essay cover images via OpenAI gpt-image-1.
 *
 * - Reads English essay (canonical) for title + description + tags
 * - Asks the LLM to design a sculptural concept fitting the neural-cosmology
 *   visual language (deep cosmos blues, faint gold/cyan signal, no text)
 * - Saves PNG to public/essays/covers/{slug}.png
 * - Patches `cover:` into frontmatter of all 4 locale versions (en/ru/es/pt)
 * - Idempotent: skips if cover file already exists (use --force to regenerate)
 *
 * Usage:
 *   node scripts/generate-essay-covers.mjs                # all essays
 *   node scripts/generate-essay-covers.mjs --slug=foo     # one slug
 *   node scripts/generate-essay-covers.mjs --force        # regenerate
 *   node scripts/generate-essay-covers.mjs --quality=low  # cheaper test
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ESSAYS_DIR = path.join(ROOT, "content", "essays");
const COVERS_DIR = path.join(ROOT, "public", "essays", "covers");
const LOCALES = ["en", "ru", "es", "pt"];

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) {
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      process.env[m[1]] = v;
    }
  }
}
loadEnv();

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("Missing OPENAI_API_KEY in .env");
  process.exit(1);
}

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const QUALITY = args.find((a) => a.startsWith("--quality="))?.split("=")[1] || "medium";
const ONE_SLUG = args.find((a) => a.startsWith("--slug="))?.split("=")[1] || null;

// Visual identity for neural-cosmology essay covers.
// Distinct from book covers and lecture cards: scientific-poetic, deep cosmos
// palette, single sculptural object, no text, no people.
const STYLE_BASE = [
  "cinematic editorial render at scientific-paper poster quality, ultra-detailed, photoreal with stylized clarity",
  "shallow depth of field, soft volumetric haze, single dramatic light source raking across the subject",
  "palette: deep cosmic background #050816 / #0b1a2e / #131a36, faint nebular indigo glow, restrained pale gold #d4b86a and signal cyan #5fbcd9 highlights, occasional bright white rim-light; NO oranges, NO reds, NO warm earth tones, NO pastel rainbow",
  "subject rendered as polished obsidian, suspended dark glass, faint internal luminescence, micro-engraved geometry; surrounded by sparse particulate dust",
  "rich micro-detail (refraction inside glass, brushed metal seams, fiber-optic threads of light)",
  "no text anywhere, no logos, no watermarks, no readable letters or numerals, no humans, no faces, no hands",
  "balanced asymmetric composition, generous negative space, single clear focal point",
  "16:9 landscape, magazine-cover production value, mood: contemplative, technical, slightly austere",
].join(", ");

async function designConcept(title, description, tags) {
  const sys =
    "You design a single-object sculptural visual concept for a neural-cosmology essay cover. " +
    "The look is photoreal cosmic 3D: polished dark glass / obsidian, faint internal glow, " +
    "suspended geometric forms, scientific yet poetic. " +
    "Given the essay's title, description, and tags, return ONE sentence " +
    "(under 50 words) describing the concrete sculptural object and its cinematic composition: " +
    "what materials, what arrangement, what is the dramatic focal point. " +
    "Subjects should evoke physics, information geometry, distributed systems, or consciousness " +
    "as ABSTRACT sculptural metaphors — never literal scenes. " +
    "Examples that fit: a translucent glass sphere etched with a galactic rotation curve, " +
    "a lattice of obsidian nodes suspended in indigo haze, a single dark crystal refracting a thin gold beam, " +
    "a cluster of slowly orbiting glass shards each catching a different facet of light. " +
    "Style (palette / lighting / 3D-render / format) is fixed elsewhere — do not mention it. " +
    "STRICT: no text, no acronyms, no equations, no readable letters or numerals anywhere; " +
    "no humans, faces, hands, body parts, animals, or recognisable scenes.";
  const user = `Tags: ${(tags || []).join(", ") || "none"}\nTitle: ${title}\nDescription: ${description}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      max_tokens: 120,
    }),
  });
  if (!res.ok) throw new Error(`Concept API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return (json.choices?.[0]?.message?.content || "").trim().replace(/\n+/g, " ");
}

function buildPrompt(motif, title) {
  return (
    `${STYLE_BASE}. ${motif}. ` +
    `The cover should evoke the topic of "${title}" without spelling out any words. ` +
    `ABSOLUTE: no readable text anywhere — no letters, no numerals, no labels, no captions, ` +
    `no logos, no equations, no diagrams with axis labels. ` +
    `No humans, no faces, no hands, no body parts, no animals.`
  );
}

async function generateImage(prompt) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1536x1024",
      quality: QUALITY,
      n: 1,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error(`No b64_json in response: ${JSON.stringify(json).slice(0, 300)}`);
  return Buffer.from(b64, "base64");
}

function ensureCoverInFrontmatter(filePath, coverPath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) return false;
  const fmBlock = fmMatch[1];
  const fmEnd = fmMatch[0].length;

  const existing = fmBlock.match(/^cover:\s*"?([^"\n]*)"?$/m);
  if (existing && existing[1].trim() === coverPath) return false;

  const coverLine = `cover: "${coverPath}"`;
  const newFmBlock = existing
    ? fmBlock.replace(/^cover:\s*.*$/m, coverLine)
    : fmBlock + "\n" + coverLine;

  fs.writeFileSync(filePath, "---\n" + newFmBlock + "\n---\n" + raw.slice(fmEnd), "utf8");
  return true;
}

async function main() {
  if (!fs.existsSync(COVERS_DIR)) fs.mkdirSync(COVERS_DIR, { recursive: true });

  const enDir = path.join(ESSAYS_DIR, "en");
  const slugs = fs
    .readdirSync(enDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .filter((s) => !ONE_SLUG || s === ONE_SLUG);

  if (slugs.length === 0) {
    console.error(`No slugs matched (--slug=${ONE_SLUG})`);
    process.exit(1);
  }

  const unitCost = QUALITY === "low" ? 0.04 : QUALITY === "medium" ? 0.07 : 0.19;
  console.log(`Generating ${slugs.length} covers @ quality=${QUALITY} (~$${(slugs.length * unitCost).toFixed(2)})`);
  console.log("");

  let generated = 0, skipped = 0, failed = 0;

  for (const slug of slugs) {
    const enPath = path.join(enDir, `${slug}.mdx`);
    const coverFile = path.join(COVERS_DIR, `${slug}.png`);
    const coverWebPath = `/essays/covers/${slug}.png`;

    if (fs.existsSync(coverFile) && !FORCE) {
      console.log(`✓ ${slug} (cached)`);
      for (const loc of LOCALES) {
        const p = path.join(ESSAYS_DIR, loc, `${slug}.mdx`);
        if (fs.existsSync(p)) ensureCoverInFrontmatter(p, coverWebPath);
      }
      skipped++;
      continue;
    }

    const fm = matter(fs.readFileSync(enPath, "utf8")).data;
    process.stdout.write(`→ ${slug} ... `);
    try {
      const motif = await designConcept(fm.title, fm.description, fm.tags);
      const prompt = buildPrompt(motif, fm.title);
      const buf = await generateImage(prompt);
      fs.writeFileSync(coverFile, buf);
      for (const loc of LOCALES) {
        const p = path.join(ESSAYS_DIR, loc, `${slug}.mdx`);
        if (fs.existsSync(p)) ensureCoverInFrontmatter(p, coverWebPath);
      }
      console.log(`done (${(buf.length / 1024).toFixed(0)} KB)`);
      generated++;
    } catch (err) {
      console.log(`FAILED: ${err.message.slice(0, 200)}`);
      failed++;
    }
  }

  console.log("");
  console.log(`Generated: ${generated}, cached: ${skipped}, failed: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
