import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFooterSocialSection } from "@/components/public/public-social-blocks";
import { Container, Rule } from "@/components/ui/primitives";
import { getSocialLinks } from "@/lib/queries";
import { SITE_NAV_LINKS, isNavOffSiteStyle } from "@/lib/site-nav-links";

export async function SiteFooter() {
  const year = new Date().getFullYear();
  const socialLinks = await getSocialLinks();

  return (
    <footer className="relative overflow-hidden border-t border-outline-variant bg-background">
      <Container className="pb-8 pt-20 md:pt-28">
        {/* Top row — availability + columns */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <span className="type-mono inline-flex items-center gap-2.5 text-primary">
              <span
                aria-hidden
                className="pulse-dot size-1.5 rounded-full bg-primary-container"
              />
              Available for work
            </span>
            <p className="type-h3 mt-6 max-w-sm text-on-surface">
              Building reliable full-stack web software — and looking for the
              next problem worth solving.
            </p>
            <Link
              href="/contact"
              className="type-mono link-wipe mt-8 inline-flex items-center gap-2 text-on-surface"
            >
              Start a conversation
              <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h2 className="type-mono-sm mb-6 text-on-surface-variant">
              Index
            </h2>
            <ul className="flex flex-col gap-3.5">
              {SITE_NAV_LINKS.map((l, i) => {
                const offSite = isNavOffSiteStyle(l);
                const cls =
                  "group flex items-baseline gap-3 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface";
                const inner = (
                  <>
                    <span className="type-mono-sm text-on-surface-variant/60 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="link-wipe">{l.label}</span>
                    {offSite ? (
                      <ArrowUpRight
                        className="size-3 opacity-50"
                        aria-hidden
                      />
                    ) : null}
                  </>
                );
                return (
                  <li key={l.href}>
                    {offSite ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cls}
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link href={l.href} className={cls}>
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <SiteFooterSocialSection links={socialLinks} />
        </div>

        {/* Oversized wordmark band — the footer's whole visual weight. */}
        <div className="mt-24 select-none md:mt-32" aria-hidden>
          <Rule className="mb-6" />
          <p className="font-display text-[clamp(2.75rem,13.2vw,13rem)] leading-[0.82] tracking-[-0.04em] text-on-surface">
            Sandun Madhushan
          </p>
        </div>

        <Rule className="mt-10" />
        <div className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="type-mono-sm text-on-surface-variant">
            © {year} — All rights reserved
          </p>
          <p className="type-mono-sm text-on-surface-variant">
            Matale, Sri Lanka · Next.js &amp; Tailwind
          </p>
        </div>
      </Container>
    </footer>
  );
}
