import { panorama } from "@/lib/content";

import { Photo } from "./ui";

export function Panorama() {
  return (
    <section className="p-5 sm:p-6">
      <Photo
        label={panorama.imageLabel}
        src={panorama.image}
        sizes="100vw"
        className="aspect-[16/7] rounded-[3px] sm:aspect-[21/6]"
      />
    </section>
  );
}
