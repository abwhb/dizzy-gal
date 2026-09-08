import Image from "next/image";

/**
 * A photo position. Until a real photograph exists it renders as a labelled
 * slot (or whatever `children` draws in its place); pass `src` (a file in
 * `public/`, or any configured remote image) and the same box fills with the
 * photo at the same crop.
 */
export function PhotoSlot({
  label,
  alt = label,
  src,
  className = "",
  style,
  captionClassName = "text-[9px] tracking-[.12em]",
  sizes = "(max-width: 768px) 100vw, 33vw",
  fit = "cover",
  overlay,
  children,
}: {
  label: string;
  alt?: string;
  src?: string;
  className?: string;
  style?: React.CSSProperties;
  captionClassName?: string;
  sizes?: string;
  fit?: "cover" | "contain";
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden text-center ${className}`}
      style={style}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={fit === "contain" ? "object-contain" : "object-cover"}
        />
      ) : (
        (children ?? (
          <span className={`px-2 font-semibold uppercase ${captionClassName}`}>{label}</span>
        ))
      )}
      {overlay}
    </div>
  );
}
