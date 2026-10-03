import { redirect } from "next/navigation";
import { getAdmin } from "@/server/auth/admin";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-serif text-4xl font-semibold">Masuk Admin</h1>
      <p className="mt-2 text-muted">Khusus pengelola Kampung Batik Jetis.</p>
      <LoginForm />
    </main>
  );
}
