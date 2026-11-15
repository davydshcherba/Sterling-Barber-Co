import site from "@/data/site.json";

export type Hours = Record<string, [string, string] | null>;

export const hours = site.hours as unknown as Hours;
export const TZ = site.timezone;

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function toMinutes(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

export function toHM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function weekdayOf(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export type Now = { date: string; minutes: number; weekday: number };

/** Current date and time at the shop (Lviv), independent of the visitor's time zone. */
export function shopNow(): Now {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  const date = `${get("year")}-${get("month")}-${get("day")}`;
  return {
    date,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
    weekday: weekdayOf(date),
  };
}

export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function formatDayParts(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  const f = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", { ...o, timeZone: "UTC" }).format(d);
  return {
    weekday: f({ weekday: "short" }),
    day: f({ day: "numeric" }),
    month: f({ month: "short" }),
  };
}

export function openStatus(now: Now) {
  const today = hours[String(now.weekday)];
  if (today) {
    const [open, close] = today.map(toMinutes);
    if (now.minutes >= open && now.minutes < close) {
      return { open: true, note: `Open until ${toHM(close)}` };
    }
    if (now.minutes < open) {
      return { open: false, note: `Opens today at ${toHM(open)}` };
    }
  }
  for (let i = 1; i <= 7; i++) {
    const wd = (now.weekday + i) % 7;
    const h = hours[String(wd)];
    if (h) {
      const when = i === 1 ? "tomorrow" : DAY_NAMES[wd];
      return { open: false, note: `Opens ${when} at ${h[0]}` };
    }
  }
  return { open: false, note: "Closed" };
}

/** Opening hours grouped for display, e.g. "Mon–Fri 10:00–20:00". */
export function hoursSummary(): { days: string; time: string }[] {
  const short = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const groups: { from: number; to: number; value: string }[] = [];
  for (const wd of [1, 2, 3, 4, 5, 6, 0]) {
    const h = hours[String(wd)];
    const value = h ? `${h[0]}–${h[1]}` : "Closed";
    const last = groups[groups.length - 1];
    if (last && last.value === value) last.to = wd;
    else groups.push({ from: wd, to: wd, value });
  }
  return groups.map((g) => ({
    days: g.from === g.to ? short[g.from] : `${short[g.from]}–${short[g.to]}`,
    time: g.value,
  }));
}
