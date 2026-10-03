"use client";

import { useActionState } from "react";
import { type ChangeStatusState, updateBookingStatus } from "@/app/actions/admin";
import type { BookingStatus } from "@/generated/prisma/enums";
import { STATUS_LABELS, STATUS_TRANSITIONS } from "@/server/booking/status";

export function StatusForm({ bookingId, status }: { bookingId: string; status: BookingStatus }) {
  const [state, action, pending] = useActionState<ChangeStatusState, FormData>(updateBookingStatus, {});
  const next = STATUS_TRANSITIONS[status];
  if (next.length === 0) return <span className="text-sm text-muted">Status akhir</span>;
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="from" value={status} />
      <label className="sr-only" htmlFor={`to-${bookingId}`}>
        Ubah status
      </label>
      <select id={`to-${bookingId}`} name="to" className="rounded-[4px] border border-field bg-cream px-2 py-1.5 text-sm">
        {next.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-[4px] bg-espresso px-3 py-1.5 text-sm font-semibold text-cream disabled:opacity-60"
        onClick={(e) => {
          const to = (e.currentTarget.form?.elements.namedItem("to") as HTMLSelectElement | null)?.value;
          if (to === "BATAL" && !confirm("Batalkan pesanan ini? Status BATAL tidak bisa diubah lagi.")) e.preventDefault();
        }}
      >
        {pending ? "…" : "Simpan"}
      </button>
      {state.error && (
        <span role="alert" className="w-full text-sm text-danger">
          {state.error}
        </span>
      )}
    </form>
  );
}
