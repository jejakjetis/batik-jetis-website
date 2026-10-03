import { MAX_DAYS_AHEAD, MIN_DAYS_AHEAD } from "./config";
import { formatDateOnly, parseDateOnly, todayInJakarta, validateVisitDate } from "./rules";
import { formatDateId } from "./whatsapp";

export type DateOption = { value: string; label: string };

/** Rentang tanggal pemesanan yang mungkin (WIB): H-3 s.d. +60 hari. */
export function bookingWindow(now: Date): { from: string; to: string } {
  const today = parseDateOnly(todayInJakarta(now))!;
  const add = (n: number) => formatDateOnly(new Date(today.getTime() + n * 86_400_000));
  return { from: add(MIN_DAYS_AHEAD), to: add(MAX_DAYS_AHEAD) };
}

/** Daftar Sabtu/Minggu yang bisa dipesan, memakai aturan yang sama dengan server. */
export function bookableDates(now: Date, closedDates: Iterable<string>): DateOption[] {
  const closed = new Set(closedDates);
  const { from, to } = bookingWindow(now);
  const out: DateOption[] = [];
  for (let d = parseDateOnly(from)!; formatDateOnly(d) <= to; d = new Date(d.getTime() + 86_400_000)) {
    const v = formatDateOnly(d);
    if (validateVisitDate(v, now, closed.has(v)).ok) out.push({ value: v, label: formatDateId(v) });
  }
  return out;
}
