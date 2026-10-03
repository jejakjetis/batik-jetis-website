import type { ReactNode } from "react";

export function Eyebrow({
  children,
  tone = "light",
  as: Tag = "p",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  as?: "p" | "span";
}) {
  const color = tone === "dark" ? "text-terracotta-light" : "text-terracotta-text";
  return (
    <Tag className={`text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm ${color}`}>{children}</Tag>
  );
}
