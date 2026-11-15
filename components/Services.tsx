import Link from "next/link";
import { services, formatPrice } from "@/lib/booking";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          id="services-title"
          eyebrow="The Menu"
          title="Services & Prices"
          intro="Straightforward prices, no surprises. Time shown is what you can expect in the chair."
        />

        <Reveal>
          <div className="board dark-zone text-cream">
            <div className="px-5 py-9 md:px-12 md:py-12">
              <ul className="grid gap-x-16 gap-y-9 md:grid-cols-2">
                {services.map((s) => (
                  <li key={s.id}>
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-sign text-xl uppercase tracking-[.1em] md:text-2xl">{s.name}</h3>
                      <span className="mb-1.5 min-w-6 flex-1 border-b-2 border-dotted border-cream/40" aria-hidden="true" />
                      <span className="font-display text-2xl font-bold text-brass-light">
                        {formatPrice(s.price)}
                      </span>
                    </div>
                    <p className="mt-1 text-[.95rem] text-cream/80">{s.description}</p>
                    <p className="mt-3 flex items-center justify-between gap-4">
                      <span className="font-sign text-xs uppercase tracking-[.2em] text-brass-light">
                        {s.duration} min
                      </span>
                      <Link
                        href={`/book?service=${s.id}`}
                        className="font-sign text-xs uppercase tracking-[.2em] underline underline-offset-4 hover:text-brass-light"
                      >
                        Book<span className="sr-only"> {s.name}</span> →
                      </Link>
                    </p>
                  </li>
                ))}
                <li className="flex items-center border border-dashed border-brass/60 p-5 text-sm text-cream/80">
                  Prices are in euros. Not sure what you need? Ask your barber in the chair and he will advise.
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 text-center">
          <Link href="/book" className="btn btn-red">
            Book now
          </Link>
        </div>
      </div>
    </section>
  );
}
