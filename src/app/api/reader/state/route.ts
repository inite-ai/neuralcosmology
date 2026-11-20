import { reader, withDb } from "@/lib/reader/reader.server";

export const dynamic = "force-dynamic";

// GET ?book&lang → место и пометки читателя в книге; PUT — сохранить место (@inite/reader).
export const GET = withDb(reader.routes.state.GET);
export const PUT = withDb(reader.routes.state.PUT);
