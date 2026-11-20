import { reader, withDb } from "@/lib/reader/reader.server";

export const dynamic = "force-dynamic";

// POST — пометка, PATCH — правка (toAuthor: заметка письмом автору), DELETE ?id (@inite/reader).
export const POST = withDb(reader.routes.annotations.POST);
export const PATCH = withDb(reader.routes.annotations.PATCH);
export const DELETE = withDb(reader.routes.annotations.DELETE);
