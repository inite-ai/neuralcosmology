import { markdownFor } from "@/lib/agent/markdown";
import { listAnswers } from "@/lib/answers";
import { listEssays } from "@/lib/essays";
import { experiments } from "@/lib/interactive";
import { books } from "@/content/books";

export const dynamic = "force-dynamic";

// Полный текст сайта одним файлом (английская версия): ответы, книги, опыты,
// эссе. Другие языки — по .md-адресам страниц.
export function GET() {
  const paths = [
    "/en",
    ...listAnswers("en").map((a) => `/en/answers/${a.slug}`),
    ...books.map((b) => `/en/books/${b.slug}`),
    ...experiments().map((x) => `/en/experiments/${x.id}`),
    ...listEssays("en").map((e) => `/en/essays/${e.slug}`),
  ];
  const body = paths
    .map((p) => markdownFor(p)?.body)
    .filter(Boolean)
    .join("\n\n---\n\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
