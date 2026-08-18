"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Ticker whose speed and direction follow scroll velocity: it idles at a slow
 * drift, accelerates while you scroll, and reverses when you scroll back.
 *
 * Velocity is stored in a plain ref and decayed inside the ticker. An earlier
 * version spawned a `gsap.to` on every ScrollTrigger update to ease it back to
 * zero — with Lenis driving ScrollTrigger.update once per frame, that created
 * a new 0.9s tween every frame and locked the main thread. Never allocate
 * per-frame here.
 */
export function VelocityMarquee({
  children,
  baseSpeed = 0.5,
  className = "",
}: {
  children: ReactNode;
  /** Idle drift in pixels per frame. */
  baseSpeed?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let offset = 0;
    let direction = 1;
    let velocity = 0;
    let half = track.scrollWidth / 2;

    const measure = () => {
      half = track.scrollWidth / 2;
    };
    measure();

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        direction = self.direction || 1;
        // Plain assignment — no tween, no allocation.
        velocity = Math.min(Math.abs(self.getVelocity()) / 300, 8);
      },
    });

    const tick = () => {
      if (half <= 0) return;
      velocity *= 0.93; // exponential decay back to the idle drift
      offset -= (baseSpeed + velocity) * direction;
      if (offset <= -half) offset += half;
      if (offset > 0) offset -= half;
      // Direct style write is cheaper than gsap.set at 60fps.
      track.style.transform = `translate3d(${offset}px,0,0)`;
    };

    gsap.ticker.add(tick);
    window.addEventListener("resize", measure);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", measure);
      trigger.kill();
    };
  }, [baseSpeed]);

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden>
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </div>
    </div>
  );
}
