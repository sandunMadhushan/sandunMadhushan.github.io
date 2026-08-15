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

/** Grid cards only (featured hero is always shown separately). */
const INITIAL_GRID_VISIBLE = 6;
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
  const [visibleGridCount, setVisibleGridCount] = useState(INITIAL_GRID_VISIBLE);
  const gridStartRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const pendingScrollRef = useRef<
    { type: "more"; index: number } | { type: "less" } | null
  >(null);
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
  const visibleCount = filtered.length + (featuredOutsideFilter ? 1 : 0);

  const displayedRest = useMemo(
    () => rest.slice(0, visibleGridCount),
    [rest, visibleGridCount],
  );
  const hasMoreInGrid = visibleGridCount < rest.length;
  const canCollapseGrid =
    rest.length > INITIAL_GRID_VISIBLE && visibleGridCount > INITIAL_GRID_VISIBLE;

  function pickTab(next: string) {
    setTab(next);
    setVisibleGridCount(INITIAL_GRID_VISIBLE);
    pendingScrollRef.current = null;
  }

  useEffect(() => {
    const pending = pendingScrollRef.current;
    if (!pending) return;
    pendingScrollRef.current = null;

    if (pending.type === "more") {
      const target = cardRefs.current[pending.index];
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    gridStartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [visibleGridCount]);

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
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-outline-variant bg-surface-container-low md:aspect-[21/9]">
              <NextImage
                src={featuredCover}
                alt={featured.title}
                fill
                priority
                sizes="100vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                unoptimized={isRemoteImageSrc(featuredCover)}
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
      <div className="mb-10 md:mb-14">
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
            {String(visibleCount).padStart(2, "0")}{" "}
            {visibleCount === 1 ? "project" : "projects"}
          </span>
        </div>
      </div>

      {/* ---------- STAGGERED GRID ---------- */}
      <div ref={gridStartRef} className="grid grid-cols-12 gap-x-8 gap-y-16">
        {rest.length === 0 && (
          <p className="type-mono col-span-12 border border-dashed border-outline-variant py-20 text-center text-on-surface-variant">
            No projects match this filter.
          </p>
        )}

        {displayedRest.map((p, i) => {
          const cover = projectCardSrc(p, DEFAULT_PORTRAIT_SRC);
          const categories = parseProjectCategories(p.category);
          /* Alternating rhythm: wide, narrow, narrow — breaks the uniform grid. */
          const inRow = i % 3;
          const span =
            inRow === 0
              ? "md:col-span-12 lg:col-span-6"
              : "md:col-span-6 lg:col-span-3";
          const ratio = inRow === 0 ? "aspect-[16/10]" : "aspect-[4/3]";

          return (
            <article
              key={p.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`group col-span-12 ${span}`}
            >
              <Link href={`/projects/${p.slug}`} className="block">
                <div
                  className={`relative ${ratio} w-full overflow-hidden rounded-sm border border-outline-variant bg-surface-container-low`}
                >
                  <NextImage
                    src={cover}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    unoptimized={isRemoteImageSrc(cover)}
                  />
                </div>

                <div className="mt-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="type-mono-sm text-on-surface-variant">
                      {categories.join(" · ")}
                    </span>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-on-surface-variant transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden
                    />
                  </div>
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
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {hasMoreInGrid || canCollapseGrid ? (
        <div className="mt-20">
          <Rule />
          <button
            type="button"
            onClick={() => {
              if (hasMoreInGrid) {
                setVisibleGridCount((n) => {
                  pendingScrollRef.current = { type: "more", index: n };
                  return Math.min(n + LOAD_MORE_STEP, rest.length);
                });
                return;
              }
              pendingScrollRef.current = { type: "less" };
              setVisibleGridCount(INITIAL_GRID_VISIBLE);
            }}
            aria-label={hasMoreInGrid ? "Load more projects" : "Show fewer projects"}
            className="type-mono group flex w-full items-center justify-center gap-3 py-6 text-on-surface-variant transition-colors hover:text-primary"
          >
            {hasMoreInGrid ? "Load more" : "Show less"}
            {hasMoreInGrid ? (
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
