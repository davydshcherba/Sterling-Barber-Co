import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BarberPole } from "@/components/BarberPole";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { SectionHeading } from "@/components/SectionHeading";
import { barbers, services } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Book online",
  description:
    "Book a visit at Sterling Barber Co. in Lviv: choose a service, a barber, a day and a time in under a minute.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function BookPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const barber = barbers.find((b) => b.id === one("barber"))?.id;
  const service = services.find((s) => s.id === one("service"))?.id;

  return (
    <>
      <Header />
      <main id="main" className="pb-16 md:pb-24">
        <div className="mx-auto max-w-3xl px-4 pt-12 md:pt-16">
          <SectionHeading eyebrow="Reservations" title="Book Your Visit" intro="Five quick steps. No account needed." />
          <BookingFlow initialBarber={barber} initialService={service} />
        </div>
      </main>
      <BarberPole className="h-3" />
      <Footer />
    </>
  );
}
