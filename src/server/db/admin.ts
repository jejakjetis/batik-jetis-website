import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";
import type { BookingStatus } from "@/generated/prisma/enums";
import { parseDateOnly } from "@/server/booking/rules";
import { canTransition } from "@/server/booking/status";

export type BookingFilter = {
  status?: BookingStatus;
  dateFrom?: string;
  dateTo?: string;
  code?: string;
  page?: number;
};

export const PAGE_SIZE = 50;

/** Daftar pesanan untuk admin (berisi data pribadi: HANYA dipanggil setelah requireAdmin*). */
export async function listBookings(db: PrismaClient, f: BookingFilter) {
  const visitDate: { gte?: Date; lte?: Date } = {};
  const from = f.dateFrom ? parseDateOnly(f.dateFrom) : null;
  const to = f.dateTo ? parseDateOnly(f.dateTo) : null;
  if (from) visitDate.gte = from;
  if (to) visitDate.lte = to;
  const where = {
    ...(f.status ? { status: f.status } : {}),
    ...(from || to ? { visitDate } : {}),
    ...(f.code ? { code: f.code } : {}),
  };
  const page = Math.max(1, f.page ?? 1);
  const [items, total] = await Promise.all([
    db.booking.findMany({
      where,
      orderBy: [{ visitDate: "asc" }, { createdAt: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        package: { select: { name: true } },
        session: { select: { label: true, startTime: true, endTime: true } },
        statusLogs: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    }),
    db.booking.count({ where }),
  ]);
  return { items, total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export type ChangeStatusResult =
  | { ok: true }
  | { ok: false; error: "NOT_FOUND" | "INVALID_TRANSITION" | "STALE" };

/**
 * Ubah status + catat log dalam satu transaksi. `expectedFrom` mencegah perubahan ganda
 * (dua admin / klik dobel): update hanya berlaku jika status masih sama.
 */
export async function changeBookingStatus(
  db: PrismaClient,
  args: { bookingId: string; expectedFrom: BookingStatus; to: BookingStatus; actorEmail: string },
): Promise<ChangeStatusResult> {
  if (!canTransition(args.expectedFrom, args.to)) return { ok: false, error: "INVALID_TRANSITION" };
  return db.$transaction(async (tx) => {
    const updated = await tx.booking.updateMany({
      where: { id: args.bookingId, status: args.expectedFrom },
      data: { status: args.to },
    });
    if (updated.count === 0) {
      const exists = await tx.booking.count({ where: { id: args.bookingId } });
      return { ok: false, error: exists ? "STALE" : "NOT_FOUND" } as const;
    }
    await tx.bookingStatusLog.create({
      data: { bookingId: args.bookingId, fromStatus: args.expectedFrom, toStatus: args.to, changedByEmail: args.actorEmail },
    });
    return { ok: true } as const;
  });
}
