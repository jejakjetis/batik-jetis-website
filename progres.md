# Progres

## Status saat ini
Tahap: Produksi & Live | Terakhir diperbarui: 2026-10-10
Situs telah live di domain produksi **https://jejakjetis.com** dan **https://www.jejakjetis.com** via Cloudflare Workers + OpenNext. Database Supabase terhubung melalui Hyperdrive, migrasi skema tabel UMKM (0004) dan 6 toko telah ter-seed, widget Turnstile aktif, alur pemesanan tiket dengan nomor WhatsApp pengelola (+62 857-1131-2011) berfungsi penuh. Seluruh 39 unit dan integration test lulus.

Pembaruan lokal terbaru dikerjakan di branch `main`: penyempurnaan konten dan layout Tentang serta transkrip wawancara, pemasangan foto Batik Namiroh, animasi pada bagian transkrip, dan pengalihan referensi gambar ke format WebP. Perubahan ini masih lokal dan belum di-commit atau di-push.

## Selesai
- [x] 2026-10-10 — Memperbaiki error dan warning ESLint: script seed CommonJS, animasi reduced-motion, import tak terpakai, dan pemakaian koordinat Google Maps (scripts/seed-umkm.js, src/components/ui/AnimateIn.tsx, src/lib/site.ts, fixtures dan section)
- [x] 2026-10-10 — Menyesuaikan rasio bingkai foto Batik Namiroh ke 3:2 agar gambar memenuhi bingkai tanpa ruang kosong atas-bawah (src/components/sections/About.tsx)
- [x] 2026-10-10 — Merapatkan jarak label, subjudul, dan paragraf Batik Namiroh dengan meratakan konten ke atas sejajar gambar (src/components/sections/About.tsx)
- [x] 2026-10-10 — Merapatkan jarak vertikal antarparagraf sejarah pada desktop agar setara dengan paragraf transkrip (src/components/sections/About.tsx)
- [x] 2026-10-10 — Menyamakan animasi reveal pada setiap judul, paragraf, garis aksen, dan gambar di bagian transkrip (src/components/sections/About.tsx)
- [x] 2026-10-10 — Menambahkan paragraf lanjutan Batik Namiroh selebar kontainer di bawah baris judul dan gambar (src/components/sections/About.tsx)
- [x] 2026-10-10 — Merapatkan jarak label transkrip dengan subbagian Batik Namiroh (src/components/sections/About.tsx)
- [x] 2026-10-10 — Menyesuaikan gaya judul transkrip dan subjudulnya dengan heading bagian Tentang (src/components/sections/About.tsx)
- [x] 2026-10-10 — Menghapus placeholder gambar dari subbagian Batik Kamsatun dan Proses Pembatikan (src/components/sections/About.tsx)
- [x] 2026-10-10 — Menata subbagian transkrip dalam layout teks kiri dan placeholder gambar kanan (src/components/sections/About.tsx)
- [x] 2026-10-10 — Menambahkan kerangka transkrip wawancara dengan subbagian Batik Namiroh, Batik Kamsatun, dan Proses Pembatikan (src/components/sections/About.tsx)
- [x] 2026-10-10 — Membentangkan paragraf lanjutan Tentang selebar dua kolom di desktop (src/components/sections/About.tsx)
- [x] 2026-10-10 — Menerapkan perataan justify pada paragraf Tentang (src/components/sections/About.tsx)
- [x] 2026-10-10 — Menyamakan tipografi paragraf lanjutan Tentang dengan paragraf utama (src/components/sections/About.tsx)
- [x] 2026-10-10 — Memindahkan paragraf lanjutan Tentang ke bawah gambar pada layout desktop (src/components/sections/About.tsx)
- [x] 2026-10-10 — Menyiapkan paragraf lanjutan kosong pada section Tentang untuk diisi (src/components/sections/About.tsx)
- [x] 2026-10-10 — Hero Carousel Background: Penyempurnaan transisi background slider menjadi cross-dissolve fade in & fade out halus berdurasi 2.5 detik (menghilangkan pergeseran translate-x yang patah), eager loading dan preloading aset gambar hero ke memori browser, auto-cycle 5 detik (2.5s transisi + 2.5s tampilan tenang), dan tombol navigasi sudut kanan '>'.
- [x] 2026-10-10 — UI Animasi & Pembersihan: Penambahan animasi fade-in slide-up minimalis (`AnimateIn` via native IntersectionObserver) di seluruh section beranda (Hero, About, Packages, Story, MapSection, Umkm, Faq), serta penghapusan folder tidak terpakai `batik-jetis-next`.
- [x] 2026-10-10 — Custom Domain & DNS: Integrasi domain Hostinger `jejakjetis.com` dan `www.jejakjetis.com` ke Cloudflare Workers via Custom Domains, pembersihan record A/CNAME parkir Hostinger, eliminasi isu DNS NXDOMAIN/cache.
- [x] 2026-10-10 — Cloudflare Turnstile: Pengaktifan site key (`0x4AAAAAAFSar_VEJF4it2PT`) dan secret key aktif, whitelist hostname (`jejakjetis.com`, `kampung-batik-jetis.jejakjetis.workers.dev`, `localhost`) via Cloudflare API; perbaikan form pemesanan terkunci.
- [x] 2026-10-10 — Konfigurasi Kontak: Pembaruan `BOOKING_WHATSAPP_NUMBER` ke nomor resmi pengelola (`6285711312011` / `+62 857-1131-2011`) dan `SITE_URL` ke `https://jejakjetis.com`.
- [x] 2026-10-10 — Database & UMKM: Migrasi `0004_umkm_columns` (tabel Umkm: mapCode, discountCoupon, imageUrl, products array), seed 6 toko UMKM (`scripts/seed-umkm.js`), perbaikan live query `getUmkm()`, dan stabilisasi runtime Prisma Client.
- [x] 2026-10-10 — Deployment: Verifikasi typecheck, 39 test Vitest hijau, deploy sukses ke Cloudflare Workers di branch `test-step-step`.
- [x] 2026-10-04 — Setup Next.js 16, TS strict, Tailwind 4, ESLint, Vitest; skema Prisma + migrasi 0001 (CHECK, RLS) + seed
- [x] 2026-10-04 — Migrasi 0002 (ClosedDate, SessionSlot.isClosed, RLS _prisma_migrations, REVOKE) dan 0003 (RateLimit)
- [x] 2026-10-04 — Logika pemesanan + unit test (src/server/booking/), createBooking dengan validasi dulu lalu transaksi FOR UPDATE (src/server/db/bookings.ts)
- [x] 2026-10-04 — Server action submitBooking: rate limit Postgres, honeypot, Turnstile, Zod, URL WA
- [x] 2026-10-04 — Front end: design token + font, komponen dasar, 10 section, form pemesanan, halaman sukses, 404, error (src/components/, src/app/(public)/)
- [x] 2026-10-04 — Kembali ke Cloudflare: OpenNext + wrangler, Hyperdrive per request (src/server/db/client.ts), vercel.json dihapus
- [x] 2026-10-04 — Admin: Supabase Auth + allowlist, layout & action terproteksi, daftar pesanan + filter, ubah status + log, test tanpa sesi (src/app/admin/, src/server/auth/, test/admin/)
- [x] 2026-10-04 — Security headers + CSP (cek curl -I di preview), SEO (metadata, Open Graph, robots, sitemap), noindex admin
- [x] 2026-10-04 — DEPLOY.md (Cloudflare); CLAUDE.md, README.md diperbarui

