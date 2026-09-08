import Image from "next/image";

/**
 * A photo position. Until a real photograph exists it renders as a labelled
 * slot (or whatever `children` draws in its place); pass `src` (a file in
 * `public/`, or any configured remote image) and the same box fills with the
 * photo at the same crop.
 */
export function PhotoSlot({
  label,
  src,
  className = "",
  style,
  captionClassName = "text-[9px] tracking-[.12em]",
  sizes = "(max-width: 768px) 100vw, 33vw",
  children,
}: {
  label: string;
  src?: string;
  className?: string;
  style?: React.CSSProperties;
  captionClassName?: string;
  sizes?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden text-center ${className}`}
      style={style}
    >
      {src ? (
        <Image src={src} alt={label} fill sizes={sizes} className="object-cover" />
      ) : (
        (children ?? (
          <span className={`px-2 font-semibold uppercase ${captionClassName}`}>{label}</span>
        ))
      )}
    </div>
  );
}
