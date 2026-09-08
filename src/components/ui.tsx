import Image from "next/image";

/**
 * A photo position. Until a real photograph exists it renders as a warm
 * duotone slot with a caption naming the intended shot; pass `src` (a file
 * in `public/`) and the same box fills with the photo at the same crop.
 */
export function Photo({
  label,
  src,
  className = "",
  tone = "warm",
  fill = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: {
  label: string;
  src?: string;
  className?: string;
  tone?: "warm" | "cool";
  /** Cover the nearest positioned ancestor instead of flowing in the layout. */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      // The duotone stays underneath a real photo so a slow or failed load
      // still shows the intended tone instead of a blank box.
      className={`overflow-hidden ${fill ? "absolute inset-0" : "relative"} ${tone === "warm" ? "photo-slot" : "photo-slot--cool"} ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={label}
          fill
          sizes={sizes}
          priority={priority}
          // Remote (Commons) photos are already resized by their host and are
          // loaded straight by the browser; local files go through the optimizer.
          unoptimized={src.startsWith("http")}
          className="object-cover"
        />
      ) : (
        <span className="absolute bottom-3 left-3 rounded-sm border border-white/20 bg-night/40 px-2 py-1 text-[10px] font-semibold tracking-[.08em] uppercase backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}

/** Eight-spoke asterisk, the Vita-style logo mark. */
export function Mark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      {[0, 45, 90, 135].map((deg) => (
        <rect key={deg} x="10.6" y="1" width="2.8" height="22" rx="1.4" transform={`rotate(${deg} 12 12)`} />
      ))}
    </svg>
  );
}

/** The small filled square that ends every Vita button. */
export function Square({ className = "h-1.5 w-1.5" }: { className?: string }) {
  return <span aria-hidden className={`inline-block shrink-0 bg-current ${className}`} />;
}

const base =
  "inline-flex items-center justify-between gap-4 text-[12px] font-bold tracking-[-.01em] transition-colors duration-200";

export const button = {
  /** White pill, dark text — the hero call to action. */
  pill: `${base} rounded-full bg-white px-5 py-3 text-night hover:bg-amber`,
  /** Dark teal block, white text — cards and lists. */
  block: `${base} w-full rounded-md bg-teal px-4 py-3 text-white hover:bg-[#1f4250]`,
};

export function Stars({ count = 5, className = "" }: { count?: number; className?: string }) {
  return (
    <span className={`inline-flex gap-px text-amber ${className}`} aria-label={`${count} étoiles`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-2.5 w-2.5">
          <path d="M10 1.5l2.5 5.4 5.9.7-4.4 4 1.2 5.9L10 14.6l-5.2 2.9 1.2-5.9-4.4-4 5.9-.7z" />
        </svg>
      ))}
    </span>
  );
}

const icon = "h-3.5 w-3.5 shrink-0 text-mist";

export function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={icon}>
      <path d="M10 18s5.5-5.2 5.5-9.5a5.5 5.5 0 1 0-11 0C4.5 12.8 10 18 10 18z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="8.5" r="1.8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={icon}>
      <rect x="3" y="4.5" width="14" height="12.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 8.5h14M7 3v3M13 3v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function UsersIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={icon}>
      <circle cx="8" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 16c.6-2.9 2.8-4.5 5.5-4.5s4.9 1.6 5.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M13 4.6a2.6 2.6 0 0 1 0 4.9M14.5 11.8c1.8.5 2.8 1.9 3 4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** `4980` → `4 980 $` (non-breaking spaces, Canadian French convention). */
export function formatPrice(price: number) {
  const grouped = Math.round(price)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${grouped} $`;
}