## Sedang dikerjakan / Pemeliharaan
- [ ] 2026-10-10 — Meninjau dan memverifikasi perubahan lokal (lint, typecheck, build), lalu commit dan push ke `main`; perubahan mencakup `About.tsx`, aset WebP, referensi gambar Hero/Story/Map/Packages/UMKM, dan `progres.md`.
- [ ] Monitoring log Observability Cloudflare Workers dan umpan balik pemesanan dari Pokdarwis
- [ ] Merge berkala antara `test-step-step` dan `main` agar sinkronisasi tim terjaga

## Berikutnya
- [ ] Pembersihan berkala tabel `RateLimit` (bulanan) via Supabase SQL Editor
- [ ] Evaluasi kebutuhan akun Cloudflare Workers Paid ($5/bln) jika trafik meningkat
- [ ] (Ditunda) Integrasi payment gateway otomatis (Midtrans) jika dibutuhkan Pokdarwis

## Tugas non-kode
- [x] Hubungkan domain Hostinger `jejakjetis.com` & `www.jejakjetis.com` ke Cloudflare Workers
- [x] Buat project Supabase (region Singapura); konfigurasi RLS dan kredensial Hyperdrive
- [x] Buat Hyperdrive id dan pasang di `wrangler.jsonc`
- [x] Buat Turnstile widget resmi dan whitelist domain
- [ ] Serah terima akun pengelola (Cloudflare, Supabase) ke Pokdarwis Jetis

## Ukuran bundle Worker (gzip)
- 2026-10-04 — Halaman kosong + proxy.ts: 2.203 KiB
- 2026-10-04 — Dengan Prisma (fast) + proxy.ts: 4.401 KiB; compiler small + proxy.ts: 3.695 KiB
- 2026-10-04 — Tanpa proxy.ts (resvg/yoga ikut hilang): 2.351 KiB
- 2026-10-04 — Final tahap ini (admin, Supabase SSR, SEO, headers): **2.547 KiB** (batas gratis 3 MiB; Paid 10 MiB)

