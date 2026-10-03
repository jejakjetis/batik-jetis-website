import { Container } from "@/components/ui/Container";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Perbaikan §5.2: paragraf tidak dobel; foto sejajar margin grid (di dalam Container).
// TODO(konten): teks sejarah final + sumber dari pengelola. Jangan menambahkan tahun/tokoh tanpa sumber.
export function About() {
  return (
    <section id="tentang" aria-labelledby="tentang-title" className="bg-cream py-20 lg:py-28">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <PhotoPlaceholder label="Foto gerbang Kampung Batik Jetis (menyusul)" className="aspect-[4/3] w-full rounded-sm" />
        <SectionHeading id="tentang-title" eyebrow="Tentang Kami" title="Kampung Batik Jetis, Sidoarjo." accent>
          <p>
            Kampung Batik Jetis adalah kampung pengrajin batik tulis di Kota Sidoarjo. Di gang-gangnya, rumah warga
            sekaligus menjadi bengkel batik dan toko, tempat pengunjung bisa melihat proses membatik dari dekat.
          </p>
          <p className="mt-4 text-base text-muted">
            {/* TODO(konten) */}
            Kisah sejarah kampung akan dilengkapi setelah naskah resmi dari pengelola tersedia.
          </p>
        </SectionHeading>
      </Container>
    </section>
  );
}
