type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  dark?: boolean;
  id?: string;
};

export function Ornament({ dark = false }: { dark?: boolean }) {
  const line = dark ? "bg-brass" : "bg-ink/50";
  return (
    <div className="my-4 flex items-center justify-center gap-3" aria-hidden="true">
      <span className={`h-px w-14 ${line}`} />
      <svg viewBox="0 0 12 12" className="size-3 fill-brass">
        <path d="M6 0 L12 6 L6 12 L0 6 Z" />
      </svg>
      <span className={`h-px w-14 ${line}`} />
    </div>
  );
}

export function SectionHeading({ eyebrow, title, intro, dark = false, id }: Props) {
  return (
    <header className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
      <p className={`font-sign text-sm uppercase tracking-[.28em] ${dark ? "text-brass-light" : "text-barber-red"}`}>
        {eyebrow}
      </p>
      <h2 id={id} className="mt-2 font-display text-4xl font-black leading-tight md:text-5xl">
        {title}
      </h2>
      <Ornament dark={dark} />
      {intro ? <p className={`text-base md:text-lg ${dark ? "text-cream/80" : "text-ink-soft"}`}>{intro}</p> : null}
    </header>
  );
}
