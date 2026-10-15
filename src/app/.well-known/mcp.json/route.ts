import { mcpCardResponse } from "@inite/mcp/site";
import { account } from "@/lib/agent/mcp";
import { siteUrl } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Карточка MCP-сервера: где он и что умеет, чтобы агенту не гадать.
export function GET() {
  const site = siteUrl();
  return mcpCardResponse({
    site,
    name: "neuralcosmology",
    title: "Neural Cosmology",
    description:
      "Answers, essays, interactive experiments and books by Mikhail Savchenko on consciousness, cosmology and computation (en, ru, pt, es). Search, read as markdown, see prices, open a checkout for a reader.",
    endpoints: [{ path: "/mcp" }, { path: "/mcp/account", resource: account() }],
    tools: ["search", "read", "list_books", "create_checkout", "my_library"],
    documentation: `${site}/llms.txt`,
  });
}
