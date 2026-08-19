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
 * behind it — both a solid accent-color fill with a dark box-shadow halo,
 * so they stay visible against any background (dark, light, a photo, the
 * nav's blurred glass) without depending on mix-blend-mode compositing.
 *
 * Earlier this locked the ring onto the full bounding box of whatever was
 * hovered — nice on a small button, useless on a wide nav bar or a
 * full-height project card: the brackets ended up far from the actual
 * pointer, which read as "the cursor vanished" over exactly those elements.
 * This version never leaves the pointer position — hovering an interactive
 * element only grows the ring in place.
 *
 * Only mounts for fine pointers, and never under reduced-motion. The native
 * cursor is hidden ONLY after the mark has actually been drawn once, so a
 * failure here can never leave the page with no visible cursor at all.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let armed = false;
    let visible = false;
    let hovering = false;

    gsap.set(dot, { opacity: 0 });
    gsap.set(ring, { opacity: 0, width: RING_SIZE, height: RING_SIZE });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.06, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.06, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.28, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.28, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const px = e.clientX;
      const py = e.clientY;

      if (!armed) {
        armed = true;
        // Only now is it safe to take away the native cursor.
        document.documentElement.classList.add("has-custom-cursor");
      }

      // Re-arming only hid the native cursor once; it never re-showed the
      // mark itself after a fade-out (window blur, tab switch, pointer
      // leaving the viewport). That left the page with NO visible cursor
      // at all until reload. Every move must be able to bring it back.
      if (!visible) {
        visible = true;
        // Plain gsap.to here, deliberately NOT gsap.killTweensOf: killing
        // tweens on dot/ring would also kill the persistent internal
        // tweens that the quickTo x/y setters below depend on, freezing
        // the mark at whatever position it last had (opacity would come
        // back, but it would stop following the pointer forever). A
        // same-property opacity tween auto-overwrites the previous one.
        gsap.to([dot, ring], { opacity: 1, duration: 0.25, overwrite: "auto" });
      }

      dotX(px - DOT_SIZE / 2);
      dotY(py - DOT_SIZE / 2);
      const ringSize = hovering ? RING_SIZE_HOVER : RING_SIZE;
      ringX(px - ringSize / 2);
      ringY(py - ringSize / 2);
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
    };

    const onLeaveWindow = () => {
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.2, overwrite: "auto" });
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
    </>
  );
}
