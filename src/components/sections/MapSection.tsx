//syntax client agar page menjadi interactive
"use client";

import { useState } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { SITE, googleMapsLink, googleMapsEmbedUrl } from "@/lib/site";

// Embed OpenStreetMap via iframe: 0 KB JavaScript di bundle, tanpa API key.
// CSP: frame-src https://www.openstreetmap.org.
export function MapSection() {
  const { lat, lng } = SITE.map;
    // State untuk mengingat tab: nilai awal adalah "denah"
  const [activeTab, setActiveTab] = useState<"google" | "denah">("google");
  return (
    <section id="peta" aria-labelledby="peta-title" className="bg-sand py-20 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-16">
        <AnimateIn>
          <div>
            <SectionHeading id="peta-title" eyebrow="Lokasi" title="Peta Wisata" accent>
              <p>Kampung Batik Jetis berada di tengah Kota Sidoarjo dan mudah dijangkau dari pusat kota.</p>
            </SectionHeading>
            <address className="mt-6 not-italic leading-relaxed text-ink/85">
              {SITE.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <div className="mt-6">
              <ButtonLink href={googleMapsLink(lat, lng)} variant="outline" external>
                Buka di Google Maps
              </ButtonLink>
            </div>
          </div>
        </AnimateIn>
        <AnimateIn delay={150}>
          <div className="flex flex-col gap-3">
{/* Tombol Pengalih Tab (Kiri = Google Maps, Kanan = Denah) */}
<div className="relative grid w-full grid-cols-2 rounded-md border border-line bg-cream p-1">
  {/* 1. Balok Background Geser */}
  <div
    aria-hidden="true"
    className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-sm bg-terracotta shadow-xs transition-transform duration-300 ease-in-out ${
      activeTab === "google" ? "translate-x-0" : "translate-x-full"
    }`}
  />

  {/* 2. Tombol Kiri: Google Maps (Default Aktif) */}
  <button
    type="button"
    onClick={() => setActiveTab("google")}
    className={`relative z-10 w-full rounded-sm py-2.5 text-center text-sm font-medium transition-colors duration-300 ${
      activeTab === "google" ? "text-cream" : "text-muted hover:text-ink"
    }`}
  >
    Navigasi Google Maps
  </button>

  {/* 3. Tombol Kanan: Denah Kawasan Wisata */}
  <button
    type="button"
    onClick={() => setActiveTab("denah")}
    className={`relative z-10 w-full rounded-sm py-2.5 text-center text-sm font-medium transition-colors duration-300 ${
      activeTab === "denah" ? "text-cream" : "text-muted hover:text-ink"
    }`}
  >
    Denah Kawasan Wisata
  </button>
</div>
  {/* 2. Konten Peta Bersyarat (Ternary Operator) */}
  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-line bg-cream">
    {activeTab === "denah" ? (
      <Image
        src="/images/Peta_Wisata.webp"
        alt="Denah Kawasan Wisata Kampung Batik Jetis"
        fill
        className="object-contain p-2"
        sizes="(min-width: 1024px) 60vw, 100vw"
      />
    ) : (
      <iframe
        title="Peta lokasi Kampung Batik Jetis, Sidoarjo"
        src={googleMapsEmbedUrl(lat, lng)}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    )}
  </div>
  {/* 3. Link Aksi Pendukung */}
  <div className="flex items-center justify-between text-xs text-muted">
    {activeTab === "denah" ? (
      <>
        <span>Gunakan denah ini untuk memandu rute di dalam kampung</span>
        <a
          href="/images/Peta_Wisata.webp"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-terracotta-text underline hover:text-terracotta"
        >
          Lihat Ukuran Penuh ↗
        </a>
      </>
    ) : (
      <>
        <span>Petunjuk arah perjalanan menuju lokasi</span>
        <a
          href={googleMapsLink(lat, lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-terracotta-text underline hover:text-terracotta"
        >
          Buka di Aplikasi Google Maps ↗
                </a>
              </>
            )}
          </div>
        </div>
      </AnimateIn>
      </Container>
    </section>
  );
}
