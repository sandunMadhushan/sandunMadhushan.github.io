import Link from "next/link";
import type { SocialLink } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import { SocialBrandGlyph } from "@/components/public/social-brand-glyph";
import { labelForSocialPlatform } from "@/lib/social-platforms";

export function SiteFooterSocialSection({ links }: { links: SocialLink[] }) {
  if (links.length === 0) return null;

  return (
    <div className="md:col-span-2 md:col-start-11">
      <h2 className="type-mono-sm mb-6 text-on-surface-variant">Connect</h2>
      <ul className="flex flex-col gap-3.5">
        {links.map((row) => {
          const label = labelForSocialPlatform(row.platform);
          return (
            <li key={row.id}>
              <Link
                href={row.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
              >
                <SocialBrandGlyph
                  platform={row.platform}
                  className="size-4 shrink-0 transition-colors group-hover:text-primary"
                />
                <span className="link-wipe">{label}</span>
                <ArrowUpRight className="size-3 opacity-50" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ContactSocialRow({ links }: { links: SocialLink[] }) {
  if (links.length === 0) return null;

  return (
    <div>
      <h3 className="type-mono-sm mb-5 text-on-surface-variant">Elsewhere</h3>
      <ul className="flex flex-col">
        {links.map((row) => {
          const label = labelForSocialPlatform(row.platform);
          return (
            <li key={row.id}>
              <Link
                href={row.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 border-b border-outline-variant py-3.5 transition-colors first:border-t hover:border-primary-container"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <SocialBrandGlyph
                    platform={row.platform}
                    className="size-4 shrink-0 text-on-surface-variant transition-colors group-hover:text-primary"
                  />
                  {label}
                </span>
                <ArrowUpRight
                  className="size-3.5 text-on-surface-variant transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
