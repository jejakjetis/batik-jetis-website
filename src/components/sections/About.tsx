import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn } from "@/components/ui/AnimateIn";

// Perbaikan §5.2: paragraf tidak dobel; foto sejajar margin grid (di dalam Container).
// TODO(konten): teks sejarah final + sumber dari pengelola. Jangan menambahkan tahun/tokoh tanpa sumber.
export function About() {
  return (
    <section id="tentang" aria-labelledby="tentang-title" className="bg-cream pt-20 lg:pt-28">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-4">
        <AnimateIn>
          <div className="relative aspect-[4/3] w-fill overflow-hidden rounded-sm border border-line">
            <Image
              src="/images/gapura_kampung_batik_jetis.webp"
              alt="Gapura Kampung Batik Jetis" fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </AnimateIn>
        <AnimateIn delay={150}>
          <SectionHeading id="tentang-title" eyebrow="Tentang Kami" title="Kampung Batik Jetis, Sidoarjo." accent>
            <p className="text-justify">
              Kampung Jetis merupakan kampung tua pengrajin batik yang telah ada sejak 1675 setelah masjid Jami dibangun (sekarang bernama Al-Abror).
              Tradisi membatik di kampung Jetis sendiri pertama kali dikenalkan oleh seorang pendatang yang mengaku sebagai keturunan dari raja Kediri
              yang dikejar oleh Belanda bernama Mulyadi. Warga sekitar mengenalnya dengan nama mbah Mulyadi atas kebaikannya dan dan tanda hormat atas
              ketaatannya terhadap agama. Pada masa itu, mbah Mulyadi melakukan pendekatan dengan warga sekitar dengan berbagai seperti mengajak sholat
              berjama’ah, membaca Al-Qur’an, serta mengajarkan cara membatik.
            </p>
          </SectionHeading>
        </AnimateIn>
        <AnimateIn delay={300} className="lg:col-span-2">
          <p className="text-justify text-lg leading-relaxed text-ink/85">
            Keahlian membatik yang diajarkan mbah Mulyadi menjadi cikal bakal
            awal mula kampung Jetis menjadi kampung batik. Seiring berjalannya waktu,
            kawasan kampung Jetis menjadi semakin ramai dan perdagangan di kawasan ini
            sempat menjadi ramai serta banyak dikunjungi para pedagang dari luar
            daerah terutama dari Madura. Di kemudian waktu, batik Jetis sempat mengalami
            mati suri karena tidak ada generasi yang mau melanjutkan perkembangan usaha tersebut.
          </p>
        </AnimateIn>
        <AnimateIn delay={300} className="lg:col-span-2">
          <p className="text-justify text-lg leading-relaxed text-ink/85">
            Di tahun 1950-an, batik Jetis mulai hidup kembali dengan munculnya sebuah usaha
            batik tulis yang didirikan seorang perempuan bernama Bu Widiarsih. Pada akhirnya
            banyak masyarakat kampung Jetis yang bekerja kepada Bu Widiarsih sebagai pegawainya.
            Pada saat itu, usaha batik tulis Bu Widiarsih menjadi perusahaan baik terbesar dan
            tertua yang ada di kampung Jetis. Pada tahun 1970-an, banyak mantan pegawai dari
            Bu Widiarsih yang membuka usaha batik rumahan yang di kemudian waktu menjadi mata
            pencaharian masyarakat Jetis selama bertahun-tahun. Salah satu pengusaha batik Jetis
            bernama H. M. Nur Wahyudi mengatakan bahwa orang tuanya dahulu pernah menjadi pegawai
            dari usaha batik tulis Bu Widiarsih sebelumnya akhirnya membuka usaha batik sendiri.
            Di tahun 2008, pemerintah meresmikan kampung Jetis menjadi kampung batik Jetis.
            Sebelum diresmikan, kampung ini hanya terdiri pengusaha-pengusaha batik yang bersifat
            individual dan sendiri-sendiri.
          </p>
        </AnimateIn>
      </Container>
    </section>
  );
}
