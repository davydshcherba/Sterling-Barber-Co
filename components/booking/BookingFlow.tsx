"use client";

import { useEffect, useId, useRef, useState, type ChangeEventHandler, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ANY_BARBER, barbers, formatPrice, isOpenDay, listDates, services, slotsFor } from "@/lib/booking";
import { formatDayParts, formatLongDate, shopNow, toHM, toMinutes, type Now } from "@/lib/time";

const STEPS = ["Service", "Barber", "Date", "Time", "Details"];
const INPUT =
  "mt-2 block min-h-12 w-full border-2 border-ink bg-cream px-3 text-base aria-invalid:border-barber-red";

type Props = { initialService?: string; initialBarber?: string };
type Errors = { name?: string; phone?: string };

/** A real radio input styled as a card, so arrow keys and screen readers work natively. */
function Choice(props: {
  name: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  label?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  children: ReactNode;
}) {
  const { name, value, checked, disabled, label, onChange, className = "", children } = props;
  return (
    <label className={`block ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
      <input
        type="radio"
        className="peer sr-only"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        aria-label={label}
        onChange={onChange}
      />
      <span
        className={`flex h-full border-2 border-ink bg-cream p-3 transition-colors hover:bg-cream-deep peer-checked:border-barber-red peer-checked:bg-barber-red peer-checked:text-cream peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-solid peer-focus-visible:outline-barber-blue peer-disabled:border-ink/30 peer-disabled:bg-cream-deep peer-disabled:text-ink-soft peer-disabled:hover:bg-cream-deep ${className}`}
      >
        {children}
      </span>
    </label>
  );
}

function Stepper({ step, onJump }: { step: number; onJump: (i: number) => void }) {
  return (
    <ol className="flex" aria-label="Booking progress">
      {STEPS.map((label, i) => {
        const done = i < step;
        const current = i === step;
        const circle = `relative z-10 flex size-10 items-center justify-center rounded-full border-2 font-sign text-base ${
          current
            ? "border-barber-red bg-barber-red text-cream"
            : done
              ? "border-ink bg-ink text-cream"
              : "border-ink/40 bg-cream text-ink-soft"
        }`;
        const inner = done ? (
          <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 10.5 8 14.5 16 6" />
          </svg>
        ) : (
          i + 1
        );
        return (
          <li key={label} className="relative flex flex-1 flex-col items-center gap-1.5" aria-current={current ? "step" : undefined}>
            {i > 0 ? (
              <span className={`absolute right-1/2 top-5 h-0.5 w-full -translate-y-1/2 ${i <= step ? "bg-ink" : "bg-ink/25"}`} aria-hidden="true" />
            ) : null}
            {done ? (
              <button type="button" onClick={() => onJump(i)} className={circle} aria-label={`Back to step ${i + 1}: ${label}`}>
                {inner}
              </button>
            ) : (
              <span className={circle}>
                {inner}
                <span className="sr-only"> {label}</span>
              </span>
            )}
            <span
              className={`font-sign text-[.7rem] uppercase tracking-[.14em] sm:text-xs ${current ? "text-barber-red" : "hidden text-ink-soft sm:block"}`}
              aria-hidden="true"
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function BookingFlow({ initialService, initialBarber }: Props) {
  const uid = useId();
  const headingId = `${uid}-heading`;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(initialService ?? null);
  const [barberId, setBarberId] = useState<string | null>(initialBarber ?? null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [now, setNow] = useState<Now>(() => shopNow());
  const [done, setDone] = useState<{ code: string; barberId: string } | null>(null);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, done]);

  const service = services.find((s) => s.id === serviceId) ?? null;
  const barber = barbers.find((b) => b.id === barberId) ?? null;
  const preselected = Boolean(initialBarber && barber && barber.id === initialBarber);
  const slots = service && barberId && date ? slotsFor({ date, service, barberId, now }) : [];
  const slot = slots.find((s) => s.time === time && s.available) ?? null;

  const go = (n: number) => {
    setNow(shopNow());
    setStep(n);
  };
  const pickService = (id: string) => {
    if (id !== serviceId) {
      setServiceId(id);
      setDate(null);
      setTime(null);
    }
  };
  const pickBarber = (id: string) => {
    if (id !== barberId) {
      setBarberId(id);
      setDate(null);
      setTime(null);
    }
  };
  const pickDate = (d: string) => {
    if (d !== date) {
      setDate(d);
      setTime(null);
    }
  };

  const canContinue = [Boolean(service), Boolean(barberId), Boolean(date), Boolean(slot)][step] ?? false;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    const digits = phone.replace(/\D/g, "");
    if (!/^[+\d\s().-]+$/.test(phone.trim()) || digits.length < 9 || digits.length > 15) {
      next.phone = "Enter a valid phone number, for example +380 67 123 45 67.";
    }
    setErrors(next);
    if (next.name || next.phone) {
      document.getElementById(`${uid}-${next.name ? "name" : "phone"}`)?.focus();
      return;
    }
    setDone({
      code: `SB-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      barberId: (barberId === ANY_BARBER ? slot?.barberId : barberId) ?? barbers[0].id,
    });
  };

  const reset = () => {
    setStep(0);
    setServiceId(null);
    setBarberId(null);
    setDate(null);
    setTime(null);
    setName("");
    setPhone("");
    setErrors({});
    setDone(null);
    setNow(shopNow());
  };

  /* ---------- Confirmation ---------- */
  if (done && service && date && time) {
    const assigned = barbers.find((b) => b.id === done.barberId);
    const end = toHM(toMinutes(time) + service.duration);
    const rows: [string, string][] = [
      ["Service", `${service.name} (${service.duration} min)`],
      ["Barber", assigned?.name ?? "Any barber"],
      ["Date", formatLongDate(date)],
      ["Time", `${time} – ${end}`],
      ["Price", formatPrice(service.price)],
      ["Name", name.trim()],
      ["Phone", phone.trim()],
    ];
    return (
      <section aria-labelledby={headingId} className="border-2 border-ink bg-cream p-2">
        <div className="border border-dashed border-ink px-5 py-8 sm:px-10">
          <p className="font-sign text-sm uppercase tracking-[.24em] text-barber-red">Booking summary</p>
          <h2 id={headingId} ref={headingRef} tabIndex={-1} className="mt-2 font-display text-3xl font-black sm:text-4xl">
            See you soon, {name.trim().split(" ")[0]}.
          </h2>
          <p className="mt-2 text-ink-soft">
            Reference <strong className="font-sign tracking-[.14em] text-ink">{done.code}</strong>
          </p>
          <dl className="mt-6 divide-y divide-ink/20 border-y border-ink/30">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6rem_1fr] gap-3 py-3 sm:grid-cols-[8rem_1fr]">
                <dt className="font-sign text-sm uppercase tracking-[.16em] text-ink-soft">{k}</dt>
                <dd className="font-medium break-words">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 border-l-4 border-brass pl-4 text-sm text-ink-soft">
            This is a demo: no appointment was made and nothing was sent anywhere.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="btn btn-red">
              Back to the site
            </Link>
            <button type="button" onClick={reset} className="btn btn-outline">
              Book another visit
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- Steps ---------- */
  const heading = [
    ["Choose a service", "Pick what you need. The time shown is how long it takes."],
    ["Choose your barber", preselected ? "We picked this barber for you. Change it if you like." : "Pick a barber, or let us assign whoever is free."],
    ["Pick a day", "The next 14 days. We are closed on Sundays."],
    ["Pick a time", "Greyed-out times are already booked."],
    ["Your details", "So we know who to expect."],
  ][step];

  const dates = listDates(now.date);
  const groups = [
    { label: "Morning", items: slots.filter((s) => toMinutes(s.time) < 720) },
    { label: "Afternoon", items: slots.filter((s) => toMinutes(s.time) >= 720 && toMinutes(s.time) < 1020) },
    { label: "Evening", items: slots.filter((s) => toMinutes(s.time) >= 1020) },
  ].filter((g) => g.items.length);

  const summary = [
    service ? `${service.name}, ${formatPrice(service.price)}` : null,
    step > 1 && barber ? barber.name : step > 1 && barberId === ANY_BARBER ? "Any barber" : null,
    step > 2 && date ? formatLongDate(date) : null,
    step > 3 && time ? time : null,
  ].filter(Boolean);

  return (
    <div>
      <div className="mb-8">
        <Stepper step={step} onJump={go} />
      </div>

      <section aria-labelledby={headingId} className="border-2 border-ink bg-cream p-2">
        <div className="border border-ink/40 px-4 py-7 sm:px-8">
          <p className="font-sign text-sm uppercase tracking-[.24em] text-barber-red">
            Step {step + 1} of {STEPS.length}
          </p>
          <h2 id={headingId} ref={headingRef} tabIndex={-1} className="mt-1 scroll-mt-24 font-display text-3xl font-black">
            {heading[0]}
          </h2>
          <p className="mt-1 text-ink-soft">{heading[1]}</p>
          {step > 0 && summary.length ? (
            <p className="mt-4 border-l-4 border-brass bg-cream-deep px-3 py-2 text-sm">
              <span className="font-sign uppercase tracking-[.14em]">Your visit: </span>
              {summary.join(" · ")}
            </p>
          ) : null}

          <div className="mt-6">
            {step === 0 && (
              <div role="radiogroup" aria-labelledby={headingId} className="grid gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <Choice key={s.id} name={`${uid}-service`} value={s.id} checked={serviceId === s.id} onChange={() => pickService(s.id)}>
                    <span className="flex w-full items-start justify-between gap-3">
                      <span>
                        <span className="block font-sign text-lg uppercase tracking-[.08em]">{s.name}</span>
                        <span className="block font-sign text-xs uppercase tracking-[.16em] opacity-80">{s.duration} min</span>
                      </span>
                      <span className="font-display text-xl font-bold">{formatPrice(s.price)}</span>
                    </span>
                  </Choice>
                ))}
              </div>
            )}

            {step === 1 && (
              <div role="radiogroup" aria-labelledby={headingId} className="grid gap-3 sm:grid-cols-2">
                <Choice name={`${uid}-barber`} value={ANY_BARBER} checked={barberId === ANY_BARBER} onChange={() => pickBarber(ANY_BARBER)}>
                  <span className="flex items-center gap-3">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-current font-display text-xl font-bold">?</span>
                    <span>
                      <span className="block font-sign text-lg uppercase tracking-[.08em]">Any barber</span>
                      <span className="block text-sm opacity-80">First available, more times to choose from</span>
                    </span>
                  </span>
                </Choice>
                {barbers.map((b) => (
                  <Choice key={b.id} name={`${uid}-barber`} value={b.id} checked={barberId === b.id} onChange={() => pickBarber(b.id)}>
                    <span className="flex items-center gap-3">
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-current">
                        <Image src={b.photo} alt="" fill sizes="56px" quality={60} className="object-cover" style={{ objectPosition: b.position }} />
                      </span>
                      <span>
                        <span className="block font-sign text-lg uppercase tracking-[.08em]">{b.name}</span>
                        <span className="block text-sm opacity-80">{b.specialty}</span>
                      </span>
                    </span>
                  </Choice>
                ))}
              </div>
            )}

            {step === 2 && service && barberId && (
              <div role="radiogroup" aria-labelledby={headingId} className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7">
                {dates.map((d, i) => {
                  const open = isOpenDay(d);
                  const free = open && slotsFor({ date: d, service, barberId, now }).some((s) => s.available);
                  const p = formatDayParts(d);
                  return (
                    <Choice
                      key={d}
                      name={`${uid}-date`}
                      value={d}
                      checked={date === d}
                      disabled={!free}
                      label={`${formatLongDate(d)}${free ? "" : open ? ", fully booked" : ", closed"}`}
                      onChange={() => pickDate(d)}
                      className="justify-center text-center"
                    >
                      <span className="flex flex-col items-center leading-tight">
                        <span className="font-sign text-xs uppercase tracking-[.16em]">{i === 0 ? "Today" : p.weekday}</span>
                        <span className="font-display text-3xl font-bold">{p.day}</span>
                        <span className="font-sign text-xs uppercase tracking-[.16em]">{p.month}</span>
                        {!free ? <span className="mt-1 text-[.7rem] uppercase tracking-wide">{open ? "Full" : "Closed"}</span> : null}
                      </span>
                    </Choice>
                  );
                })}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {date ? <p className="font-medium">{formatLongDate(date)}</p> : null}
                {groups.map((g) => (
                  <div key={g.label}>
                    <h3 className="mb-2 font-sign text-sm uppercase tracking-[.2em] text-ink-soft">{g.label}</h3>
                    <div role="radiogroup" aria-label={g.label} className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                      {g.items.map((s) => (
                        <Choice
                          key={s.time}
                          name={`${uid}-time`}
                          value={s.time}
                          checked={time === s.time}
                          disabled={!s.available}
                          label={`${s.time}${s.available ? "" : ", booked"}`}
                          onChange={() => setTime(s.time)}
                          className="justify-center py-3 text-center"
                        >
                          <span className={`font-sign text-lg tracking-wider tabular-nums ${s.available ? "" : "line-through"}`}>{s.time}</span>
                        </Choice>
                      ))}
                    </div>
                  </div>
                ))}
                {barberId === ANY_BARBER && slot?.barberId ? (
                  <p className="text-sm text-ink-soft">
                    With &ldquo;any barber&rdquo; this time would be with {barbers.find((b) => b.id === slot.barberId)?.name}.
                  </p>
                ) : null}
              </div>
            )}

            {step === 4 && (
              <form onSubmit={submit} noValidate id={`${uid}-form`}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${uid}-name`} className="font-sign text-sm uppercase tracking-[.16em]">
                      Your name
                    </label>
                    <input
                      id={`${uid}-name`}
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                      className={INPUT}
                    />
                    {errors.name ? (
                      <p id={`${uid}-name-err`} role="alert" className="mt-1 text-sm font-medium text-barber-red">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor={`${uid}-phone`} className="font-sign text-sm uppercase tracking-[.16em]">
                      Phone number
                    </label>
                    <input
                      id={`${uid}-phone`}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+380 67 123 45 67"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
                      className={INPUT}
                    />
                    {errors.phone ? (
                      <p id={`${uid}-phone-err`} role="alert" className="mt-1 text-sm font-medium text-barber-red">
                        {errors.phone}
                      </p>
                    ) : null}
                  </div>
                </div>
                <p className="mt-4 text-sm text-ink-soft">Demo site: your details stay in this browser tab and are not sent anywhere.</p>
              </form>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink/25 pt-5">
            {step > 0 ? (
              <button type="button" onClick={() => go(step - 1)} className="btn btn-outline">
                Back
              </button>
            ) : (
              <span />
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => go(step + 1)} disabled={!canContinue} className="btn btn-red">
                Continue
              </button>
            ) : (
              <button type="submit" form={`${uid}-form`} className="btn btn-red">
                Confirm booking
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
