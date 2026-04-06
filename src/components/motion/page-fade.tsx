"use client";

import { motion } from "framer-motion";

type TransitionPreset = "minimal" | "smooth" | "cinematic";

const ACTIVE_TRANSITION_PRESET: TransitionPreset = "minimal";

const PRESETS: Record<
  TransitionPreset,
  {
    initial: { opacity: number; y: number; scale: number; filter?: string };
    animate: { opacity: number; y: number; scale: number; filter?: string };
    transition: { duration: number; ease: [number, number, number, number] };
  }
> = {
  // Barely-there transition for snappy feel.
  minimal: {
    initial: { opacity: 0.98, y: 4, scale: 1 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
  },
  // Balanced transition for most portfolio pages.
  smooth: {
    initial: { opacity: 0.92, y: 12, scale: 0.995 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
  // Stronger transition with subtle blur for dramatic feel.
  cinematic: {
    initial: { opacity: 0.84, y: 24, scale: 0.985, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  },
};

export function PageFade({ children }: { children: React.ReactNode }) {
  const preset = PRESETS[ACTIVE_TRANSITION_PRESET];

  return (
    <motion.div
      initial={preset.initial}
      animate={preset.animate}
      transition={preset.transition}
    >
      {children}
    </motion.div>
  );
}
