-- Penutupan sesi per tanggal
ALTER TABLE "SessionSlot" ADD COLUMN "isClosed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "closedReason" VARCHAR(200);

-- Penutupan tanggal penuh
CREATE TABLE "ClosedDate" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reason" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClosedDate_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ClosedDate_date_key" ON "ClosedDate"("date");
ALTER TABLE "ClosedDate" ENABLE ROW LEVEL SECURITY;

-- RLS untuk tabel riwayat migrasi Prisma
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- Cabut semua hak role API Supabase di schema public (akses hanya lewat Prisma/server).
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;
-- Tabel baru yang dibuat role migrasi (postgres) juga tidak otomatis diberi hak.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon, authenticated;
