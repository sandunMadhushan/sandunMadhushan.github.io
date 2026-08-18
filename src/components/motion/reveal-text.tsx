"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Masked type reveal.
 *
 * Each unit sits in an overflow-hidden box and rises straight into place.
 * `split="char"` staggers per letter (for short display headings);
 * `split="word"` is the default and is right for anything longer.
 *
 * Skipped entirely under prefers-reduced-motion, where the text is simply
 * present from the start.
 */
export function RevealText({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
  stagger,
  onLoad = false,
  split = "word",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  delay?: number;
  stagger?: number;
  /** Play immediately instead of waiting for the element to scroll into view. */
  onLoad?: boolean;
  split?: "word" | "char";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const units = el.querySelectorAll<HTMLElement>("[data-unit]");
    if (units.length === 0) return;

    const step = stagger ?? (split === "char" ? 0.028 : 0.055);

    const ctx = gsap.context(() => {
      gsap.to(units, {
        y: "0%",
        duration: 1.0,
        ease: "expo.out",
        stagger: step,
        delay,
        ...(onLoad
          ? {}
          : {
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }),
      });
    }, el);

    return () => ctx.revert();
  }, [delay, stagger, onLoad, split]);

  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={className}>
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
          {split === "char"
            ? Array.from(word).map((ch, ci) => (
                <span key={ci} className="reveal-mask">
                  <span data-unit>{ch}</span>
                </span>
              ))
            : (
                <span className="reveal-mask">
                  <span data-unit>{word}</span>
                </span>
              )}
          {wi < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
}
