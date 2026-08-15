"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";

/**
 * Two-state theme switch. Both glyphs are rendered and cross-faded so the
 * control never reflows, and the track reads as a physical switch.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`group relative flex h-9 w-9 items-center justify-center rounded-sm border border-outline-variant text-on-surface-variant transition-colors duration-300 hover:border-primary hover:text-primary ${className}`}
    >
      <Sun
        className={`absolute size-[15px] transition-all duration-500 ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
        strokeWidth={1.75}
        aria-hidden
      />
      <Moon
        className={`absolute size-[15px] transition-all duration-500 ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
        strokeWidth={1.75}
        aria-hidden
      />
    </button>
  );
}
