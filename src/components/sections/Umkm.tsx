import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClasses } from "@/components/ui/Button";
import type { PublicUmkm } from "@/server/db/types";
import { formatRupiah } from "@/server/booking/whatsapp";

function priceRange(u: PublicUmkm): string | null {
  if (u.priceMin != null && u.priceMax != null) return `${formatRupiah(u.priceMin)} – ${formatRupiah(u.priceMax)}`;
  if (u.priceMin != null) return `Mulai ${formatRupiah(u.priceMin)}`;
  return null;
}

// Kartu usaha (perbaikan §5.2: bukan sekadar galeri): nama, produk, kisaran harga, tombol WA.
export function Umkm({ items }: { items: PublicUmkm[] }) {
  return (
    <section id="umkm" aria-labelledby="umkm-title" className="bg-cream py-20 lg:py-28">
      <Container>
        <SectionHeading id="umkm-title" eyebrow="Usaha Lokal" title="UMKM Kampung Batik Jetis">
          <p>Belanja langsung dari pengrajin dan pelaku usaha di kampung.</p>
        </SectionHeading>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((u) => {
            const price = priceRange(u);
            const wa = u.whatsapp
              ? `https://wa.me/${u.whatsapp}?text=${encodeURIComponent(`Halo ${u.name}, saya melihat usaha Anda di website Kampung Batik Jetis.`)}`
              : null;
            return (
              <li key={u.id} className="flex flex-col rounded-sm border border-line bg-sand p-6">
                <h3 className="font-serif text-2xl font-semibold text-ink">{u.name}</h3>
                <p className="mt-1 text-ink/85">{u.products}</p>
                {u.description && <p className="mt-3 text-sm leading-relaxed text-muted">{u.description}</p>}
                <p className="mt-4 text-sm text-muted">
                  Kisaran harga: <span className="font-semibold text-ink">{price ?? "menyusul"}</span>
                </p>
                <div className="mt-auto pt-5">
                  {wa ? (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline", "md", "w-full")}>
                      Hubungi via WhatsApp
                    </a>
                  ) : (
                    <p className="text-sm text-muted">Kontak menyusul</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
