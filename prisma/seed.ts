import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DIRECT_URL/DATABASE_URL belum diisi");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  // Idempoten: upsert berdasarkan kunci unik. Tidak menghapus data.
  await prisma.package.upsert({
    where: { slug: "umum" },
    update: {},
    create: {
      slug: "umum",
      name: "Paket Umum",
      pricePerPerson: 54000,
      durationMinutes: 120,
      minParticipants: 1,
      maxParticipants: 20,
      facilities: [
        "Wisata kampung batik",
        "Demo membatik",
        "Kupon diskon makanan Rp5.000",
        "Kupon diskon busana Rp30.000",
      ],
      sortOrder: 1,
    },
  });
  await prisma.package.upsert({
    where: { slug: "pelajar" },
    update: {},
    create: {
      slug: "pelajar",
      name: "Paket Pelajar (Rombongan Sekolah)",
      pricePerPerson: 39000,
      durationMinutes: 120,
      minParticipants: 20,
      maxParticipants: 30,
      facilities: [
        "Wisata kampung batik",
        "Demo membatik",
        "Kupon diskon makanan Rp5.000",
        "3 kain batik untuk 3 anak terbaik",
      ],
      sortOrder: 2,
    },
  });

  // TODO(klien): jam sesi belum final.
  const sessions = [
    { label: "Sesi Pagi", startTime: "08:00", endTime: "10:00", sortOrder: 1 },
    { label: "Sesi Siang", startTime: "10:00", endTime: "12:00", sortOrder: 2 },
    { label: "Sesi Sore", startTime: "15:00", endTime: "17:00", sortOrder: 3 },
  ];
  for (const s of sessions) {
    await prisma.session.upsert({
      where: { startTime_endTime: { startTime: s.startTime, endTime: s.endTime } },
      update: {},
      create: { ...s, quota: 30 },
    });
  }

  // TODO(klien): data 7 UMKM dan FAQ final belum ada; tidak di-seed.
}

main()
  .catch((e: unknown) => {
    console.error(e instanceof Error ? e.message : "Seed gagal");
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
