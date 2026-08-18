"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  SITE_NAV_LINKS,
  isNavOffSiteStyle,
  isTrailingNavLink,
  type SiteNavLink,
} from "@/lib/site-nav-links";

/** Distance scrolled before the bar collapses into the floating capsule. */
const COLLAPSE_AT = 90;

export function SiteNav({ active }: { active?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  const primary = SITE_NAV_LINKS.filter((l) => !isTrailingNavLink(l));
  const trailing = SITE_NAV_LINKS.filter(isTrailingNavLink);

  const isActive = useCallback(
    (l: SiteNavLink) =>
      !isNavOffSiteStyle(l) &&
      (active === l.href ||
        (l.href !== "/" && Boolean(active?.startsWith(l.href)))),
    [active],
  );

  const activeIndex = primary.findIndex(isActive);

  /* Position the sliding indicator behind the hovered link, falling back to
     the active route. Measured rather than hard-coded so it survives font
     loading and any label change. One effect owns mount, dependency changes,
     resize and webfont settle, so there is no memoized callback to preserve. */
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      const idx = hovered ?? (activeIndex >= 0 ? activeIndex : null);
      const host = listRef.current;
      const el = idx === null ? null : linkRefs.current[idx];
      if (!el || !host) {
        setPill(null);
        return;
      }
      setPill({ x: el.offsetLeft, w: el.offsetWidth });
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
    };
  }, [hovered, activeIndex]);

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
    let frame = 0;
    const update = () => {
      frame = 0;
      setCollapsed(window.scrollY > COLLAPSE_AT);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
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

  const renderLink = (l: SiteNavLink, i: number) => {
    const offSite = isNavOffSiteStyle(l);
    const on = isActive(l);
    const cls = `type-mono relative z-10 whitespace-nowrap px-4 py-2 transition-colors duration-300 ${
      on || hovered === i ? "text-on-surface" : "text-on-surface-variant"
    }`;
    const body = (
      <>
        {l.label}
        {offSite ? (
          <ArrowUpRight className="ml-1 inline size-3 opacity-50" aria-hidden />
        ) : null}
      </>
    );
    const shared = {
      ref: (el: HTMLAnchorElement | null) => {
        linkRefs.current[i] = el;
      },
      className: cls,
      onMouseEnter: () => setHovered(i),
      onFocus: () => setHovered(i),
    };

    return offSite ? (
      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" {...shared}>
        {body}
      </a>
    ) : (
      <Link key={l.href} href={l.href} {...shared}>
        {body}
      </Link>
    );
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div
          className={`mx-auto flex items-center justify-between gap-6 transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            collapsed
              ? "mt-3 w-[min(100%-1.5rem,64rem)] rounded-full border border-outline-variant bg-background/70 px-3 py-2 backdrop-blur-2xl md:px-4"
              : "mt-0 w-full max-w-[1512px] rounded-none border border-transparent px-5 py-5 sm:px-8 lg:px-12"
          }`}
        >
          {/* Wordmark — contracts to a monogram inside the capsule. */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="pointer-events-auto group flex shrink-0 items-baseline gap-2 overflow-hidden"
          >
            <span
              className={`font-display leading-none text-on-surface transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                collapsed ? "text-lg" : "text-2xl"
              }`}
            >
              <span>S</span>
              <span
                className={`inline-block overflow-hidden align-baseline transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  collapsed ? "max-w-0 opacity-0" : "max-w-[6ch] opacity-100"
                }`}
              >
                andun
              </span>
            </span>
            <span
              aria-hidden
              className="size-1.5 shrink-0 bg-primary-container transition-transform duration-500 group-hover:scale-150"
            />
          </Link>

          {/* Primary nav with the sliding indicator. */}
          <nav
            aria-label="Primary"
            className="pointer-events-auto hidden md:block"
            onMouseLeave={() => setHovered(null)}
          >
            <div ref={listRef} className="relative flex items-center">
              {pill ? (
                <span
                  aria-hidden
                  className="absolute inset-y-0 -z-0 rounded-full bg-surface-container-high transition-all duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
                />
              ) : null}
              {primary.map(renderLink)}
            </div>
          </nav>

          <div className="pointer-events-auto flex shrink-0 items-center gap-2 sm:gap-3">
            {trailing.length > 0 ? (
              <div
                className={`hidden items-center transition-all duration-500 md:flex ${
                  collapsed ? "max-w-0 opacity-0" : "max-w-[12rem] opacity-100"
                }`}
              >
                {trailing.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-mono whitespace-nowrap px-3 py-2 text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    {l.label}
                    <ArrowUpRight className="ml-1 inline size-3 opacity-50" aria-hidden />
                  </a>
                ))}
              </div>
            ) : null}

            <ThemeToggle className={collapsed ? "rounded-full" : ""} />

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              aria-label="Connect"
              className={`group inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary-container transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] active:scale-95 ${
                collapsed
                  ? "size-9 rounded-full"
                  : "type-mono rounded-sm px-5 py-2.5"
              }`}
            >
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-500 ${
                  collapsed ? "max-w-0 opacity-0" : "max-w-[8ch] opacity-100"
                }`}
              >
                Connect
              </span>
              <ArrowUpRight
                className={`size-4 shrink-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                  collapsed ? "opacity-100" : "opacity-0 max-w-0"
                }`}
                aria-hidden
              />
            </Link>

            {/* Mobile trigger */}
            <button
              type="button"
              aria-expanded={open}
              aria-controls="site-mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex size-9 flex-col items-center justify-center gap-[5px] md:hidden"
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
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      <div
        id="site-mobile-nav"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-background transition-[opacity,visibility] duration-300 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex h-full flex-col justify-between px-5 pb-10 pt-28 sm:px-8">
          <ul className="flex flex-col">
            {SITE_NAV_LINKS.map((l, i) => {
              const offSite = isNavOffSiteStyle(l);
              const on = isActive(l);
              const cls = `flex items-baseline justify-between gap-4 border-b border-outline-variant py-5 font-display text-4xl leading-none tracking-tight transition-colors ${
                on ? "text-primary" : "text-on-surface"
              }`;
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
                  style={{ transitionDelay: open ? `${100 + i * 50}ms` : "0ms" }}
                  className={`transition-all duration-500 ${
                    open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
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
                    <Link href={l.href} className={cls} onClick={() => setOpen(false)}>
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
