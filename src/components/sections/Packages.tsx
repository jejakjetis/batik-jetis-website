import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn } from "@/components/ui/AnimateIn";
import type { PublicPackage } from "@/server/db/types";
import { formatRupiah } from "@/server/booking/whatsapp";

function formatDuration(minutes: number): string {
  const h = minutes / 60;
  return `±${Number.isInteger(h) ? h : h.toLocaleString("id-ID")} jam`;
}

export function Packages({ packages }: { packages: PublicPackage[] }) {
  return (
    <section id="kegiatan" aria-labelledby="kegiatan-title" className="bg-sand py-20 lg:py-28">
      <Container>
        <AnimateIn>
          <SectionHeading id="kegiatan-title" eyebrow="Paket Wisata" title="Kegiatan Wisata" />
        </AnimateIn>
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {packages.map((p, idx) => (
            <AnimateIn key={p.id} delay={idx * 150}>
              <li className="grid gap-6 py-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-10">
              <div className="relative aspect-[7/5] w-full overflow-hidden rounded-sm border border-line">
                <Image
                  src={p.slug === "pelajar" ? "/images/Paket_Siswa.webp" : "/images/Paket_Umum.webp"}
                  alt={`Foto kegiatan ${p.name}`}
                  fill
                  className="object-cover object-[center_5%] transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(min-width: 768px) 320px, 100vw"
                />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-semibold text-ink">{p.name}</h3>

                {p.description && <p className="mt-3 text-lg leading-relaxed text-ink/85">{p.description}</p>}
                <ul className="mt-4 grid gap-1.5 text-ink/85 sm:grid-cols-2">
                  {p.facilities.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <p className="font-serif text-3xl font-semibold text-ink">
                    {formatRupiah(p.pricePerPerson)}
                    <span className="font-sans text-base font-normal text-muted"> / orang</span>
                  </p>
                  <p className="text-sm tracking-wide text-muted">
                    {formatDuration(p.durationMinutes)} · {p.minParticipants}–{p.maxParticipants} orang per pesanan
                  </p>
                </div>
                <div className="mt-6">
                  <ButtonLink href={`/?paket=${p.slug}#pemesanan`} variant="secondary">
                    Pesan {p.name.split(" (")[0]}
                  </ButtonLink>
                </div>
              </div>
            </li>
          </AnimateIn>
        ))}
        </ul>
      </Container>
    </section>
  );
}
