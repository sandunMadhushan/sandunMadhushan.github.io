import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <AdminSidebar />
      <div className="ml-64 min-h-screen">{children}</div>
    </div>
  );
}
