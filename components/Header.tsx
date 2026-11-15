"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { BarberPole } from "./BarberPole";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#barbers", label: "Barbers" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-cream">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-[4.5rem]">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-sign text-sm uppercase tracking-[.18em] underline-offset-8 hover:text-barber-red hover:underline"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/book" className="btn btn-red btn-sm">
            Book now
          </Link>
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex size-12 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="size-7 stroke-ink" fill="none" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            {open ? (
              <path d="M5 5 L19 19 M19 5 L5 19" />
            ) : (
              <path d="M4 7h16 M4 12h16 M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        hidden={!open}
        className="border-t-2 border-ink bg-cream px-4 pb-5 pt-2 md:hidden"
      >
        <ul>
          {links.map((l) => (
            <li key={l.href} className="border-b border-ink/20">
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-4 font-sign text-lg uppercase tracking-[.18em]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/book" onClick={() => setOpen(false)} className="btn btn-red mt-5 w-full">
          Book now
        </Link>
      </nav>

      <BarberPole className="h-2" />
    </header>
  );
}
