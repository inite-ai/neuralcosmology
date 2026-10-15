import { markdownResponse } from "@inite/content/ai";
import { markdownFor } from "@/lib/agent/markdown";

export const dynamic = "force-dynamic";

// Markdown-версия страницы для агентов. Сюда middleware переписывает
// /<путь>.md и запросы с Accept: text/markdown. Каноническая — HTML-страница
// (Link rel=canonical): поиск не должен видеть дубль.
export async function GET(_req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  return markdownResponse(markdownFor(`/${path.join("/")}`));
}
