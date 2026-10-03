import { describe, expect, it } from "vitest";
import { generateBookingCode } from "./code";
import { bookingInputSchema, normalizeWhatsapp } from "./input";
import { buildWhatsappMessage, buildWhatsappUrl, formatDateId } from "./whatsapp";
import { memoryLimit } from "../security/rate-limit";

const valid = {
  packageId: "pkg",
  sessionId: "ses",
  visitDate: "2026-10-10",
  participantCount: "3",
  customerName: "  Budi  ",
  email: "Budi@Example.com",
  whatsapp: "0812-3456-7890",
};

describe("bookingInputSchema", () => {
  it("normalisasi dan coercion", () => {
    const r = bookingInputSchema.parse(valid);
    expect(r).toMatchObject({ customerName: "Budi", email: "budi@example.com", whatsapp: "6281234567890", participantCount: 3 });
  });
  it("menolak field tak dikenal (mis. harga dari klien)", () => {
    expect(bookingInputSchema.safeParse({ ...valid, totalPrice: 1 }).success).toBe(false);
  });
  it("membatasi panjang string", () => {
    expect(bookingInputSchema.safeParse({ ...valid, customerName: "a".repeat(101) }).success).toBe(false);
    expect(bookingInputSchema.safeParse({ ...valid, notes: "a".repeat(501) }).success).toBe(false);
  });
});

describe("normalizeWhatsapp", () => {
  it.each([
    ["081234567890", "6281234567890"],
    ["+62 812 3456 7890", "6281234567890"],
    ["6281234567890", "6281234567890"],
    ["81234567890", "6281234567890"],
  ])("%s -> %s", (input, out) => expect(normalizeWhatsapp(input)).toBe(out));
  it("menolak nomor tidak valid", () => {
    expect(normalizeWhatsapp("12345")).toBeNull();
    expect(normalizeWhatsapp("0212345678")).toBeNull();
  });
});

describe("kode pesanan", () => {
  it("8 karakter dari alfabet aman, tidak berulang", () => {
    const codes = new Set(Array.from({ length: 2000 }, () => generateBookingCode()));
    expect(codes.size).toBe(2000);
    for (const c of codes) expect(c).toMatch(/^[A-HJKMNP-Z2-9]{8}$/);
  });
});

describe("pesan WhatsApp", () => {
  it("format tanggal Indonesia dan URL ter-encode", () => {
    expect(formatDateId("2026-10-04")).toBe("Minggu, 4 Oktober 2026");
    const msg = buildWhatsappMessage({
      code: "ABCD2345", packageName: "Paket Umum", visitDate: "2026-10-04", sessionLabel: "Sesi Pagi",
      sessionTime: "08:00–10:00", participantCount: 2, totalPrice: 108000, customerName: "Siti & Co",
    });
    const url = buildWhatsappUrl("6281234567890", msg);
    expect(url.startsWith("https://wa.me/6281234567890?text=")).toBe(true);
    expect(url).not.toContain("&Co");
    expect(decodeURIComponent(url.split("text=")[1])).toBe(msg);
    expect(() => buildWhatsappUrl("081234", msg)).toThrow();
  });
});

describe("rate limit fallback", () => {
  it("maks 5 per 10 menit per key", () => {
    const t = 1_000_000;
    const rule = { limit: 5, windowMs: 10 * 60 * 1000 };
    for (let i = 0; i < 5; i++) expect(memoryLimit("ip-a", rule, t + i)).toBe(true);
    expect(memoryLimit("ip-a", rule, t + 10)).toBe(false);
    expect(memoryLimit("ip-b", rule, t + 10)).toBe(true);
    expect(memoryLimit("ip-a", rule, t + 10 * 60 * 1000 + 1)).toBe(true);
  });
});
