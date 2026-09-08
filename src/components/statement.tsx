import { statement } from "@/lib/content";

export function Statement() {
  return (
    <section className="border-b border-line px-5 pt-6 pb-10 sm:px-6 lg:pb-14">
      <h2 className="max-w-[820px] text-[clamp(28px,4.6vw,52px)] leading-[1.02] font-semibold tracking-[-.04em] text-balance">
        <span className="block text-mist">{statement.muted}</span>
        <span className="block">{statement.strong}</span>
      </h2>
    </section>
  );
}
