import "server-only";
import { z } from "zod";

// Divalidasi saat server start (src/instrumentation.ts) dan lazy saat pertama dipakai.
// Tidak saat build, agar build tidak butuh secret. Gagal keras jika env wajib kosong.
const serverEnvSchema = z.object({
  DATABASE_URL: z.url(), // pooler Supabase transaction mode (6543)
  SUPABASE_URL: z.url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  ADMIN_EMAILS: z
    .string()
    .min(1)
    .transform((v) =>
      v
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean),
    )
    .pipe(z.array(z.email()).min(1)),
  BOOKING_WHATSAPP_NUMBER: z.string().regex(/^62\d{8,13}$/),
  SITE_URL: z.url(),
  TURNSTILE_SITE_KEY: z.string().min(1),
  TURNSTILE_SECRET_KEY: z.string().min(1),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const parsed = serverEnvSchema.safeParse(source);
  if (!parsed.success) {
    // Hanya nama variabel yang disebut, tidak pernah nilainya.
    const names = [...new Set(parsed.error.issues.map((i) => i.path.join(".")))].join(", ");
    throw new Error(`Env tidak valid atau belum diisi: ${names}`);
  }
  return parsed.data;
}

export function getServerEnv(): ServerEnv {
  cached ??= parseServerEnv(process.env);
  return cached;
}
