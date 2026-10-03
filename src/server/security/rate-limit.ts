import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";
import { hitRateLimit, type RateLimitRule } from "@/server/db/rate-limit";

export const BOOKING_RATE_LIMIT: RateLimitRule = { limit: 5, windowMs: 10 * 60 * 1000 };

// Cadangan in-memory HANYA untuk lokal (NODE_ENV !== "production") bila DB rate limit gagal.
const memory = new Map<string, number[]>();

export function memoryLimit(key: string, rule: RateLimitRule = BOOKING_RATE_LIMIT, now = Date.now()): boolean {
  const hits = (memory.get(key) ?? []).filter((t) => now - t < rule.windowMs);
  if (hits.length >= rule.limit) {
    memory.set(key, hits);
    return false;
  }
  hits.push(now);
  memory.set(key, hits);
  if (memory.size > 5000) memory.clear();
  return true;
}

/**
 * Produksi: wajib lewat Postgres; error = lempar (permintaan ditolak, gagal tertutup).
 * Lokal: jatuh ke in-memory bila DB tidak bisa dipakai.
 */
export async function checkRateLimit(
  db: PrismaClient,
  scope: string,
  identifier: string,
  rule: RateLimitRule = BOOKING_RATE_LIMIT,
  isProduction = process.env.NODE_ENV === "production",
): Promise<boolean> {
  try {
    return await hitRateLimit(db, scope, identifier, rule);
  } catch (e) {
    if (isProduction) throw new Error("Rate limit tidak tersedia", { cause: e });
    return memoryLimit(`${scope}:${identifier}`, rule);
  }
}
