import { siteUrl } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Карточка MCP-сервера: где он и что умеет, чтобы агенту не гадать.
export function GET() {
  const site = siteUrl();
  return Response.json(
    {
      name: "neuralcosmology",
      title: "Neural Cosmology",
      description:
        "Answers, essays, interactive experiments and books by Mikhail Savchenko on consciousness, cosmology and computation (en, ru, pt, es). Search, read as markdown, see prices, open a checkout for a reader.",
      endpoints: [
        { url: `${site}/mcp`, transport: "streamable-http", auth: "none" },
        {
          url: `${site}/mcp/account`,
          transport: "streamable-http",
          auth: "oauth2",
          protectedResourceMetadata: `${site}/.well-known/oauth-protected-resource/mcp/account`,
        },
      ],
      tools: ["search", "read", "list_books", "create_checkout", "my_library"],
      documentation: `${site}/llms.txt`,
    },
    { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" } },
  );
}
