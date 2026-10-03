import { About } from "@/components/sections/About";
import { Booking } from "@/components/sections/Booking";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { MapSection } from "@/components/sections/MapSection";
import { Packages } from "@/components/sections/Packages";
import { Story } from "@/components/sections/Story";
import { Umkm } from "@/components/sections/Umkm";
import { getTurnstileSiteKey } from "@/lib/public-config";
import { bookableDates, bookingWindow } from "@/server/booking/dates";
import { getClosedDates, getFaqs, getPackages, getUmkm } from "@/server/db/public";

// Dinamis: daftar tanggal bergantung pada hari ini (WIB) dan tanggal tutup di DB.
export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const now = new Date();
  const { from, to } = bookingWindow(now);
  const [packages, umkm, faqs, closed] = await Promise.all([getPackages(), getUmkm(), getFaqs(), getClosedDates(from, to)]);
  const paket = (await searchParams).paket;

  return (
    <>
      <Hero />
      <About />
      <Packages packages={packages} />
      <Story />
      <MapSection />
      <Umkm items={umkm} />
      <Booking
        packages={packages}
        dates={bookableDates(now, closed)}
        siteKey={getTurnstileSiteKey()}
        defaultPackageSlug={typeof paket === "string" ? paket : undefined}
      />
      <Faq items={faqs} />
    </>
  );
}
