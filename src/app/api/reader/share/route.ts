import { reader, withDb } from "@/lib/reader/reader.server";

export const dynamic = "force-dynamic";

// POST {book, lang, chapter, anchor, quote} → {id, url}; только дословная цитата из главы (@inite/reader).
export const POST = withDb(reader.routes.share.POST);
