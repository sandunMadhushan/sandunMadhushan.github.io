"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import type { Project } from "@prisma/client";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { isRemoteImageSrc } from "@/lib/image-url";
import { projectCardSrc } from "@/lib/project-media";
import { DEFAULT_PORTRAIT_SRC } from "@/lib/site-constants";
import { parseProjectCategories } from "@/lib/project-categories";
import { Eyebrow, Rule } from "@/components/ui/primitives";
import { ProjectsWall } from "@/components/projects/projects-wall";

/** Cards below the featured spread, before "Show more" is pressed. */
const INITIAL_VISIBLE = 6;

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const tabs = useMemo(() => {
    const set = new Set<string>(["All"]);
    for (const project of projects) {
      for (const c of parseProjectCategories(project.category)) set.add(c);
    }
    return Array.from(set);
  }, [projects]);
  const [tab, setTab] = useState("All");
  const [expanded, setExpanded] = useState(false);
  const gridStartRef = useRef<HTMLDivElement | null>(null);
  const activeTab = tabs.includes(tab) ? tab : "All";
  const filtered = useMemo(() => {
    if (activeTab === "All") return projects;
    return projects.filter((p) =>
      parseProjectCategories(p.category).includes(activeTab),
    );
  }, [projects, activeTab]);

  const featured = projects.find((p) => p.featured) ?? projects[0];
  const featuredCover = featured
    ? projectCardSrc(featured, DEFAULT_PORTRAIT_SRC)
    : DEFAULT_PORTRAIT_SRC;
  const featuredOutsideFilter = Boolean(
    featured && !filtered.some((p) => p.id === featured.id),
  );
  const totalCount = filtered.length + (featuredOutsideFilter ? 1 : 0);

  const rest = useMemo(
    () => filtered.filter((p) => p.id !== featured?.id),
    [filtered, featured],
  );
  const displayedRest = expanded ? rest : rest.slice(0, INITIAL_VISIBLE);
  const hasMore = !expanded && rest.length > INITIAL_VISIBLE;
  const canCollapse = expanded && rest.length > INITIAL_VISIBLE;

  function pickTab(next: string) {
    setTab(next);
    setExpanded(false);
  }

  const wasCollapsedRef = useRef(false);
  useEffect(() => {
    if (!wasCollapsedRef.current) return;
    wasCollapsedRef.current = false;
    gridStartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [expanded]);

  return (
    <>
      {/* ---------- FEATURED SPREAD ---------- */}
      {featured && (
        <section className="mb-24 md:mb-32">
          <Rule />
          <div className="pt-4">
            <Eyebrow index="01">Featured</Eyebrow>
          </div>

          <Link
            href={`/projects/${featured.slug}`}
            className="group mt-8 block md:mt-12"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-outline-variant bg-surface-container-low transition-colors duration-500 group-hover:border-primary-container md:aspect-[21/9]">
              <NextImage
                src={featuredCover}
                alt={featured.title}
                fill
                priority
                sizes="100vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                unoptimized={isRemoteImageSrc(featuredCover)}
              />
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary-container transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
            </div>

            <div className="mt-8 grid grid-cols-12 gap-y-6 md:gap-8">
              <div className="col-span-12 md:col-span-6">
                <h2 className="type-h1 text-on-surface transition-colors duration-300 group-hover:text-primary">
                  {featured.title}
                </h2>
              </div>
              <div className="col-span-12 md:col-span-4">
                <p className="type-body text-on-surface-variant">
                  {featured.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                  {featured.technologies.map((t) => (
                    <span
                      key={t}
                      className="type-mono-sm text-on-surface-variant"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-span-12 flex md:col-span-2 md:justify-end">
                <span className="type-mono inline-flex items-center gap-2 text-on-surface transition-colors group-hover:text-primary">
                  View case study
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ---------- FILTERS ---------- */}
      <div ref={gridStartRef} className="mb-4 scroll-mt-28">
        <Rule />
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 pt-4">
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-3"
            role="tablist"
            aria-label="Filter projects by category"
          >
            {tabs.map((t) => {
              const on = activeTab === t;
              return (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => pickTab(t)}
                  className={`type-mono group relative py-1 transition-colors duration-300 ${
                    on
                      ? "text-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {t}
                  <span
                    aria-hidden
                    className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current transition-transform duration-400 ${
                      on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <span className="type-mono-sm tabular-nums text-on-surface-variant">
            {String(totalCount).padStart(2, "0")}{" "}
            {totalCount === 1 ? "project" : "projects"}
          </span>
        </div>
      </div>

      {/* ---------- UNIFORM WALL ---------- */}
      {displayedRest.length === 0 ? (
        <p className="type-mono border border-dashed border-outline-variant py-20 text-center text-on-surface-variant">
          No projects match this filter.
        </p>
      ) : (
        <ProjectsWall projects={displayedRest} />
      )}

      {hasMore || canCollapse ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              if (hasMore) {
                setExpanded(true);
                return;
              }
              wasCollapsedRef.current = true;
              setExpanded(false);
            }}
            aria-label={hasMore ? "Show more projects" : "Show fewer projects"}
            className="type-mono group flex w-full items-center justify-center gap-3 py-6 text-on-surface-variant transition-colors hover:text-primary"
          >
            {hasMore ? "Show more" : "Show less"}
            {hasMore ? (
              <ChevronDown
                className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
                aria-hidden
              />
            ) : (
              <ChevronUp
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden
              />
            )}
          </button>
          <Rule />
        </div>
      ) : null}
    </>
  );
}
