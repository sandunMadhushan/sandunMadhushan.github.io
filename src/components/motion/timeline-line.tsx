"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vertical spine for the About timeline. A dim track is drawn full-height and
 * an accent line fills it in proportion to how far the section has scrolled
 * past the middle of the viewport — so the line literally draws as you read.
 */
export function TimelineLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame = requestAnimationFrame(() => setProgress(1));
      return () => cancelAnimationFrame(frame);
    }

    const update = () => {
      frame = 0;
      const parent = el.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const anchor = window.innerHeight * 0.5;
      const travelled = anchor - rect.top;
      setProgress(Math.max(0, Math.min(1, travelled / rect.height)));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`absolute bottom-0 top-0 w-px bg-outline-variant ${className}`}
    >
      <div
        className="w-full origin-top bg-primary-container"
        style={{ height: "100%", transform: `scaleY(${progress})` }}
      />
    </div>
  );
}
