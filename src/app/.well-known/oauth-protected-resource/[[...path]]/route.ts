import { siteUrl } from "@/lib/auth";

export const dynamic = "force-dynamic";

// RFC 9728: где агенту взять токен для /mcp/account.
export async function GET(_req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  const site = siteUrl();
  const resource = `${site}/${path.length ? path.join("/") : "mcp/account"}`;
  return Response.json(
    {
      resource,
      resource_name: "Neural Cosmology",
      authorization_servers: [process.env.INITE_AUTH_ISSUER || "https://auth-api.inite.ai"],
      scopes_supported: ["openid", "profile", "email"],
      bearer_methods_supported: ["header"],
      resource_documentation: `${site}/llms.txt`,
    },
    { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" } },
  );
}
