// Kode pesanan 8 karakter dari CSPRNG. Alfabet tanpa karakter mirip (0/O, 1/I/L).
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // 31 karakter

export function generateBookingCode(length = 8): string {
  const out: string[] = [];
  // Rejection sampling agar distribusi merata.
  const limit = 256 - (256 % ALPHABET.length);
  while (out.length < length) {
    const bytes = crypto.getRandomValues(new Uint8Array(length * 2));
    for (const b of bytes) {
      if (b < limit && out.length < length) out.push(ALPHABET[b % ALPHABET.length]);
    }
  }
  return out.join("");
}
