/**
 * Primary site navigation (header + footer).
 * - `external`: off-site URL → new tab + icon.
 * - `newTab`: on-site href (e.g. /blog) but treat like off-site (new tab + icon) after redirect.
 * - `placement: "trailing"`: header only — shown to the right of the main cluster (before Connect).
 */
export type SiteNavLink =
  | { href: string; label: string; external: true; placement?: "trailing" }
  | { href: string; label: string; external?: false; newTab?: boolean; placement?: "trailing" };

export function isNavOffSiteStyle(link: SiteNavLink): boolean {
  return ("external" in link && link.external) || Boolean("newTab" in link && link.newTab);
}

export function isTrailingNavLink(link: SiteNavLink): boolean {
  return link.placement === "trailing";
}

export const SITE_NAV_LINKS: SiteNavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog", newTab: true, placement: "trailing" },
];
