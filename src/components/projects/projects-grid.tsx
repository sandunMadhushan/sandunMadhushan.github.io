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
import { Card, CardContent } from "@/components/ui/card";

/** Cards below the featured spread. */
const INITIAL_VISIBLE = 6;
const LOAD_MORE_STEP = 6;

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const tabs = useMemo(() => {
    const set = new Set<string>(["All"]);
    for (const project of projects) {
      for (const c of parseProjectCategories(project.category)) set.add(c);
    }
    return Array.from(set);
  }, [projects]);
  const [tab, setTab] = useState("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const gridStartRef = useRef<HTMLDivElement | null>(null);
  const activeTab = tabs.includes(tab) ? tab : "All";
  const filtered = useMemo(() => {
    if (activeTab === "All") return projects;
    return projects.filter((p) =>
      parseProjectCategories(p.category).includes(activeTab),
    );
  }, [projects, activeTab]);

  const featured = projects.find((p) => p.featured) ?? projects[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);
  const featuredCover = featured
    ? projectCardSrc(featured, DEFAULT_PORTRAIT_SRC)
    : DEFAULT_PORTRAIT_SRC;
  const featuredOutsideFilter = Boolean(
    featured && !filtered.some((p) => p.id === featured.id),
  );
  const totalCount = filtered.length + (featuredOutsideFilter ? 1 : 0);

  const displayedRest = useMemo(
    () => rest.slice(0, visibleCount),
    [rest, visibleCount],
  );
  const hasMore = visibleCount < rest.length;
  const canCollapse = rest.length > INITIAL_VISIBLE && visibleCount > INITIAL_VISIBLE;

  function pickTab(next: string) {
    setTab(next);
    setVisibleCount(INITIAL_VISIBLE);
  }

  const wasCollapsedRef = useRef(false);
  useEffect(() => {
    if (!wasCollapsedRef.current) return;
    wasCollapsedRef.current = false;
    gridStartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [visibleCount]);

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

      {/* ---------- GRID ---------- */}
      {rest.length === 0 ? (
        <p className="type-mono border border-dashed border-outline-variant py-20 text-center text-on-surface-variant">
          No projects match this filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedRest.map((p, i) => {
            const cover = projectCardSrc(p, DEFAULT_PORTRAIT_SRC);
            const categories = parseProjectCategories(p.category);

            return (
              <Link key={p.id} href={`/projects/${p.slug}`} className="group block">
                <Card className="h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:border-primary-container group-hover:shadow-[0_28px_70px_-20px_rgba(0,0,0,0.55)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <NextImage
                      src={cover}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                      unoptimized={isRemoteImageSrc(cover)}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
                    <span className="type-mono-sm absolute left-3 top-3 flex size-7 items-center justify-center rounded-full border border-white/25 bg-black/30 tabular-nums text-white backdrop-blur-sm">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <span className="absolute right-3 top-3 flex size-7 translate-y-1 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </span>
                  </div>

                  <CardContent className="flex flex-1 flex-col pt-5">
                    <span className="type-mono-sm text-on-surface-variant">
                      {categories.join(" · ")}
                    </span>
                    <h3 className="type-h3 mt-2 text-on-surface transition-colors duration-300 group-hover:text-primary">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
                      {p.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                      {p.technologies.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="type-mono-sm text-on-surface-variant/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {hasMore || canCollapse ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              if (hasMore) {
                setVisibleCount((n) => Math.min(n + LOAD_MORE_STEP, rest.length));
                return;
              }
              wasCollapsedRef.current = true;
              setVisibleCount(INITIAL_VISIBLE);
            }}
            aria-label={hasMore ? "Load more projects" : "Show fewer projects"}
            className="type-mono group flex w-full items-center justify-center gap-3 py-6 text-on-surface-variant transition-colors hover:text-primary"
          >
            {hasMore ? "Load more" : "Show less"}
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
