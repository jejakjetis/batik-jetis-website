"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number; // dalam ms (misal 100, 200)
  direction?: "up" | "fade";
}

/**
 * Komponen wrapper animasi scroll reveal yang tenang, minimalis, dan elegan.
 * Menggunakan IntersectionObserver native browser agar performa 60fps tanpa beban library berat.
 */
export function AnimateIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect user's motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const baseStyle = {
    transitionDuration: "750ms",
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const transformClass =
    direction === "up"
      ? isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-6"
      : isVisible
      ? "opacity-100"
      : "opacity-0";

  return (
    <div
      ref={ref}
      style={baseStyle}
      className={`transition-all will-change-[opacity,transform] ${transformClass} ${className}`}
    >
      {children}
    </div>
  );
}

