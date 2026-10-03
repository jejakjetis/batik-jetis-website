"use server";

import { z } from "zod";
import { bookingWindow } from "@/server/booking/dates";
import { getAvailability } from "@/server/db/public";
import type { SessionAvailability } from "@/server/db/types";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** Sisa kuota per sesi (data publik: hanya angka, tanpa data pesanan). */
export async function getSessionAvailability(visitDate: unknown): Promise<SessionAvailability[]> {
  const parsed = dateSchema.safeParse(visitDate);
  if (!parsed.success) return [];
  const { from, to } = bookingWindow(new Date());
  if (parsed.data < from || parsed.data > to) return [];
  try {
    return await getAvailability(parsed.data);
  } catch (e) {
    console.error("getSessionAvailability gagal:", e instanceof Error ? e.name : "unknown");
    return [];
  }
}
