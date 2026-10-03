import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

// TODO(klien): foto hero asli (proses membatik). Sementara motif kawung + overlay gelap.
export function Hero() {
  return (
    <section
      id="beranda"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-espresso bg-[url(/images/kawung-dark.svg)] bg-repeat"
    >
      {/* Overlay gelap agar eyebrow & teks terbaca (perbaikan wajib §5.2) */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/40" />
      <Container className="flex min-h-[min(calc(100svh-4rem),760px)] flex-col justify-center py-20">
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
          Kunjungi Kampung Batik Jetis di Sidoarjo — lihat langsung pengrajin membatik tulis, berkeliling kampung,
          dan temukan karya UMKM lokal.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <ButtonLink href="/#pemesanan" size="lg">
            Pesan Tiket
          </ButtonLink>
          <ButtonLink href="/#kegiatan" variant="outline-light" size="lg">
            Jelajahi Wisata
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
