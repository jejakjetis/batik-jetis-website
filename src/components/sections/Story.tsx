import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Section gelap. Dipisah dari Peta Wisata (perbaikan §5.2).
// TODO(konten): narasi & kutipan pengrajin hanya boleh diisi dari sumber asli (nama + izin).
export function Story() {
  return (
    <section aria-labelledby="kisah-title" className="bg-espresso">
      <div className="grid lg:grid-cols-2">
        <div
          role="img"
          aria-label="Motif batik kawung (ilustrasi)"
          className="min-h-64 bg-[url(/images/kawung-dark.svg)] bg-[length:120px] bg-repeat lg:min-h-[560px]"
        />
        <Container className="py-16 lg:max-w-none lg:py-24 lg:pl-16 xl:pr-[max(2rem,calc((100vw-75rem)/2+2rem))]">
          <SectionHeading id="kisah-title" eyebrow="Kisah Batik" title="Setiap Garis Ditarik dengan Canting" accent tone="dark">
            <p>
              Batik tulis dibuat dengan menorehkan malam panas memakai canting di atas kain, lalu diwarnai dan
              dilorod. Prosesnya bertahap dan membutuhkan ketelitian serta kesabaran.
            </p>
            <p className="mt-4">
              Saat berkunjung, Anda dapat menyaksikan langsung tahapan ini bersama para pengrajin Kampung Batik Jetis.
            </p>
          </SectionHeading>
        </Container>
      </div>
    </section>
  );
}
