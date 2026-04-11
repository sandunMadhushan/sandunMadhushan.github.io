"use client";

import { useMemo, useState } from "react";
import NextImage from "next/image";
import { isRemoteImageSrc } from "@/lib/image-url";
import { projectCardSrc } from "@/lib/project-media";
import Link from "next/link";
import type { Project } from "@prisma/client";
import { MIcon } from "@/components/m-icon";
import { DEFAULT_PORTRAIT_SRC } from "@/lib/site-constants";

const TABS = ["All", "Web", "Mobile", "AI"] as const;

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const filtered = useMemo(() => {
    if (tab === "All") return projects;
    return projects.filter((p) => p.category === tab);
  }, [projects, tab]);

  const featured = projects.find((p) => p.featured) ?? projects[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);
  const featuredCover = featured ? projectCardSrc(featured, DEFAULT_PORTRAIT_SRC) : DEFAULT_PORTRAIT_SRC;
  const featuredOutsideFilter = Boolean(
    featured && !filtered.some((p) => p.id === featured.id),
  );
  const visibleCount = filtered.length + (featuredOutsideFilter ? 1 : 0);

  return (
    <>
      {featured && (
        <section className="mb-20">
          <div className="group relative overflow-hidden rounded-xl bg-surface-container-low transition-all duration-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.15)]">
            <div className="flex flex-col lg:flex-row">
              <div className="relative w-full overflow-hidden lg:w-3/5">
                <div className="relative aspect-[4/3] min-h-[200px] w-full max-h-[min(72dvh,480px)] sm:aspect-video sm:min-h-[240px] lg:max-h-none lg:aspect-auto lg:min-h-[360px] lg:h-[min(420px,50dvh)] xl:min-h-[400px] xl:h-[460px]">
                  <NextImage
                    src={featuredCover}
                    alt={featured.title}
                    fill
                    className="object-cover grayscale-[20%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    sizes="(max-width: 1023px) 100vw, 60vw"
                    unoptimized={isRemoteImageSrc(featuredCover)}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 lg:w-2/5 lg:p-12">
                <span className="label-md mb-4 font-bold uppercase tracking-widest text-primary">
                  Featured Project
                </span>
                <h2 className="mb-4 text-3xl font-bold text-on-surface lg:text-4xl">{featured.title}</h2>
                <p className="mb-8 leading-relaxed text-on-surface-variant/80">{featured.description}</p>
                <div className="mb-8 flex flex-wrap gap-2">
                  {featured.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-surface-container-high px-3 py-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/projects/${featured.slug}`}
                  className="flex w-fit items-center gap-3 rounded-lg bg-primary-container px-8 py-4 font-bold text-on-primary-container transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95"
                >
                  View Project Details
                  <MIcon name="arrow_forward" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex w-fit gap-2 rounded-xl bg-surface-container-lowest p-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-lg px-6 py-2 text-sm font-bold shadow-lg transition-all ${
                tab === t
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface/45 hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="text-sm font-medium text-on-surface-variant/50">
          Showing {visibleCount} {visibleCount === 1 ? "project" : "projects"}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {rest.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-outline-variant/25 bg-surface-container-low/50 py-16 text-center text-on-surface-variant">
            No projects match this filter.
          </p>
        )}
        {rest.map((p) => {
          const cover = projectCardSrc(p, DEFAULT_PORTRAIT_SRC);
          return (
          <article
            key={p.id}
            className="group flex flex-col overflow-hidden rounded-xl bg-surface-container-low transition-all duration-300 hover:translate-y-[-8px]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden sm:min-h-[200px]">
              <NextImage
                src={cover}
                alt={p.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized={isRemoteImageSrc(cover)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent opacity-60" />
            </div>
            <div className="flex flex-grow flex-col p-8">
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-xl font-bold text-on-surface">{p.title}</h3>
                <MIcon name={p.cardIcon || "code"} className="text-xl text-primary" />
              </div>
              <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-on-surface-variant/70">{p.description}</p>
              <div className="mb-8 mt-auto flex flex-wrap gap-2">
                {p.technologies.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded bg-surface-container-highest px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter text-on-surface-variant"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <Link
                href={`/projects/${p.slug}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-outline-variant/20 py-3 text-sm font-bold transition-all hover:border-primary/50 hover:bg-surface-bright"
              >
                View Details
                <MIcon name="open_in_new" className="text-sm" />
              </Link>
            </div>
          </article>
          );
        })}
      </div>
    </>
  );
}
