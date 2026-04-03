import Link from "next/link";
import type { SocialLink } from "@prisma/client";
import { SocialBrandGlyph } from "@/components/public/social-brand-glyph";
import { labelForSocialPlatform } from "@/lib/social-platforms";

export function SiteFooterSocialSection({ links }: { links: SocialLink[] }) {
  if (links.length === 0) return null;

  return (
    <div className="lg:col-span-4">
      <h2 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50">
        Connect
      </h2>
      <ul className="flex max-w-xs flex-col gap-2">
        {links.map((row) => {
          const label = labelForSocialPlatform(row.platform);
          return (
            <li key={row.id}>
              <Link
                href={row.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-outline-variant/15 bg-surface-container-high/40 py-2 pl-2 pr-4 text-sm font-medium text-on-surface transition-all hover:border-primary-container/35 hover:bg-surface-container-high hover:text-primary-container"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-container-low text-primary">
                  <SocialBrandGlyph platform={row.platform} className="h-[18px] w-[18px]" />
                </span>
                {label}
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
      <h3 className="mb-6 text-lg font-semibold">Follow Me</h3>
      <div className="flex flex-wrap gap-3">
        {links.map((row) => {
          const label = labelForSocialPlatform(row.platform);
          return (
            <Link
              key={row.id}
              href={row.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition-all hover:bg-primary-container hover:text-on-primary-container"
            >
              <SocialBrandGlyph platform={row.platform} className="h-[18px] w-[18px]" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
