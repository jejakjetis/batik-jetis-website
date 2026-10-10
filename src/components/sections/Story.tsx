import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn } from "@/components/ui/AnimateIn";

// Section gelap. Dipisah dari Peta Wisata (perbaikan §5.2).
// TODO(konten): narasi & kutipan pengrajin hanya boleh diisi dari sumber asli (nama + izin).
export function Story() {
  return (
    <section aria-labelledby="kisah-title" className="bg-espresso">
      <div className="grid lg:grid-cols-2">
        <AnimateIn className="relative min-h-72 w-full lg:min-h-full">
          <Image
            src="/images/Batik1.webp"
            alt="Proses membatik tulis di Kampung Batik Jetis"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </AnimateIn>
        <Container className="py-16 lg:max-w-none lg:py-24 lg:pl-16 xl:pr-[max(2rem,calc((100vw-75rem)/2+2rem))]">
          <AnimateIn delay={150}>
            <SectionHeading id="kisah-title" eyebrow="Kisah Batik" title="Setiap Garis Ditarik dengan Canting" accent tone="dark">
              <p>
                Batik tulis dibuat dengan menorehkan malam panas memakai canting di atas kain, lalu diwarnai dan
                dilorod. Prosesnya bertahap dan membutuhkan ketelitian serta kesabaran.
              </p>
              <p className="mt-4">
                Saat berkunjung, Anda dapat menyaksikan langsung tahapan ini bersama para pengrajin Kampung Batik Jetis.
              </p>
            </SectionHeading>
          </AnimateIn>
        </Container>
      </div>
    </section>
  );
}
