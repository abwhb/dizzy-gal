"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);

/**
 * Page motion, driven by data attributes so sections stay plain markup:
 *
 *   data-hero-root / data-hero-content / data-hero="…" / data-parallax
 *                             the hero intro, its scroll-away and pointer drift
 *   data-header               sticky nav hides on scroll-down, returns on scroll-up
 *   data-marquee              the strip's speed follows scroll velocity
 *   data-reveal[="pop"|"slide"]   scroll-in; siblings entering together stagger
 *   data-split="chars"        letters rise out of a mask as it scrolls in
 *       + data-wobble           …and wobble under the pointer
 *   data-split="words-scrub"  words brighten one by one, tied to scroll position
 *   data-draw                 the line marks inside draw themselves in
 *   data-deal                 children are dealt onto the grid, tied to scroll
 *   data-scallop              icing edges drip down as they arrive
 *   data-parallax-bg          background pattern drifts slower than the page
 *   data-rise                 slides up into place as the page bottom nears
 *   data-pin-rail             (≥1024px) pinned; scroll becomes horizontal travel
 *   data-float                gentle idle bob
 *
 * Elements carrying data-hero / data-reveal / data-split / data-deal children
 * start hidden via CSS once <html class="js"> is set (layout.tsx), so nothing
 * flashes before this runs and nothing is lost if it never does. Reduced
 * motion skips all of it.
 */

const PREHIDDEN = "[data-hero], [data-reveal], [data-split], [data-deal] > *";

export function Motion() {
  useGSAP((_context, contextSafe) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(PREHIDDEN, { autoAlpha: 1 });
      gsap.set("[data-mascot]", { display: "none" });
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    try {
      setupReveals();
      setupDeal();
      setupDraw();
      setupScallops();
      setupIdle();
      setupHeader();
      setupMarquee(signal);
      setupBgParallax();
      setupRise();
      setupMascot();
      setupRail(signal);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => setupPinnedRail());
    } catch (error) {
      console.error("motion: scroll setup failed, showing everything", error);
      gsap.set(PREHIDDEN, { autoAlpha: 1 });
    }

    // Anything that splits text waits for the display face, so glyphs don't
    // swap mid-flight. Work after the await is wrapped in contextSafe so it
    // is still reverted on unmount (and on Strict Mode's double-run).
    const run = contextSafe!(() => {
      if (signal.aborted) return;
      try {
        setupHero(signal);
        setupTextReveals(signal);
      } catch (error) {
        console.error("motion: text setup failed, showing everything", error);
        gsap.set("[data-hero], [data-split]", { autoAlpha: 1 });
      }
    });
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(run);

    return () => controller.abort();
  });

  return null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const q = (sel: string, scope?: Element) => gsap.utils.toArray<HTMLElement>(sel, scope);

/** Already scrolled past on load (mid-page reload, hash link): show as-is. */
const isAbove = (el: Element) => el.getBoundingClientRect().bottom < 0;

