// Logika otorisasi admin yang murni (tanpa I/O) agar bisa diuji.

export type AuthUser = { id: string; email?: string | null } | null;

export type AdminIdentity = { id: string; email: string };

/** Lolos hanya jika ada sesi valid DAN email ada di allowlist (case-insensitive). */
export function authorizeAdmin(user: AuthUser, allowlist: readonly string[]): AdminIdentity | null {
  if (!user?.email) return null;
  const email = user.email.trim().toLowerCase();
  return allowlist.includes(email) ? { id: user.id, email } : null;
}
