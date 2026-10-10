import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClasses } from "@/components/ui/Button";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { AnimateIn } from "@/components/ui/AnimateIn";
import type { PublicUmkm } from "@/server/db/types";
import { formatRupiah } from "@/server/booking/whatsapp";

export function Umkm({ items }: { items: PublicUmkm[] }) {
  return (
    <section id="umkm" aria-labelledby="umkm-title" className="bg-sand py-20 lg:py-28">
      <Container>
        <AnimateIn>
          <SectionHeading id="umkm-title" eyebrow="Usaha Lokal" title="UMKM Kampung Batik Jetis">
            <p>Belanja langsung dari pengrajin dan pelaku usaha di kampung.</p>
          </SectionHeading>
        </AnimateIn>

        <AnimateIn delay={150}>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {items.map((u) => {
            const wa = u.whatsapp
              ? `https://wa.me/${u.whatsapp}?text=${encodeURIComponent(`Halo ${u.name}, saya melihat usaha Anda di website Kampung Batik Jetis.`)}`
              : null;

            return (
              <li key={u.id} className="flex flex-col overflow-hidden rounded-sm border border-line bg-cream">
                {/* Foto Toko */}
                <div className="relative w-full aspect-[16/9]">
                  {u.imageUrl ? (
                    <Image
                      src={u.imageUrl}
                      alt={`Foto toko ${u.name}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <PhotoPlaceholder
                      label={`Foto toko ${u.name} (menyusul)`}
                      className="h-full w-full"
                    />
                  )}
                  {/* Badge Kode Peta */}
                  {u.mapCode && (
                    <span className="absolute top-3 right-3 rounded bg-espresso/90 px-2.5 py-1 text-xs font-semibold tracking-widest text-cream">
                      {u.mapCode}
                    </span>
                  )}
                </div>

                {/* Konten Kartu */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-2xl font-semibold text-ink">{u.name}</h3>

                  {/* List Produk */}
                  <ul className="mt-3 space-y-1">
                    {u.products.map((prod) => (
                      <li key={prod} className="flex items-start gap-2 text-sm text-ink/80">
                        <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                        {prod}
                      </li>
                    ))}
                  </ul>

                  {/* Estimasi Harga & Kupon */}
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4">
                    <p className="text-sm text-muted">
                      Estimasi harga:{" "}
                      <span className="font-semibold text-ink">{u.price ?? "menyusul"}</span>
                    </p>
                    {u.discountCoupon != null && (
                      <p className="text-sm text-muted">
                        Kupon diskon:{" "}
                        <span className="font-semibold text-terracotta-text">
                          {formatRupiah(u.discountCoupon)}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Tombol WA (hanya tampil jika kontak ada) */}
                  {wa && (
                    <div className="mt-auto pt-5">
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonClasses("outline", "md", "w-full")}
                      >
                        Hubungi via WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </AnimateIn>
      </Container>
    </section>
  );
}

