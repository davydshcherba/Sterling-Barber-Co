import Link from "next/link";
import site from "@/data/site.json";
import { hoursSummary } from "@/lib/time";
import { BarberPole } from "./BarberPole";
import { Seal } from "./Logo";

export function Footer() {
  return (
    <footer className="dark-zone mt-auto bg-board text-cream">
      <BarberPole className="h-2.5" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[auto_1fr_1fr_1fr] md:items-start">
        <Seal className="size-28 md:size-32" />

        <div>
          <h2 className="font-sign text-sm uppercase tracking-[.22em] text-brass-light">Find us</h2>
          <p className="mt-3">{site.address.line1}</p>
          <p className="text-cream/80">{site.address.line2}</p>
          <p className="mt-2">
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="underline underline-offset-4 hover:text-brass-light">
              {site.phone}
            </a>
          </p>
        </div>

        <div>
          <h2 className="font-sign text-sm uppercase tracking-[.22em] text-brass-light">Hours</h2>
          <ul className="mt-3 space-y-1">
            {hoursSummary().map((h) => (
              <li key={h.days} className="flex gap-3">
                <span className="w-16 text-cream/80">{h.days}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sign text-sm uppercase tracking-[.22em] text-brass-light">Explore</h2>
          <ul className="mt-3 space-y-1">
            <li><Link href="/book" className="underline-offset-4 hover:text-brass-light hover:underline">Book online</Link></li>
            <li><Link href="/#services" className="underline-offset-4 hover:text-brass-light hover:underline">Services</Link></li>
            <li><a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-brass-light hover:underline">Instagram</a></li>
            <li><a href={site.social.telegram} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-brass-light hover:underline">Telegram</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brass/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-cream/75 sm:flex-row">
          <p>
            &copy; {site.name} · {site.city}
          </p>
          <a
            href="https://makelabhq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:text-brass-light hover:underline"
          >
            Demo by Make Lab → makelabhq.com
          </a>
        </div>
      </div>
    </footer>
  );
}
