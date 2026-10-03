// Aturan bisnis yang bisa berubah. Kuota & harga ada di database.
export const BUSINESS_TIME_ZONE = "Asia/Jakarta";
export const MIN_DAYS_AHEAD = 3; // H-3
export const MAX_DAYS_AHEAD = 60;
export const OPEN_WEEKDAYS = [0, 6] as const; // Minggu, Sabtu
export const CLOSED_HOURS = { start: "12:00", end: "15:00" } as const; // WIB
// TODO(klien): batas pembatalan; asumsi paling lambat H-2.
export const CANCEL_MIN_DAYS_BEFORE = 2;
