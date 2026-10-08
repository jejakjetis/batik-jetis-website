// Konfigurasi publik situs (bukan rahasia). Nilai bertanda TODO(klien) belum dikonfirmasi.
export const SITE = {
  name: "Kampung Batik Jetis",
  tagline: "Wisata edukasi batik tulis di Sidoarjo",
  // TODO(klien): alamat lengkap resmi.
  addressLines: ["Kampung Batik Jetis, Kel. Lemahputro", "Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur"],
  // TODO(klien): titik koordinat pintu masuk kampung (sementara perkiraan, wajib dicek).
  map: { lat: -7.456687, lng: 112.71383, zoom: 17 },
} as const;

export const NAV_ITEMS = [
  { href: "/#beranda", label: "Beranda" },
  { href: "/#tentang", label: "Tentang" },
  { href: "/#kegiatan", label: "Kegiatan Wisata" },
  { href: "/#peta", label: "Peta Wisata" },
  { href: "/#umkm", label: "UMKM" },
  { href: "/#kontak", label: "Kontak" },
] as const;

/** URL embed OpenStreetMap (tanpa JS tambahan, tanpa API key). */
export function osmEmbedUrl(lat: number, lng: number): string {
  const d = 0.004;
  const bbox = [lng - d, lat - d * 0.6, lng + d, lat + d * 0.6].map((n) => n.toFixed(5)).join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat},${lng}`;
}

export function googleMapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=Kampoeng+Batik+Jetis+Sidoarjo`;
}
export function googleMapsEmbedUrl(lat: number, lng:number): string {
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.0774216942596!2d112.70941644771436!3d-7.4566872543360425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e1333afd2ef1%3A0x977f519df88e7c23!2sKampoeng%20Batik%20Jetis!5e0!3m2!1sen!2sid!4v1791272776696!5m2!1sen!2sid`;
}
