"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const PIN = `<svg viewBox="0 0 36 46" width="36" height="46" xmlns="http://www.w3.org/2000/svg"><path d="M18 1C9 1 2 8 2 17c0 12 16 28 16 28s16-16 16-28C34 8 27 1 18 1z" fill="#A6262B" stroke="#2A1F1A" stroke-width="2"/><circle cx="18" cy="17" r="6" fill="#F3EAD8"/></svg>`;

/** OpenStreetMap via Leaflet. Loaded only once the map scrolls near the viewport. */
export default function Map({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const mod = await import("leaflet");
        const L = (mod as unknown as { default?: typeof mod }).default ?? mod;
        if (cancelled) return;

        map = L.map(el, { scrollWheelZoom: false }).setView([lat, lng], 16);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        L.marker([lat, lng], {
          title: label,
          alt: label,
          icon: L.divIcon({ className: "", html: PIN, iconSize: [36, 46], iconAnchor: [18, 44] }),
        })
          .addTo(map)
          .bindPopup(label);
      },
      { rootMargin: "300px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      map?.remove();
    };
  }, [lat, lng, label]);

  return (
    <div
      ref={box}
      role="region"
      aria-label="Map showing the shop location"
      className="h-80 min-h-80 w-full border-2 border-ink bg-cream-deep lg:h-full"
    />
  );
}
