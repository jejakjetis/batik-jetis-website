import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

export function SectionHeading({
  id,
  eyebrow,
  title,
  accent = false,
  tone = "light",
  children,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  accent?: boolean;
  tone?: "light" | "dark";
  children?: ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className={`mt-3 font-serif text-4xl leading-tight font-semibold sm:text-5xl ${tone === "dark" ? "text-cream" : "text-ink"}`}
      >
        {title}
      </h2>
      {accent && <div aria-hidden="true" className="mt-5 h-0.5 w-14 bg-terracotta" />}
      {children && (
        <div className={`mt-5 text-lg leading-relaxed ${tone === "dark" ? "text-cream/90" : "text-ink/85"}`}>
          {children}
        </div>
      )}
    </div>
  );
}
