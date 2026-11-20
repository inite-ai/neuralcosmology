import { INITE_AUTH_ISSUER, mcpCard } from "@inite/mcp/site";
import { ACCOUNT_SCOPES, SCOPE_AUTHOR, SCOPE_DISCUSS, account } from "@/lib/agent/mcp";
import { siteUrl } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Карточка MCP-сервера: где он и что умеет, чтобы агенту не гадать. Для /mcp/account —
// вход через INITE и области, которые нужны инструментам читалки (как на mikefluff.com).
export function GET() {
  const site = siteUrl();
  const resource = account();
  const card = mcpCard({
    site,
    name: "neuralcosmology",
    title: "Neural Cosmology",
    description:
      "Answers, essays, interactive experiments and books by Mikhail Savchenko on consciousness, cosmology and computation (en, ru, pt, es). Search, read as markdown, see prices, open a checkout for a reader, read and join chapter discussions.",
    endpoints: [{ path: "/mcp" }, { path: "/mcp/account", resource }],
    tools: ["search", "read", "list_books", "create_checkout", "my_library", "get_chapter_discussion", "post_comment", "send_note_to_author", "get_author_inbox", "moderate_comment"],
    documentation: `${site}/llms.txt`,
  });
  return Response.json(
    {
      ...card,
      authentication: {
        required: false,
        schemes: ["oauth2"],
        protectedResourceMetadata: resource.metadataUrl,
        resource: resource.resource,
        authorizationServers: [INITE_AUTH_ISSUER],
        scopes: ACCOUNT_SCOPES,
        tools: {
          post_comment: SCOPE_DISCUSS,
          send_note_to_author: SCOPE_DISCUSS,
          get_author_inbox: SCOPE_AUTHOR,
          moderate_comment: SCOPE_AUTHOR,
        },
      },
    },
    { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" } },
  );
}
