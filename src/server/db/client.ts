import "server-only";
import { cache } from "react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Runtime: binding Cloudflare Hyperdrive -> koneksi langsung Supabase (5432).
// Satu klien per request (React cache) dan maxUses: 1: koneksi I/O tidak boleh
// dipakai lintas request di Workers. Hyperdrive yang menampung pool ke Supabase.
export function createPrismaClient(connectionString: string): PrismaClient {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString, maxUses: 1 }) });
}

async function hyperdriveConnectionString(): Promise<string | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env.HYPERDRIVE?.connectionString || null;
  } catch {
    return null; // di luar konteks Cloudflare (mis. next dev tanpa binding)
  }
}

export const getDb = cache(async (): Promise<PrismaClient> => {
  const cs = await hyperdriveConnectionString();
  if (!cs) throw new Error("Binding HYPERDRIVE tidak tersedia");
  return createPrismaClient(cs);
});

/** Apakah koneksi DB tersedia (dipakai untuk fixture saat pengembangan UI tanpa .env). */
export async function isDbConfigured(): Promise<boolean> {
  return (await hyperdriveConnectionString()) !== null;
}
