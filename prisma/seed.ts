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

  const umkmList = [
    {
      slug: "toko-terang-jaya",
      name: "Toko Terang Jaya",
      mapCode: "T7",
      products: ["Aneka Minuman", "Aneka Ice Cream", "Aneka Mainan"],
      price: "Rp 3.000 - Rp 30.000",
      discountCoupon: 5000,
      imageUrl: "/images/TerangJaya_Toko_1.jpeg",
      sortOrder: 1,
    },
    {
      slug: "toko-99ceria",
      name: "Toko 99Ceria",
      mapCode: "T8",
      products: ["Kebab Medium", "Kebab Jumbo", "Es Teh"],
      price: "Rp 5.000 - Rp 13.000",
      discountCoupon: 5000,
      imageUrl: "/images/99Ceria_Toko_2.jpeg",
      sortOrder: 2,
    },
    {
      slug: "toko-batik-adis",
      name: "Toko Batik Adis",
      mapCode: "T3",
      products: ["Baju Batik"],
      price: "Rp 150.000 - Rp 260.000",
      discountCoupon: 30000,
      imageUrl: "/images/toko_batik_adis.jpeg",
      sortOrder: 3,
    },
    {
      slug: "toko-amir-jaya",
      name: "Toko Amir Jaya",
      mapCode: "T4",
      products: ["Baju Batik", "Sarung", "Kain Batik"],
      price: "Rp 150.000",
      discountCoupon: 30000,
      imageUrl: "/images/AmirJaya_Toko_3.jpeg",
      sortOrder: 4,
    },
    {
      slug: "toko-sakinah-batik",
      name: "Toko Sakinah Batik",
      mapCode: "T6",
      products: ["Baju Batik", "Sarung", "Kain Batik"],
      price: "Rp 150.000",
      discountCoupon: 30000,
      imageUrl: "/images/BatikSakinah_Produk_5.jpeg",
      sortOrder: 5,
    },
    {
      slug: "toko-rimanda",
      name: "Toko Rimanda",
      mapCode: "T5",
      products: ["Baju Batik"],
      price: "Rp 150.000",
      discountCoupon: 30000,
      imageUrl: "/images/toko-batik-rimanda.jpeg",
      sortOrder: 6,
    },
  ];

  for (const u of umkmList) {
    await prisma.umkm.upsert({
      where: { slug: u.slug },
      update: {
        name: u.name,
        mapCode: u.mapCode,
        products: u.products,
        price: u.price,
        discountCoupon: u.discountCoupon,
        imageUrl: u.imageUrl,
        sortOrder: u.sortOrder,
      },
      create: u,
    });
  }
}

main()
  .catch((e: unknown) => {
    console.error(e instanceof Error ? e.message : "Seed gagal");
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
