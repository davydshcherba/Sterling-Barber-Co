"use client";

import { DAY_NAMES, hours, openStatus } from "@/lib/time";
import { useShopNow } from "@/lib/useShopNow";

export function OpenBadge() {
  const now = useShopNow();
  const status = now ? openStatus(now) : null;
  const tone = !status
    ? "border-ink/40 text-ink-soft"
    : status.open
      ? "border-barber-blue text-barber-blue"
      : "border-barber-red text-barber-red";

  return (
    <p role="status" className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className={`inline-flex items-center gap-2 border-2 px-3 py-1 font-sign text-sm uppercase tracking-[.18em] ${tone}`}>
        <span className="size-2 rounded-full bg-current" aria-hidden="true" />
        {status ? (status.open ? "Open now" : "Closed") : "Checking hours"}
      </span>
      <span className="text-sm text-ink-soft">{status?.note ?? " "}</span>
    </p>
  );
}

export function HoursTable() {
  const now = useShopNow();
  return (
    <dl className="divide-y divide-ink/20 border-y border-ink/30">
      {[1, 2, 3, 4, 5, 6, 0].map((wd) => {
        const h = hours[String(wd)];
        const today = now?.weekday === wd;
        return (
          <div key={wd} className={`flex justify-between gap-4 px-2 py-2 ${today ? "bg-ink/10 font-semibold" : ""}`}>
            <dt>
              {DAY_NAMES[wd]}
              {today ? <span className="sr-only"> (today)</span> : null}
            </dt>
            <dd className="tabular-nums">{h ? `${h[0]} – ${h[1]}` : "Closed"}</dd>
          </div>
        );
      })}
    </dl>
  );
}
