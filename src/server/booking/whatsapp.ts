const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export function formatRupiah(value: number): string {
  return rupiah.format(value);
}

/** "2026-10-04" -> "Minggu, 4 Oktober 2026" */
export function formatDateId(visitDate: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${visitDate}T00:00:00Z`));
}

export type BookingSummary = {
  code: string;
  packageName: string;
  visitDate: string;
  sessionLabel: string;
  sessionTime: string;
  participantCount: number;
  totalPrice: number;
  customerName: string;
};

export function buildWhatsappMessage(s: BookingSummary): string {
  return [
    "Halo pengelola Kampung Batik Jetis, saya ingin konfirmasi pemesanan.",
    "",
    `Kode pesanan: ${s.code}`,
    `Nama: ${s.customerName}`,
    `Paket: ${s.packageName}`,
    `Tanggal: ${formatDateId(s.visitDate)}`,
    `Sesi: ${s.sessionLabel} (${s.sessionTime} WIB)`,
    `Peserta: ${s.participantCount} orang`,
    `Total: ${formatRupiah(s.totalPrice)}`,
    "",
    "Mohon info pembayaran QRIS. Terima kasih.",
  ].join("\n");
}

export function buildWhatsappUrl(phone: string, message: string): string {
  if (!/^62\d{8,13}$/.test(phone)) throw new Error("Nomor WA pengelola tidak valid");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
