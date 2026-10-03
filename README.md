# Website Kampung Batik Jetis, Sidoarjo

Website wisata satu halaman dengan pemesanan tiket kunjungan (Sabtu/Minggu, kuota per sesi) dan panel admin untuk mengelola status pesanan. Pembayaran QRIS dikonfirmasi manual via WhatsApp; website tidak memproses pembayaran.

## Stack
Next.js 16 (App Router) + TypeScript strict · Tailwind CSS v4 · PostgreSQL (Supabase) via Prisma 7 (driver adapter `@prisma/adapter-pg`) · Supabase Auth (`@supabase/ssr`, khusus admin) · Zod 4 · Vitest · Deploy **Vercel** (region `sin1`), DB runtime lewat **pooler Supabase transaction mode (6543)** · Zona waktu bisnis Asia/Jakarta (WIB).

> Catatan Next.js 16: API berbeda dari versi lama. Baca dokumentasi di `node_modules/next/dist/docs/` sebelum menulis kode. Aturan proyek ada di `CLAUDE.md`.

## Menjalankan lokal
```bash
npm install                 # juga menjalankan prisma generate
cp .env.example .env        # dibaca prisma CLI, seed, test integrasi
cp .env.example .env.local  # dibaca Next.js (isi sama)
npm run db:deploy && npm run db:seed
npm run dev
```
Turnstile lokal memakai test key Cloudflare: site key `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA` (selalu lolos).

