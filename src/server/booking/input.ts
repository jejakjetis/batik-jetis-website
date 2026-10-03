import { z } from "zod";

/** Normalisasi nomor WA Indonesia ke format 62…; null jika tidak valid. */
export function normalizeWhatsapp(raw: string): string | null {
  let n = raw.replace(/[\s\-().]/g, "");
  if (n.startsWith("+")) n = n.slice(1);
  if (n.startsWith("0")) n = `62${n.slice(1)}`;
  else if (n.startsWith("8")) n = `62${n}`;
  return /^628\d{7,12}$/.test(n) ? n : null;
}

const trimmed = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) =>
  trimmed(max)
    .optional()
    .transform((v) => (v ? v : undefined));

// Hanya pilihan dan data diri yang diterima dari klien. Harga/total tidak pernah.
export const bookingInputSchema = z
  .object({
    packageId: z.string().min(1).max(40),
    sessionId: z.string().min(1).max(40),
    visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    participantCount: z.coerce.number().int().min(1).max(100),
    customerName: trimmed(100).min(2),
    email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
    whatsapp: z
      .string()
      .max(20)
      .transform((v, ctx) => {
        const n = normalizeWhatsapp(v);
        if (!n) {
          ctx.addIssue({ code: "custom", message: "Nomor WhatsApp tidak valid" });
          return z.NEVER;
        }
        return n;
      }),
    institution: optionalText(150),
    notes: optionalText(500),
  })
  .strict();

export type BookingInput = z.output<typeof bookingInputSchema>;
