// TODO(klien): SEMUA data di file ini adalah placeholder selama database belum siap.
// Hanya dipakai di luar produksi saat DB belum dikonfigurasi (lihat public.ts).
// Paket & sesi mengikuti CLAUDE.md §3.2–3.4. UMKM belum ada datanya: jangan diisi nama karangan.
import type { PublicFaq, PublicPackage, PublicSession, PublicUmkm } from "./types";
import Image from "next/image"; 

export const FIXTURE_PACKAGES: PublicPackage[] = [
  {
    id: "fixture-umum",
    slug: "umum",
    name: "Paket Umum",
    description: "Berkeliling kampung batik bersama pemandu dan menyaksikan demo membatik tulis.",
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
  },
  {
    id: "fixture-pelajar",
    slug: "pelajar",
    name: "Paket Pelajar (Rombongan Sekolah)",
    description: "Wisata edukasi batik untuk rombongan sekolah, lengkap dengan demo membatik.",
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
  },
];

// TODO(klien): jam sesi belum final.
export const FIXTURE_SESSIONS: PublicSession[] = [
  { id: "fixture-pagi", label: "Sesi Pagi", startTime: "08:00", endTime: "10:00", quota: 30 },
  { id: "fixture-siang", label: "Sesi Siang", startTime: "10:00", endTime: "12:00", quota: 30 },
  { id: "fixture-sore", label: "Sesi Sore", startTime: "15:00", endTime: "17:00", quota: 30 },
];

// TODO(klien): data 6 UMKM (nama, kode peta, produk, kisaran harga, kupon, foto, WA) belum diterima.
export const FIXTURE_UMKM: PublicUmkm[] = [
  {
    id: "fixture-umkm-1",
    name: "Toko Terang Jaya",
    mapCode: "T7",
    products: ["Aneka Minuman", "Aneka Ice Cream", "Aneka Mainan"],
    description: null,
    price:"Rp 3.000 - Rp 30.000",
    discountCoupon: 5000,
    imageUrl: "/images/TerangJaya_Toko_1.jpeg",
    whatsapp: null,
  },
  {
    id: "fixture-umkm-2",
    name: "Toko 99Ceria",
    mapCode: "T8",
    products: ["Kebab Medium", "Kebab Jumbo", "Es Teh"],
    description: null,
    price: "Rp 5.000 - Rp 13.000",
    discountCoupon: 5000,
    imageUrl: "/images/99Ceria_Toko_2.jpeg",
    whatsapp: null,
  },
  {
    id: "fixture-umkm-3",
    name: "Toko Batik Adis",
    mapCode: "T3",
    products: ["Baju Batik"],
    description: null,
    price: "Rp 150.000 - Rp 260.000",
    discountCoupon: 30000,
    imageUrl: "/images/toko_batik_adis.jpeg",
    whatsapp: null,
  },
  {
    id: "fixture-umkm-4",
    name: "Toko Amir Jaya",
    mapCode: "T4",
    products: ["Baju Batik", "Sarung", "Kain Batik"],
    description: null,
    price: "Rp 150.000",
    discountCoupon: 30000,
    imageUrl: "/images/AmirJaya_Toko_3.jpeg",
    whatsapp: null,
  },
  {
    id: "fixture-umkm-5",
    name: "Toko Sakinah Batik",
    mapCode: "T6",
    products: ["Baju Batik", "Sarung", "Kain Batik"],
    description: null,
    price: "Rp 150.000",
    discountCoupon: 30000,
    imageUrl: "/images/BatikSakinah_Produk_5.jpeg",
    whatsapp: null,
  },
  {
    id: "fixture-umkm-6",
    name: "Toko Rimanda",
    mapCode: "T5",
    products: ["Baju Batik"],
    description: null,
    price: "Rp 150.000",
    discountCoupon: 30000,
    imageUrl: "/images/toko-batik-rimanda.jpeg",
    whatsapp: null,
  },
];

// FAQ disusun dari aturan yang sudah disepakati (CLAUDE.md §3). TODO(klien): tinjau redaksi akhir.
export const FIXTURE_FAQS: PublicFaq[] = [
  {
    id: "faq-hari",
    question: "Kapan Kampung Batik Jetis bisa dikunjungi?",
    answer:
      "Kunjungan wisata tersedia setiap hari Sabtu dan Minggu, dibagi per sesi. Pukul 12.00–15.00 WIB tidak ada sesi kunjungan.",
  },
  {
    id: "faq-h3",
    question: "Berapa hari sebelumnya saya harus memesan?",
    answer: "Pemesanan paling lambat 3 hari sebelum tanggal kunjungan, dan paling jauh 60 hari ke depan.",
  },
  {
    id: "faq-kuota",
    question: "Berapa orang yang bisa ikut dalam satu sesi?",
    answer:
      "Setiap sesi menampung total 30 orang. Paket Umum untuk 1–20 orang per pesanan; Paket Pelajar untuk rombongan 20–30 siswa.",
  },
  {
    id: "faq-bayar",
    question: "Bagaimana cara pembayaran dan konfirmasi pesanan?",
    answer:
      "Setelah mengisi formulir, Anda akan diarahkan ke WhatsApp pengelola dengan kode pesanan. Pembayaran melalui QRIS dan dikonfirmasi oleh pengelola lewat WhatsApp.",
  },
  {
    id: "faq-batal",
    question: "Apakah pesanan bisa dibatalkan?",
    answer:
      "Pembatalan dan pengembalian dana dapat dilakukan paling lambat 2 hari sebelum tanggal kunjungan. Hubungi pengelola melalui WhatsApp dengan menyebutkan kode pesanan.",
  },
];
