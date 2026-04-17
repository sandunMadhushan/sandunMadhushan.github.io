"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

type Ctx = { openMobileNav: () => void };
const AdminNavContext = createContext<Ctx | null>(null);

export function useAdminMobileNav() {
  return useContext(AdminNavContext);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const openMobileNav = useCallback(() => setMobileOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileOpen(false), []);

  return (
    <AdminNavContext.Provider value={{ openMobileNav }}>
      <div className="min-h-screen overflow-x-auto bg-surface text-on-surface">
        <AdminSidebar mobileOpen={mobileOpen} onNavigate={closeMobileNav} />
        <button
          type="button"
          aria-label="Close menu"
          className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity md:hidden ${
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={closeMobileNav}
        />
        {/* w-full + ml-64 overflows the viewport; width must subtract the sidebar */}
        <div className="min-h-screen w-full min-w-0 md:ml-64 md:w-[calc(100%-16rem)]">{children}</div>
      </div>
    </AdminNavContext.Provider>
  );
}
