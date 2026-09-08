import type { IllustrationName } from "@/lib/content";

/**
 * Line illustrations in the brand-board style: single-weight open strokes,
 * rounded caps, no fills, drawn in `currentColor` so each usage sets its own
 * colour (orange on cream, burgundy on pink).
 */

type Props = {
  className?: string;
  strokeWidth?: number;
};

function Svg({
  children,
  className,
  strokeWidth = 2.4,
}: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export function Strawberry(props: Props) {
  return (
    <Svg {...props}>
      {/* body — wide shoulders tapering to a soft point */}
      <path d="M9 21c0-6 6.5-9 15-9s15 3 15 9c0 10-9.5 21-15 21S9 31 9 21Z" />
      {/* hull */}
      <path d="M24 12c-2-4-6-6-10-6 .5 4 3.5 6.5 7 7" />
      <path d="M24 12c2-4 6-6 10-6-.5 4-3.5 6.5-7 7" />
      <path d="M24 11.5V7" />
      {/* seeds */}
      <path d="M18 22.5v1.5M30 22.5v1.5M24 28.5V30M19.5 31.5V33M28.5 31.5V33" />
    </Svg>
  );
}

export function Lemon(props: Props) {
  return (
    <Svg {...props}>
      {/* slice — rind, pith and six segments */}
      <circle cx="24" cy="24" r="15" />
      <circle cx="24" cy="24" r="11.5" />
      <path d="M24 12.5v23M34 18.25 14 29.75M34 29.75 14 18.25" />
    </Svg>
  );
}

export function Cream(props: Props) {
  return (
    <Svg {...props}>
      {/* piped swirl seen from above — a spiral of half-turns */}
      <path d="M11 25a13 13 0 1 1 26 0 10.5 10.5 0 1 1-21 0 8 8 0 1 1 16 0 5.5 5.5 0 1 1-11 0 3 3 0 1 1 6 0" />
    </Svg>
  );
}

export function Cake(props: Props) {
  return (
    <Svg {...props}>
      {/* isometric layered slab with a berry on top */}
      <path d="M24 10 40 17 24 24 8 17 24 10Z" />
      <path d="M8 17v13l16 7 16-7V17" />
      <path d="M24 24v13" />
      <path d="M8 23.5 24 30.5 40 23.5" />
      <circle cx="24" cy="15.5" r="2.5" />
    </Svg>
  );
}

export function Heart(props: Props) {
  return (
    <Svg {...props}>
      <path d="M24 40C12.5 32.5 6.5 25.5 6.5 18.5 6.5 12.7 11 8.5 16 8.5c3.6 0 6.6 2 8 5 1.4-3 4.4-5 8-5 5 0 9.5 4.2 9.5 10 0 7-6 14-17.5 21.5Z" />
    </Svg>
  );
}

const registry: Record<IllustrationName, (props: Props) => React.ReactElement> = {
  strawberry: Strawberry,
  lemon: Lemon,
  cream: Cream,
  cake: Cake,
  heart: Heart,
};

export function Illustration({
  name,
  ...props
}: Props & { name: IllustrationName }) {
  const Component = registry[name];
  return <Component {...props} />;
}
