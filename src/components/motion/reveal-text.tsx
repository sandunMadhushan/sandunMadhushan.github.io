"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Word-by-word mask reveal. Each word sits in an overflow-hidden box and
 * lifts into place, which is what makes oversized display type feel
 * deliberate rather than merely faded in.
 *
 * `as` keeps the heading level semantic; motion is skipped entirely when
 * the visitor prefers reduced motion.
 */
export function RevealText({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
  stagger = 0.055,
  onLoad = false,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  delay?: number;
  stagger?: number;
  /** Play immediately instead of waiting for the element to scroll into view. */
  onLoad?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    if (words.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.to(words, {
        y: "0%",
        duration: 1.1,
        ease: "expo.out",
        stagger,
        delay,
        ...(onLoad
          ? {}
          : {
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
              },
            }),
      });
    }, el);

    return () => ctx.revert();
  }, [delay, stagger, onLoad]);

  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="reveal-mask">
          <span data-word>{word}</span>
          {i < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
}
