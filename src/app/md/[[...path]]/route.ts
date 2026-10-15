import { markdownFor } from "@/lib/agent/markdown";

export const dynamic = "force-dynamic";

// Markdown-версия страницы для агентов. Сюда middleware переписывает
// /<путь>.md и запросы с Accept: text/markdown.
export async function GET(_req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  const md = markdownFor(`/${path.join("/")}`);
  if (!md) {
    return new Response("# Not found\n", {
      status: 404,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  }
  return new Response(md.body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // Каноническая — HTML-страница: поиск не должен видеть дубль.
      Link: `<${md.canonical}>; rel="canonical"`,
      Vary: "Accept",
      "Cache-Control": "public, max-age=300",
    },
  });
}
