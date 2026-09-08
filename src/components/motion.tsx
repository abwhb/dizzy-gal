"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Page motion, driven by data attributes so server components stay simple:
 *
 * - `data-hero-word`, `data-hero-copy`  — rise in on load, staggered
 * - `data-parallax`                      — drifts slower than the scroll
 * - `data-reveal`                        — fades up when it enters the viewport
 * - `data-reveal-group`                  — its direct children fade up, staggered
 * - `data-count="20"`                    — number counts up from 0 on reveal
 *
 * `globals.css` hides reveal targets only when the `js` class is on <html>,
 * so the page is fully visible without JavaScript. Reduced-motion users get
 * the content with no movement.
 */
export function Motion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-reveal], [data-reveal-group] > *, [data-hero-word], [data-hero-copy]", { clearProps: "all", opacity: 1 });
        return;
      }

      const ease = "power3.out";

      // Hero: the giant word settles in, then the copy and button follow.
      gsap
        .timeline({ defaults: { ease } })
        .fromTo("[data-hero-word]", { y: 60, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 1.1 }, 0.1)
        .fromTo("[data-hero-copy]", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 }, 0.5);

      // Hero photo drifts at a fraction of the scroll speed.
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top top", end: "bottom top", scrub: true },
          },
        );
      });

      // Single elements rise into place as they enter the viewport.
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease, scrollTrigger: { trigger: el, start: "top 88%", once: true } },
        );
      });

      // Grids and lists stagger their children.
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        gsap.fromTo(
          Array.from(group.children),
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease,
            stagger: 0.09,
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          },
        );
      });

      // Stats count up from zero the first time they are seen.
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix ?? "";
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.value)}${suffix}`;
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
