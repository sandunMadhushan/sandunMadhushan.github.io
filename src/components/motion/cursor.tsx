"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Idle ring diameter, px. */
const RING_SIZE = 34;
/** Ring diameter while hovering something interactive, px. */
const RING_SIZE_HOVER = 54;
/** Dot diameter, px. */
const DOT_SIZE = 7;

const INTERACTIVE = 'a, button, [role="button"], summary, [data-cursor-lock]';

/**
 * Signal cursor.
 *
 * A small dot glued exactly to the pointer, with a ring trailing a step
 * behind it — both painted with mix-blend-mode: difference, so they read as
 * a bright mark against dark content and a dark mark against light content
 * automatically, with zero contrast tuning needed against the nav's glass
 * capsule, project imagery, or either theme.
 *
 * Earlier this locked the ring onto the full bounding box of whatever was
 * hovered — nice on a small button, useless on a wide nav bar or a
 * full-height project card: the brackets ended up far from the actual
 * pointer, which read as "the cursor vanished" over exactly those elements.
 * This version never leaves the pointer position — hovering an interactive
 * element only grows the ring and, if the element sets data-cursor-text,
 * reveals a small label next to it.
 *
 * Only mounts for fine pointers, and never under reduced-motion. The native
 * cursor is hidden ONLY after the mark has actually been drawn once, so a
 * failure here can never leave the page with no visible cursor at all.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let armed = false;
    let hovering = false;

    gsap.set(dot, { opacity: 0 });
    gsap.set(ring, { opacity: 0, width: RING_SIZE, height: RING_SIZE });
    gsap.set(label, { opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.06, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.06, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.28, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.28, ease: "power3.out" });
    const labelX = gsap.quickTo(label, "x", { duration: 0.28, ease: "power3.out" });
    const labelY = gsap.quickTo(label, "y", { duration: 0.28, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const px = e.clientX;
      const py = e.clientY;

      if (!armed) {
        armed = true;
        // Only now is it safe to take away the native cursor.
        document.documentElement.classList.add("has-custom-cursor");
        gsap.to([dot, ring], { opacity: 1, duration: 0.25 });
      }

      dotX(px - DOT_SIZE / 2);
      dotY(py - DOT_SIZE / 2);
      const ringSize = hovering ? RING_SIZE_HOVER : RING_SIZE;
      ringX(px - ringSize / 2);
      ringY(py - ringSize / 2);
      labelX(px + ringSize / 2 + 10);
      labelY(py - 7);
    };

    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
      if (!el || hovering) return;
      hovering = true;
      gsap.to(ring, {
        width: RING_SIZE_HOVER,
        height: RING_SIZE_HOVER,
        duration: 0.35,
        ease: "expo.out",
      });
      const text = el.getAttribute("data-cursor-text");
      if (text) {
        label.textContent = text;
        gsap.to(label, { opacity: 1, duration: 0.25 });
      }
    };

    const onOut = (e: PointerEvent) => {
      if (!hovering) return;
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
      if (!el) return;
      const next = e.relatedTarget as Element | null;
      if (next && el.contains(next)) return;
      hovering = false;
      gsap.to(ring, {
        width: RING_SIZE,
        height: RING_SIZE,
        duration: 0.35,
        ease: "expo.out",
      });
      gsap.to(label, { opacity: 0, duration: 0.2 });
    };

    const onLeaveWindow = () => {
      gsap.to([dot, ring, label], { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={labelRef} className="cursor-label" aria-hidden />
    </>
  );
}
