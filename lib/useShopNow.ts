"use client";

import { useMemo, useSyncExternalStore } from "react";
import { shopNow, weekdayOf, type Now } from "./time";

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}

function snapshot() {
  const n = shopNow();
  return `${n.date}|${n.minutes}`;
}

/** Current shop time, or null on the server / first render so markup never mismatches. */
export function useShopNow(): Now | null {
  const key = useSyncExternalStore(subscribe, snapshot, () => "");
  return useMemo(() => {
    if (!key) return null;
    const [date, minutes] = key.split("|");
    return { date, minutes: Number(minutes), weekday: weekdayOf(date) };
  }, [key]);
}
