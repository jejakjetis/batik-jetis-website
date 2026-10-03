// TODO(klien): SEMUA data di file ini adalah placeholder selama database belum siap.
// Hanya dipakai di luar produksi saat DB belum dikonfigurasi (lihat public.ts).
// Paket & sesi mengikuti CLAUDE.md §3.2–3.4. UMKM belum ada datanya: jangan diisi nama karangan.
import type { PublicFaq, PublicPackage, PublicSession, PublicUmkm } from "./types";

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

// TODO(klien): data 7 UMKM (nama, produk, kisaran harga, WA) belum diterima.
export const FIXTURE_UMKM: PublicUmkm[] = Array.from({ length: 7 }, (_, i) => ({
  id: `fixture-umkm-${i + 1}`,
  name: `UMKM ${i + 1} (data menyusul)`,
  products: "Produk menyusul",
  description: null,
  priceMin: null,
  priceMax: null,
  whatsapp: null,
}));

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
