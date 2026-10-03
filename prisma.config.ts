import "dotenv/config";
import { defineConfig } from "prisma/config";

// CLI (migrate/seed) memakai koneksi langsung (DIRECT_URL), bukan pooler.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Kosong saat generate/build tanpa DB; migrate akan gagal jelas jika belum diisi.
    url: process.env.DIRECT_URL ?? "",
  },
});