## Environment variables (nilai tidak pernah di-commit)
| Nama | Fungsi |
|---|---|
| `DATABASE_URL` | Runtime: pooler Supabase **transaction mode, port 6543**. Server only. |
| `DIRECT_URL` | Migrasi/seed: koneksi langsung port 5432. Server only, tidak perlu di Vercel runtime. |
| `SUPABASE_URL` | URL proyek Supabase (Auth admin). |
| `SUPABASE_ANON_KEY` | Anon key Supabase (aman karena RLS + REVOKE). |
| `ADMIN_EMAILS` | Allowlist email admin, dipisah koma. |
| `BOOKING_WHATSAPP_NUMBER` | Nomor WA pengelola, format `62…`. |
| `SITE_URL` | URL kanonis situs. |
| `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile form pemesanan. |

Divalidasi Zod di `src/lib/env.ts`; `src/instrumentation.ts` memanggilnya saat server start sehingga server gagal start bila env wajib kosong (pesan hanya menyebut nama variabel). Build tidak butuh env.

## Perintah
| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server dev |
| `npm run build` | `prisma generate` + build produksi |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest |
| `npm run db:generate` | Generate Prisma Client ke `src/generated/prisma` |
| `npm run db:migrate` | Buat/terapkan migrasi (dev) |
| `npm run db:deploy` | Terapkan migrasi (produksi) |
| `npm run db:seed` | Seed paket & sesi |

## Peta struktur
```
CLAUDE.md                     aturan proyek untuk AI agent (wajib dibaca)
progres.md                    status pekerjaan + ukuran bundle per fase
Design/                       screenshot desain Framer
Archive.zip                   arsip aset dari klien (belum dibuka)
vercel.json                   region fungsi sin1 (cron ditambahkan bersama Midtrans)
next.config.ts                konfigurasi Next (security headers menyusul)
src/instrumentation.ts        validasi env saat server start
prisma.config.ts              Prisma 7: schema, migrasi, seed, DIRECT_URL
prisma/schema.prisma          skema database
prisma/migrations/            0001_init (tabel, CHECK, RLS), 0002 (penutupan, RLS _prisma_migrations, REVOKE), 0003 (RateLimit)
prisma/seed.ts                seed paket & sesi (idempoten)
src/proxy.ts                  proxy Next 16 (sementara uji; nanti redirect kenyamanan /admin)
src/app/actions/booking.ts    server action submitBooking (rate limit, honeypot, Turnstile, Zod, service, URL WA)
src/lib/env.ts                validasi env runtime (server-only, lazy)
src/server/booking/config.ts  konstanta aturan (H-3, 60 hari, Sabtu/Minggu, jam tutup)
src/server/booking/rules.ts   aturan tanggal WIB, sesi, peserta, harga, kuota (murni, ber-test)
src/server/booking/input.ts   skema Zod input pesanan (.strict) + normalisasi WA
src/server/db/client.ts       getDb()/createPrismaClient(): Prisma + adapter-pg via pooler (server-only)
src/server/db/bookings.ts     createBooking(): validasi -> transaksi upsert slot + FOR UPDATE + kuota + insert
src/server/db/rate-limit.ts   rate limit fixed-window di tabel RateLimit (UPSERT atomik)
src/server/booking/code.ts    kode pesanan 8 karakter CSPRNG
src/server/booking/whatsapp.ts format rupiah/tanggal Indonesia, pesan & URL WA
src/server/security/          turnstile.ts (verifikasi server), rate-limit.ts (DB; in-memory hanya lokal)
src/generated/prisma/         Prisma Client hasil generate (di-gitignore)
test/integration/             test konkurensi kuota lewat pooler DATABASE_URL (skip bila kosong)
vitest.config.ts              alias @ dan stub server-only
```

## Route
Halaman belum ada. Server action: `submitBooking` (src/app/actions/booking.ts). Rencana: `/`, halaman sukses, `/admin/**` (`noindex`).

## Skema database
| Model | Isi |
|---|---|
| `Package` | Paket wisata: slug, nama, `pricePerPerson` (int rupiah), durasi menit, min/max peserta per pesanan, fasilitas (array), aktif, urutan. |
| `Session` | Template sesi harian: label, `startTime`/`endTime` ("HH:mm" WIB), `quota` (default 30), aktif. Berlaku tiap Sabtu/Minggu. |
| `SessionSlot` | Satu baris per (sesi, tanggal) — unik. Dipakai sebagai baris yang dikunci `FOR UPDATE` saat membuat pesanan. |
| `Booking` | Pesanan: `code` acak 8 karakter (unik), paket, sesi, `visitDate` (DATE), jumlah peserta, `unitPrice` snapshot & `totalPrice` (int, CHECK total = harga × peserta), nama, email, WA `62…`, instansi (opsional), catatan, `status`. |
| `BookingStatusLog` | Audit perubahan status: dari, ke, email admin, waktu. |
| `Umkm` | Usaha lokal: nama, produk, kisaran harga, WA, deskripsi, foto, aktif. |
| `Faq` | Pertanyaan, jawaban, urutan, aktif. |
| `ClosedDate` | Tanggal tutup penuh (semua sesi). |
| `RateLimit` | Penghitung rate limit per (key hash, jendela waktu). |

**Menutup tanggal/sesi (tahap 1, lewat Supabase Table Editor):**
- Tutup satu hari penuh: tambah baris di `ClosedDate` (`id` isi teks unik apa saja, `date`, `reason`).
- Tutup satu sesi di tanggal tertentu: cari/tambah baris `SessionSlot` (`sessionId`, `visitDate`) lalu set `isClosed = true`.
- Nonaktifkan sesi untuk semua tanggal: `Session.isActive = false`.

Enum `BookingStatus`: `MENUNGGU` → `DIKONFIRMASI` → `LUNAS` → `SELESAI`, atau `BATAL`.

**Pooler & penguncian:** adapter-pg tidak memakai prepared statement bernama, sehingga kompatibel dengan Supavisor transaction mode; transaksi `FOR UPDATE` berjalan di satu koneksi server selama BEGIN..COMMIT.

**Keamanan DB:** RLS aktif di semua tabel (termasuk `_prisma_migrations`) tanpa policy, dan semua hak `anon`/`authenticated` di schema `public` dicabut (termasuk default privileges). Anon key tidak bisa membaca/menulis lewat API Supabase. Semua akses lewat Prisma di server.

## Alur pemesanan
1. Pengunjung memilih paket, tanggal, sesi, jumlah peserta, isi data diri (+ Turnstile, honeypot `website`).
2. `submitBooking`: rate limit per IP (5/10 menit, tabel `RateLimit`) → honeypot → verifikasi Turnstile di server → Zod `.strict()`.
3. `createBooking` — **semua validasi sebelum menulis apa pun**: paket aktif, Sabtu/Minggu, H-3 s.d. 60 hari (WIB), bukan `ClosedDate`, sesi aktif & tidak beririsan jam tutup 12–15, slot tidak `isClosed`, batas peserta paket; harga dari DB.
4. Transaksi: `INSERT SessionSlot … ON CONFLICT DO NOTHING` → `SELECT … FOR UPDATE` → jumlahkan peserta non-`BATAL` → tolak bila > kuota → insert `Booking` (`MENUNGGU`, kode CSPRNG).
5. Kembalikan URL `wa.me` (pesan di-`encodeURIComponent`) berisi ringkasan + kode.
6. Admin mengubah status; setiap perubahan dicatat di `BookingStatusLog` (belum dibuat).
