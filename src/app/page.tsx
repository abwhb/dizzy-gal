import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Departures } from "@/components/departures";
import { Destinations } from "@/components/destinations";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Hajj } from "@/components/hajj";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Steps } from "@/components/steps";
import { Testimonials } from "@/components/testimonials";

export default function CortobaPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Departures />
        <Hajj />
        <Destinations />
        <Steps />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
