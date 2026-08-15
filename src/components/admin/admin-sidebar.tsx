"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ArrowUpRight, LogOut, Settings } from "lucide-react";
import { MIcon } from "@/components/m-icon";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/projects", label: "Projects", icon: "inventory_2" },
  { href: "/admin/skills", label: "Skills", icon: "psychology" },
  { href: "/admin/about", label: "About", icon: "person" },
  { href: "/admin/social", label: "Social links", icon: "share" },
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
      className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-outline-variant bg-surface-container-lowest transition-transform duration-300 ease-out md:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand */}
      <div className="border-b border-outline-variant px-6 py-6">
        <Link
          href="/"
          className="group flex items-baseline gap-2"
          onClick={onNavigate}
        >
          <span className="font-display text-xl leading-none text-on-surface">
            Sandun
          </span>
          <span
            aria-hidden
            className="size-1.5 bg-primary-container transition-transform duration-300 group-hover:scale-150"
          />
        </Link>
        <span className="type-mono-sm mt-2 block text-on-surface-variant">
          Admin Console
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4" aria-label="Admin">
        <ul>
          {items.map((item, i) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`type-mono group relative flex items-center gap-3 px-6 py-3.5 transition-colors ${
                    active
                      ? "text-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {/* Accent marker replaces the old glow. */}
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0 h-full w-0.5 bg-primary-container transition-transform duration-300 ${
                      active ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                    }`}
                  />
                  <MIcon name={item.icon} className="text-base" />
                  <span className="flex-1">{item.label}</span>
                  <span className="type-mono-sm tabular-nums opacity-40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-outline-variant">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="type-mono flex items-center gap-3 px-6 py-3.5 text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <ArrowUpRight className="size-4" aria-hidden />
          View site
        </Link>

        <div className="flex items-center justify-between gap-2 px-6 py-3.5">
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Coming soon"
            className="type-mono inline-flex cursor-not-allowed items-center gap-3 text-on-surface-variant/40"
          >
            <Settings className="size-4" aria-hidden />
            Settings
          </button>
          <ThemeToggle />
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="type-mono flex w-full items-center gap-3 border-t border-outline-variant px-6 py-3.5 text-left text-on-surface-variant transition-colors hover:text-[color:var(--ember)]"
        >
          <LogOut className="size-4" aria-hidden />
          Log out
        </button>
      </div>
    </aside>
  );
}
