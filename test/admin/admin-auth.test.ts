import { beforeEach, describe, expect, it, vi } from "vitest";
import { authorizeAdmin } from "@/server/auth/authorize";
import { canTransition } from "@/server/booking/status";

// --- Mock I/O: sesi Supabase, DB, header, navigasi ---
const getUser = vi.fn();
const signInWithPassword = vi.fn();
const signOut = vi.fn();
vi.mock("@/server/auth/supabase", () => ({
  createSupabaseServerClient: async () => ({ auth: { getUser, signInWithPassword, signOut } }),
}));
const dbCalls: string[] = [];
const fakeDb = {
  $transaction: vi.fn(async () => {
    dbCalls.push("transaction");
    return { ok: true };
  }),
  $queryRaw: vi.fn(async () => [{ count: 1 }]),
};
vi.mock("@/server/db/client", () => ({ getDb: async () => fakeDb }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "cf-connecting-ip": "1.2.3.4" }) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
const redirect = vi.fn((url: string) => {
  throw new Error(`REDIRECT:${url}`);
});
vi.mock("next/navigation", () => ({ redirect: (u: string) => redirect(u) }));

beforeEach(() => {
  vi.clearAllMocks();
  dbCalls.length = 0;
  Object.assign(process.env, {
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_ANON_KEY: "anon",
    ADMIN_EMAILS: "Admin@Example.com, kedua@example.com",
    BOOKING_WHATSAPP_NUMBER: "6281234567890",
    SITE_URL: "https://example.com",
    TURNSTILE_SITE_KEY: "x",
    TURNSTILE_SECRET_KEY: "y",
  });
});

function statusForm() {
  const fd = new FormData();
  fd.set("bookingId", "b1");
  fd.set("from", "MENUNGGU");
  fd.set("to", "DIKONFIRMASI");
  return fd;
}

describe("authorizeAdmin", () => {
  const list = ["admin@example.com"];
  it("menolak tanpa sesi, tanpa email, dan email di luar allowlist", () => {
    expect(authorizeAdmin(null, list)).toBeNull();
    expect(authorizeAdmin({ id: "u", email: null }, list)).toBeNull();
    expect(authorizeAdmin({ id: "u", email: "lain@example.com" }, list)).toBeNull();
  });
  it("menerima email allowlist (tidak peka huruf besar)", () => {
    expect(authorizeAdmin({ id: "u", email: " ADMIN@example.com " }, list)).toEqual({ id: "u", email: "admin@example.com" });
  });
});

describe("transisi status", () => {
  it("hanya arah yang valid", () => {
    expect(canTransition("MENUNGGU", "DIKONFIRMASI")).toBe(true);
    expect(canTransition("LUNAS", "MENUNGGU")).toBe(false);
    expect(canTransition("BATAL", "LUNAS")).toBe(false);
    expect(canTransition("SELESAI", "BATAL")).toBe(false);
  });
});

describe("Server Action admin tanpa sesi", () => {
  it("updateBookingStatus ditolak dan DB tidak disentuh bila tidak ada sesi", async () => {
    getUser.mockResolvedValue({ data: { user: null } });
    const { updateBookingStatus } = await import("@/app/actions/admin");
    const r = await updateBookingStatus({}, statusForm());
    expect(r.error).toMatch(/Sesi berakhir/);
    expect(dbCalls).toEqual([]);
  });

  it("updateBookingStatus ditolak bila email tidak di allowlist", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u", email: "penyusup@example.com" } } });
    const { updateBookingStatus } = await import("@/app/actions/admin");
    const r = await updateBookingStatus({}, statusForm());
    expect(r.error).toBeDefined();
    expect(dbCalls).toEqual([]);
  });

  it("updateBookingStatus jalan untuk admin di allowlist", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u", email: "admin@example.com" } } });
    const { updateBookingStatus } = await import("@/app/actions/admin");
    const r = await updateBookingStatus({}, statusForm());
    expect(r).toEqual({ ok: true });
    expect(dbCalls).toEqual(["transaction"]);
  });

  it("login menolak email di luar allowlist tanpa memanggil Supabase", async () => {
    const { login } = await import("@/app/actions/admin");
    const fd = new FormData();
    fd.set("email", "bukan-admin@example.com");
    fd.set("password", "rahasia");
    const r = await login({}, fd);
    expect(r.error).toBeDefined();
    expect(signInWithPassword).not.toHaveBeenCalled();
  });
});

describe("layout /admin tanpa sesi", () => {
  it("requireAdminPage mengarahkan ke /admin/login", async () => {
    getUser.mockResolvedValue({ data: { user: null } });
    const { requireAdminPage } = await import("@/server/auth/admin");
    await expect(requireAdminPage()).rejects.toThrow("REDIRECT:/admin/login");
  });
  it("layout panel admin tidak merender konten tanpa sesi", async () => {
    getUser.mockResolvedValue({ data: { user: null } });
    const { default: Layout } = await import("@/app/admin/(panel)/layout");
    await expect(Layout({ children: null } as never)).rejects.toThrow("REDIRECT:/admin/login");
  });
});
