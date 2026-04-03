"use client";

import { MIcon } from "@/components/m-icon";
import { useAdminMobileNav } from "@/components/admin/admin-shell";

export function AdminTopbar({ title }: { title?: string }) {
  const nav = useAdminMobileNav();

  return (
    <header className="sticky top-0 z-30 flex w-full max-w-full min-w-0 items-center justify-between border-b border-outline-variant/10 bg-surface/95 px-4 py-4 backdrop-blur-md md:px-8 md:py-6">
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        <button
          type="button"
          aria-label="Open navigation menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-on-surface transition-colors hover:bg-surface-container-high hover:text-primary md:hidden"
          onClick={() => nav?.openMobileNav()}
        >
          <MIcon name="menu" />
        </button>
        <h1 className="truncate text-base font-semibold text-on-surface md:text-lg">
          {title ?? "System Overview"}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-4 md:gap-6">
        <div className="relative hidden sm:block">
          <span className="sr-only">Notifications (placeholder)</span>
          <MIcon name="notifications" className="cursor-default text-on-surface/50" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" aria-hidden />
        </div>
        <div
          className="h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-primary-container/40 to-surface-container-high ring-2 ring-primary/25 md:h-10 md:w-10"
          aria-hidden
        />
      </div>
    </header>
  );
}
