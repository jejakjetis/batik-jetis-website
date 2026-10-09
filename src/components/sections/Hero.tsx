import Image from "next/image"; // <-- 1. Tambahkan import Image
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function Hero() {
  return (
    <section
      id="beranda"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-espresso"
    >
      {/* 2. Gambar Background Foto */}
      <Image
        src="/images/hero-section.png"
        alt="Latar belakang Kampung Batik Jetis"
        fill
        priority
        className="-z-20 object-cover"
      />

      {/* 3. Lapisan Overlay Gelap */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/40"
      />

      <Container className="flex min-h-[min(calc(100svh-4rem),760px)] flex-col justify-center py-20">
        <AnimateIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terracotta-light sm:text-sm">
            Wisata Edukasi Batik · Sidoarjo
          </p>
          <h1
            id="hero-title"
            className="mt-5 max-w-3xl font-serif text-5xl leading-[1.05] font-semibold text-cream sm:text-6xl lg:text-7xl"
          >
            Di Sini, Batik Masih Ditulis dengan Tangan.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/90">
            Kunjungi Kampung Batik Jetis, temui pengrajin, dan kenali warisan batik yang telah berkembang sejak 1675.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <ButtonLink href="/#pemesanan" size="lg">
              Pesan Tiket
            </ButtonLink>
            <ButtonLink href="/#kegiatan" variant="outline-light" size="lg">
              Jelajahi Wisata
            </ButtonLink>
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}