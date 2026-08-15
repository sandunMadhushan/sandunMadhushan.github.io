"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Staggers direct children (or anything matching `selector`) into view.
 *
 * Replaces the old whole-section fade: individual rows arrive in sequence,
 * which reads as intentional composition instead of one large block jumping.
 */
export function StaggerIn({
  children,
  className = "",
  selector = ":scope > *",
  y = 28,
  stagger = 0.08,
  duration = 0.9,
  start = "top 86%",
}: {
  children: React.ReactNode;
  className?: string;
  selector?: string;
  y?: number;
  stagger?: number;
  duration?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(el.querySelectorAll<HTMLElement>(selector));
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        duration,
        ease: "expo.out",
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [selector, y, stagger, duration, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
