import {
  BUSINESS_TIME_ZONE,
  CLOSED_HOURS,
  MAX_DAYS_AHEAD,
  MIN_DAYS_AHEAD,
  OPEN_WEEKDAYS,
} from "./config";

// Tanggal kunjungan direpresentasikan sebagai string "YYYY-MM-DD" (tanggal kalender WIB).
// Di DB disimpan sebagai DATE; Prisma memetakannya ke Date pada 00:00 UTC.

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type RuleError =
  | "INVALID_DATE"
  | "NOT_WEEKEND"
  | "TOO_SOON"
  | "TOO_FAR"
  | "DATE_CLOSED"
  | "SESSION_UNAVAILABLE"
  | "SESSION_IN_CLOSED_HOURS"
  | "PARTICIPANTS_OUT_OF_RANGE"
  | "QUOTA_EXCEEDED";

export type RuleResult = { ok: true } | { ok: false; error: RuleError };

const ok: RuleResult = { ok: true };
const fail = (error: RuleError): RuleResult => ({ ok: false, error });

/** Tanggal hari ini menurut WIB, format YYYY-MM-DD. */
export function todayInJakarta(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Parse YYYY-MM-DD ketat ke Date 00:00 UTC; null jika tidak valid (mis. 2026-02-30). */
export function parseDateOnly(value: string): Date | null {
  if (!DATE_RE.test(value)) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) return null;
  return d;
}

export function formatDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const DAY_MS = 86_400_000;

export function daysBetween(fromDate: string, toDate: string): number {
  const a = parseDateOnly(fromDate);
  const b = parseDateOnly(toDate);
  if (!a || !b) throw new Error("Tanggal tidak valid");
  return Math.round((b.getTime() - a.getTime()) / DAY_MS);
}

/**
 * Aturan tanggal: valid, Sabtu/Minggu, minimal H-3 dan maksimal 60 hari dari hari ini (WIB),
 * dan tidak termasuk tanggal tutup.
 */
export function validateVisitDate(
  visitDate: string,
  now: Date,
  isDateClosed: boolean,
): RuleResult {
  const d = parseDateOnly(visitDate);
  if (!d) return fail("INVALID_DATE");
  if (!(OPEN_WEEKDAYS as readonly number[]).includes(d.getUTCDay())) return fail("NOT_WEEKEND");
  const diff = daysBetween(todayInJakarta(now), visitDate);
  if (diff < MIN_DAYS_AHEAD) return fail("TOO_SOON");
  if (diff > MAX_DAYS_AHEAD) return fail("TOO_FAR");
  if (isDateClosed) return fail("DATE_CLOSED");
  return ok;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Sesi tidak boleh beririsan dengan jam tutup 12.00–15.00 WIB. */
export function sessionOverlapsClosedHours(startTime: string, endTime: string): boolean {
  const s = toMinutes(startTime);
  const e = toMinutes(endTime);
  return s < toMinutes(CLOSED_HOURS.end) && e > toMinutes(CLOSED_HOURS.start);
}

export function validateSession(
  session: { isActive: boolean; startTime: string; endTime: string } | null,
  slotClosed: boolean,
): RuleResult {
  if (!session || !session.isActive || slotClosed) return fail("SESSION_UNAVAILABLE");
  if (sessionOverlapsClosedHours(session.startTime, session.endTime)) {
    return fail("SESSION_IN_CLOSED_HOURS");
  }
  return ok;
}

export function validateParticipants(
  pkg: { minParticipants: number; maxParticipants: number },
  count: number,
): RuleResult {
  if (!Number.isInteger(count) || count < pkg.minParticipants || count > pkg.maxParticipants) {
    return fail("PARTICIPANTS_OUT_OF_RANGE");
  }
  return ok;
}

/** Total dalam integer rupiah. Harga per orang selalu dari DB. */
export function computeTotal(pricePerPerson: number, count: number): number {
  if (!Number.isSafeInteger(pricePerPerson) || pricePerPerson < 0) throw new Error("Harga tidak valid");
  if (!Number.isSafeInteger(count) || count < 1) throw new Error("Jumlah peserta tidak valid");
  const total = pricePerPerson * count;
  if (!Number.isSafeInteger(total)) throw new Error("Total melebihi batas");
  return total;
}

export function checkQuota(alreadyBooked: number, requested: number, quota: number): RuleResult {
  return alreadyBooked + requested <= quota ? ok : fail("QUOTA_EXCEEDED");
}

/** Pesan umum untuk pengguna (tanpa detail teknis). */
export const RULE_MESSAGES: Record<RuleError, string> = {
  INVALID_DATE: "Tanggal kunjungan tidak valid.",
  NOT_WEEKEND: "Kunjungan hanya tersedia hari Sabtu dan Minggu.",
  TOO_SOON: `Pemesanan paling lambat ${MIN_DAYS_AHEAD} hari sebelum tanggal kunjungan.`,
  TOO_FAR: `Pemesanan paling jauh ${MAX_DAYS_AHEAD} hari ke depan.`,
  DATE_CLOSED: "Kampung Batik Jetis tutup pada tanggal tersebut. Silakan pilih tanggal lain.",
  SESSION_UNAVAILABLE: "Sesi yang dipilih tidak tersedia.",
  SESSION_IN_CLOSED_HOURS: "Sesi yang dipilih tidak tersedia.",
  PARTICIPANTS_OUT_OF_RANGE: "Jumlah peserta tidak sesuai ketentuan paket.",
  QUOTA_EXCEEDED: "Kuota sesi ini tidak mencukupi. Silakan pilih sesi atau tanggal lain.",
};
