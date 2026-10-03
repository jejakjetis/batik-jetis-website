import { logout } from "@/app/actions/admin";
import { requireAdminPage } from "@/server/auth/admin";

// Lapis pertama: cek sesi + allowlist untuk semua halaman panel admin.
// Lapis kedua ada di setiap Server Action admin (requireAdminAction).
export default async function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdminPage();
  return (
    <>
      <header className="border-b border-line bg-cream">
        <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <p className="font-serif text-xl font-semibold">Admin Kampung Batik Jetis</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted">{admin.email}</span>
            <form action={logout}>
              <button type="submit" className="font-semibold text-terracotta-text underline-offset-4 hover:underline">
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-site px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </>
  );
}
