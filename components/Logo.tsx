import { useId } from "react";
import Link from "next/link";
import site from "@/data/site.json";

/** Crossed-scissors mark used inside both the compact badge and the large seal. */
function Scissors({ stroke = "stroke-cream" }: { stroke?: string }) {
  return (
    <g className={stroke} fill="none" strokeLinecap="round" strokeWidth="3">
      <path d="M41 44 L23 13" />
      <path d="M23 44 L41 13" />
      <circle cx="42" cy="49" r="5.2" strokeWidth="2.6" />
      <circle cx="22" cy="49" r="5.2" strokeWidth="2.6" />
      <circle cx="32" cy="28.5" r="1.8" className="fill-brass stroke-none" />
    </g>
  );
}

/** Round badge with scissors. Compact version for the header. */
export function LogoMark({ className = "size-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30" className="fill-ink" />
      <circle cx="32" cy="32" r="27" fill="none" className="stroke-brass" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="24.5" fill="none" className="stroke-cream" strokeWidth=".6" opacity=".6" />
      <Scissors />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label={`${site.name}, home`}
    >
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-black tracking-tight text-ink sm:text-2xl">
          Sterling
        </span>
        <span className="mt-1 font-sign text-[.7rem] uppercase tracking-[.22em] text-barber-red">
          Barber Co. · Est. {site.established}
        </span>
      </span>
    </Link>
  );
}

/** Full seal with ring text and an "Est." ribbon. Used in the hero and the footer. */
export function Seal({ className = "size-40" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <defs>
        <path id={id} d="M100,100 m-73,0 a73,73 0 1,1 146,0 a73,73 0 1,1 -146,0" />
      </defs>
      <circle cx="100" cy="100" r="96" className="fill-ink" />
      <circle cx="100" cy="100" r="90" fill="none" className="stroke-brass" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="52" fill="none" className="stroke-brass" strokeWidth="1" />
      <text className="font-sign fill-cream" fontSize="17" letterSpacing="4.4">
        <textPath href={`#${id}`} startOffset="2%">
          STERLING BARBER CO. • LVIV •
        </textPath>
      </text>
      <g transform="translate(58 52) scale(1.3)">
        <Scissors />
      </g>
      <polygon points="52,128 148,128 140,139 148,150 52,150 60,139" className="fill-barber-red" />
      <text x="100" y="144.5" textAnchor="middle" className="font-sign fill-cream" fontSize="13" letterSpacing="2.5">
        EST. {site.established}
      </text>
    </svg>
  );
}
