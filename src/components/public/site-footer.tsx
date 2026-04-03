import Link from "next/link";

const social = [
  { href: "https://github.com", label: "GitHub" },
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://twitter.com", label: "Twitter" },
] as const;

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-outline-variant/10 bg-surface px-6 py-16 md:px-12 md:py-20">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-10 md:flex-row md:items-start md:justify-between md:gap-12">
        <div className="space-y-4 text-center md:max-w-sm md:text-left">
          <div className="text-xl font-bold tracking-tighter text-on-surface">
            Sandun Madhushan
          </div>
          <p className="text-sm leading-relaxed text-on-surface-variant/80">
            Building the future of the web, one pixel at a time.
          </p>
        </div>
        <nav
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          aria-label="Social"
        >
          {social.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-on-surface-variant/70 transition-colors hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </nav>
        <p className="text-center text-sm text-on-surface-variant/50 md:text-right">
          © {new Date().getFullYear()} The Digital Curator. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
