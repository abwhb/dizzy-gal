"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * Page motion, driven by data attributes so sections stay plain markup:
 *
 *   data-hero-root            the hero section (parallax trigger)
 *   data-hero-content         the block that parallaxes away on scroll
 *   data-hero="pill|title|tagline|cta"   pieces of the intro timeline
 *   data-reveal[="pop"|"slide"]          scroll-in; siblings that enter
 *                                        together are staggered automatically
 *   data-float                gentle idle bob (the jar)
 *
 * Elements carrying data-hero / data-reveal start hidden via CSS once
 * <html class="js"> is set (layout.tsx), so nothing flashes before this runs
 * and nothing is lost if it never does. Reduced motion skips all of it.
 */
export function Motion() {
  useGSAP((_context, contextSafe) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set("[data-hero], [data-reveal]", { autoAlpha: 1 });
      return;
    }

    try {
      setupReveals();
      setupIdle();
    } catch (error) {
      console.error("motion: reveal setup failed, showing everything", error);
      gsap.set("[data-hero], [data-reveal]", { autoAlpha: 1 });
    }

    // Split the lockup only once the display face is in, so glyphs don't
    // swap mid-flight. Work after the await is wrapped in contextSafe so it
    // is still reverted on unmount (and on Strict Mode's double-run).
    let cancelled = false;
    const run = contextSafe!(() => {
      if (cancelled) return;
      try {
        setupHero();
      } catch (error) {
        console.error("motion: hero setup failed, showing everything", error);
        gsap.set("[data-hero]", { autoAlpha: 1 });
      }
    });
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(run);

    return () => {
      cancelled = true;
    };
  });

  return null;
}

function setupHero() {
  const root = document.querySelector<HTMLElement>("[data-hero-root]");
  if (!root) return;

  const pills = gsap.utils.toArray<HTMLElement>('[data-hero="pill"]', root);
  const title = root.querySelector<HTMLElement>('[data-hero="title"]');
  const tagline = root.querySelector<HTMLElement>('[data-hero="tagline"]');
  const cta = root.querySelector<HTMLElement>('[data-hero="cta"]');

  // Lift the CSS pre-hide, then animate *from* hidden in the same tick.
  gsap.set("[data-hero]", { autoAlpha: 1 });

  const titleSplit = title ? SplitText.create(title, { type: "chars" }) : null;
  const taglineSplit = tagline ? SplitText.create(tagline, { type: "words" }) : null;
  const chars = titleSplit?.chars ?? [];
  const words = taglineSplit?.words ?? [];

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(pills, { y: -18, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, 0);

  if (chars.length) {
    tl.from(
      chars,
      {
        y: 90,
        autoAlpha: 0,
        scale: 0.55,
        rotation: () => gsap.utils.random(-16, 16),
        duration: 0.9,
        ease: "back.out(1.7)",
        stagger: 0.05,
      },
      0.15,
    );
  }

  if (words.length) {
    tl.from(words, { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.045 }, "-=0.45");
  }

  if (cta) {
    tl.from(cta, { y: 16, autoAlpha: 0, scale: 0.9, duration: 0.5 }, "-=0.3");
  }

  // The "!" keeps bobbing — the one bit of the lockup that never settles.
  const bang = chars.at(-1);
  if (bang) {
    tl.add(() => {
      gsap.to(bang, {
        y: "-6%",
        rotation: 6,
        duration: 1.1,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    });
  }

  // Lockup drifts up and fades as the hero scrolls away. This targets the
  // content wrapper, not the pieces above: a scrubbed tween records its
  // start values on first render, and the pieces are mid-entrance then.
  const content = root.querySelector<HTMLElement>("[data-hero-content]");
  if (content) {
    gsap.to(content, {
      yPercent: -30,
      autoAlpha: 0,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "80% top", scrub: true },
    });
  }
}

type Variant = "default" | "pop" | "slide";

const FROM: Record<Variant, gsap.TweenVars> = {
  default: { autoAlpha: 0, y: 28 },
  pop: { autoAlpha: 0, scale: 0.6, rotation: () => gsap.utils.random(-10, 10) },
  slide: { autoAlpha: 0, x: 40 },
};

const TO: Record<Variant, gsap.TweenVars> = {
  default: { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
  pop: { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.7)" },
  slide: { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" },
};

function setupReveals() {
  const all = gsap.utils.toArray<HTMLElement>("[data-reveal]");

  // Anything already scrolled past on load (a mid-page reload, a hash link)
  // is shown straight away rather than waiting to be scrolled *up* into.
  const above = all.filter((el) => el.getBoundingClientRect().bottom < 0);
  gsap.set(above, { autoAlpha: 1 });

  const pending = new Set(all.filter((el) => !above.includes(el)));
  const variantOf = (el: HTMLElement): Variant => {
    const v = el.dataset.reveal || "default";
    return (v in FROM ? v : "default") as Variant;
  };
  const show = (els: HTMLElement[], variant: Variant) => {
    els.forEach((el) => pending.delete(el));
    gsap.to(els, { ...TO[variant], stagger: 0.08, overwrite: true });
  };

  const byVariant: Record<Variant, HTMLElement[]> = { default: [], pop: [], slide: [] };
  pending.forEach((el) => byVariant[variantOf(el)].push(el));

  (Object.keys(byVariant) as Variant[]).forEach((variant) => {
    const els = byVariant[variant];
    if (!els.length) return;
    gsap.set(els, FROM[variant]);
    ScrollTrigger.batch(els, {
      start: "top 90%",
      once: true,
      onEnter: (batch) => show(batch as HTMLElement[], variant),
    });
  });

  // Anything hugging the bottom of the document may never reach the 90%
  // line (the footer, on a short page). Reaching the end of the page
  // reveals whatever is still pending.
  ScrollTrigger.create({
    start: () => ScrollTrigger.maxScroll(window) - 2,
    once: true,
    onEnter: () => {
      (Object.keys(byVariant) as Variant[]).forEach((variant) => {
        const left = [...pending].filter((el) => variantOf(el) === variant);
        if (left.length) show(left, variant);
      });
    },
  });
}

function setupIdle() {
  gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
    gsap.to(el, {
      y: -8,
      duration: 2.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: i * 0.3,
    });
  });
}

/**
 * Add-to-cart flourish: a dot arcs from the button to the cart badge, then
 * the badge pops. Falls back to nothing under reduced motion.
 */
export function flyToCart(from: HTMLElement) {
  const badge = document.querySelector<HTMLElement>("[data-cart-badge]");
  if (!badge || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const a = from.getBoundingClientRect();
  const b = badge.getBoundingClientRect();
  const dot = document.createElement("span");
  dot.setAttribute("aria-hidden", "true");
  Object.assign(dot.style, {
    position: "fixed",
    left: `${a.left + a.width / 2 - 8}px`,
    top: `${a.top + a.height / 2 - 8}px`,
    width: "16px",
    height: "16px",
    borderRadius: "999px",
    background: "#FF6A00",
    boxShadow: "0 0 0 2.5px #57151F",
    zIndex: "60",
    pointerEvents: "none",
  });
  document.body.appendChild(dot);

  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const duration = 0.7;

  // Two eases on two axes give the arc.
  gsap.to(dot, { x: dx, duration, ease: "power1.inOut" });
  gsap.to(dot, {
    y: dy,
    scale: 0.5,
    duration,
    ease: "back.in(1.4)",
    onComplete: () => {
      dot.remove();
      gsap.fromTo(
        badge,
        { scale: 1 },
        { scale: 1.5, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" },
      );
    },
  });
}
