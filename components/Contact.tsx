import site from "@/data/site.json";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { HoursTable, OpenBadge } from "./OpenNow";
import Map from "./Map";

const { lat, lng } = site.address;
const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          id="contact-title"
          eyebrow="Find Us"
          title="Visit the Shop"
          intro="In the old town, a short walk from the market square."
        />

        <Reveal>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="border-2 border-ink bg-cream p-6 md:p-8">
              <OpenBadge />

              <address className="mt-6 not-italic">
                <p className="font-sign text-sm uppercase tracking-[.2em] text-barber-red">Address</p>
                <p className="mt-1 font-display text-2xl font-bold">{site.address.line1}</p>
                <p className="text-ink-soft">{site.address.line2}</p>
                <p className="mt-4 font-sign text-sm uppercase tracking-[.2em] text-barber-red">Phone</p>
                <p className="mt-1">
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-lg font-medium underline underline-offset-4 hover:text-barber-red">
                    {site.phone}
                  </a>
                </p>
              </address>

              <h3 className="mb-2 mt-6 font-sign text-sm uppercase tracking-[.2em] text-barber-red">Hours</h3>
              <HoursTable />

              <div className="mt-7 flex flex-wrap gap-3">
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  Instagram
                </a>
                <a href={site.social.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                    <path d="M21.5 3.3 2.7 10.6c-1.3.5-1.2 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.2-2.2 4.6 3.4c.8.5 1.5.2 1.7-.8l3-14.2c.3-1.2-.4-1.8-1.4-1.4zM8.4 13.2l9.4-5.9c.4-.3.8-.1.5.2l-7.8 7-.3 3.2z" />
                  </svg>
                  Telegram
                </a>
                <a href={osmLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                  Open map
                </a>
              </div>
            </div>

            <Map lat={lat} lng={lng} label={`${site.name}, ${site.address.line1}`} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
