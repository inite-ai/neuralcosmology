import { catalog } from "@/lib/agent/catalog";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(catalog(), { headers: { "Cache-Control": "public, max-age=300" } });
}
