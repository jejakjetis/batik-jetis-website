import { connection } from "next/server";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { getContactWhatsapp } from "@/lib/public-config";

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  await connection(); // env runtime Workers hanya tersedia saat request, bukan saat build
  return (
    <>
      <Navbar />
      <main id="konten">{children}</main>
      <Footer whatsapp={getContactWhatsapp()} />
    </>
  );
}
