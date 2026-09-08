import Image from "next/image";

/** Page gutter + max width shared by every section. */
export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 ${className}`}>{children}</div>;
}

/** Small uppercase label that sits above a section title. */
export function Kicker({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`flex items-center gap-3 text-[11px] font-semibold tracking-[.22em] uppercase ${className}`}
    >
      <span aria-hidden className="h-px w-6 bg-current opacity-60" />
      {children}
    </p>
  );
}

export function SectionTitle({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={`font-display text-[clamp(30px,4vw,48px)] leading-[1.08] font-medium tracking-[-.01em] text-balance ${className}`}
    >
      {children}
    </Tag>
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-semibold transition-colors duration-200";

export const button = {
  primary: `${buttonBase} bg-green text-sand hover:bg-forest hover:text-sand`,
  gold: `${buttonBase} bg-gold text-ink hover:bg-[#d8b45c] hover:text-ink`,
  outline: `${buttonBase} border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-sand`,
  outlineLight: `${buttonBase} border border-sand/40 text-sand hover:bg-sand hover:text-green`,
  ghost: `${buttonBase} px-0 py-0 text-green underline-offset-4 hover:underline hover:text-green`,
};

export function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Check({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="m4.5 10.5 3.5 3.5 7.5-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A photo position. Until a real photograph exists it renders as a soft
 * duotone slot with a caption naming the intended shot; pass `src` (a file
 * in `public/`) and the same box fills with the photo at the same crop.
 */
export function Photo({
  label,
  src,
  className = "",
  tone = "dark",
  caption = "bottom",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: {
  label: string;
  src?: string;
  className?: string;
  tone?: "dark" | "light";
  /** Where the slot caption sits, so it can dodge overlaid badges. */
  caption?: "top" | "bottom";
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative flex overflow-hidden ${caption === "top" ? "items-start" : "items-end"} ${src ? "" : tone === "dark" ? "photo-slot" : "photo-slot--light"} ${className}`}
    >
      {src ? (
        <Image src={src} alt={label} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <span className="m-4 rounded-full border border-current/30 px-3 py-1 text-[10px] font-semibold tracking-[.14em] uppercase">
          {label}
        </span>
      )}
    </div>
  );
}

/** Eight-point star, a discreet nod to Islamic geometric ornament. */
export function StarMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 0l2.6 6.3L21 4.2l-2.1 6.4L24 12l-5.1 1.4L21 19.8l-6.4-2.1L12 24l-2.6-6.3L3 19.8l2.1-6.4L0 12l5.1-1.4L3 4.2l6.4 2.1z" />
    </svg>
  );
}

/** `4980` → `4 980 $` (non-breaking spaces, Canadian French convention). */
export function formatPrice(price: number) {
  const grouped = Math.round(price)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  return `${grouped}\u00a0$`;
}
