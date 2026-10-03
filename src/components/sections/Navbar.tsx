"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS, SITE } from "@/lib/site";
import { buttonClasses } from "@/components/ui/Button";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-espresso focus:px-4 focus:py-2 focus:text-cream"
      >
        Lewati ke konten
      </a>
      <nav aria-label="Navigasi utama" className="mx-auto flex h-16 max-w-site items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <Link href="/#beranda" className="font-serif text-xl font-semibold text-ink sm:text-2xl">
          {SITE.name}
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-[15px] text-muted transition-colors hover:text-terracotta-text">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link href="/#pemesanan" className={buttonClasses("primary", "md", "max-sm:hidden")}>
            Pesan Tiket
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[4px] text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Tutup menu" : "Buka menu"}</span>
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="menu-mobile"
        ref={menuRef}
        hidden={!open}
        className="border-t border-line bg-cream lg:hidden"
      >
        <ul className="mx-auto flex max-w-site flex-col px-4 py-2 sm:px-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-base text-ink hover:text-terracotta-text"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="py-3 sm:hidden">
            <Link href="/#pemesanan" onClick={() => setOpen(false)} className={buttonClasses("primary", "md", "w-full")}>
              Pesan Tiket
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
