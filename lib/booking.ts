import servicesData from "@/data/services.json";
import barbersData from "@/data/barbers.json";
import slotsData from "@/data/slots.json";
import { addDays, hours, toHM, toMinutes, weekdayOf, type Now } from "./time";

export type Service = (typeof servicesData)[number];
export type Barber = (typeof barbersData)[number];

export const services: Service[] = servicesData;
export const barbers: Barber[] = barbersData;

const SLOT = slotsData.slotMinutes;
const busy = slotsData.busy as Record<string, Record<string, string[]>>;

export const BOOKING_DAYS = 14;
export const ANY_BARBER = "any";

export type Slot = {
  time: string;
  available: boolean;
  /** Barber who would take the booking (useful for "any barber"). */
  barberId: string | null;
};

export function listDates(today: string): string[] {
  return Array.from({ length: BOOKING_DAYS }, (_, i) => addDays(today, i));
}

export function isOpenDay(iso: string): boolean {
  return Boolean(hours[String(weekdayOf(iso))]);
}

function barberFree(barberId: string, iso: string, start: number, count: number) {
  const taken = busy[barberId]?.[String(weekdayOf(iso))] ?? [];
  for (let i = 0; i < count; i++) {
    if (taken.includes(toHM(start + i * SLOT))) return false;
  }
  return true;
}

/** All 30-minute start times for a day, each flagged as available or booked. */
export function slotsFor(opts: {
  date: string;
  service: Service;
  barberId: string;
  now: Now;
}): Slot[] {
  const { date, service, barberId, now } = opts;
  const day = hours[String(weekdayOf(date))];
  if (!day) return [];

  const open = toMinutes(day[0]);
  const close = toMinutes(day[1]);
  const count = Math.ceil(service.duration / SLOT);
  const candidates =
    barberId === ANY_BARBER ? barbers.map((b) => b.id) : [barberId];
  const result: Slot[] = [];

  for (let start = open; start + count * SLOT <= close; start += SLOT) {
    const past = date === now.date && start < now.minutes + 30;
    const free = past
      ? null
      : candidates.find((id) => barberFree(id, date, start, count)) ?? null;
    result.push({ time: toHM(start), available: free !== null, barberId: free });
  }
  return result;
}

export function formatPrice(price: number) {
  return `€${price}`;
}
