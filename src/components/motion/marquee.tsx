"use client";

import type { ReactNode } from "react";

/**
 * Seamless horizontal ticker. The child set is rendered twice and the
 * track translates -50%, so the loop has no visible seam.
 * Pauses on hover; frozen entirely under reduced-motion.
 */
export function Marquee({
  children,
  duration = 40,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <div
      className={`marquee-host relative overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        className="marquee-track"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </div>
    </div>
  );
}
