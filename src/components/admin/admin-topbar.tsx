"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useAdminMobileNav } from "@/components/admin/admin-shell";

/** Turns `/admin/projects/edit/abc` into `Admin / Projects / Edit`. */
function useCrumbs(): string[] {
  const pathname = usePathname() ?? "";
  return pathname
    .split("/")
    .filter(Boolean)
    .slice(0, 3)
    .map((seg) =>
      seg
        .replace(/[-_]/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase())
        .replace(/^\(|\)$/g, ""),
    );
}

export function AdminTopbar({ title }: { title?: string }) {
  const nav = useAdminMobileNav();
  const crumbs = useCrumbs();

  return (
    <header className="sticky top-0 z-30 flex w-full min-w-0 max-w-full items-center justify-between gap-4 border-b border-outline-variant bg-background/90 px-5 py-4 backdrop-blur-xl md:px-8">
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        <button
          type="button"
          aria-label="Open navigation menu"
          className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-outline-variant text-on-surface transition-colors hover:border-primary hover:text-primary md:hidden"
          onClick={() => nav?.openMobileNav()}
        >
          <Menu className="size-4" aria-hidden />
        </button>

        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="hidden md:block">
            <ol className="type-mono-sm flex items-center gap-2 text-on-surface-variant">
              {crumbs.map((c, i) => (
                <li key={`${c}-${i}`} className="flex items-center gap-2">
                  {i > 0 ? (
                    <span aria-hidden className="opacity-40">
                      /
                    </span>
                  ) : null}
                  <span className={i === crumbs.length - 1 ? "text-primary" : ""}>
                    {c}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="type-h3 mt-0.5 truncate text-on-surface">
            {title ?? "System Overview"}
          </h1>
        </div>
      </div>

      <span className="type-mono-sm hidden shrink-0 items-center gap-2 text-on-surface-variant sm:inline-flex">
        <span
          aria-hidden
          className="pulse-dot size-1.5 rounded-full bg-primary-container"
        />
        Live
      </span>
    </header>
  );
}
