import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFooterSocialSection } from "@/components/public/public-social-blocks";
import { Container, Rule } from "@/components/ui/primitives";
import { GravityText } from "@/components/motion/gravity-text";
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

        {/* Signature band — a quiet ambient glow (soft, layered radial
            gradients, à la Aura) sits behind a moderately sized name that
            reacts to pointer proximity instead of announcing itself at full
            viewport width. Restrained on purpose: a signature, not a shout. */}
        <div className="relative mt-24 overflow-hidden md:mt-32">
          <Rule className="mb-10 md:mb-14" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute left-1/2 top-[55%] h-[26rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_68%)] opacity-[0.12] blur-[80px]" />
            <div className="absolute left-[18%] top-[85%] h-[18rem] w-[30rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--ember)_0%,transparent_72%)] opacity-[0.14] blur-[70px]" />
          </div>

          <p className="type-mono-sm mb-5 text-on-surface-variant/60">
            Sign off
          </p>
          <GravityText
            text="Sandun Madhushan"
            className="font-display block select-none text-[clamp(2.5rem,7.5vw,6rem)] leading-[0.96] tracking-[-0.03em] text-on-surface"
          />
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
