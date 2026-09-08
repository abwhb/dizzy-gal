import { Illustration } from "@/components/illustrations";
import { promises } from "@/lib/content";

export function PromiseStrip() {
  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] border-b-[3px] border-burgundy">
      {promises.map((promise) => (
        <div
          key={promise.label}
          data-reveal
          className="group flex items-center gap-3 border-r-[3px] border-burgundy px-5 py-[22px] max-sm:border-b-[3px] max-sm:last:border-b-0"
        >
          <span className="flex size-[38px] flex-none items-center justify-center rounded-full border-2 border-dizzy-orange text-dizzy-orange transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
            <Illustration name={promise.illustration} className="size-[22px]" strokeWidth={3} />
          </span>
          <span className="text-[13px] leading-[1.35] font-semibold tracking-[.1em] uppercase">
            {promise.label}
          </span>
        </div>
      ))}
    </section>
  );
}
