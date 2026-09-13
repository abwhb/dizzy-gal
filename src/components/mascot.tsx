import { PATHS } from "@/components/illustrations";

/**
 * The Dizzy Gal: a spoon-wielding, spiral-eyed character that tumbles down
 * the right edge of the page as you scroll (motion.tsx) and lands in the
 * chocolate puddle at the bottom. Hidden without JS; hidden entirely under
 * reduced motion.
 */
export function FallingMascot() {
  return (
    <div
      data-mascot
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-[2vw] z-30 w-[48px] sm:right-[5vw] sm:w-[80px] lg:w-[92px]"
    >
      <svg viewBox="0 0 72 88" className="w-full drop-shadow-[0_4px_0_rgba(87,21,31,.18)]">
        {/* spoon, held high */}
        <g stroke="#57151F" strokeWidth={2.5} strokeLinecap="round">
          <path d="M18 50 8 30" />
          <ellipse
            cx="6.5"
            cy="24"
            rx="5"
            ry="7"
            transform="rotate(-25 6.5 24)"
            fill="#F2EFE6"
          />
        </g>
        {/* head */}
        <circle cx="38" cy="28" r="20" fill="#F2EFE6" stroke="#57151F" strokeWidth={2.5} />
        <g
          transform="translate(8 -2) scale(1.25)"
          fill="none"
          stroke="#57151F"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={PATHS.smiley[1]} />
          <path d={PATHS.smiley[2]} />
          <path d={PATHS.smiley[3]} />
          <path d={PATHS.smiley[4]} fill="#FF8BA7" />
        </g>
        <circle cx="23" cy="36" r="2.6" fill="#FF6A00" />
        <circle cx="53" cy="36" r="2.6" fill="#FF6A00" />
        {/* body, arms, legs */}
        <rect
          x="26"
          y="46"
          width="24"
          height="23"
          rx="9"
          fill="#FF8BA7"
          stroke="#57151F"
          strokeWidth={2.5}
        />
        <g stroke="#57151F" strokeWidth={2.5} strokeLinecap="round" fill="none">
          <path d="M27 54 18 50" />
          <path d="M49 55l9 5" />
          <path d="M32 69v11M44 69v11" />
          <path d="M27 80h8M40 80h8" />
        </g>
      </svg>
    </div>
  );
}

/** The chocolate puddle the mascot lands in. Sits at the page bottom. */
export function Puddle({ className = "" }: { className?: string }) {
  return (
    <div
      data-puddle
      aria-hidden="true"
      className={`pointer-events-none origin-bottom ${className}`}
    >
      <svg viewBox="0 0 200 64" className="w-full">
        <path
          d="M12 40c8-16 40-24 88-22s96 8 90 24-40 18-90 16S4 56 12 40Z"
          fill="#57151F"
        />
        <path
          d="M40 34c14-6 36-8 60-6"
          fill="none"
          stroke="#F2EFE6"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.3}
        />
        <circle data-drop cx="62" cy="22" r="4" fill="#57151F" />
        <circle data-drop cx="100" cy="14" r="5" fill="#57151F" />
        <circle data-drop cx="140" cy="22" r="4" fill="#57151F" />
      </svg>
    </div>
  );
}
