import reviews from "@/data/reviews.json";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

function Stars({ n }: { n: number }) {
  return (
    <div role="img" aria-label={`${n} out of 5 stars`} className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`size-5 ${i < n ? "fill-barber-red" : "fill-ink/20"}`} aria-hidden="true">
          <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6L10 15l-5.3 3 1.1-6L1.4 7.8l6-.8z" />
        </svg>
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="paper-deep py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          id="reviews-title"
          eyebrow="Kind Words"
          title="What Clients Say"
          intro="These are sample reviews for this demo site."
        />
        <ul className="grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <li key={r.name}>
              <Reveal delay={i * 90} className="h-full">
                <figure className="relative flex h-full flex-col border-2 border-ink bg-cream p-6">
                  <span className="absolute -top-3 right-4 -rotate-2 border border-ink bg-brass-light px-2 py-0.5 font-sign text-[.7rem] uppercase tracking-[.18em] text-ink">
                    Sample review
                  </span>
                  <Stars n={r.rating} />
                  <blockquote className="mt-4 flex-1 font-display text-lg leading-relaxed">
                    &ldquo;{r.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-ink/30 pt-3 font-sign text-sm uppercase tracking-[.18em]">
                    {r.name}
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
