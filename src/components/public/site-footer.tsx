import Link from "next/link";
import { IconFacebook, IconGithub, IconLinkedin } from "@/components/icons/social-brand-icons";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
] as const;

const social = [
  { href: "https://github.com", label: "GitHub", Icon: IconGithub },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: IconLinkedin },
  { href: "https://facebook.com", label: "Facebook", Icon: IconFacebook },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden border-t border-outline-variant/10 bg-surface-container-low">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-container/35 to-transparent"
      />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary-container/8 blur-[100px]" />

      <div className="relative mx-auto max-w-[1440px] px-6 py-14 md:px-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:gap-y-14">
          {/* Brand */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-5">
            <Link
              href="/"
              className="inline-flex text-2xl font-black tracking-tighter text-on-surface transition-opacity hover:opacity-90"
            >
              S<span className="text-primary-container">M</span>
            </Link>
            <p className="max-w-sm text-[0.9375rem] leading-relaxed text-on-surface-variant/85">
              Sandun Madhushan — full-stack developer crafting fast, accessible web experiences.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant/15 bg-surface-container-high/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
              Open to collaborations
            </div>
          </div>

          {/* Site map */}
          <div className="lg:col-span-3">
            <h2 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50">
              Explore
            </h2>
            <ul className="flex flex-col gap-3">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    <span className="h-px w-0 bg-primary-container transition-all duration-300 group-hover:w-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="lg:col-span-4">
            <h2 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50">
              Connect
            </h2>
            <ul className="flex max-w-xs flex-col gap-2">
              {social.map(({ href, label, Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-outline-variant/15 bg-surface-container-high/40 py-2 pl-2 pr-4 text-sm font-medium text-on-surface transition-all hover:border-primary-container/35 hover:bg-surface-container-high hover:text-primary-container"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-container-low text-primary">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-outline-variant/10 pt-8 md:flex-row md:items-center md:justify-between md:pt-10">
          <p className="text-center text-xs text-on-surface-variant/55 md:text-left">
            © {year} Sandun Madhushan. All rights reserved.
          </p>
          <p className="text-center text-xs text-on-surface-variant/40 md:text-right">
            Designed &amp; built with care — Next.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