/** Letters lift and wobble when the pointer runs over them. */
function attachWobble(chars: Element[], signal: AbortSignal) {
  chars.forEach((char) => {
    char.addEventListener(
      "pointerenter",
      () => {
        if (gsap.isTweening(char)) return;
        gsap
          .timeline()
          .to(char, { rotation: gsap.utils.random(-14, 14), y: -8, duration: 0.14 })
          .to(char, { rotation: 0, y: 0, duration: 0.7, ease: "elastic.out(1,.35)" });
      },
      { signal },
    );
  });
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function setupHero(signal: AbortSignal) {
  const root = document.querySelector<HTMLElement>("[data-hero-root]");
  if (!root) return;

  const pills = q('[data-hero="pill"]', root);
  const title = root.querySelector<HTMLElement>('[data-hero="title"]');
  const tagline = root.querySelector<HTMLElement>('[data-hero="tagline"]');
  const cta = root.querySelector<HTMLElement>('[data-hero="cta"]');
  const zzz = root.querySelector<HTMLElement>('[data-hero="zzz"]');
  const doodles = q('[data-hero="doodle"]', root);
  const badge = root.querySelector<HTMLElement>('[data-hero="badge"]');

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
  if (zzz) {
    tl.from(
      zzz,
      { autoAlpha: 0, scale: 0.4, rotation: -40, duration: 0.6, ease: "back.out(2.2)" },
      "-=0.35",
    );
  }
  if (words.length) {
    tl.from(words, { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.045 }, "-=0.4");
  }
  if (cta) {
    tl.from(cta, { y: 16, autoAlpha: 0, scale: 0.9, duration: 0.5 }, "-=0.3");
  }
  if (doodles.length) {
    tl.from(
      doodles,
      {
        autoAlpha: 0,
        scale: 0.3,
        rotation: () => gsap.utils.random(-50, 50),
        duration: 0.7,
        ease: "back.out(1.8)",
        stagger: { each: 0.07, from: "random" },
      },
      "-=0.6",
    );
  }
  if (badge) {
    tl.from(
      badge,
      { autoAlpha: 0, scale: 0, rotation: -120, duration: 0.8, ease: "back.out(1.6)" },
      "-=0.5",
    );
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

  attachWobble(chars.slice(0, -1), signal);
  setupPointerParallax(root, signal);

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

/** Doodles drift with the pointer, deeper ones further. Pointer devices only. */
function setupPointerParallax(root: HTMLElement, signal: AbortSignal) {
  if (window.matchMedia("(hover: none)").matches) return;
  const items = q("[data-parallax]", root).map((el) => ({
    x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
    y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
    depth: Number(el.dataset.parallax) || 0.4,
  }));
  if (!items.length) return;

  root.addEventListener(
    "pointermove",
    (event) => {
      const r = root.getBoundingClientRect();
      const nx = (event.clientX - r.left) / r.width - 0.5;
      const ny = (event.clientY - r.top) / r.height - 0.5;
      for (const item of items) {
        item.x(nx * 90 * item.depth);
        item.y(ny * 70 * item.depth);
      }
    },
    { signal, passive: true },
  );
  root.addEventListener(
    "pointerleave",
    () => {
      for (const item of items) {
        item.x(0);
        item.y(0);
      }
    },
    { signal },
  );
}

// ─── Text ───────────────────────────────────────────────────────────────────

function setupTextReveals(signal: AbortSignal) {
  q("[data-split]").forEach((el) => {
    const mode = el.dataset.split;

    if (mode === "chars") {
      // words too, so a line can only break between words, never mid-word.
      const split = SplitText.create(el, { type: "words,chars", mask: "chars" });
      gsap.set(el, { autoAlpha: 1 });
      if (!isAbove(el)) {
        // Trigger on an untransformed ancestor: inside a data-rise block the
        // element is measured mid-shift and its start can fall past max scroll.
        const trigger = el.closest("[data-rise]")?.parentElement ?? el;
        gsap.from(split.chars, {
          yPercent: 110,
          duration: 0.8,
          ease: "back.out(1.4)",
          stagger: 0.035,
          scrollTrigger: { trigger, start: "top 92%", once: true },
        });
      }
      if (el.dataset.wobble !== undefined) attachWobble(split.chars, signal);
      return;
    }

    if (mode === "words-scrub") {
      const split = SplitText.create(el, { type: "words", ignore: "svg" });
      gsap.set(el, { autoAlpha: 1 });
      if (isAbove(el)) return;
      gsap.fromTo(
        split.words,
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 45%", scrub: 0.4 },
        },
      );
      return;
    }

    gsap.set(el, { autoAlpha: 1 });
  });
}

// ─── Scroll reveals ─────────────────────────────────────────────────────────

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
  const all = q("[data-reveal]");
  const above = all.filter(isAbove);
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
  // line. Reaching the end of the page reveals whatever is still pending.
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

/** Children scatter in from random offsets and settle onto the grid with scroll. */
function setupDeal() {
  q("[data-deal]").forEach((container) => {
    const items = Array.from(container.children) as HTMLElement[];
    if (!items.length) return;
    if (isAbove(container)) {
      gsap.set(items, { autoAlpha: 1 });
      return;
    }
    gsap.from(items, {
      x: () => gsap.utils.random(-140, 140),
      y: 90,
      rotation: () => gsap.utils.random(-28, 28),
      scale: 0.7,
      autoAlpha: 0,
      stagger: 0.07,
      ease: "power2.out",
      scrollTrigger: { trigger: container, start: "top 95%", end: "top 40%", scrub: 0.5 },
    });
  });
}

/** Every path inside draws itself, like it's being sketched. */
function setupDraw() {
  q("[data-draw]").forEach((el) => {
    const paths = el.querySelectorAll("path");
    if (!paths.length || isAbove(el)) return;
    gsap.from(paths, {
      drawSVG: "0%",
      duration: 1.1,
      ease: "power2.inOut",
      stagger: 0.05,
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
}

/** Icing drips down over the edge as the section arrives. */
function setupScallops() {
  q("[data-scallop]").forEach((el) => {
    if (isAbove(el)) return;
    gsap.from(el, {
      scaleY: 0,
      duration: 0.9,
      ease: "back.out(2.5)",
      scrollTrigger: { trigger: el, start: "top 97%", once: true },
    });
  });
}

function setupIdle() {
  q("[data-float]").forEach((el, i) => {
    gsap.to(el, {
      y: () => gsap.utils.random(-6, -11),
      duration: () => gsap.utils.random(1.8, 2.8),
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: i * 0.23,
    });
  });
}

// ─── Scroll-linked ──────────────────────────────────────────────────────────

let headerHidden = false;

/** Sticky nav slips away on scroll-down and returns on scroll-up. */
function setupHeader() {
  const header = document.querySelector<HTMLElement>("[data-header]");
  if (!header) return;
  const hero = document.querySelector<HTMLElement>("[data-hero-root]");
  const set = (hidden: boolean) => {
    if (hidden === headerHidden) return;
    headerHidden = hidden;
    gsap.to(header, {
      yPercent: hidden ? -100 : 0,
      duration: 0.35,
      ease: "power2.out",
      overwrite: true,
    });
  };
  ScrollTrigger.create({
    start: () => (hero ? hero.offsetHeight + 160 : 400),
    end: "max",
    onUpdate: (self) => set(self.direction === 1),
    onLeaveBack: () => set(false),
  });
}

function showHeader() {
  const header = document.querySelector<HTMLElement>("[data-header]");
  if (!header || !headerHidden) return;
  headerHidden = false;
  gsap.to(header, { yPercent: 0, duration: 0.3, ease: "power2.out", overwrite: true });
}

/** The marquee runs on GSAP so its speed can follow the scroll. */
function setupMarquee(signal: AbortSignal) {
  const track = document.querySelector<HTMLElement>("[data-marquee]");
  if (!track) return;
  track.style.animation = "none";
  const tween = gsap.to(track, { xPercent: -50, duration: 60, ease: "none", repeat: -1 });
  let settle: gsap.core.Tween | null = null;

  ScrollTrigger.create({
    onUpdate: (self) => {
      // Faster with a fast scroll, backwards when scrolling up, then settle.
      const boost = gsap.utils.clamp(-4, 6, 1 + self.getVelocity() / 450);
      tween.timeScale(boost);
      settle?.kill();
      settle = gsap.to(tween, { timeScale: 1, duration: 1.4, ease: "power2.out", delay: 0.1 });
    },
  });

  const strip = track.parentElement;
  strip?.addEventListener("pointerenter", () => tween.pause(), { signal });
  strip?.addEventListener("pointerleave", () => tween.play(), { signal });
}

/** Pattern backgrounds drift slower than the page. */
function setupBgParallax() {
  q("[data-parallax-bg]").forEach((el) => {
    gsap.to(el, {
      backgroundPositionY: "-140px",
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
}

/** Slides up into place as the bottom of the page comes into view. */
function setupRise() {
  q("[data-rise]").forEach((el) => {
    gsap.from(el, {
      yPercent: 45,
      ease: "none",
      // The parent is the trigger: measuring `el` itself would include the
      // 45% shift and push the end point past the bottom of the page.
      scrollTrigger: {
        trigger: el.parentElement ?? el,
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
      },
    });
  });
}

/**
 * The mascot tumbles down the right edge over the whole page and lands in
 * the puddle at the bottom, which splashes. Its landing height is measured
 * from where the puddle sits at max scroll, so it always meets it.
 */
function setupMascot() {
  const mascot = document.querySelector<HTMLElement>("[data-mascot]");
  const puddle = document.querySelector<HTMLElement>("[data-puddle]");
  if (!mascot || !puddle) return;
  const hero = document.querySelector<HTMLElement>("[data-hero-root]");
  const drops = puddle.querySelectorAll("[data-drop]");

  gsap.set(mascot, { autoAlpha: 0 });
  gsap.set(drops, { autoAlpha: 0 });

  // Appears once the hero is mostly gone.
  ScrollTrigger.create({
    start: () => (hero ? hero.offsetHeight * 0.55 : 200),
    onEnter: () => gsap.to(mascot, { autoAlpha: 1, duration: 0.4 }),
    onLeaveBack: () => gsap.to(mascot, { autoAlpha: 0, duration: 0.3 }),
  });

  const landingY = () => {
    const r = puddle.getBoundingClientRect();
    const puddleTopAtMax = r.top + window.scrollY - ScrollTrigger.maxScroll(window);
    return puddleTopAtMax + r.height * 0.42 - mascot.offsetHeight;
  };

  let landed = false;
  const splash = () => {
    gsap
      .timeline()
      .to(puddle, {
        scaleX: 1.18,
        scaleY: 0.82,
        duration: 0.16,
        ease: "power2.out",
      })
      .to(puddle, { scaleX: 1, scaleY: 1, duration: 0.7, ease: "elastic.out(1,.4)" })
      .fromTo(
        drops,
        { autoAlpha: 1, y: 0, scale: 0.5 },
        { y: -30, scale: 1, autoAlpha: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" },
        0,
      );
  };

  gsap.fromTo(
    mascot,
    { y: () => window.innerHeight * 0.14, rotation: -8 },
    {
      y: landingY,
      rotation: 712,
      ease: "none",
      immediateRender: true,
      scrollTrigger: {
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress > 0.985 && !landed) {
            landed = true;
            splash();
          } else if (self.progress < 0.9 && landed) {
            landed = false;
          }
        },
      },
    },
  );
}

/**
 * On wide screens the social rail pins and vertical scroll becomes its
 * horizontal travel. Registered inside gsap.matchMedia, so it reverts
 * cleanly when the viewport drops below the breakpoint.
 */
type RailFx = { place: () => void; progress: (p: number) => void };
let railFx: RailFx | null = null;

/**
 * Depth inside the social rail, shared by the native swipe and the desktop
 * pin: photos tilt and dip as they leave the centre of the screen, the
 * doodles on the quote cards drift at their own rate, the bar under the
 * header fills and the counter follows the card nearest the middle.
 */
function setupRail(signal: AbortSignal) {
  const section = document.querySelector<HTMLElement>("[data-pin-rail]");
  const rail = section?.querySelector<HTMLElement>(".rail");
  railFx = null;
  if (!section || !rail) return;

  const cards = Array.from(rail.children) as HTMLElement[];
  const arts = cards.map((card) => {
    const art = card.querySelector<HTMLElement>("[data-card-art]");
    return art
      ? {
          kind: art.dataset.cardArt,
          x: gsap.quickSetter(art, "x", "px"),
          y: gsap.quickSetter(art, "y", "px"),
          rot: gsap.quickSetter(art, "rotation", "deg"),
        }
      : null;
  });
  const bar = section.querySelector<HTMLElement>("[data-feed-bar]");
  const barSetter = bar ? gsap.quickSetter(bar, "scaleX") : null;
  const count = section.querySelector<HTMLElement>("[data-feed-count]");
  const clamp = gsap.utils.clamp(-1, 1);

  const place = () => {
    const vw = window.innerWidth;
    cards.forEach((card, i) => {
      const art = arts[i];
      if (!art) return;
      const r = card.getBoundingClientRect();
      const d = r.left + r.width / 2 - vw / 2;
      // -1 at the left edge, 0 in the middle, 1 at the right edge.
      const t = clamp(d / (vw * 0.6));
      if (art.kind === "photo") {
        art.rot(t * 4);
        art.y(Math.abs(t) * 16);
        art.x(t * -10);
      } else {
        art.x(t * -44);
        art.rot(t * 12);
      }
    });
  };
  // 01 at the start of the rail, the last card's number at the end.
  const progress = (p: number) => {
    barSetter?.(p);
    if (count) count.textContent = String(1 + Math.round(p * (cards.length - 1))).padStart(2, "0");
  };

  // The native swipe rail (touch, and any screen below the pin breakpoint).
  // Under the desktop pin scrollLeft stays 0 and the pin drives this instead.
  let frame = 0;
  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      place();
      const max = rail.scrollWidth - rail.clientWidth;
      if (max > 0) progress(rail.scrollLeft / max);
    });
  };
  rail.addEventListener("scroll", onScroll, { passive: true, signal });
  window.addEventListener("resize", onScroll, { signal });
  place();
  railFx = { place, progress };
}

function setupPinnedRail() {
  const section = document.querySelector<HTMLElement>("[data-pin-rail]");
  const rail = section?.querySelector<HTMLElement>(".rail");
  if (!section || !rail) return;

  // Layout offsets ignore the cards' entrance transforms. scrollWidth
  // includes those transforms and would change after the pin is measured.
  const distance = () => {
    const first = rail.firstElementChild as HTMLElement | null;
    const last = rail.lastElementChild as HTMLElement | null;
    if (!first || !last) return 0;
    return Math.max(0, last.offsetLeft + last.offsetWidth - first.offsetLeft - rail.clientWidth);
  };
  if (distance() <= 0) return;

  const cards = Array.from(rail.children) as HTMLElement[];
  // Where each card's left edge lines up with the rail's, as scroll progress.
  const stops = () => {
    const travel = distance();
    const origin = cards[0]?.offsetLeft ?? 0;
    return [0, ...cards.map((card) => Math.min(travel, card.offsetLeft - origin) / travel), 1];
  };

  // The strip leans into a fast scroll and eases back upright when it stops.
  const lean = { skew: 0 };
  const skewSetter = gsap.quickSetter(rail, "skewX", "deg");
  const clampSkew = gsap.utils.clamp(-7, 7);

  // A viewport change can follow a native swipe; avoid adding that scroll
  // offset to the desktop transform when the pin takes over.
  rail.scrollLeft = 0;
  gsap.set(rail, { overflowX: "visible", transformOrigin: "center center" });
  gsap.set(section, { overflow: "hidden" });
  const tween = gsap.to(rail, {
    x: () => -distance(),
    ease: "none",
    // The scrub lags the scroll, so card depth and the bar follow the
    // tween's own frames rather than the raw scroll position.
    onUpdate(this: gsap.core.Tween) {
      railFx?.place();
      railFx?.progress(this.progress());
    },
    scrollTrigger: {
      trigger: section,
      pin: true,
      // The page is a flex column; reserve space so the footer cannot
      // overlap the photos while this section is pinned.
      pinSpacing: "margin",
      scrub: 0.6,
      // Pinned mid-viewport rather than flush to the top, so the sticky
      // header (which returns on any scroll-up) never covers the heading.
      start: () => (section.offsetHeight < window.innerHeight ? "center center" : "top top"),
      // A little more scroll than travel, so the rail moves slower than the
      // page and there's time to take the cards in.
      end: () => `+=${distance() * 1.4}`,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      // Settle on a card edge once the scroll comes to rest.
      snap: {
        snapTo: (value) => gsap.utils.snap(stops(), value),
        duration: { min: 0.15, max: 0.45 },
        delay: 0.05,
        ease: "power2.inOut",
        // Snap from where the scroll rests, not where a flick would have carried it.
        inertia: false,
      },
      onUpdate: (self) => {
        const skew = clampSkew(self.getVelocity() / -400);
        if (Math.abs(skew) > Math.abs(lean.skew)) {
          lean.skew = skew;
          gsap.to(lean, {
            skew: 0,
            duration: 0.7,
            ease: "power3",
            overwrite: true,
            onUpdate: () => skewSetter(lean.skew),
          });
        }
      },
    },
  });

  const stepRail = (event: Event) => {
    const direction = (event as CustomEvent<{ direction?: number }>).detail?.direction;
    const trigger = tween.scrollTrigger;
    const travel = distance();
    if ((direction !== -1 && direction !== 1) || !trigger || travel <= 0) return;

    // Cancel the native fallback only while this pinned rail owns navigation.
    event.preventDefault();
    const current = trigger.progress * travel;
    const cards = Array.from(rail.children) as HTMLElement[];
    const origin = cards[0]?.offsetLeft ?? 0;
    const stops = [0, ...cards.map((card) => Math.min(travel, card.offsetLeft - origin)), travel];
    const target = direction === 1
      ? stops.find((position) => position > current + 1) ?? travel
      : stops.findLast((position) => position < current - 1) ?? 0;
    if (Math.abs(target - current) < 1) return;

    window.scrollTo({
      top: trigger.start + (target / travel) * (trigger.end - trigger.start),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  section.addEventListener("dizzy:feed-step", stepRail);
  return () => section.removeEventListener("dizzy:feed-step", stepRail);
}

// ─── Cart ───────────────────────────────────────────────────────────────────

/**
 * Add-to-cart flourish: a dot arcs from the button to the cart badge, then
 * the badge pops. Falls back to nothing under reduced motion.
 */
export function flyToCart(from: HTMLElement) {
  const badge = document.querySelector<HTMLElement>("[data-cart-badge]");
  if (!badge || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  showHeader();

  const a = from.getBoundingClientRect();
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

  // Measure the badge after the header has had a beat to come back.
  gsap.delayedCall(0.2, () => {
    const b = badge.getBoundingClientRect();
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
  });
}
