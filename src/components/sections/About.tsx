import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn } from "@/components/ui/AnimateIn";

// Perbaikan §5.2: paragraf tidak dobel; foto sejajar margin grid (di dalam Container).
// TODO(konten): teks sejarah final + sumber dari pengelola. Jangan menambahkan tahun/tokoh tanpa sumber.
export function About() {
  return (
    <section id="tentang" aria-labelledby="tentang-title" className="bg-cream py-20 lg:py-28">
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
        <div className="lg:col-span-2 mt-8">
          <section aria-labelledby="transkrip-title">
            <AnimateIn delay={300}><h2 id="transkrip-title" className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-text sm:text-sm">
              Hasil Transkrip Wawancara
            </h2></AnimateIn>

            <article className="mt-3 grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
              <div>
                <AnimateIn delay={300}><h3 className="font-serif text-4xl leading-tight font-semibold text-ink sm:text-5xl">Batik Namiroh</h3></AnimateIn>
                <AnimateIn delay={300}><div aria-hidden="true" className="mt-5 h-0.5 w-14 bg-terracotta" /></AnimateIn>

                <AnimateIn delay={300}><p className="mt-5 text-justify text-lg leading-relaxed text-ink/85">
                  Secara pencatatan, usaha Batik Namiroh didirikan pada tahun 1953. Untuk saat ini, usaha batik Namiroh dikelola oleh Mas Renaldi sejak tahun 2008. Pada awalnya tidak niatan untuk melakukan pencatatan dari nenek Mas Renaldi. Tetapi, dikarenakan adanya kebutuhan data dari mahasiswa dan pemerintah akhirnya dilakukan proses pencatatan (karena membutuhkan sumber primer). Nama “Namiroh” sendiri terinspirasi dari Masjid Namiroh ketika nenek Mas Renaldi pergi haji.
                </p></AnimateIn>
              </div>
              <AnimateIn delay={300}>
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm border border-line">
                  <Image
                    src="/images/batik-namiroh.webp"
                    alt="Batik Namiroh"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
              </AnimateIn>
            </article>
            <AnimateIn delay={300}><p className="mt-8 text-justify text-lg leading-relaxed text-ink/85">
              Di tahun 1970an-1980an, terdapat pembatik dari desa lain yang membuat batik dengan harga murah tapi rusak (kualitasnya rendah) yang berimbas pada usaha-usaha batik di kampung Jetis termasuk batik Namiroh terkena imbasnya. Batik-batik kualitas tersebut terkenal gampang luntur. Setelah di konfirmasi oleh dosen unesa yang melakukan penelitian batik juga, hal ini bisa terjadi karena pemerintah mendatangkan mesin dari Cina. Di satu sisi memang membuat batik menjadi lebih murah tetapi di sisi lain kualitasnya menjadi drop dan hal ini berimbas pada usaha batik Namiroh  karena banyak konsumen yang tidak percaya.
              Dikarenakan sepinya pembeli, akhirnya nenek dari mas renaldi berjualan kue untuk menghidupi keluarga. Tidak menyerah dengan keadaan akhirnya sang nenek membuat batik lagi dan menjualnya secara door to door ke toko-toko. Usaha batik Namiroh juga mengalami tantangan berat lain terutama ketika krisis moneter dan pandemi COVID-19.

            </p></AnimateIn>

            <AnimateIn delay={300}><p className="mt-4 text-justify text-lg leading-relaxed text-ink/85">
              Pembeli dari usaha batik Namiroh biasanya berasal dari Madura. Selain dari Madura, pembeli dari usaha batik namiroh juga berasal dari kalangan pejabat seperti bupati, orang-orang pemerintahan, bahkan Gubernur Khofifah Parawansa pernah membeli batik Namiroh. Para pembeli dari Madura ini sangat suka dengan batik setorjoan khas sidoarjo. Motif-motif batik sidoarjo biasanya berupa hasil bumi seperti beras kutah, kembang bayem, udang bandeng, dsb. Hal ini karena dulunya Sidoarjo penghasil beras melimpah ditambah banyak perkebunan tebu.
            </p></AnimateIn>

            <AnimateIn delay={300}><p className="mt-4 text-justify text-lg leading-relaxed text-ink/85">
              Sejak tahun 2008, usaha batik Namiroh dipegang oleh mas Renaldi. Sebelumnya, usaha batik Namiroh dipegang oleh hanya sang ibu. Sang nenek lebih menganjurkan anak-anaknya untuk berkarir di profesi lain sehingga usaha batik Namiroh hanya diteruskan oleh Ibu mas renaldi yang saat itu merupakan ibu rumah tangga. Di tahun 2008, mas renaldi sedang menjalani tahun akhir perkuliahan dan kebetulan saat itu ada tawaran untuk promosi serta pameran batik. Mas renaldi aktif dalam kegiatan-kegiatan tersebut sampai akhirnya di tahun 2008, beliau memutuskan untuk meneruskan usaha batik Namiroh yang telah dikelola sang ibu bertahun-tahun.
            </p></AnimateIn>

            <AnimateIn delay={300}><p className="mt-4 text-justify text-lg leading-relaxed text-ink/85">
              Terdapat perbedaan pengelolaan usaha batik antara sang ibu dan mas renaldi. Ketika masih dikelola sang ibu, segala proses berlangsung secara manual seperti pemotongan kain secara manual menggunakan gunting dan proses perendaman kain dengan minyak kacang yang ditambah tepung tapioka selama seminggu. Ketika dikelola oleh mas renaldi kedua proses hal tersebut tidak dilakukan untuk menambah efisiensi.
            </p></AnimateIn>




            <article className="mt-16">
              <div>
                <AnimateIn delay={300}><h3 className="font-serif text-4xl leading-tight font-semibold text-ink sm:text-5xl">Batik Kamsatun</h3></AnimateIn>
                <AnimateIn delay={300}><div aria-hidden="true" className="mt-5 h-0.5 w-14 bg-terracotta" /></AnimateIn>
                <AnimateIn delay={300}><p className="mt-5 text-justify text-lg leading-relaxed text-ink/85">
                  Batik Khamsatun sendiri didirikan oleh Ibu dan kakak dari Bapak Zaenal di tahun 1983. Sang Ibu bernama Kamsatun dan sang kakak bernama Isbahillah. Sebelum mendirikan usaha batik sendiri, keluarga Bapak Zaenal bekerja dan belajar dari pengusaha batik lain. Akhirnya di masa itu dengan modal kurang lebih 30.000 rupiah keluarga Bapak Zaenal membeli kain satu gelondong sepanjang 32 meter yang kemudian dipotong-potong. Pak Zaenal mengungkapkan keluarganya memiliki spesialis batik yakni kain panjang (jarik), sarung, dan selendang gendong. Untuk selendang gendong memiliki ukuran sekitar 2,6-2,7 meter dengan lebar 90 centimeter. Sedangkan untuk kain panjang atau jarik memiliki panjang 2,5-2,6 meter. Untuk sarung sendiri di batik Pak Zaenal terdapat ukuran sepanjang 2,1 meter serta memiliki ciri khas berupa motif tumpal. Lama pengerjaan batik sendiri rata-rata tiga bulan.
                </p></AnimateIn>
              </div>
            </article>

            <AnimateIn delay={300}><p className="mt-4 text-justify text-lg leading-relaxed text-ink/85">
              Untuk penjualan batik, Pak Zaenal sendiri menggunakan reseller/sales khusus yang mengambil batiknya untuk dijual/ditawarkan di tempat lain. Kebanyakan batik dari Pak Zaenal dijual ke daerah petambak di Sidoarjo seperti Kalanganyar. Seringkali Pak Zaenal menerima permintaan untuk dibuatkan motif-motif sesuai keinginan pembeli.
            </p></AnimateIn>


            <AnimateIn delay={300}><p className="mt-4 text-justify text-lg leading-relaxed text-ink/85">
              Di tahun 2008 pemerintah daerah Sidoarjo memunculkan sentra-sentra akhirnya diundang berbagai audiensi ke kabupaten dan diperkenalkan batik-batik Sidoarjo. Di tahun tersebut kampung Jetis dikukuhkan secara resmi sebagai kampung batik. Pak Zaenal menuturkan bahwa para pengusaha batik di kampung batik Jetis suka membuat motif kesukaan orang Madura (motif Setorjoan). Sebelum adanya peristiwa perang sampit, banyak juga pengusaha batik kampung Jetis menjual produknya ke etnis Madura yang ada Kalimantan di samping di Pulau Madura. Berbeda dengan pengusaha batik lain, Pak Zaenal lebih memiliki untuk mengikuti tren untuk membuat batik setorjoan dan lebih memilih untuk memproduksi batik dalam jumlah yang tidak massal. Hal ini dikarenakan ketiadaan modal yang kurang cukup untuk memproduksi dalam jumlah banyak. Batik dari Pak Zaenal sendiri juga memiliki ciri khas lain yakni motifnya berada di dua sisi.
            </p></AnimateIn>

            <AnimateIn delay={300}><p className="mt-4 text-justify text-lg leading-relaxed text-ink/85">
              Meskipun begitu, terdapat kesempatan emas bagi Pak Zaenal karena tidak memproduksi dalam jumlah massal maka batik-batik yang dijual memiliki harga yang lebih mahal dari batik pada umumnya (selain memang jenis batiknya batik tulis). Pak Zaenal sendiri juga aktif dalam berbagai komunitas seperti komunitas pembatik dan komunitas berkebaya. Pak Zaenal seringkali mendapatkan pembeli melalui relasi dari komunitas-komunitas tersebut. Untuk sarung sendiri dipatok dengan harga dua juta dan kain panjang dijual sekitar 2 juta.
            </p></AnimateIn>

            <AnimateIn delay={300}><p className="mt-4 text-justify text-lg leading-relaxed text-ink/85">
              Selain batik dengan menggunakan pewarna sintetis, Pak Zaenal juga memproduksi batik dari pewarna alami seperti menggunakan kayu mahoni, sabut kelapa, serta tawas untuk warna coklat, warna hijau yang dari daun dan buah-buahan. Terdapat treatment khusus dalam merawat batik yakni dianjurkan untuk tidak menggunakan deterjen, tidak dikucek dengan kuat, dan tidak dijemur di bawah matahari langsung.
              Usaha batik Pak Zaenal pernah menghadapi tantangan terberat ketika pandemi COVID-19. Selama pandemi dua tahun tersebut, Pak Zaenal hampir tidak pernah memproduksi kain batik satu pun.
            </p></AnimateIn>

            <article className="mt-16">
              <div>
                <AnimateIn delay={300}><h3 className="font-serif text-4xl leading-tight font-semibold text-ink sm:text-5xl">Proses Pembatikan</h3></AnimateIn>
                <AnimateIn delay={300}><div aria-hidden="true" className="mt-5 h-0.5 w-14 bg-terracotta" /></AnimateIn>
                <AnimateIn delay={300}><p className="mt-5 text-justify text-lg leading-relaxed text-ink/85">
                  Tahap awal dilakukan dengan membuat pola pada kain batik. Kemudian dilakukan proses pelilinan atau mencanting. Setelah proses pencantingan, dilakukan proses perwarnaan. Dalam proses perwarnaan, ada yang menggunakan teknik ngeblok kemudian baru proses perwarnaan awal. Perwarnaan batik sendiri terdapat dua tipe yakni tipe kering dan tipe basah. Tipe kering dilakukan dengan media dalam keadaan kering (kainnya diwarnain dengan dicolet), sedangkan untuk tipe basah, kain diwarnain dengan cara dicelup secara keseluruhan untuk warna dasar. Diakhir proses, terdapat tahapan penguncian warna. Jika menggunakan pewarna asli maka penguncian warna menggunakan tawas dan air atau kapur dan air. Jika ingin pengunci warna dengan warna yang lebih gelap atau tua maka bisa menggunakan dengan kawat atau paku yang berkarat yang direndam air. Sedangkan untuk penguncian warna sintetis dapat dilakukan dengan napthol dan garam warna.
                </p></AnimateIn>
              </div>
            </article>
          </section>
        </div>
      </Container>
    </section>
  );
}
