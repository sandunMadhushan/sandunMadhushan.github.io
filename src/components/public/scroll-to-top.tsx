"use client";

import { useCallback, useEffect, useState } from "react";
import { MIcon } from "@/components/m-icon";
import { useSmoothScroll } from "@/components/public/smooth-scroll-provider";

const SHOW_AFTER_PX = 320;

export function ScrollToTop() {
  const { lenis } = useSmoothScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const y = lenis ? lenis.scroll : window.scrollY;
      setVisible(y > SHOW_AFTER_PX);
    };
    update();

    if (lenis) {
      return lenis.on("scroll", update);
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [lenis]);

  const goTop = useCallback(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lenis) {
      lenis.scrollTo(0, { immediate: reduce });
      return;
    }
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [lenis]);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
      {...(!visible ? { "aria-hidden": true } : {})}
      className={`fixed bottom-6 right-5 z-40 flex size-11 items-center justify-center rounded-full border border-outline-variant bg-background/70 text-on-surface-variant backdrop-blur-xl transition-all duration-300 hover:border-primary hover:text-primary md:bottom-10 md:right-8 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      onClick={goTop}
    >
      <MIcon name="arrow_upward" className="text-lg" />
    </button>
  );
}
