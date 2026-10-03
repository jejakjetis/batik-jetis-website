import { describe, expect, it } from "vitest";
import {
  checkQuota,
  computeTotal,
  daysBetween,
  parseDateOnly,
  sessionOverlapsClosedHours,
  todayInJakarta,
  validateParticipants,
  validateSession,
  validateVisitDate,
} from "./rules";

// Kamis 1 Okt 2026 10:00 WIB = 03:00 UTC
const THU_MORNING = new Date("2026-10-01T03:00:00Z");

describe("todayInJakarta", () => {
  it("memakai WIB, bukan UTC", () => {
    // 2026-10-01 18:30 UTC = 2026-10-02 01:30 WIB
    expect(todayInJakarta(new Date("2026-10-01T18:30:00Z"))).toBe("2026-10-02");
    expect(todayInJakarta(new Date("2026-10-01T16:59:59Z"))).toBe("2026-10-01");
  });
});

describe("parseDateOnly", () => {
  it("menolak tanggal tidak ada dan format salah", () => {
    expect(parseDateOnly("2026-02-30")).toBeNull();
    expect(parseDateOnly("2026-1-3")).toBeNull();
    expect(parseDateOnly("2026-10-03T00:00")).toBeNull();
    expect(parseDateOnly("2026-10-03")?.toISOString()).toBe("2026-10-03T00:00:00.000Z");
  });
  it("menghitung selisih hari", () => {
    expect(daysBetween("2026-10-01", "2026-10-04")).toBe(3);
  });
});

describe("validateVisitDate", () => {
  it("menerima Sabtu/Minggu tepat H-3", () => {
    expect(validateVisitDate("2026-10-04", THU_MORNING, false)).toEqual({ ok: true }); // Minggu
  });
  it("menolak H-2", () => {
    expect(validateVisitDate("2026-10-03", THU_MORNING, false)).toEqual({ ok: false, error: "TOO_SOON" });
  });
  it("H-3 dihitung dengan tanggal WIB (lewat tengah malam WIB)", () => {
    // Kamis 1 Okt 23:30 WIB masih boleh pesan Minggu 4 Okt; Jumat 2 Okt 00:30 WIB tidak.
    expect(validateVisitDate("2026-10-04", new Date("2026-10-01T16:30:00Z"), false).ok).toBe(true);
    expect(validateVisitDate("2026-10-04", new Date("2026-10-01T17:30:00Z"), false)).toEqual({
      ok: false,
      error: "TOO_SOON",
    });
  });
  it("menolak hari kerja", () => {
    expect(validateVisitDate("2026-10-09", THU_MORNING, false)).toEqual({ ok: false, error: "NOT_WEEKEND" });
  });
  it("menolak lebih dari 60 hari", () => {
    expect(validateVisitDate("2026-11-29", THU_MORNING, false).ok).toBe(true); // 59 hari, Minggu
    expect(validateVisitDate("2026-12-05", THU_MORNING, false)).toEqual({ ok: false, error: "TOO_FAR" });
  });
  it("menolak tanggal tutup dan tanggal tidak valid", () => {
    expect(validateVisitDate("2026-10-10", THU_MORNING, true)).toEqual({ ok: false, error: "DATE_CLOSED" });
    expect(validateVisitDate("bukan-tanggal", THU_MORNING, false)).toEqual({ ok: false, error: "INVALID_DATE" });
  });
});

describe("sesi", () => {
  it("mendeteksi irisan dengan jam tutup 12–15", () => {
    expect(sessionOverlapsClosedHours("10:00", "12:00")).toBe(false);
    expect(sessionOverlapsClosedHours("15:00", "17:00")).toBe(false);
    expect(sessionOverlapsClosedHours("11:00", "13:00")).toBe(true);
    expect(sessionOverlapsClosedHours("14:30", "16:00")).toBe(true);
  });
  it("menolak sesi tidak aktif, tidak ada, atau ditutup", () => {
    const s = { isActive: true, startTime: "08:00", endTime: "10:00" };
    expect(validateSession(s, false).ok).toBe(true);
    expect(validateSession(null, false).ok).toBe(false);
    expect(validateSession({ ...s, isActive: false }, false).ok).toBe(false);
    expect(validateSession(s, true)).toEqual({ ok: false, error: "SESSION_UNAVAILABLE" });
  });
});

describe("peserta, harga, kuota", () => {
  const umum = { minParticipants: 1, maxParticipants: 20 };
  const pelajar = { minParticipants: 20, maxParticipants: 30 };
  it("batas peserta per paket", () => {
    expect(validateParticipants(umum, 1).ok).toBe(true);
    expect(validateParticipants(umum, 20).ok).toBe(true);
    expect(validateParticipants(umum, 21).ok).toBe(false);
    expect(validateParticipants(umum, 0).ok).toBe(false);
    expect(validateParticipants(umum, 2.5).ok).toBe(false);
    expect(validateParticipants(pelajar, 19).ok).toBe(false);
    expect(validateParticipants(pelajar, 30).ok).toBe(true);
  });
  it("total integer rupiah", () => {
    expect(computeTotal(54000, 3)).toBe(162000);
    expect(computeTotal(39000, 30)).toBe(1170000);
    expect(() => computeTotal(54000.5, 1)).toThrow();
    expect(() => computeTotal(54000, 0)).toThrow();
  });
  it("kuota 30 per sesi", () => {
    expect(checkQuota(25, 5, 30).ok).toBe(true);
    expect(checkQuota(25, 6, 30)).toEqual({ ok: false, error: "QUOTA_EXCEEDED" });
  });
});

import { bookableDates, bookingWindow } from "./dates";

describe("bookableDates", () => {
  it("hanya Sabtu/Minggu dalam H-3..60, tanpa tanggal tutup", () => {
    expect(bookingWindow(THU_MORNING)).toEqual({ from: "2026-10-04", to: "2026-11-30" });
    const dates = bookableDates(THU_MORNING, ["2026-10-10"]);
    expect(dates[0]).toEqual({ value: "2026-10-04", label: "Minggu, 4 Oktober 2026" });
    expect(dates.map((d) => d.value)).not.toContain("2026-10-10");
    expect(dates.map((d) => d.value)).toContain("2026-10-11");
    expect(dates.every((d) => [0, 6].includes(new Date(`${d.value}T00:00:00Z`).getUTCDay()))).toBe(true);
    expect(dates.at(-1)?.value).toBe("2026-11-29");
  });
});
