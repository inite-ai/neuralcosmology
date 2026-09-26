import "server-only";
import { NextResponse } from "next/server";
import { dbConfigured } from "@/lib/db";

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
export const fail = (error: string, status: number) => NextResponse.json({ error }, { status });
export const noDb = () => (dbConfigured() ? null : fail("storage_unavailable", 503));
export const clip = (s: unknown, max: number) => (typeof s === "string" ? s.trim().slice(0, max) : "");
