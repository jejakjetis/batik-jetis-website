"use client";

import { useSyncExternalStore } from "react";
import type { BookingActionState } from "@/app/actions/booking";
import { BOOKING_STORAGE_KEY } from "@/components/booking/BookingForm";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Success = Extract<BookingActionState, { status: "success" }>;

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const tanggal = (v: string) =>
  new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${v}T00:00:00Z`),
  );

function readStored(): string | null {
  try {
    return sessionStorage.getItem(BOOKING_STORAGE_KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null, code: string | null): Success | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Success;
    return v.status === "success" && v.summary.code === code && v.whatsappUrl.startsWith("https://wa.me/") ? v : null;
  } catch {
    return null;
  }
}

export function SuccessDetails({ code }: { code: string | null }) {
  const raw = useSyncExternalStore(() => () => {}, readStored, () => null);
  const data = parse(raw, code);

  return (
    <div>
      <Eyebrow>Pesanan Terkirim</Eyebrow>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">Terima kasih!</h1>
      {code ? (
        <>
          <p className="mt-5 text-lg text-ink/85">Kode pesanan Anda:</p>
          <p className="mt-2 font-mono text-3xl font-semibold tracking-[0.2em] text-terracotta-text">{code}</p>
        </>
      ) : (
        <p className="mt-5 text-lg text-ink/85">Pesanan Anda sudah kami terima.</p>
      )}

      {data && (
        <dl className="mt-8 space-y-2 rounded-sm border border-line bg-cream p-6 text-[15px]">
          {[
            ["Paket", data.summary.packageName],
            ["Tanggal", tanggal(data.summary.visitDate)],
            ["Sesi", `${data.summary.sessionLabel} (${data.summary.sessionTime} WIB)`],
            ["Peserta", `${data.summary.participantCount} orang`],
            ["Total", rupiah.format(data.summary.totalPrice)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-8 rounded-sm border-l-4 border-terracotta bg-cream p-5 text-ink/90">
        <p className="font-semibold">Langkah berikutnya</p>
        <p className="mt-1">
          Status pesanan: <strong>menunggu konfirmasi</strong>. Kirim pesan WhatsApp ke pengelola untuk mendapatkan
          QRIS pembayaran. Simpan kode pesanan Anda.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {data ? (
          <ButtonLink href={data.whatsappUrl} size="lg" external>
            Lanjut ke WhatsApp
          </ButtonLink>
        ) : (
          <p className="text-muted">
            Jika tombol WhatsApp tidak muncul, hubungi pengelola melalui nomor di bagian bawah halaman dan sebutkan kode
            pesanan Anda.
          </p>
        )}
        <ButtonLink href="/" variant="outline" size="lg">
          Kembali ke Beranda
        </ButtonLink>
      </div>
    </div>
  );
}
