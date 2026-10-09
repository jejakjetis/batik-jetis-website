// Bentuk data publik yang boleh dikirim ke halaman. Tidak pernah berisi data pesanan.
export type PublicPackage = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  pricePerPerson: number;
  durationMinutes: number;
  minParticipants: number;
  maxParticipants: number;
  facilities: string[];
};

export type PublicSession = {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  quota: number;
};

export type SessionAvailability = PublicSession & { remaining: number; closed: boolean };

export type PublicUmkm = {
  id: string;
  name: string;
  mapCode: string | null;
  products: string[];
  description: string | null;
  priceMin: number | null;
  priceMax: number | null;
  discountCoupon: number | null;
  imageUrl: string | null;
  whatsapp: string | null;
};

export type PublicFaq = { id: string; question: string; answer: string };
