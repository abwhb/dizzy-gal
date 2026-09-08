import { team } from "@/lib/content";

import { Mark, Photo } from "./ui";

export function Team() {
  const [first, second, ...rest] = team.members;

  return (
    <section className="border-b border-line">
      <div data-reveal-group className="grid md:grid-cols-[1fr_1fr_2fr]">
        <Portrait member={first} className="border-b border-line md:border-r" />
        <Portrait member={second} className="border-b border-line md:border-r" />

        <div className="order-first border-b border-line p-5 sm:p-6 md:order-none">
          <p className="flex items-center gap-2 text-[12px] font-semibold text-white/85">
            <Mark className="h-3 w-3" />
            {team.kicker}
          </p>
          <h2 className="mt-6 max-w-[520px] text-[clamp(30px,4.2vw,50px)] leading-[1.02] font-semibold tracking-[-.04em] text-balance">
            {team.title}
          </h2>
        </div>

        {rest.map((member, index) => (
          <Portrait
            key={`${member.role}-${index}`}
            member={member}
            className={`border-line md:border-r ${index < rest.length - 1 ? "border-b md:border-b-0" : ""}`}
          />
        ))}

        <div className="hidden items-start justify-between p-5 text-[20px] font-medium text-mist md:flex sm:p-6" aria-hidden>
          <span>+</span>
          <span>+</span>
        </div>
      </div>
    </section>
  );
}

function Portrait({
  member,
  className = "",
}: {
  member: (typeof team.members)[number];
  className?: string;
}) {
  return (
    <div className={`p-5 sm:p-6 ${className}`}>
      <div className="relative">
        <Photo label={member.imageLabel} tone="cool" sizes="(max-width: 768px) 100vw, 25vw" className="aspect-square rounded-[3px]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 rounded-b-[3px] bg-gradient-to-t from-night/85 to-transparent"
        />
        <div className="absolute bottom-3 left-3">
          <p className="text-[14px] font-bold tracking-[-.02em]">{member.name}</p>
          <p className="text-[11px] font-medium text-white/75">{member.role}</p>
        </div>
      </div>
    </div>
  );
}
