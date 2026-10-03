// TODO(klien): ganti dengan foto asli yang sudah dioptimasi (WebP, lebar ≤1600px untuk hero,
// ≤800px untuk kartu) di /public/images, lalu pakai next/image.
export function PhotoPlaceholder({
  label,
  tone = "light",
  className = "",
}: {
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const bg = tone === "dark" ? "bg-[url(/images/kawung-dark.svg)]" : "bg-[url(/images/kawung-light.svg)]";
  const text = tone === "dark" ? "text-cream/80" : "text-muted";
  return (
    <div role="img" aria-label={label} className={`relative overflow-hidden bg-repeat ${bg} ${className}`}>
      <span className={`absolute right-3 bottom-3 rounded-sm bg-cream/85 px-2 py-1 text-xs ${tone === "dark" ? "text-espresso" : text}`}>
        Foto menyusul
      </span>
    </div>
  );
}
