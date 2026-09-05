/** The 46px vertical label column that runs down the left of each section. */
export function SectionRail({ label }: { label: string }) {
  return (
    <div className="flex justify-center border-r-[3px] border-burgundy py-[26px]">
      <span className="text-[10px] font-semibold tracking-[.6em] uppercase [writing-mode:vertical-rl]">
        {label}
      </span>
    </div>
  );
}
