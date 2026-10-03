import type { BookingStatus } from "@/generated/prisma/enums";

// Transisi status yang diizinkan (CLAUDE.md §3.3). SELESAI dan BATAL adalah status akhir.
export const STATUS_TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = {
  MENUNGGU: ["DIKONFIRMASI", "BATAL"],
  DIKONFIRMASI: ["LUNAS", "BATAL"],
  LUNAS: ["SELESAI", "BATAL"],
  SELESAI: [],
  BATAL: [],
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  MENUNGGU: "Menunggu",
  DIKONFIRMASI: "Dikonfirmasi",
  LUNAS: "Lunas",
  SELESAI: "Selesai",
  BATAL: "Batal",
};

export const ALL_STATUSES = Object.keys(STATUS_LABELS) as BookingStatus[];

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  return STATUS_TRANSITIONS[from].includes(to);
}
