"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";

const HERO_SLIDES = [
  {
    src: "/images/hero-section.png",
    alt: "Suasana Kampung Batik Jetis Sidoarjo",
  },
  {
    src: "/images/jetis_batik_textiles_1784011646807.jpg",
    alt: "Kain Batik Tulis Tradisional Jetis",
  },
  {
    src: "/images/jetis_motif_flora_1786716303715.jpg",
    alt: "Motif Batik Flora Khas Jetis",
  },
  {
    src: "/images/jetis_motif_maritim_1786716329628.jpg",
    alt: "Motif Batik Maritim Khas Jetis",
  },
  {
    src: "/images/jetis_motif_merak_1786716289157.jpg",
    alt: "Motif Batik Merak Khas Jetis",
  },
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    resetTimer();
  };

  return (
    <section
      id="beranda"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-espresso"
    >
      {/* 1. Carousel Background Foto dengan Animasi Geser & Fade */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          const isBefore =
            (idx < currentIndex && !(currentIndex === HERO_SLIDES.length - 1 && idx === 0)) ||
            (currentIndex === 0 && idx === HERO_SLIDES.length - 1);

          return (
            <div
              key={slide.src}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                isActive
                  ? "opacity-100 translate-x-0 scale-100 z-10"
                  : isBefore
                  ? "opacity-0 -translate-x-12 scale-105 z-0 pointer-events-none"
                  : "opacity-0 translate-x-12 scale-105 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={idx === 0}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          );
        })}
      </div>

      {/* 2. Lapisan Overlay Gelap untuk Menjaga Kontras Teks */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/45"
      />

      {/* 3. Tombol Manual Sudut Kanan (Tanda '>') Ber-opacity Rendah */}
      <button
        type="button"
        onClick={handleNext}
        aria-label="Geser ke gambar berikutnya"
        className="group absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-ink/30 text-cream backdrop-blur-xs transition-all duration-300 opacity-40 hover:opacity-100 hover:bg-ink/65 hover:scale-110 active:scale-95 focus-visible:opacity-100"
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6 stroke-current transition-transform duration-200 group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* 4. Indikator Slide Halus di Sudut Bawah Kanan */}
      <div className="absolute bottom-6 right-6 sm:right-8 z-30 flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setCurrentIndex(idx);
              resetTimer();
            }}
            aria-label={`Pindah ke slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-6 bg-terracotta-light"
                : "w-2 bg-cream/40 hover:bg-cream/70"
            }`}
          />
        ))}
      </div>

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