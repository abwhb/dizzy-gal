import { marqueeLines } from "@/lib/content";

/**
 * Infinite scrolling strip. The line list is rendered twice and the track is
 * translated by -50%, so the loop point is seamless. Pauses on hover so a
 * line can actually be read.
 */
export function Marquee() {
  return (
    <div className="group overflow-hidden border-t-[3px] border-burgundy bg-cream py-4 text-burgundy">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[...marqueeLines, ...marqueeLines].map((line, index) => (
          <div
            key={`${line}-${index}`}
            className="flex items-center gap-4 whitespace-nowrap px-[22px] text-[13px] font-semibold tracking-[.16em] uppercase"
          >
            <span className="size-[9px] flex-none rounded-full bg-dizzy-orange" />
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
