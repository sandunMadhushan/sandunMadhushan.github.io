import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/public/site-nav";
import { SiteFooter } from "@/components/public/site-footer";
import { Container, Rule } from "@/components/ui/primitives";
import { SITE_NAV_LINKS, isNavOffSiteStyle } from "@/lib/site-nav-links";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const routes = SITE_NAV_LINKS.filter((l) => !isNavOffSiteStyle(l));

  return (
    <>
      <SiteNav />
      <main id="main" className="min-h-[100dvh] pb-24 pt-36 md:pt-44">
        <Container>
          <Rule />
          <div className="grid grid-cols-1 gap-12 pt-6 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-7">
              <span className="type-mono text-primary">
                Error — 404
              </span>
              <p
                aria-hidden
                className="font-display mt-6 text-[clamp(6rem,22vw,18rem)] leading-[0.78] tracking-[-0.05em] text-on-surface"
              >
                404
              </p>
            </div>

            <div className="flex flex-col justify-end md:col-span-4 md:col-start-9">
              <h1 className="type-h2 text-on-surface">
                This page doesn&apos;t exist.
              </h1>
              <p className="type-body mt-5 text-on-surface-variant">
                The address may be mistyped, or the page has moved since you
                last saw it. Everything else is still where you left it.
              </p>

              <nav aria-label="Site sections" className="mt-10">
                <Rule />
                <ul>
                  {routes.map((l, i) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="group flex items-center justify-between gap-4 border-b border-outline-variant py-4 transition-colors hover:text-primary"
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="type-mono-sm tabular-nums text-on-surface-variant">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-lg font-medium">{l.label}</span>
                        </span>
                        <ArrowUpRight
                          className="size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
