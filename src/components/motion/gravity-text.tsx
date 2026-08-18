"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** How close the pointer needs to be (px) before letters start reacting. */
const RADIUS = 160;
/** Max displacement a letter can be pulled, in px. */
const MAX_PULL = 22;

/**
 * A name that responds to proximity rather than hover — each letter is
 * pulled toward the pointer with a falloff, like the text has its own small
 * gravity well. Falls back to plain static text under reduced-motion, on
 * touch, or when JS hasn't mounted yet.
 *
 * Deliberately restrained (small max pull, tight radius) so it reads as a
 * quiet detail on a signature line, not a party trick.
 */
export function GravityText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const quicks = useRef<Array<{ x: (v: number) => void; y: (v: number) => void } | null>>([]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    quicks.current = letterRefs.current.map((el) => {
      if (!el) return null;
      return {
        x: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" }),
      };
    });

    // A window-level pointermove is cheap on its own, but reading every
    // letter's getBoundingClientRect on each move is not something to do on
    // every page while the footer sits off-screen. Only wire the listener up
    // while the wordmark is actually in (or near) the viewport.
    let active = false;

    const onMove = (e: PointerEvent) => {
      if (!active) return;
      letterRefs.current.forEach((el, i) => {
        const quick = quicks.current[i];
        if (!el || !quick) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - e.clientX;
        const dy = cy - e.clientY;
        const dist = Math.hypot(dx, dy);
        if (dist > RADIUS) {
          quick.x(0);
          quick.y(0);
          return;
        }
        const pull = (1 - dist / RADIUS) ** 2 * MAX_PULL;
        const angle = Math.atan2(dy, dx);
        quick.x(Math.cos(angle) * pull);
        quick.y(Math.sin(angle) * pull);
      });
    };

    const onLeave = () => {
      letterRefs.current.forEach((el) => {
        if (!el) return;
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (!active) onLeave();
      },
      { rootMargin: `${RADIUS}px` },
    );
    observer.observe(host);

    window.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [text]);

  return (
    <span ref={hostRef} className={className}>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          ref={(el) => {
            letterRefs.current[i] = el;
          }}
          className="inline-block will-change-transform"
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
