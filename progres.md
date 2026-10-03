# Progres

## Status saat ini
Tahap: 1 (inti) | Terakhir diperbarui: 2026-10-04
Target deploy kembali ke Vercel (region sin1). Logika pemesanan + kuota (transaksi + FOR UPDATE) dan server action sudah ada beserta unit test. Migrasi/seed/test integrasi belum dijalankan ke Supabase karena `.env` belum ada. Belum ada UI.

## Selesai
- [x] 2026-10-03 — Setup Next.js 16, TS strict, Tailwind 4, ESLint, Vitest
- [x] 2026-10-03 — Skema Prisma awal + migrasi 0001 (CHECK, RLS) + seed paket & sesi
- [x] 2026-10-04 — Migrasi 0002: ClosedDate, SessionSlot.isClosed, RLS _prisma_migrations, REVOKE anon/authenticated
- [x] 2026-10-04 — Aturan bisnis + unit test (src/server/booking/rules.ts, input.ts, code.ts, whatsapp.ts)
- [x] 2026-10-04 — createBooking: validasi dulu, lalu transaksi upsert slot + FOR UPDATE + kuota (src/server/db/bookings.ts)
- [x] 2026-10-04 — Server action submitBooking: rate limit, honeypot, Turnstile, Zod, URL WA (src/app/actions/booking.ts)
- [x] 2026-10-04 — Migrasi ke Vercel: hapus OpenNext/wrangler/binding; DB via pooler (src/server/db/client.ts); rate limit Postgres (migrasi 0003); vercel.json sin1; env divalidasi saat start (src/instrumentation.ts)

## Sedang dikerjakan
- [ ] A5: migrate + seed + test konkurensi lewat pooler — MENUNGGU `.env` (DATABASE_URL, DIRECT_URL)

## Berikutnya
- [ ] Integrasi Midtrans sandbox di balik PAYMENT_MODE (bagian B)
- [ ] Security headers di next.config, cek dengan curl -I
- [ ] Design token + font, UI semua section sesuai Design/, mobile-first
- [ ] Halaman sukses pemesanan, 404, error, SEO dasar (metadata, Open Graph, sitemap, robots), noindex /admin
- [ ] Admin: Supabase Auth, login, daftar pesanan + filter, ubah status + log (cek sesi + allowlist di layout & setiap action, ber-test)
- [ ] Penutup: lint, typecheck, test, build; DEPLOY.md (Vercel)

## Tugas non-kode
- [ ] Beli domain
- [ ] Buat project Supabase (region Singapura); ambil connection string pooler (6543) dan direct (5432)
- [ ] Buat project Vercel, isi env, hubungkan domain
- [ ] Buat Turnstile site key produksi (Cloudflare dashboard, gratis)
- [ ] Catat semua akun (domain, Supabase, Vercel, Cloudflare Turnstile, Midtrans) untuk dipindahkan ke Pokdarwis

## Keputusan penting
- 2026-10-03 — Prisma 7.10 (stabil). Driver adapter `@prisma/adapter-pg`; client di-generate ke `src/generated/prisma`.
- 2026-10-03 — Kuota dikunci lewat baris SessionSlot (sesi+tanggal), dibuat upsert lalu FOR UPDATE; slot kosong pun terserialisasi.
- 2026-10-03 — Booking.unitPrice menyimpan snapshot harga; CHECK DB: total = harga × peserta.
- 2026-10-04 — Semua validasi sebelum menulis SessionSlot (tidak ada slot sampah).
- 2026-10-04 — Penutupan: tabel ClosedDate (hari penuh) + SessionSlot.isClosed (satu sesi); diubah lewat Table Editor.
- 2026-10-04 — Cloudflare Workers dibatalkan: bundle 3,3 MiB gzip melebihi batas gratis. Pindah ke Vercel.
- 2026-10-04 — DB runtime via pooler Supabase transaction mode (6543); adapter-pg tanpa prepared statement bernama; pool max 3 per instance. Migrasi via DIRECT_URL (5432).
- 2026-10-04 — Rate limit pakai tabel Postgres `RateLimit` (UPSERT atomik, fixed window 5/10 menit, IP di-hash) — tanpa layanan tambahan (Upstash) karena Supabase sudah ada dan volume kecil. Produksi gagal tertutup jika DB error; in-memory hanya lokal.
- 2026-10-04 — Env runtime tanpa NEXT_PUBLIC_; SUPABASE_SERVICE_ROLE_KEY tidak dipakai (tidak dibutuhkan).
- 2026-10-04 — proxy.ts hanya redirect kenyamanan; keamanan admin di layout + setiap action.
- 2026-10-04 — Path desain: `Design/` (CLAUDE.md disesuaikan).

## Menunggu dari klien / belum jelas
- Jam setiap sesi (sementara 08–10, 10–12, 15–17 di seed)
- Batas 20 paket umum: per pesanan (asumsi) atau per sesi
- Kebijakan DP (sementara bayar penuh); nomor WA tujuan; syarat kupon
- Teks sejarah final + sumber; data 7 UMKM; isi FAQ (belum di-seed)

## Masalah diketahui
- Migrasi 0001–0003 belum pernah dijalankan ke DB sungguhan; test integrasi masih skip.
- node_modules/.next sempat rusak (file hilang, ENOTEMPTY) — folder di ~/Documents mungkin disinkron; pertimbangkan pindah folder.
- src/proxy.ts masih isi uji (header x-proxy-check).
