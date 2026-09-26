"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProgress } from "./progress";

export default function ContinueReading({
  slug,
  lang,
  hrefBase,
  firstId,
  chapterIds,
  labels,
  className,
}: {
  slug: string;
  lang: string;
  hrefBase: string;
  firstId: string;
  chapterIds: string[];
  labels: { start: string; continue: string };
  className?: string;
}) {
  const [last, setLast] = useState<string | null>(null);

  useEffect(() => {
    const p = loadProgress(slug, lang);
    if (p.last && chapterIds.includes(p.last)) setLast(p.last);
  }, [slug, lang, chapterIds]);

  return (
    <Link href={`${hrefBase}/${last ?? firstId}`} className={className}>
      {last ? labels.continue : labels.start}
    </Link>
  );
}
