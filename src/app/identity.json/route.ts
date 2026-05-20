/**
 * identity.json — canonical identity (ai-visibility.org.uk spec).
 *
 * Authoritative source for the author's research/writerly identity. Symmetric
 * to https://www.mikefluff.com/identity.json (business identity of the same
 * person). Both files cross-reference via `sameAs`.
 */

import { NextResponse } from "next/server";

const BASE = "https://neuralcosmology.com";

export function GET() {
  const body = {
    $schema:
      "https://www.ai-visibility.org.uk/specifications/identity-json/identity-json.schema.json",
    name: "Neural Cosmology — Mikhail Savchenko",
    type: "Organization",
    url: BASE,
    description:
      "Public HQ for the Neural Cosmology research programme by Mikhail Savchenko: three books, one preprint (Pointer Architecture v2 — constrained information-geometric model of galactic rotation curves, full reproducibility pipeline), a growing body of essays, and recorded lectures. Scientist with questions, not prophet with answers. Operated by Mikhail Savchenko, who also runs the business/consulting practice Mike Fluff at https://www.mikefluff.com.",
    alternateNames: [
      "Neural Cosmology",
      "Neuralcosmology",
      "Pointer Architecture programme",
    ],
    foundingDate: "2024",
    industry:
      "Independent research, scientific writing, theoretical physics, cosmology, philosophy of mind",
    contactPoints: [
      { type: "Editorial", email: "info@neuralcosmology.com" },
      { type: "Website", url: `${BASE}/en/about` },
    ],
    sameAs: [
      "https://www.mikefluff.com",
      "https://www.mikefluff.com/#person",
      "https://www.mikefluff.com/#organization",
      "https://t.me/neuralcosmology",
      "https://github.com/neuralcosmology",
      "https://www.linkedin.com/in/mikefluff/",
      "https://twitter.com/mikefluff",
      "https://t.me/mikefluff",
      "https://github.com/mikefluff",
    ],
    relatedProperty: {
      name: "Mike Fluff - Business Doctor",
      url: "https://www.mikefluff.com",
      relationship:
        "Same author. Mikhail Savchenko (research and writing identity) operates Neural Cosmology at neuralcosmology.com. Mike Fluff (business and consulting identity) operates the Business Doctor practice at mikefluff.com. Two public brands, one human.",
      identityFiles: [
        "https://www.mikefluff.com/identity.json",
        "https://www.mikefluff.com/llms.txt",
        "https://www.mikefluff.com/ai.txt",
      ],
    },
    publications: {
      preprint: `${BASE}/en/science/pointer-architecture`,
      essaysIndex: `${BASE}/en/essays`,
      essaysRss: `${BASE}/en/essays/rss.xml`,
      booksIndex: `${BASE}/en/books`,
      lecturesIndex: `${BASE}/en/lectures`,
    },
    metadata: {
      version: "1.0",
      lastUpdated: new Date().toISOString().slice(0, 10),
      relatedFiles: ["/llms.txt", "/ai.json", "/brand.txt", "/faq-ai.txt", "/.well-known/person.jsonld"],
    },
  };

  return NextResponse.json(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
