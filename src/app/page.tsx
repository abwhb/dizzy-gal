import { About } from "@/components/about";
import { Categories } from "@/components/categories";
import { Departures } from "@/components/departures";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { DestinationMap } from "@/components/map";
import { Motion } from "@/components/motion";
import { Panorama } from "@/components/panorama";
import { Process } from "@/components/process";
import { Statement } from "@/components/statement";
import { Team } from "@/components/team";

export default function Page() {
  return (
    <>
      <Motion />
      <Header />
      <main>
        <Hero />
        <Statement />
        <Categories />
        <About />
        <Departures />
        <Process />
        <DestinationMap />
        <Team />
        <Panorama />
      </main>
      <Footer />
    </>
  );
}
