import { connection } from "next/server";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getContactWhatsapp } from "@/lib/public-config";

export default async function NotFound() {
  await connection(); // dirender saat request: env runtime (Workers) tidak ada saat build
  return (
    <>
      <Navbar />
      <main id="konten" className="bg-sand py-24 lg:py-32">
        <Container className="max-w-2xl">
          <Eyebrow>404</Eyebrow>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-ink">Halaman tidak ditemukan</h1>
          <p className="mt-5 text-lg text-ink/85">Halaman yang Anda cari tidak ada atau sudah dipindahkan.</p>
          <div className="mt-8">
            <ButtonLink href="/" size="lg">
              Kembali ke Beranda
            </ButtonLink>
          </div>
        </Container>
      </main>
      <Footer whatsapp={getContactWhatsapp()} />
    </>
  );
}
