import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { NAV_ITEMS, SITE } from "@/lib/site";
import { formatPhoneId } from "@/lib/public-config";

// Label navigasi sama persis dengan header (perbaikan §5.2).
export function Footer({ whatsapp }: { whatsapp: string | null }) {
  return (
    <footer id="kontak" className="bg-espresso text-cream">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-serif text-3xl font-semibold">{SITE.name}</p>
          <p className="mt-2 font-serif text-lg text-cream/80 italic">{SITE.tagline}</p>
          <address className="mt-6 text-sm leading-relaxed text-cream/80 not-italic">
            {SITE.addressLines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-terracotta-light underline-offset-4 hover:underline"
            >
              WhatsApp: {formatPhoneId(whatsapp)}
            </a>
          ) : (
            <p className="mt-4 text-sm text-cream/70">WhatsApp: menyusul {/* TODO(klien) */}</p>
          )}
        </div>
        <nav aria-label="Navigasi footer">
          <Eyebrow tone="dark">Navigasi</Eyebrow>
          <ul className="mt-4 space-y-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-cream/90 hover:text-terracotta-light">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <Eyebrow tone="dark">Jadwal Kunjungan</Eyebrow>
          <ul className="mt-4 space-y-2 text-cream/90">
            <li>Sabtu &amp; Minggu</li>
            <li>Per sesi, sesuai jadwal pemesanan</li>
            <li>Istirahat 12.00–15.00 WIB</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-cream/15">
        <Container className="py-6 text-sm text-cream/70">
          © {new Date().getFullYear()} {SITE.name}. Hak cipta dilindungi.
        </Container>
      </div>
    </footer>
  );
}
