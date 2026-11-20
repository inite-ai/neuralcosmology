import { reader, withDb } from "@/lib/reader/reader.server";

export const dynamic = "force-dynamic";

// GET — обсуждение главы; POST — комментарий через модерацию, задержанное ждёт автора скрытым (@inite/reader).
export const GET = withDb(reader.routes.comments.GET);
export const POST = withDb(reader.routes.comments.POST);
