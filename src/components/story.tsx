import { Scallop } from "@/components/decor";
import { Illustration, Squiggle } from "@/components/illustrations";
import { PhotoSlot } from "@/components/photo-slot";
import { SectionRail } from "@/components/section-rail";
import { gallery } from "@/lib/content";

/** Words with the brand-board squiggle drawn underneath. */
function Underlined({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <Squiggle className="absolute -bottom-[.18em] left-0 h-[.32em] w-full text-dizzy-orange" />
    </span>
  );
}

export function Story() {
  return (
    <section
      id="story"
      className="relative grid grid-cols-[46px_minmax(0,1fr)] border-b-[3px] border-burgundy"
    >
      <Scallop color="#FFD34D" />
      <SectionRail label="Brand story" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] items-start gap-8 px-5 pt-[clamp(44px,6vw,84px)] pb-[clamp(32px,5vw,72px)] sm:gap-10">
        <div>
          {/* Words brighten one by one as this scrolls through the viewport. */}
          <p
            data-split="words-scrub"
            className="text-[clamp(17px,2vw,26px)] leading-[1.4] font-medium text-pretty"
          >
            Dizzy Gals is for the <Underlined>hopelessly obsessed</Underlined> dessert lovers. We
            make cakes that hit different – bold flavours, creamy layers, and just the right
            amount of <span className="font-semibold text-dizzy-orange">chaos</span>.
          </p>
          <p
            data-reveal
            className="mt-6 font-display text-[clamp(26px,3.2vw,42px)] leading-[1.02] font-extrabold text-dizzy-orange"
          >
            One bite and you&rsquo;ll get it.
            <br />
            Go on. Dig in.
          </p>
          <Illustration
            name="zzz"
            data-draw
            strokeWidth={3}
            className="mt-5 w-12 text-burgundy"
            style={{ rotate: "-8deg" }}
          />
        </div>

        {/* Sticker sheet: tiles are dealt onto the grid as you scroll, and each
            mark draws itself. A photo replaces any tile via gallery[].image. */}
        <div data-deal className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {gallery.map((tile, index) => (
            <div key={tile.label} data-draw>
              <PhotoSlot
                label={tile.label}
                src={tile.image}
                className="group aspect-square rounded-xl border-[3px] border-burgundy text-burgundy transition-transform duration-300 hover:-translate-y-1 hover:-rotate-2"
                style={{ background: tile.bg }}
                sizes="(max-width: 640px) 45vw, 15vw"
              >
                <Illustration
                  name={tile.illustration}
                  strokeWidth={2}
                  className="w-[54%] text-burgundy transition-transform duration-300 group-hover:scale-110"
                  style={{ rotate: `${index % 2 ? 6 : -6}deg` }}
                />
                <span
                  className="absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full border-2 border-burgundy bg-cream px-2.5 py-1 text-[9px] font-semibold tracking-[.12em] whitespace-nowrap text-burgundy uppercase"
                  style={{ rotate: `${index % 2 ? -3 : 3}deg` }}
                >
                  {tile.label}
                </span>
              </PhotoSlot>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
