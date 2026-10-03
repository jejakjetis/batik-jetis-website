import { BookingForm } from "@/components/booking/BookingForm";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { DateOption } from "@/server/booking/dates";
import type { PublicPackage } from "@/server/db/types";

export function Booking({
  packages,
  dates,
  siteKey,
  defaultPackageSlug,
}: {
  packages: PublicPackage[];
  dates: DateOption[];
  siteKey: string;
  defaultPackageSlug?: string;
}) {
  return (
    <section id="pemesanan" aria-labelledby="pemesanan-title" className="bg-sand py-20 lg:py-28">
      <Container>
        <SectionHeading id="pemesanan-title" eyebrow="Pemesanan" title="Pesan Kunjungan Anda">
          <p>
            Isi formulir di bawah. Setelah terkirim, Anda akan mendapat kode pesanan dan diarahkan ke WhatsApp
            pengelola untuk konfirmasi dan pembayaran QRIS.
          </p>
        </SectionHeading>
        <div className="mt-12">
          <BookingForm key={defaultPackageSlug ?? "default"} packages={packages} dates={dates} siteKey={siteKey} defaultPackageSlug={defaultPackageSlug} />
        </div>
      </Container>
    </section>
  );
}
