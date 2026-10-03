import "server-only";

// Nilai runtime yang boleh dikirim ke klien. Di luar produksi ada fallback agar UI bisa
// dikembangkan tanpa .env; di produksi wajib diisi (getServerEnv memvalidasi saat start).
const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA"; // test key resmi Cloudflare, selalu lolos

export function getTurnstileSiteKey(): string {
  const v = process.env.TURNSTILE_SITE_KEY;
  if (v) return v;
  if (process.env.NODE_ENV === "production") throw new Error("TURNSTILE_SITE_KEY belum diisi");
  return TURNSTILE_TEST_SITE_KEY;
}

/** Nomor WA pengelola (62…) untuk ditampilkan di footer; null jika belum diisi (non-produksi). */
export function getContactWhatsapp(): string | null {
  const v = process.env.BOOKING_WHATSAPP_NUMBER;
  if (v && /^62\d{8,13}$/.test(v)) return v;
  if (process.env.NODE_ENV === "production") throw new Error("BOOKING_WHATSAPP_NUMBER belum diisi");
  return null;
}

export function formatPhoneId(phone62: string): string {
  // 6281234567890 -> +62 812-3456-7890
  const rest = phone62.slice(2);
  return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
}
