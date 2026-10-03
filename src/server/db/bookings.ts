import type { PrismaClient } from "@/generated/prisma/client";
import { Prisma } from "@/generated/prisma/client";
import { generateBookingCode } from "@/server/booking/code";
import type { BookingInput } from "@/server/booking/input";
import {
  checkQuota,
  computeTotal,
  parseDateOnly,
  type RuleError,
  validateParticipants,
  validateSession,
  validateVisitDate,
} from "@/server/booking/rules";
import type { BookingSummary } from "@/server/booking/whatsapp";

export type CreateBookingResult =
  | { ok: true; summary: BookingSummary }
  | { ok: false; error: RuleError | "PACKAGE_UNAVAILABLE" };

class QuotaError extends Error {
  constructor(public readonly code: RuleError) {
    super(code);
  }
}

/**
 * Membuat pesanan. Urutan:
 * 1) semua validasi (paket, sesi, tanggal, tutup, peserta) TANPA menulis apa pun;
 * 2) transaksi: buat SessionSlot bila belum ada, kunci FOR UPDATE, hitung ulang kuota, insert.
 */
export async function createBooking(
  db: PrismaClient,
  input: BookingInput,
  now: Date,
): Promise<CreateBookingResult> {
  const visitDate = parseDateOnly(input.visitDate);
  if (!visitDate) return { ok: false, error: "INVALID_DATE" };

  const [pkg, session, closedDate, slot] = await Promise.all([
    db.package.findUnique({ where: { id: input.packageId } }),
    db.session.findUnique({ where: { id: input.sessionId } }),
    db.closedDate.findUnique({ where: { date: visitDate }, select: { id: true } }),
    db.sessionSlot.findUnique({
      where: { sessionId_visitDate: { sessionId: input.sessionId, visitDate } },
      select: { isClosed: true },
    }),
  ]);

  if (!pkg || !pkg.isActive) return { ok: false, error: "PACKAGE_UNAVAILABLE" };
  const checks = [
    validateVisitDate(input.visitDate, now, closedDate !== null),
    validateSession(session, slot?.isClosed ?? false),
    validateParticipants(pkg, input.participantCount),
  ];
  for (const c of checks) if (!c.ok) return c;
  if (!session) return { ok: false, error: "SESSION_UNAVAILABLE" };

  const unitPrice = pkg.pricePerPerson;
  const totalPrice = computeTotal(unitPrice, input.participantCount);

  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateBookingCode();
    try {
      await db.$transaction(async (tx) => {
        await tx.$executeRaw`
          INSERT INTO "SessionSlot" ("id", "sessionId", "visitDate")
          VALUES (${crypto.randomUUID()}, ${session.id}, ${input.visitDate}::date)
          ON CONFLICT ("sessionId", "visitDate") DO NOTHING`;
        const locked = await tx.$queryRaw<{ isClosed: boolean }[]>`
          SELECT "isClosed" FROM "SessionSlot"
          WHERE "sessionId" = ${session.id} AND "visitDate" = ${input.visitDate}::date
          FOR UPDATE`;
        if (locked.length !== 1 || locked[0].isClosed) throw new QuotaError("SESSION_UNAVAILABLE");

        const booked = await tx.booking.aggregate({
          _sum: { participantCount: true },
          where: { sessionId: session.id, visitDate, status: { not: "BATAL" } },
        });
        const quotaCheck = checkQuota(booked._sum.participantCount ?? 0, input.participantCount, session.quota);
        if (!quotaCheck.ok) throw new QuotaError(quotaCheck.error);

        await tx.booking.create({
          data: {
            code,
            packageId: pkg.id,
            sessionId: session.id,
            visitDate,
            participantCount: input.participantCount,
            unitPrice,
            totalPrice,
            customerName: input.customerName,
            email: input.email,
            whatsapp: input.whatsapp,
            institution: input.institution,
            notes: input.notes,
          },
        });
      });
      return {
        ok: true,
        summary: {
          code,
          packageName: pkg.name,
          visitDate: input.visitDate,
          sessionLabel: session.label,
          sessionTime: `${session.startTime}–${session.endTime}`,
          participantCount: input.participantCount,
          totalPrice,
          customerName: input.customerName,
        },
      };
    } catch (e) {
      if (e instanceof QuotaError) return { ok: false, error: e.code };
      // Tabrakan kode pesanan (sangat jarang): coba lagi dengan kode baru.
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") continue;
      throw e;
    }
  }
  throw new Error("Gagal membuat kode pesanan unik");
}
