import Link from "next/link";
import { ArrowUpRight, Download, PenLine, Plus, Sparkles } from "lucide-react";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { Rule } from "@/components/ui/primitives";
import { getMessageCount, getProjectsForAdmin } from "@/lib/queries";

export const dynamic = "force-dynamic";

const QUICK_ACTIONS = [
  { href: "/admin/projects/new", label: "Add new project", Icon: Plus, primary: true },
  { href: "/admin/projects/import", label: "Import from GitHub", Icon: Download },
  { href: "/admin/about", label: "Update about bio", Icon: PenLine },
  { href: "/admin/skills", label: "Manage skills", Icon: Sparkles },
];

export default async function AdminDashboardPage() {
  const [projects, msgCount] = await Promise.all([
    getProjectsForAdmin(),
    getMessageCount(),
  ]);

  const live = projects.filter((p) => p.published).length;
  const drafts = projects.filter((p) => !p.published).length;
  const featured = projects.filter((p) => p.featured).length;

  const stats = [
    { label: "Projects", value: projects.length, note: `${live} live · ${drafts} draft` },
    { label: "Messages", value: msgCount, note: "Inbox total" },
    { label: "Featured", value: featured, note: "On the home index" },
    { label: "Status", value: "Live", note: "Database-driven" },
  ];

  return (
    <>
      <AdminTopbar title="System Overview" />

      <section className="px-5 pb-16 md:px-8">
        {/* ---------- STAT RAIL ---------- */}
        <div className="mt-10">
          <Rule />
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`border-b border-outline-variant py-8 lg:border-b-0 ${
                  i > 0 ? "lg:border-l lg:border-outline-variant lg:pl-8" : ""
                }`}
              >
                <dt className="type-mono-sm text-on-surface-variant">
                  {s.label}
                </dt>
                <dd className="type-num font-display mt-3 text-[clamp(2.5rem,5vw,4rem)] leading-[0.9] text-on-surface">
                  {s.value}
                </dd>
                <p className="type-mono-sm mt-2 text-primary">{s.note}</p>
              </div>
            ))}
          </dl>
          <Rule className="hidden lg:block" />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
          {/* ---------- QUICK ACTIONS ---------- */}
          <div className="lg:col-span-1">
            <Rule />
            <h2 className="type-mono py-4 text-primary">Quick actions</h2>
            <ul className="flex flex-col">
              {QUICK_ACTIONS.map(({ href, label, Icon, primary }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`group flex items-center justify-between gap-4 border-t border-outline-variant py-4 transition-colors last:border-b ${
                      primary
                        ? "text-primary hover:border-primary-container"
                        : "text-on-surface-variant hover:border-primary-container hover:text-on-surface"
                    }`}
                  >
                    <span className="type-mono flex items-center gap-3">
                      <Icon className="size-4 shrink-0" aria-hidden />
                      {label}
                    </span>
                    <ArrowUpRight
                      className="size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-12 border-l-2 border-primary-container pl-5">
              <span className="type-mono-sm text-on-surface-variant">
                Editorial note
              </span>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                Keep project descriptions sharp, refresh featured work
                seasonally, and route contact messages from the inbox into your
                workflow.
              </p>
            </div>
          </div>

          {/* ---------- RECENT PROJECTS ---------- */}
          <div className="lg:col-span-2">
            <Rule />
            <div className="flex items-center justify-between py-4">
              <h2 className="type-mono text-primary">Recent projects</h2>
              <Link
                href="/admin/projects"
                className="type-mono link-wipe text-on-surface-variant transition-colors hover:text-on-surface"
              >
                View all
              </Link>
            </div>

            {projects.length === 0 ? (
              <p className="type-mono border border-dashed border-outline-variant py-14 text-center text-on-surface-variant">
                No projects yet
              </p>
            ) : (
              <ul>
                {projects.slice(0, 5).map((p, i) => {
                  const state = !p.published
                    ? "Draft"
                    : p.featured
                      ? "Featured"
                      : "Published";
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/admin/projects/edit/${p.id}`}
                        className="group grid grid-cols-12 items-center gap-3 border-t border-outline-variant py-5 transition-colors last:border-b hover:border-primary-container"
                      >
                        <span className="type-mono col-span-2 tabular-nums text-on-surface-variant md:col-span-1">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="col-span-10 min-w-0 md:col-span-7">
                          <h3 className="truncate font-medium text-on-surface transition-colors group-hover:text-primary">
                            {p.title}
                          </h3>
                          <p className="mt-1 line-clamp-1 text-sm text-on-surface-variant">
                            {p.description}
                          </p>
                        </div>
                        <span
                          className={`type-mono-sm col-span-10 col-start-3 md:col-span-3 md:col-start-auto md:text-right ${
                            state === "Draft"
                              ? "text-on-surface-variant"
                              : "text-primary"
                          }`}
                        >
                          {state}
                        </span>
                        <span className="col-span-2 hidden justify-end md:col-span-1 md:flex">
                          <ArrowUpRight
                            className="size-4 text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100"
                            aria-hidden
                          />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-outline-variant px-5 py-8 md:px-8">
        <p className="type-mono-sm text-on-surface-variant">
          © {new Date().getFullYear()} Sandun Madhushan — Admin Console
        </p>
      </footer>
    </>
  );
}
