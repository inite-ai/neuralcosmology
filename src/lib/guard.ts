import "server-only";
import type { NextRequest } from "next/server";
import { siteUrl } from "@/lib/auth";

/** Запрос, меняющий данные, должен прийти с самого сайта: чужой Origin отклоняем. */
export function sameOrigin(req: Request): boolean {
  if (req.headers.get("sec-fetch-site") === "cross-site" || req.headers.get("sec-fetch-site") === "same-site") return false;
  const origin = req.headers.get("origin");
  return !origin || origin === new URL(siteUrl()).origin || process.env.NODE_ENV !== "production";
}

export const ipOf = (req: NextRequest) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

/** Счётчик в памяти процесса: не больше max запросов за окно с одного ключа. */
export function limiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (key: string): boolean => {
    const now = Date.now();
    if (hits.size > 5000) for (const [k, v] of hits) if (now - v[v.length - 1] > windowMs) hits.delete(k);
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= max) return false;
    hits.set(key, [...recent, now]);
    return true;
  };
}