## Keputusan penting
- 2026-10-03 — Prisma 7.10 + `@prisma/adapter-pg`; client di `src/generated/prisma`.
- 2026-10-03 — Kuota dikunci lewat baris SessionSlot (sesi+tanggal), upsert lalu FOR UPDATE; Booking.unitPrice snapshot; CHECK total = harga × peserta.
- 2026-10-04 — Semua validasi sebelum menulis SessionSlot (tidak ada slot sampah).
- 2026-10-04 — Penutupan tanggal/sesi: ClosedDate + SessionSlot.isClosed, diubah via Table Editor.
- 2026-10-04 — Target deploy: Cloudflare Workers + OpenNext (sempat ke Vercel, klien memilih Cloudflare). Paket gratis vs Paid menunggu klien.
- 2026-10-04 — DB runtime: binding Hyperdrive ke direct connection (5432); klien Prisma per request (React cache), `maxUses: 1`. Migrasi/seed via DIRECT_URL.
- 2026-10-04 — Prisma `compilerBuild = "small"` untuk menghemat bundle (tetap Prisma). `runtime = "cloudflare"` ditolak (membundel semua wasm).
- 2026-10-04 — next.config: `serverExternalPackages` Prisma + `outputFileTracingIncludes` pg-cloudflare (tanpa ini build gagal).
- 2026-10-04 — **proxy.ts dihapus**: di OpenNext, Node middleware dibundel terpisah beserta server Next (+±1,3 MiB, termasuk resvg/yoga). Proteksi admin tetap dua lapis: layout/halaman + setiap action. Konsekuensi: sesi Supabase tidak di-refresh otomatis di halaman; admin login ulang setelah token habis (sarankan JWT expiry 8 jam).
- 2026-10-04 — Rate limit: tabel Postgres `RateLimit` (berjalan di Workers via Hyperdrive), bukan binding (periode binding hanya 10/60 dtk). Produksi gagal tertutup; in-memory hanya lokal. IP dari `cf-connecting-ip`, disimpan sebagai hash.
- 2026-10-04 — Semua route dinamis (`connection()`): env/secret Workers hanya ada saat request.
- 2026-10-04 — Peta: iframe OpenStreetMap (0 KB JS, tanpa API key) + tautan Google Maps.
- 2026-10-04 — Gambar: `images.unoptimized`, file statis teroptimasi di /public (tanpa biaya Cloudflare Images). Sementara placeholder SVG kawung buatan sendiri; foto Framer tidak dipakai (lisensi tidak jelas).
- 2026-10-04 — Tanggal kunjungan dipilih dari daftar (select) Sabtu/Minggu berformat Indonesia, bukan `<input type=date>` (format bergantung browser, tidak bisa membatasi hari).
- 2026-10-04 — Halaman sukses membaca ringkasan dari sessionStorage pemesan, tidak dari DB (data pesanan tidak bisa dibuka lewat kode).
- 2026-10-04 — Token warna ditambah varian kontras AA: terracotta-text #96502F, terracotta-light #D08E6A, muted #76594B, field #8A6F60.
- 2026-10-04 — Midtrans ditunda; PAYMENT_MODE tetap manual.
- 2026-10-04 — Path desain: `Design/`.

## Menunggu dari klien / belum jelas
- Paket Cloudflare Workers: gratis (3 MiB, CPU 10 ms) atau Paid
- Jam setiap sesi (sementara 08–10, 10–12, 15–17)
- Batas 20 paket umum: per pesanan (asumsi) atau per sesi
- Kebijakan DP (sementara bayar penuh); nomor WA tujuan; syarat kupon
- Teks sejarah final + sumber; data 7 UMKM; FAQ final; foto; alamat lengkap & titik koordinat (sementara perkiraan -7.4478, 112.7183 — wajib dicek)

## Masalah diketahui
- Belum pernah terhubung ke DB sungguhan; test integrasi skip; `/` di preview 500 karena DB dummy.
- Embed peta OSM tampak kosong di screenshot headless (URL embed merespons 200); cek di browser nyata.
- CSP memakai `'unsafe-inline'` untuk script (skrip inline Next.js); nonce butuh middleware yang sengaja tidak dipakai.
- `RateLimit` perlu dibersihkan berkala (SQL di DEPLOY.md); belum ada cron.
- Folder proyek di ~/Documents sempat merusak node_modules/.next (file hilang, ENOTEMPTY); pertimbangkan pindah folder.
- `.dev.vars` lokal berisi nilai DUMMY untuk preview; ganti saat menguji dengan Supabase sungguhan.
