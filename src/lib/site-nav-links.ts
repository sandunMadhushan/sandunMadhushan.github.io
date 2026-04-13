/** Primary site navigation (header + footer). Internal routes use Next.js `Link`; external open in a new tab. */
export type SiteNavLink =
  | { href: string; label: string; external?: false }
  | { href: string; label: string; external: true };

export const SITE_NAV_LINKS: SiteNavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
