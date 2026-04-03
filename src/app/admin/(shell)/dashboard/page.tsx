import Link from "next/link";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { MIcon } from "@/components/m-icon";
import { getMessageCount, getProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [projects, msgCount] = await Promise.all([
    getProjects(),
    getMessageCount(),
  ]);

  return (
    <>
      <AdminTopbar title="System Overview" />
      <section className="px-8 pb-12">
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-lg bg-surface-container-low p-6 transition-all duration-300 hover:bg-surface-container">
            <div className="mb-4 flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                Total Projects
              </span>
              <MIcon name="architecture" className="text-primary-fixed-dim" />
            </div>
            <div className="text-3xl font-extrabold tracking-tighter text-on-surface">
              {projects.length}
            </div>
            <div className="mt-2 text-[12px] font-medium text-primary">
              Portfolio entries
            </div>
          </div>
          <div className="group rounded-lg bg-surface-container-low p-6 transition-all duration-300 hover:bg-surface-container">
            <div className="mb-4 flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                Total Messages
              </span>
              <MIcon name="chat_bubble" className="text-primary-fixed-dim" />
            </div>
            <div className="text-3xl font-extrabold tracking-tighter text-on-surface">
              {msgCount}
            </div>
            <div className="mt-2 text-[12px] font-medium text-on-surface-variant/40">
              Inbox
            </div>
          </div>
          <div className="group rounded-lg bg-surface-container-low p-6 transition-all duration-300 hover:bg-surface-container">
            <div className="mb-4 flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                Portfolio Status
              </span>
              <MIcon name="check_circle" className="text-tertiary" />
            </div>
            <div className="text-3xl font-extrabold tracking-tighter text-on-surface">
              Live
            </div>
            <div className="mt-2 text-[12px] font-medium text-on-surface-variant/40">
              Dynamic content
            </div>
          </div>
          <div className="group rounded-lg bg-surface-container-low p-6 transition-all duration-300 hover:bg-surface-container">
            <div className="mb-4 flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                Featured
              </span>
              <MIcon name="trending_up" className="text-primary-fixed-dim" />
            </div>
            <div className="text-3xl font-extrabold tracking-tighter text-on-surface">
              {projects.filter((p) => p.featured).length}
            </div>
            <div className="mt-2 text-[12px] font-medium text-primary">
              Spotlight projects
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="group relative overflow-hidden rounded-xl bg-surface-container p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-container/20 blur-[80px] transition-all group-hover:bg-primary-container/30" />
              <h2 className="mb-6 text-xl font-bold tracking-tight">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href="/admin/projects/new"
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-primary-container py-4 font-semibold text-on-primary-container transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95"
                >
                  <MIcon name="add" />
                  Add New Project
                </Link>
                <Link
                  href="/admin/about"
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-surface-container-high py-4 font-semibold text-on-surface transition-all hover:bg-surface-bright"
                >
                  <MIcon name="edit_note" />
                  Update About Bio
                </Link>
                <Link
                  href="/admin/skills"
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-surface-container-high py-4 font-semibold text-on-surface transition-all hover:bg-surface-bright"
                >
                  <MIcon name="psychology" />
                  Manage Skills
                </Link>
              </div>
            </div>
            <div className="rounded-xl bg-surface-container-low p-8">
              <h3 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
                Engagement Score
              </h3>
              <div className="mb-2 flex items-end gap-2">
                <span className="text-5xl font-black tracking-tighter">94</span>
                <span className="mb-2 font-bold text-primary">/ 100</span>
              </div>
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div className="h-full w-[94%] bg-primary-container" />
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-on-surface-variant">
                Portfolio content is database-driven and ready to scale with
                your traffic.
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-surface-container p-8 lg:col-span-2">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">
                Recent Projects
              </h2>
              <Link
                href="/admin/projects"
                className="text-[12px] font-bold uppercase tracking-widest text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-1">
              {projects.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="group flex items-start gap-6 rounded-lg px-4 py-5 transition-colors hover:bg-surface-container-high"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-highest">
                    <MIcon name="inventory_2" className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-on-surface transition-colors group-hover:text-primary">
                        {p.title}
                      </h4>
                      <span className="text-[11px] font-medium text-on-surface-variant/40">
                        {p.featured ? "Featured" : "Standard"}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-on-surface-variant">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-xl border-l-2 border-primary-container bg-surface-container-low p-8">
          <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Editorial Insight
          </span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tighter">
            The Curator&apos;s Perspective
          </h2>
          <p className="max-w-2xl text-lg font-light leading-relaxed text-on-surface-variant/80">
            Keep project descriptions sharp, refresh featured work seasonally,
            and route contact messages from the inbox into your workflow.
          </p>
        </div>
      </section>
      <footer className="mt-12 w-full border-t border-outline-variant/10 bg-surface px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-6 text-sm text-on-surface-variant/50 md:flex-row">
          <p>© {new Date().getFullYear()} The Digital Curator.</p>
          <div className="flex flex-wrap justify-center gap-8">
            <span className="cursor-default">GitHub</span>
            <span className="cursor-default">LinkedIn</span>
            <span className="cursor-default">Facebook</span>
          </div>
        </div>
      </footer>
    </>
  );
}
