/**
 * Tiny RSS reader for the sibling site (mikefluff.com/blog/rss.xml).
 *
 * We do not need a general-purpose parser — the sibling RSS is produced by
 * the same author so the format is known and stable. Failures are silent:
 * if the sibling feed is unreachable, the cross-card just renders nothing.
 */

export type SiblingPost = {
  title: string;
  link: string;
  date?: string;
  description?: string;
};

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function pick(item: string, tag: string): string | undefined {
  const m = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i").exec(item);
  return m ? decodeEntities(m[1]).trim() : undefined;
}

export async function fetchSiblingPosts(url: string, max = 3): Promise<SiblingPost[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Neuralcosmology-sibling-feed/1.0" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
    return items
      .slice(0, max)
      .map((item) => {
        const title = pick(item, "title");
        const link = pick(item, "link");
        const date = pick(item, "pubDate") ?? pick(item, "dc:date");
        const description = pick(item, "description");
        if (!title || !link) return null;
        return { title, link, date, description } as SiblingPost;
      })
      .filter((p): p is SiblingPost => p !== null);
  } catch {
    return [];
  }
}
