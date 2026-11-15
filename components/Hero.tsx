import Image from "next/image";
import Link from "next/link";
import site from "@/data/site.json";
import { hoursSummary } from "@/lib/time";
import { Ornament } from "./SectionHeading";
import { Seal } from "./Logo";

export function Hero() {
  const hours = hoursSummary();
  return (
    <section className="dark-zone relative isolate overflow-hidden bg-board text-cream" aria-labelledby="hero-title">
      <Image
        src="/images/hero.jpg"
        alt="Interior of a vintage barbershop with red leather barber chairs"
        fill
        priority
        quality={70}
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-board/60" />

      <div className="mx-auto flex min-h-[calc(100svh-6rem)] max-w-6xl items-center px-4 py-12 md:py-20">
        <div className="relative w-full max-w-2xl border-2 border-brass bg-board/90 p-2 sm:p-3">
          <div className="border border-brass/70 px-5 py-9 text-center sm:px-10 sm:py-12">
            <p className="font-sign text-xs uppercase tracking-[.28em] text-brass-light sm:text-sm">
              {site.hero.eyebrow}
            </p>
            <h1
              id="hero-title"
              className="mt-4 font-display text-5xl font-black leading-[1.02] sm:text-6xl md:text-7xl"
            >
              Sterling
              <span className="block font-sign text-[.42em] font-medium uppercase tracking-[.34em] text-brass-light">
                Barber Co.
              </span>
            </h1>
            <Ornament dark />
            <p className="mx-auto max-w-md text-base text-cream/90 sm:text-lg">{site.hero.subtitle}</p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
              <Link href="/book" className="btn btn-red border-cream/0 hover:border-cream hover:bg-cream hover:text-ink">
                Book now
              </Link>
              <Link href="/#services" className="btn btn-cream">
                Services &amp; prices
              </Link>
            </div>

            <dl className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 border-t border-brass/50 pt-5 font-sign text-sm uppercase tracking-[.16em]">
              {hours.map((h) => (
                <div key={h.days} className="flex gap-2">
                  <dt className="text-brass-light">{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <Seal className="absolute bottom-8 right-8 hidden size-36 rotate-6 lg:block xl:right-16" />
      </div>
    </section>
  );
}
