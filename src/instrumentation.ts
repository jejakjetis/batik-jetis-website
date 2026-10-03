// Dipanggil sekali saat server start. Di produksi: gagal start jika env wajib tidak ada.
// Di pengembangan: env divalidasi saat pertama dipakai, agar UI bisa dikerjakan tanpa .env.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NODE_ENV === "production") {
    const { getServerEnv } = await import("@/lib/env");
    getServerEnv();
  }
}
