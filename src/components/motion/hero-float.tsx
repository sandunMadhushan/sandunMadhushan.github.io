"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function HeroFloat({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tween = gsap.to(el, {
      y: 12,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div ref={ref} className="will-change-transform">
      {children}
    </div>
  );
}
