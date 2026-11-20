import { reader, withDb } from "@/lib/reader/reader.server";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// POST {mode: ask | explain | recap, …}: ответ компаньона потоком или пересказ прошлых глав (@inite/reader).
export const POST = withDb(reader.routes.ai.POST);
