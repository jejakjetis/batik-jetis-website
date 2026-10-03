import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { getServerEnv } from "@/lib/env";

// Runtime: pooler Supabase mode transaction (port 6543) lewat DATABASE_URL.
// - adapter-pg TIDAK memakai prepared statement bernama (statementNameGenerator tidak diisi),
//   sehingga aman untuk Supavisor transaction mode.
// - Transaksi interaktif ($transaction + FOR UPDATE) berjalan di satu koneksi server
//   selama BEGIN..COMMIT, jadi penguncian tetap benar lewat pooler.
// - Pool kecil per instance fungsi serverless; pooler yang menampung koneksi.
export function createPrismaClient(connectionString: string): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString, max: 3, idleTimeoutMillis: 10_000 }),
  });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getDb(): PrismaClient {
  globalForPrisma.prisma ??= createPrismaClient(getServerEnv().DATABASE_URL);
  return globalForPrisma.prisma;
}
