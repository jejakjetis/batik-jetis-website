import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SuccessDetails } from "./SuccessDetails";

export const metadata: Metadata = {
  title: "Pesanan Terkirim — Kampung Batik Jetis",
  robots: { index: false, follow: false },
};

// Tidak membaca DB: ringkasan diambil dari sessionStorage browser pemesan sendiri,
// sehingga data pesanan tidak bisa dibuka orang lain lewat URL/kode.
export default async function SuccessPage({ searchParams }: PageProps<"/pesanan/terkirim">) {
  const kode = (await searchParams).kode;
  const code = typeof kode === "string" && /^[A-Z2-9]{8}$/.test(kode) ? kode : null;
  return (
    <section className="bg-sand py-20 lg:py-28">
      <Container className="max-w-3xl">
        <SuccessDetails code={code} />
      </Container>
    </section>
  );
}
