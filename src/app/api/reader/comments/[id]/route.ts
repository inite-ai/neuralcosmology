import { reader, withDb } from "@/lib/reader/reader.server";

export const dynamic = "force-dynamic";

// POST {action: like | unlike | hide | show | pin | unpin | delete} (@inite/reader).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withDb((r) => reader.routes.comment(r, id))(req);
}
