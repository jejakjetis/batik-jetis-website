import { NextResponse, type NextRequest } from "next/server";

// Sementara: uji kompatibilitas proxy.ts di OpenNext Cloudflare.
// Nanti diisi cek sesi Supabase untuk /admin/**.
export function proxy(request: NextRequest) {
  const res = NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/admin")) res.headers.set("x-proxy-check", "1");
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
