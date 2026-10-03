// Dipanggil sekali saat server Next.js start: gagal start jika env wajib tidak ada.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getServerEnv } = await import("@/lib/env");
    getServerEnv();
  }
}
