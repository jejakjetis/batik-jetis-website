"use client";

import { useRouter } from "next/navigation";
import { useActionState, useCallback, useId, useMemo, useState, useTransition } from "react";
import { type BookingActionState, submitBooking } from "@/app/actions/booking";
import { getSessionAvailability } from "@/app/actions/availability";
import { Button } from "@/components/ui/Button";
import type { DateOption } from "@/server/booking/dates";
import type { PublicPackage, SessionAvailability } from "@/server/db/types";
import { Turnstile } from "./Turnstile";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
export const BOOKING_STORAGE_KEY = "kbj:last-booking";

const fieldCls =
  "mt-2 block w-full rounded-[4px] border border-field bg-cream px-3 py-3 text-base text-ink placeholder:text-muted/80 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/40 aria-[invalid=true]:border-danger";
const labelCls = "block text-sm font-semibold tracking-wide text-ink";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-danger">
      {message}
    </p>
  );
}

export function BookingForm({
  packages,
  dates,
  siteKey,
  defaultPackageSlug,
}: {
  packages: PublicPackage[];
  dates: DateOption[];
  siteKey: string;
  defaultPackageSlug?: string;
}) {
  const router = useRouter();
  const uid = useId();
  const [resetKey, setResetKey] = useState(0);
  const [state, formAction, pending] = useActionState<BookingActionState, FormData>(async (prev, formData) => {
    const result = await submitBooking(prev, formData);
    if (result.status === "success") {
      try {
        sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(result));
      } catch {
        // sessionStorage tidak tersedia: halaman sukses tetap menampilkan kode dari URL.
      }
      router.push(`/pesanan/terkirim?kode=${encodeURIComponent(result.summary.code)}`);
    } else {
      setResetKey((k) => k + 1); // token Turnstile sekali pakai
    }
    return result;
  }, { status: "idle" });

  const initialPkg = packages.find((p) => p.slug === defaultPackageSlug) ?? packages[0];
  const [packageId, setPackageId] = useState(initialPkg?.id ?? "");
  const pkg = packages.find((p) => p.id === packageId);
  const [count, setCount] = useState<number>(initialPkg?.minParticipants ?? 1);
  const [visitDate, setVisitDate] = useState("");
  const [sessions, setSessions] = useState<SessionAvailability[] | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [loadingSessions, startLoading] = useTransition();
  const [token, setToken] = useState<string | null>(null);
  const onToken = useCallback((t: string | null) => setToken(t), []);


  function onDateChange(value: string) {
    setVisitDate(value);
    setSessionId("");
    setSessions(null);
    if (!value) return;
    startLoading(async () => setSessions(await getSessionAvailability(value)));
  }

  const total = pkg && Number.isInteger(count) && count > 0 ? pkg.pricePerPerson * count : 0;
  const countValid = pkg ? count >= pkg.minParticipants && count <= pkg.maxParticipants : false;
  const fieldErrors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const err = (name: string) => fieldErrors[name];
  const ids = useMemo(
    () => Object.fromEntries(["name", "email", "wa", "pkg", "date", "count", "inst", "notes", "session"].map((k) => [k, `${uid}-${k}`])),
    [uid],
  );
  const selectedSession = sessions?.find((s) => s.id === sessionId);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
      {/* Ringkasan: hanya tampilan; server menghitung ulang harga dari database. */}
      <aside aria-labelledby={`${uid}-ringkasan`} className="h-fit rounded-sm border border-line bg-sand p-6 lg:sticky lg:top-24 lg:order-first">
        <h3 id={`${uid}-ringkasan`} className="font-serif text-2xl font-semibold text-ink">
          Ringkasan
        </h3>
        <dl className="mt-4 space-y-2 text-[15px]">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Paket</dt>
            <dd className="text-right font-semibold">{pkg?.name ?? "-"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Harga per orang</dt>
            <dd className="font-semibold">{pkg ? rupiah.format(pkg.pricePerPerson) : "-"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Tanggal</dt>
            <dd className="text-right font-semibold">{dates.find((d) => d.value === visitDate)?.label ?? "-"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Sesi</dt>
            <dd className="text-right font-semibold">
              {selectedSession ? `${selectedSession.startTime}–${selectedSession.endTime} WIB` : "-"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Peserta</dt>
            <dd className="font-semibold">{countValid ? `${count} orang` : "-"}</dd>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-line pt-4">
            <dt className="font-semibold">Total</dt>
            <dd className="font-serif text-3xl font-semibold text-terracotta-text" aria-live="polite">
              {countValid ? rupiah.format(total) : "-"}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-muted">
          Pembayaran melalui QRIS, dikonfirmasi pengelola lewat WhatsApp. Total akhir dihitung ulang oleh sistem.
        </p>
      </aside>

      <form action={formAction} noValidate className="space-y-6" aria-describedby={state.status === "error" ? `${uid}-form-error` : undefined}>
        {state.status === "error" && (
          <div id={`${uid}-form-error`} role="alert" className="rounded-sm border border-danger/40 bg-danger/5 px-4 py-3 text-danger">
            {state.message}
          </div>
        )}

        {/* Honeypot: disembunyikan dari pengguna & pembaca layar. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${uid}-website`}>Website</label>
          <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div>
          <label htmlFor={ids.pkg} className={labelCls}>
            Paket wisata
          </label>
          <select
            id={ids.pkg}
            name="packageId"
            required
            value={packageId}
            onChange={(e) => {
              setPackageId(e.target.value);
              const p = packages.find((x) => x.id === e.target.value);
              if (p) setCount((c) => Math.min(Math.max(c, p.minParticipants), p.maxParticipants));
            }}
            className={fieldCls}
            aria-invalid={Boolean(err("packageId"))}
          >
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {rupiah.format(p.pricePerPerson)}/orang
              </option>
            ))}
          </select>
          <FieldError id={`${ids.pkg}-e`} message={err("packageId")} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={ids.date} className={labelCls}>
              Tanggal kunjungan
            </label>
            <select
              id={ids.date}
              name="visitDate"
              required
              value={visitDate}
              onChange={(e) => onDateChange(e.target.value)}
              className={fieldCls}
              aria-describedby={`${ids.date}-h`}
              aria-invalid={Boolean(err("visitDate"))}
            >
              <option value="">Pilih tanggal</option>
              {dates.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <p id={`${ids.date}-h`} className="mt-1.5 text-sm text-muted">
              Sabtu &amp; Minggu, paling lambat 3 hari sebelumnya.
            </p>
            <FieldError id={`${ids.date}-e`} message={err("visitDate")} />
          </div>
          <div>
            <label htmlFor={ids.count} className={labelCls}>
              Jumlah peserta
            </label>
            <input
              id={ids.count}
              name="participantCount"
              type="number"
              inputMode="numeric"
              required
              min={pkg?.minParticipants}
              max={pkg?.maxParticipants}
              value={Number.isNaN(count) ? "" : count}
              onChange={(e) => setCount(e.target.valueAsNumber)}
              className={fieldCls}
              aria-describedby={`${ids.count}-h`}
              aria-invalid={Boolean(err("participantCount")) || (!countValid && !Number.isNaN(count))}
            />
            <p id={`${ids.count}-h`} className={`mt-1.5 text-sm ${countValid ? "text-muted" : "text-danger"}`}>
              {pkg ? `${pkg.minParticipants}–${pkg.maxParticipants} orang untuk paket ini.` : ""}
            </p>
            <FieldError id={`${ids.count}-e`} message={err("participantCount")} />
          </div>
        </div>

        <fieldset aria-describedby={`${ids.session}-h`}>
          <legend className={labelCls}>Sesi</legend>
          <p id={`${ids.session}-h`} className="mt-1 text-sm text-muted" aria-live="polite">
            {!visitDate
              ? "Pilih tanggal terlebih dahulu untuk melihat sisa kuota."
              : loadingSessions
                ? "Memuat sisa kuota…"
                : sessions && sessions.length === 0
                  ? "Sesi tidak tersedia untuk tanggal ini."
                  : "Kuota 30 orang per sesi."}
          </p>
          {sessions && sessions.length > 0 && !loadingSessions && (
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {sessions.map((s) => {
                const unavailable = s.closed || s.remaining < (countValid ? count : 1);
                return (
                  <label
                    key={s.id}
                    className={`flex cursor-pointer flex-col rounded-[4px] border px-4 py-3 has-[:checked]:border-terracotta has-[:checked]:bg-terracotta/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-terracotta ${
                      unavailable ? "cursor-not-allowed border-line opacity-60" : "border-field"
                    }`}
                  >
                    <input
                      type="radio"
                      name="sessionId"
                      value={s.id}
                      className="sr-only"
                      checked={sessionId === s.id}
                      disabled={unavailable}
                      onChange={() => setSessionId(s.id)}
                    />
                    <span className="font-semibold">{s.label}</span>
                    <span className="text-sm text-muted">
                      {s.startTime}–{s.endTime} WIB
                    </span>
                    <span className={`mt-1 text-sm ${s.remaining === 0 || s.closed ? "text-danger" : "text-success"}`}>
                      {s.closed ? "Ditutup" : s.remaining === 0 ? "Penuh" : `Sisa ${s.remaining} tempat`}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
          <FieldError id={`${ids.session}-e`} message={err("sessionId")} />
        </fieldset>

        <div>
          <label htmlFor={ids.name} className={labelCls}>
            Nama lengkap
          </label>
          <input id={ids.name} name="customerName" required maxLength={100} autoComplete="name" placeholder="Nama lengkap Anda" className={fieldCls} aria-invalid={Boolean(err("customerName"))} aria-describedby={err("customerName") ? `${ids.name}-e` : undefined} />
          <FieldError id={`${ids.name}-e`} message={err("customerName")} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={ids.email} className={labelCls}>
              Alamat email
            </label>
            <input id={ids.email} name="email" type="email" required maxLength={254} autoComplete="email" placeholder="email@anda.com" className={fieldCls} aria-invalid={Boolean(err("email"))} aria-describedby={err("email") ? `${ids.email}-e` : undefined} />
            <FieldError id={`${ids.email}-e`} message={err("email")} />
          </div>
          <div>
            <label htmlFor={ids.wa} className={labelCls}>
              Nomor WhatsApp
            </label>
            <input id={ids.wa} name="whatsapp" type="tel" inputMode="tel" required maxLength={20} autoComplete="tel" placeholder="08xxxxxxxxxx" className={fieldCls} aria-invalid={Boolean(err("whatsapp"))} aria-describedby={err("whatsapp") ? `${ids.wa}-e` : undefined} />
            <FieldError id={`${ids.wa}-e`} message={err("whatsapp")} />
          </div>
        </div>

        {pkg?.slug === "pelajar" && (
          <div>
            <label htmlFor={ids.inst} className={labelCls}>
              Nama sekolah
            </label>
            <input id={ids.inst} name="institution" maxLength={150} autoComplete="organization" className={fieldCls} aria-invalid={Boolean(err("institution"))} />
            <FieldError id={`${ids.inst}-e`} message={err("institution")} />
          </div>
        )}

        <div>
          <label htmlFor={ids.notes} className={labelCls}>
            Catatan <span className="font-normal text-muted">(opsional)</span>
          </label>
          <textarea id={ids.notes} name="notes" rows={3} maxLength={500} className={fieldCls} aria-invalid={Boolean(err("notes"))} />
          <FieldError id={`${ids.notes}-e`} message={err("notes")} />
        </div>

        <Turnstile siteKey={siteKey} onToken={onToken} resetKey={resetKey} />

        <Button type="submit" size="lg" className="w-full" disabled={pending || !token || !sessionId || !countValid} aria-disabled={pending || !token || !sessionId || !countValid}>
          {pending ? "Mengirim…" : "Kirim Pesanan & Lanjut ke WhatsApp"}
        </Button>
        <p className="text-sm text-muted">
          Dengan mengirim, data Anda dipakai hanya untuk memproses pesanan ini.
        </p>
      </form>
    </div>
  );
}
