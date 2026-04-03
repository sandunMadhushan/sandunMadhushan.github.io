"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { MIcon } from "@/components/m-icon";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/projects", label: "Projects", icon: "inventory_2" },
  { href: "/admin/skills", label: "Skills", icon: "psychology" },
  { href: "/admin/about", label: "About", icon: "person" },
  { href: "/admin/messages", label: "Messages", icon: "mail" },
];

export function AdminSidebar({
  mobileOpen = false,
  onNavigate,
}: {
  mobileOpen?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-outline-variant/10 bg-surface-container-low py-4 transition-transform duration-200 ease-out md:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="px-6 py-8 text-lg font-black tracking-tighter text-on-surface">
        Admin Panel
        <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50">
          System Control
        </span>
      </div>
      <nav className="mt-4 flex-1 space-y-2" aria-label="Admin">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`mx-4 flex items-center gap-3 rounded-lg px-4 py-3 text-[12px] font-bold uppercase tracking-widest transition-all ${
                active
                  ? "bg-surface-container-high text-on-surface shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                  : "text-on-surface/50 hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <MIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-1">
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Coming soon"
          className="mx-4 flex w-[calc(100%-2rem)] cursor-not-allowed items-center gap-3 rounded-lg px-4 py-3 text-left text-[12px] font-bold uppercase tracking-widest text-on-surface/35"
        >
          <MIcon name="settings" />
          Settings
        </button>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mx-4 flex w-[calc(100%-2rem)] items-center gap-3 rounded-lg px-4 py-3 text-left text-[12px] font-bold uppercase tracking-widest text-on-surface/50 transition-all hover:bg-surface-container hover:text-on-surface"
        >
          <MIcon name="logout" />
          Logout
        </button>
      </div>
    </aside>
  );
}
