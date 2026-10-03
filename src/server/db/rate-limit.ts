import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";

export type RateLimitRule = { limit: number; windowMs: number };

/** Mulai jendela waktu tetap (fixed window) yang memuat `now`. */
export function windowStartFor(now: Date, windowMs: number): Date {
  return new Date(Math.floor(now.getTime() / windowMs) * windowMs);
}

/** Hash SHA-256 agar IP mentah tidak tersimpan di DB. */
export async function hashKey(raw: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Buffer.from(buf).toString("hex").slice(0, 64);
}

/**
 * Rate limit di Postgres: satu UPSERT atomik per permintaan, konsisten di semua instance serverless.
 * Mengembalikan true jika masih di bawah batas.
 */
export async function hitRateLimit(
  db: PrismaClient,
  scope: string,
  identifier: string,
  rule: RateLimitRule,
  now = new Date(),
): Promise<boolean> {
  const key = `${scope}:${await hashKey(identifier)}`;
  const windowStart = windowStartFor(now, rule.windowMs);
  const rows = await db.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimit" ("key", "windowStart", "count")
    VALUES (${key}, ${windowStart}, 1)
    ON CONFLICT ("key", "windowStart") DO UPDATE SET "count" = "RateLimit"."count" + 1
    RETURNING "count"`;
  return (rows[0]?.count ?? Infinity) <= rule.limit;
}

/** Hapus jendela lama (dipanggil cron). */
export async function purgeRateLimits(db: PrismaClient, olderThan: Date): Promise<number> {
  const r = await db.rateLimit.deleteMany({ where: { windowStart: { lt: olderThan } } });
  return r.count;
}
