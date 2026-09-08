import { PhotoSlot } from "@/components/photo-slot";
import { SectionRail } from "@/components/section-rail";
import { gallery } from "@/lib/content";

export function Story() {
  return (
    <section
      id="story"
      className="grid grid-cols-[46px_minmax(0,1fr)] border-b-[3px] border-burgundy"
    >
      <SectionRail label="Brand story" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] items-start gap-8 px-5 py-[clamp(32px,5vw,72px)] sm:gap-10">
        <div data-reveal>
          <p className="text-[clamp(17px,2vw,26px)] leading-[1.35] font-medium text-pretty">
            Dizzy Gals is for the hopelessly obsessed dessert lovers. We make cakes that hit
            different – bold flavours, creamy layers, and just the right amount of chaos.
          </p>
          <p className="mt-5 font-display text-[clamp(24px,3vw,38px)] leading-[1.05] font-extrabold text-dizzy-orange">
            One bite and you&rsquo;ll get it.
            <br />
            Go on. Dig in.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {gallery.map((tile) => (
            <div key={tile.label} data-reveal="pop">
              <PhotoSlot
                label={tile.label}
                src={tile.image}
                className="aspect-square rounded-xl border-[3px] border-burgundy text-burgundy transition-transform duration-300 hover:-translate-y-1 hover:-rotate-2"
                style={{ background: tile.bg }}
                sizes="(max-width: 640px) 45vw, 15vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
