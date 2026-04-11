import Link from "next/link";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminProjectsPanel } from "@/components/admin/admin-projects-panel";
import { MIcon } from "@/components/m-icon";
import { getProjectsForAdmin } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjectsForAdmin();

  return (
    <>
      <AdminTopbar title="System Overview" />
      <section className="mx-auto max-w-[1440px] p-12">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-primary">
              Management
            </span>
            <h2 className="text-4xl font-extrabold leading-none tracking-tighter text-on-surface">
              Project Portfolio
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/projects/import"
              className="flex items-center gap-2 rounded-lg border border-outline-variant/25 bg-surface-container-high px-6 py-3 font-semibold text-on-surface transition-all hover:bg-surface-bright active:scale-95"
            >
              <MIcon name="download" />
              Import from GitHub
            </Link>
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-2 rounded-lg bg-primary-container px-6 py-3 font-semibold text-on-primary-container shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all hover:brightness-110 active:scale-95"
            >
              <MIcon name="add" />
              Add New Project
            </Link>
          </div>
        </div>
        <AdminProjectsPanel projects={projects} />
      </section>
      <footer className="w-full border-t border-[#e5e2e3]/10 bg-[#131314] px-12 py-20">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-sm text-on-surface-variant/40">
            © {new Date().getFullYear()} The Digital Curator.
          </div>
          <div className="flex gap-8 text-sm text-[#e5e2e3]/40">
            <span>GitHub</span>
            <span>LinkedIn</span>
            <span>Facebook</span>
          </div>
        </div>
      </footer>
    </>
  );
}
