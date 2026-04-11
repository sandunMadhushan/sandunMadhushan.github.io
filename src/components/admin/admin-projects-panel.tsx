"use client";

import { useMemo, useState } from "react";
import type { Project } from "@prisma/client";
import { ProjectsTable } from "@/components/admin/projects-table";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "published" | "draft";

function useMatchesFilter(search: string, status: StatusFilter, tech: string) {
  return useMemo(() => {
    const q = search.trim().toLowerCase();
    return (p: Project) => {
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (status === "published" && !p.published) return false;
      if (status === "draft" && p.published) return false;
      if (tech !== "all" && !p.technologies.includes(tech)) return false;
      return true;
    };
  }, [search, status, tech]);
}

export function AdminProjectsPanel({ projects }: { projects: Project[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [tech, setTech] = useState<string>("all");

  const techOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) {
      for (const t of p.technologies) set.add(t);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  }, [projects]);

  const matchesFilter = useMatchesFilter(search, status, tech);

  const visibleProjects = useMemo(
    () => projects.filter(matchesFilter),
    [projects, matchesFilter],
  );

  const portfolioStats = useMemo(
    () => ({
      total: projects.length,
      published: projects.filter((p) => p.published).length,
      draft: projects.filter((p) => !p.published).length,
    }),
    [projects],
  );

  const filtersActive = Boolean(search.trim()) || status !== "all" || tech !== "all";

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 rounded-xl bg-surface-container-low p-6 md:flex-row md:flex-wrap md:items-end">
        <div className="relative w-full md:min-w-[240px] md:max-w-md md:flex-1">
          <label htmlFor="admin-projects-search" className="sr-only">
            Search projects by title
          </label>
          <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            id="admin-projects-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title..."
            className="w-full rounded-lg border-none border-b border-outline-variant bg-surface-container-lowest py-3 pl-12 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50"
          />
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 md:ml-auto md:w-auto">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">
              Visibility
            </span>
            <div className="flex flex-wrap gap-1.5 rounded-lg bg-surface-container-lowest p-1">
              {(
                [
                  { id: "all" as const, label: "All" },
                  { id: "published" as const, label: "Published" },
                  { id: "draft" as const, label: "Draft" },
                ] as const
              ).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setStatus(id)}
                  className={cn(
                    "rounded-md px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors",
                    status === id
                      ? "bg-primary-container text-on-primary-container"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-w-[180px] flex-col gap-1">
            <label htmlFor="admin-projects-tech" className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">
              Tech stack
            </label>
            <select
              id="admin-projects-tech"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className="rounded-lg border border-outline-variant/25 bg-surface-container-lowest py-2.5 pl-3 pr-8 text-xs font-semibold text-on-surface"
            >
              <option value="all">All technologies</option>
              {techOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filtersActive ? (
        <p className="mb-4 text-xs text-on-surface-variant/70">
          Showing <span className="font-semibold text-on-surface">{visibleProjects.length}</span> of{" "}
          {projects.length} projects that match. Clear all filters to drag-reorder the full list.
        </p>
      ) : null}

      <ProjectsTable
        projects={visibleProjects}
        portfolioStats={portfolioStats}
        reorderLocked={filtersActive}
      />
    </>
  );
}
