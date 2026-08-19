"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Newspaper } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { MIcon } from "@/components/m-icon";
import { cn } from "@/lib/utils";

/** Approximate fixed `SiteNav` height (py-4 + line + border). Keep in sync with site-nav spacing. */
const SITE_NAV_BOTTOM_PX = 64;

type Props = {
  title: string;
  githubLink: string | null;
  liveLink: string | null;
  blogLink: string | null;
  header: ReactNode;
  children: ReactNode;
};

export function ProjectDetailLayout({ title, githubLink, liveLink, blogLink, header, children }: Props) {
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

  const hasActions = Boolean(githubLink || liveLink || blogLink);

  return (
    <>
      <div ref={headerWrapRef}>{header}</div>

      <div
        role="navigation"
        aria-label="Project quick actions"
        className={cn(
          "fixed left-0 right-0 z-40 transition-[transform,opacity] duration-300 ease-out",
          showSticky
            ? "top-16 translate-y-0 opacity-100"
            : "top-16 pointer-events-none -translate-y-full opacity-0",
        )}
      >
        {/* Inset to the same gutter + max-width as the rest of the page
            (Container), so this bar reads as part of the document instead
            of a full-bleed strip that ignores its margins. */}
        <div className="mx-auto max-w-[1512px] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 rounded-lg border border-outline-variant bg-background/90 px-4 py-3 backdrop-blur-xl md:gap-4 md:px-5">
            <h2 className="type-mono min-w-0 flex-1 truncate text-on-surface">
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
                    className="type-mono-sm inline-flex items-center gap-1.5 rounded-sm bg-primary-container px-3 py-2 text-on-primary-container transition-opacity hover:opacity-90 md:px-3.5"
                  >
                    <MIcon name="launch" className="text-sm" />
                    <span className="hidden sm:inline">Live</span>
                  </a>
                ) : null}
                {githubLink ? (
                  <a
                    href={githubLink}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={showSticky ? undefined : -1}
                    className="type-mono-sm inline-flex items-center gap-1.5 rounded-sm border border-outline-variant px-3 py-2 text-on-surface transition-colors hover:border-primary hover:text-primary md:px-3.5"
                  >
                    <SiGithub className="size-3.5 shrink-0" aria-hidden />
                    <span className="hidden sm:inline">GitHub</span>
                  </a>
                ) : null}
                {blogLink ? (
                  <a
                    href={blogLink}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={showSticky ? undefined : -1}
                    className="type-mono-sm inline-flex items-center gap-1.5 rounded-sm border border-outline-variant px-3 py-2 text-on-surface transition-colors hover:border-primary hover:text-primary md:px-3.5"
                  >
                    <Newspaper className="size-3.5 shrink-0" aria-hidden />
                    <span className="hidden sm:inline">Blog</span>
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {children}
    </>
  );
}
