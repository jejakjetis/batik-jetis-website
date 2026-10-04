import Link from "next/link";
import { z } from "zod";
import { formatDateId, formatRupiah } from "@/server/booking/whatsapp";
import { ALL_STATUSES, STATUS_LABELS } from "@/server/booking/status";
import { requireAdminPage } from "@/server/auth/admin";
import { listBookings } from "@/server/db/admin";
import { getDb } from "@/server/db/client";
import { StatusForm } from "./StatusForm";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().catch(undefined);
const filterSchema = z.object({
  status: z.enum(ALL_STATUSES as [string, ...string[]]).optional().catch(undefined),
  dari: date,
  sampai: date,
  kode: z.string().trim().toUpperCase().regex(/^[A-Z2-9]{8}$/).optional().catch(undefined),
  hal: z.coerce.number().int().min(1).max(1000).optional().catch(undefined),
});

const fmtDateTime = new Intl.DateTimeFormat("id-ID", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Jakarta" });

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminBookingsPage({ searchParams }: PageProps<"/admin">) {
  await requireAdminPage(); // defense in depth (layout juga mengecek)
  const sp = await searchParams;
  const pick = (k: string) => (typeof sp[k] === "string" ? sp[k] : undefined);
  const f = filterSchema.parse({ status: pick("status"), dari: pick("dari"), sampai: pick("sampai"), kode: pick("kode"), hal: pick("hal") });

  const db = await getDb();
  const { items, total, page, pages } = await listBookings(db, {
    status: f.status as (typeof ALL_STATUSES)[number] | undefined,
    dateFrom: f.dari,
    dateTo: f.sampai,
    code: f.kode,
    page: f.hal,
  });

  const qs = (p: number) => {
    const u = new URLSearchParams();
    if (f.status) u.set("status", f.status);
    if (f.dari) u.set("dari", f.dari);
    if (f.sampai) u.set("sampai", f.sampai);
    if (f.kode) u.set("kode", f.kode);
    u.set("hal", String(p));
    return `/admin?${u}`;
  };
  const input = "mt-1 block rounded-[4px] border border-field bg-cream px-2 py-2 text-sm";

  return (
    <>
      <h1 className="font-serif text-3xl font-semibold">Daftar Pesanan</h1>

      <form method="get" className="mt-6 flex flex-wrap items-end gap-4 rounded-sm border border-line bg-cream p-4">
        <div>
          <label htmlFor="f-status" className="text-sm font-semibold">Status</label>
          <select id="f-status" name="status" defaultValue={f.status ?? ""} className={input}>
            <option value="">Semua</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-dari" className="text-sm font-semibold">Kunjungan dari</label>
          <input id="f-dari" name="dari" type="date" defaultValue={f.dari} className={input} />
        </div>
        <div>
          <label htmlFor="f-sampai" className="text-sm font-semibold">sampai</label>
          <input id="f-sampai" name="sampai" type="date" defaultValue={f.sampai} className={input} />
        </div>
        <div>
          <label htmlFor="f-kode" className="text-sm font-semibold">Kode</label>
          <input id="f-kode" name="kode" maxLength={8} defaultValue={f.kode} className={`${input} uppercase`} />
        </div>
        <button type="submit" className="rounded-[4px] bg-terracotta px-4 py-2 text-sm font-semibold text-white">Terapkan</button>
        <Link href="/admin" className="py-2 text-sm text-terracotta-text underline">Reset</Link>
      </form>

      <p className="mt-6 text-sm text-muted">{total} pesanan · halaman {page}/{pages}</p>

      <div className="mt-3 overflow-x-auto rounded-sm border border-line bg-cream">
        <table className="min-w-[960px] w-full text-left text-sm">
          <thead className="border-b border-line bg-sand/60">
            <tr>
              {["Kode", "Kunjungan", "Paket", "Peserta", "Total", "Pemesan", "Status", "Ubah status"].map((h) => (
                <th key={h} scope="col" className="px-3 py-2 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-muted">Tidak ada pesanan.</td></tr>
            )}
            {items.map((b) => {
              const visit = b.visitDate.toISOString().slice(0, 10);
              return (
                <tr key={b.id} className="align-top">
                  <td className="px-3 py-3 font-mono font-semibold">{b.code}</td>
                  <td className="px-3 py-3">
                    {formatDateId(visit)}
                    <br />
                    <span className="text-muted">{b.session.label} {b.session.startTime}–{b.session.endTime}</span>
                  </td>
                  <td className="px-3 py-3">{b.package.name}{b.institution && <><br /><span className="text-muted">{b.institution}</span></>}</td>
                  <td className="px-3 py-3">{b.participantCount}</td>
                  <td className="px-3 py-3">{formatRupiah(b.totalPrice)}</td>
                  <td className="px-3 py-3">
                    {b.customerName}
                    <br />
                    <a className="text-terracotta-text underline" href={`https://wa.me/${b.whatsapp}`} target="_blank" rel="noopener noreferrer">{b.whatsapp}</a>
                    <br />
                    <span className="text-muted">{b.email}</span>
                    {b.notes && <p className="mt-1 max-w-56 text-muted">Catatan: {b.notes}</p>}
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-semibold">{STATUS_LABELS[b.status]}</span>
                    <br />
                    <span className="text-xs text-muted">Dibuat {fmtDateTime.format(b.createdAt)}</span>
                    {b.statusLogs.length > 0 && (
                      <details className="mt-1 text-xs text-muted">
                        <summary className="cursor-pointer">Riwayat</summary>
                        <ul className="mt-1 space-y-1">
                          {b.statusLogs.map((l) => (
                            <li key={l.id}>{fmtDateTime.format(l.createdAt)}: {l.fromStatus ? STATUS_LABELS[l.fromStatus] : "-"} → {STATUS_LABELS[l.toStatus]} ({l.changedByEmail})</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </td>
                  <td className="px-3 py-3"><StatusForm bookingId={b.id} status={b.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav aria-label="Halaman" className="mt-4 flex gap-4 text-sm">
          {page > 1 && <Link className="text-terracotta-text underline" href={qs(page - 1)}>← Sebelumnya</Link>}
          {page < pages && <Link className="text-terracotta-text underline" href={qs(page + 1)}>Berikutnya →</Link>}
        </nav>
      )}
    </>
  );
}
