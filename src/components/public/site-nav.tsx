"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  SITE_NAV_LINKS,
  isNavOffSiteStyle,
  isTrailingNavLink,
  type SiteNavLink,
} from "@/lib/site-nav-links";

export function SiteNav({ active }: { active?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Prefetch every internal route once the browser goes idle. */
  useEffect(() => {
    let cancelled = false;
    const prefetchAll = () => {
      if (cancelled) return;
      SITE_NAV_LINKS.forEach((l) => {
        if (!isNavOffSiteStyle(l)) router.prefetch(l.href);
      });
    };
    let idleId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(prefetchAll, { timeout: 2000 });
    } else {
      timeoutId = setTimeout(prefetchAll, 200);
    }
    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      else if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (l: SiteNavLink) =>
    !isNavOffSiteStyle(l) &&
    (active === l.href || (l.href !== "/" && Boolean(active?.startsWith(l.href))));

  /** Desktop link: monospace label with a square active marker. */
  const renderLink = (l: SiteNavLink) => {
    const offSite = isNavOffSiteStyle(l);
    const activeNow = isActive(l);
    const base = `type-mono group relative inline-flex items-center gap-1.5 py-1 transition-colors duration-300 ${
      activeNow
        ? "text-on-surface"
        : "text-on-surface-variant hover:text-on-surface"
    }`;
    const inner = (
      <>
        <span
          aria-hidden
          className={`size-1 shrink-0 transition-all duration-300 ${
            activeNow
              ? "scale-100 bg-primary-container"
              : "scale-0 bg-primary-container group-hover:scale-100"
          }`}
        />
        {l.label}
        {offSite ? (
          <ArrowUpRight className="size-3 opacity-50" aria-hidden />
        ) : null}
      </>
    );

    return offSite ? (
      <a
        key={l.href}
        href={l.href}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
      >
        {inner}
      </a>
    ) : (
      <Link key={l.href} href={l.href} className={base}>
        {inner}
      </Link>
    );
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-outline-variant bg-background/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          className="mx-auto flex max-w-[1512px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-12"
          aria-label="Primary"
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="group flex shrink-0 items-baseline gap-2"
            onClick={() => setOpen(false)}
          >
            <span className="font-display text-2xl leading-none tracking-tight text-on-surface">
              Sandun
            </span>
            <span
              aria-hidden
              className="hidden h-1.5 w-1.5 bg-primary-container transition-transform duration-500 group-hover:scale-150 sm:block"
            />
          </Link>

          {/* Primary links */}
          <div className="hidden min-w-0 flex-1 items-center justify-center gap-9 md:flex">
            {SITE_NAV_LINKS.filter((l) => !isTrailingNavLink(l)).map(renderLink)}
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {SITE_NAV_LINKS.some(isTrailingNavLink) ? (
              <div className="hidden items-center gap-5 border-l border-outline-variant pl-5 md:flex">
                {SITE_NAV_LINKS.filter(isTrailingNavLink).map(renderLink)}
              </div>
            ) : null}

            <ThemeToggle />

            <Magnetic className="hidden sm:inline-block">
              <Link
                href="/contact"
                className="type-mono inline-flex items-center gap-2 rounded-sm bg-primary-container px-5 py-2.5 text-on-primary-container transition-transform duration-300 hover:scale-[1.03] active:scale-95"
                onClick={() => setOpen(false)}
              >
                Connect
              </Link>
            </Magnetic>

            {/* Mobile trigger — two bars that morph into a cross. */}
            <button
              type="button"
              aria-expanded={open}
              aria-controls="site-mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={`h-px w-5 bg-on-surface transition-all duration-300 ${
                  open ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-5 bg-on-surface transition-all duration-300 ${
                  open ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>
        {scrolled ? <ScrollProgress /> : null}
      </header>

      {/* Full-screen mobile overlay with staggered display-type links. */}
      <div
        id="site-mobile-nav"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-background transition-[opacity,visibility] duration-400 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex h-full flex-col justify-between px-5 pb-10 pt-28 sm:px-8">
          <ul className="flex flex-col">
            {SITE_NAV_LINKS.map((l, i) => {
              const offSite = isNavOffSiteStyle(l);
              const activeNow = isActive(l);
              const cls = `flex items-baseline justify-between gap-4 border-b border-outline-variant py-5 font-display text-4xl leading-none tracking-tight transition-colors ${
                activeNow ? "text-primary" : "text-on-surface"
              }`;
              const style = {
                transitionDelay: open ? `${120 + i * 55}ms` : "0ms",
              };
              const inner = (
                <>
                  <span>{l.label}</span>
                  <span className="type-mono-sm text-on-surface-variant">
                    {offSite ? "↗" : String(i + 1).padStart(2, "0")}
                  </span>
                </>
              );
              return (
                <li
                  key={l.href}
                  style={style}
                  className={`transition-all duration-500 ${
                    open
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                >
                  {offSite ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cls}
                      onClick={() => setOpen(false)}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className={cls}
                      onClick={() => setOpen(false)}
                    >
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="type-mono mt-8 flex items-center justify-center gap-2 rounded-sm bg-primary-container px-6 py-4 text-on-primary-container"
          >
            Start a conversation
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </>
  );
}
