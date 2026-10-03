import "server-only";
import { redirect } from "next/navigation";
import { getServerEnv } from "@/lib/env";
import { type AdminIdentity, authorizeAdmin } from "./authorize";
import { createSupabaseServerClient } from "./supabase";

/** Identitas admin dari sesi saat ini, atau null. getUser() memverifikasi token ke server Supabase. */
export async function getAdmin(): Promise<AdminIdentity | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    return authorizeAdmin(data.user, getServerEnv().ADMIN_EMAILS);
  } catch {
    return null;
  }
}

/** Untuk layout/halaman admin: arahkan ke login bila bukan admin. */
export async function requireAdminPage(): Promise<AdminIdentity> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Tidak diizinkan");
  }
}

/** Untuk setiap Server Action admin: lempar error bila bukan admin (jangan hanya andalkan layout). */
export async function requireAdminAction(): Promise<AdminIdentity> {
  const admin = await getAdmin();
  if (!admin) throw new UnauthorizedError();
  return admin;
}
