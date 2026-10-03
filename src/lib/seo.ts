import "server-only";

/** URL kanonis situs dari env runtime SITE_URL (tanpa garis miring akhir). */
export function siteUrl(): string {
  const v = process.env.SITE_URL;
  if (v && /^https?:\/\//.test(v)) return v.replace(/\/+$/, "");
  if (process.env.NODE_ENV === "production") throw new Error("SITE_URL belum diisi");
  return "http://localhost:3000";
}
