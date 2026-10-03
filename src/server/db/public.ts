import "server-only";
import { parseDateOnly } from "@/server/booking/rules";
import { getDb, isDbConfigured } from "./client";
import { FIXTURE_FAQS, FIXTURE_PACKAGES, FIXTURE_SESSIONS, FIXTURE_UMKM } from "./fixtures";
import type { PublicFaq, PublicPackage, PublicSession, PublicUmkm, SessionAvailability } from "./types";

// Query data publik. Bila DB belum dikonfigurasi (hanya di luar produksi), pakai fixture.
// Data pesanan tidak pernah dikembalikan; ketersediaan hanya berupa angka sisa kuota.

async function shouldUseFixtures(): Promise<boolean> {
  if (await isDbConfigured()) return false;
  if (process.env.NODE_ENV === "production") throw new Error("Database belum dikonfigurasi");
  return true;
}

export async function getPackages(): Promise<PublicPackage[]> {
  if (await shouldUseFixtures()) return FIXTURE_PACKAGES;
  const db = await getDb();
  return db.package.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true, slug: true, name: true, description: true, pricePerPerson: true,
      durationMinutes: true, minParticipants: true, maxParticipants: true, facilities: true,
    },
  });
}

export async function getSessions(): Promise<PublicSession[]> {
  if (await shouldUseFixtures()) return FIXTURE_SESSIONS;
  const db = await getDb();
  return db.session.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { startTime: "asc" }],
    select: { id: true, label: true, startTime: true, endTime: true, quota: true },
  });
}

export async function getUmkm(): Promise<PublicUmkm[]> {
  if (await shouldUseFixtures()) return FIXTURE_UMKM;
  const db = await getDb();
  return db.umkm.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, products: true, description: true, priceMin: true, priceMax: true, whatsapp: true },
  });
}

export async function getFaqs(): Promise<PublicFaq[]> {
  if (await shouldUseFixtures()) return FIXTURE_FAQS;
  const db = await getDb();
  const rows = await db.faq.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, question: true, answer: true },
  });
  return rows.length > 0 ? rows : FIXTURE_FAQS; // TODO(klien): hapus fallback setelah FAQ diisi di DB
}

/** Tanggal tutup penuh dalam rentang (YYYY-MM-DD). */
export async function getClosedDates(from: string, to: string): Promise<string[]> {
  if (await shouldUseFixtures()) return [];
  const db = await getDb();
  const rows = await db.closedDate.findMany({
    where: { date: { gte: parseDateOnly(from)!, lte: parseDateOnly(to)! } },
    select: { date: true },
  });
  return rows.map((r) => r.date.toISOString().slice(0, 10));
}

/** Sisa kuota per sesi untuk satu tanggal. Pesanan BATAL tidak dihitung. */
export async function getAvailability(visitDate: string): Promise<SessionAvailability[]> {
  const date = parseDateOnly(visitDate);
  if (!date) return [];
  const sessions = await getSessions();
  if (await shouldUseFixtures()) return sessions.map((s) => ({ ...s, remaining: s.quota, closed: false }));

  const db = await getDb();
  const [sums, slots] = await Promise.all([
    db.booking.groupBy({
      by: ["sessionId"],
      where: { visitDate: date, status: { not: "BATAL" } },
      _sum: { participantCount: true },
    }),
    db.sessionSlot.findMany({ where: { visitDate: date, isClosed: true }, select: { sessionId: true } }),
  ]);
  const used = new Map(sums.map((s) => [s.sessionId, s._sum.participantCount ?? 0]));
  const closed = new Set(slots.map((s) => s.sessionId));
  return sessions.map((s) => ({
    ...s,
    remaining: Math.max(0, s.quota - (used.get(s.id) ?? 0)),
    closed: closed.has(s.id),
  }));
}
