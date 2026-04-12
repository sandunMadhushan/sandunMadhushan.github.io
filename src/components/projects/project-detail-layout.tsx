"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MIcon } from "@/components/m-icon";
import { cn } from "@/lib/utils";

/** Approximate fixed `SiteNav` height (py-4 + line + border). Keep in sync with site-nav spacing. */
const SITE_NAV_BOTTOM_PX = 64;

type Props = {
  title: string;
  githubLink: string | null;
  liveLink: string | null;
  header: ReactNode;
  children: ReactNode;
};

export function ProjectDetailLayout({ title, githubLink, liveLink, header, children }: Props) {
  const headerWrapRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  const updateSticky = useCallback(() => {
    const el = headerWrapRef.current;
    if (!el) return;
    setShowSticky(el.getBoundingClientRect().bottom < SITE_NAV_BOTTOM_PX);
  }, []);

  useEffect(() => {
    updateSticky();
    window.addEventListener("scroll", updateSticky, { passive: true });
    window.addEventListener("resize", updateSticky);
    return () => {
      window.removeEventListener("scroll", updateSticky);
      window.removeEventListener("resize", updateSticky);
    };
  }, [updateSticky]);

  const hasActions = Boolean(githubLink || liveLink);

  return (
    <>
      <div ref={headerWrapRef}>{header}</div>

      <div
        role="navigation"
        aria-label="Project quick actions"
        className={cn(
          "fixed left-0 right-0 z-40 border-b border-outline-variant/10 bg-surface/90 shadow-sm backdrop-blur-xl transition-[transform,opacity] duration-300 ease-out",
          showSticky
            ? "top-16 translate-y-0 opacity-100"
            : "top-16 pointer-events-none -translate-y-full opacity-0",
        )}
      >
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-6 py-2.5 md:gap-4 md:px-12">
          <h2 className="min-w-0 flex-1 truncate text-sm font-bold tracking-tight text-on-surface md:text-[0.9375rem]">
            {title}
          </h2>
          {hasActions ? (
            <div className="flex shrink-0 items-center gap-2">
              {liveLink ? (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={showSticky ? undefined : -1}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary-container px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-on-primary-container transition-opacity hover:opacity-90 md:px-3.5 md:text-xs"
                >
                  <MIcon name="launch" className="text-base" />
                  <span className="hidden sm:inline">Live</span>
                </a>
              ) : null}
              {githubLink ? (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={showSticky ? undefined : -1}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/20 bg-surface-container-high px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-on-surface transition-colors hover:bg-surface-bright md:px-3.5 md:text-xs"
                >
                  <MIcon name="code" className="text-base" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {children}
    </>
  );
}
