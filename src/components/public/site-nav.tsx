"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MIcon } from "@/components/m-icon";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav({ active }: { active?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const prefetchAll = () => {
      if (cancelled) return;
      links.forEach((l) => router.prefetch(l.href));
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
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/5 bg-surface/70 backdrop-blur-xl transition-all">
      <nav
        className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 py-4 md:px-12"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-tighter text-on-surface"
          onClick={() => setOpen(false)}
        >
          S<span className="text-primary-container">M</span>
        </Link>
        <div className="hidden items-center gap-8 text-[15px] font-medium tracking-tight md:flex">
          {links.map((l) => {
            const isActive =
              active === l.href || (l.href !== "/" && active?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  isActive
                    ? "border-b-2 border-primary-container pb-1 font-semibold text-primary-container"
                    : "text-on-surface/70 transition-colors duration-300 hover:text-primary-container"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/contact"
            className="rounded-lg bg-primary-container px-3 py-2 text-xs font-semibold text-on-primary-container transition-all hover:brightness-110 active:scale-95 sm:px-6 sm:text-sm"
            onClick={() => setOpen(false)}
          >
            Connect
          </Link>
          <button
            type="button"
            aria-expanded={open ? "true" : "false"}
            aria-controls="site-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface transition-colors hover:bg-surface-container-high md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <MIcon name={open ? "close" : "menu"} className="text-2xl" />
          </button>
        </div>
      </nav>

      <div
        id="site-mobile-nav"
        className={`absolute left-0 right-0 top-full z-40 max-h-[min(70dvh,calc(100dvh-5rem))] overflow-y-auto border-t border-outline-variant/10 bg-background/95 shadow-lg backdrop-blur-lg transition-[visibility,opacity,transform] duration-200 md:hidden ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0 pointer-events-none"
        }`}
        aria-hidden={open ? "false" : "true"}
      >
        <ul className="flex flex-col gap-1 px-6 py-4 pb-6">
          {links.map((l) => {
            const isActive =
              active === l.href || (l.href !== "/" && active?.startsWith(l.href));
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block rounded-lg px-4 py-3 text-lg font-medium transition-colors ${
                    isActive
                      ? "bg-surface-container-high text-primary-container"
                      : "text-on-surface/80 hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
