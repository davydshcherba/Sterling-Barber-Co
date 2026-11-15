import Image from "next/image";
import Link from "next/link";
import { barbers } from "@/lib/booking";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Barbers() {
  return (
    <section id="barbers" aria-labelledby="barbers-title" className="paper-deep py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          id="barbers-title"
          eyebrow="Behind the Chair"
          title="Meet the Barbers"
          intro="Four barbers, one standard. Pick the one whose work you like, or let us match you."
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {barbers.map((b, i) => (
            <li key={b.id}>
              <Reveal delay={i * 80} className="h-full">
                <article className="flex h-full flex-col border-2 border-ink bg-cream p-2">
                  <div className="relative aspect-[4/5] overflow-hidden border border-ink">
                    <Image
                      src={b.photo}
                      alt={`${b.name}, ${b.role}`}
                      fill
                      quality={70}
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover"
                      style={{ objectPosition: b.position }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-2 pb-3 pt-4">
                    <h3 className="font-display text-2xl font-bold leading-tight">{b.name}</h3>
                    <p className="mt-1 font-sign text-sm uppercase tracking-[.16em] text-barber-red">{b.role}</p>
                    <p className="mt-3 font-medium">{b.specialty}</p>
                    <p className="mt-1 flex-1 text-sm text-ink-soft">{b.bio}</p>
                    <Link href={`/book?barber=${b.id}`} className="btn btn-outline btn-sm mt-5 w-full">
                      Book with {b.name.split(" ")[0]}
                    </Link>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
