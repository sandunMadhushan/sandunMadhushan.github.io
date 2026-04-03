"use client";

import { MIcon } from "@/components/m-icon";

export function AdminTopbar({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between bg-[#131314] px-8 py-6">
      <div className="flex items-center gap-4">
        <MIcon name="menu" className="cursor-pointer text-[#e5e2e3] hover:text-primary" />
        <h1 className="text-lg font-semibold text-[#e5e2e3]">{title ?? "System Overview"}</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <MIcon name="notifications" className="cursor-pointer text-[#e5e2e3]/60 hover:text-primary" />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />
        </div>
        <div className="h-10 w-10 overflow-hidden rounded-full bg-surface-container-high ring-2 ring-primary/20" />
      </div>
    </header>
  );
}
