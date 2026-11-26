import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { isAuthor } from "@/lib/reader/context";
import { recordStat, type StatEvent } from "@/lib/stats.server";

// POST /api/stats — браузерная половина lib/stats.server. Маяк: ответ всегда 204.
// Отсюда приходят только события, которые видит страница: страница, открытая глава,
// дочитанная глава. Оплату и покупку пишут серверные маршруты, которые о них знают.

export const dynamic = "force-dynamic";

const FROM_BROWSER = new Set<StatEvent>(["page", "chapter_open", "chapter_complete"]);
const OURS = /(^|\.)neuralcosmology\.com$|^localhost$|^127\.0\.0\.1$/;
const none = () => new Response(null, { status: 204 });

function host(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw) return null;
  try {
    return new URL(raw).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const origin = host(req.headers.get("origin"));
  if (!origin || !OURS.test(origin)) return none();

  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const name = typeof b?.n === "string" ? (b.n as StatEvent) : null;
  if (!b || !name || !FROM_BROWSER.has(name)) return none();

  // Автор, читающий свои книги, — не читатель.
  if (isAuthor(await getSession().catch(() => null))) return none();

  let path: string | null = null;
  let source: string | null = null;
  if (typeof b.p === "string" && b.p.startsWith("/")) {
    const url = new URL(b.p, "https://x.invalid");
    path = url.pathname;
    source = url.searchParams.get("utm_source");
  }
  if (!source && name === "page") {
    const ref = host(b.r);
    if (ref && !OURS.test(ref)) source = ref;
  }
  const str = (k: string) => (typeof b[k] === "string" ? (b[k] as string) : null);
  await recordStat(req.headers, { name, path, source: source?.toLowerCase() ?? null, book: str("b"), chapter: str("c"), lang: str("l") });
  return none();
}
