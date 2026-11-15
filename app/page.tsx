import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Barbers } from "@/components/Barbers";
import { Gallery } from "@/components/Gallery";
import { Reviews } from "@/components/Reviews";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { BarberPole } from "@/components/BarberPole";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <BarberPole className="h-3" />
        <Services />
        <Barbers />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
