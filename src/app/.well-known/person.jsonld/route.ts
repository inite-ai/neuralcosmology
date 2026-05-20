/**
 * /.well-known/person.jsonld — canonical Person endpoint.
 *
 * Single source of truth for the author entity. Both neuralcosmology.com and
 * www.mikefluff.com reference the same `@id` (`https://neuralcosmology.com/#person`)
 * so any LLM/SERP that resolves either domain ends up at one unified Person
 * record. This endpoint exposes that record at a discoverable well-known path.
 */

import { NextResponse } from "next/server";
import {
  AUTHOR_NAME,
  AUTHOR_SAME_AS,
  AUTHOR_URL,
  SITE_URL,
} from "@/lib/schema";

export function GET() {
  const body = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    alternateName: ["Mike Fluff", "Майк Флафф", "Михаил Савченко"],
    url: AUTHOR_URL,
    sameAs: AUTHOR_SAME_AS,
    jobTitle: "Independent researcher, writer, business doctor, tech therapist",
    description:
      "Mikhail Savchenko (research/writing identity) and Mike Fluff (business/consulting identity) are the same person — two public-facing brands of one human. Independent researcher behind the Neural Cosmology programme (preprint, three books, essays, lectures) at neuralcosmology.com, and operator of the Business Doctor practice (AI automation, regulatory immunity, tech surgery, courses) at mikefluff.com.",
    knowsAbout: [
      "cosmology",
      "galactic rotation curves",
      "information geometry",
      "consciousness",
      "neuroscience",
      "theoretical physics",
      "AI automation",
      "AI privacy and compliance",
      "PII handling",
      "GDPR",
      "LGPD",
      "DPA",
      "secure-by-design AI workflows",
      "business diagnostics",
      "process optimization",
    ],
    worksFor: [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Neural Cosmology",
        url: SITE_URL,
      },
      {
        "@type": "Organization",
        "@id": "https://www.mikefluff.com/#organization",
        name: "Mike Fluff - Business Doctor",
        url: "https://www.mikefluff.com",
      },
    ],
    relatedLink: [
      "https://www.mikefluff.com",
      "https://www.mikefluff.com/identity.json",
      "https://www.mikefluff.com/llms.txt",
    ],
  };

  return NextResponse.json(body, {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
