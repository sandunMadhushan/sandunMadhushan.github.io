import Link from "next/link";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { ProjectsTable } from "@/components/admin/projects-table";
import { MIcon } from "@/components/m-icon";
import { getProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

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
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 rounded-lg bg-primary-container px-6 py-3 font-semibold text-on-primary-container shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all hover:brightness-110 active:scale-95"
          >
            <MIcon name="add" />
            Add New Project
          </Link>
        </div>
        <div className="mb-8 flex flex-col gap-4 rounded-xl bg-surface-container-low p-6 md:flex-row md:items-center">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              readOnly
              placeholder="Search projects by title..."
              className="w-full rounded-lg border-none border-b border-outline-variant bg-surface-container-lowest py-3 pl-12 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-outline-variant/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-bright"
            >
              All Status
            </button>
            <button
              type="button"
              className="rounded-lg border border-outline-variant/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-bright"
            >
              Tech Stack
            </button>
          </div>
        </div>
        <ProjectsTable projects={projects} />
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
