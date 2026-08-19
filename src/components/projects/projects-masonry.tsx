"use client";

import NextImage from "next/image";
import Link from "next/link";
import type { Project } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import { isRemoteImageSrc } from "@/lib/image-url";
import { projectCardSrc } from "@/lib/project-media";
import { DEFAULT_PORTRAIT_SRC } from "@/lib/site-constants";
import { parseProjectCategories } from "@/lib/project-categories";

/** Deterministic string hash — stable across server/client renders, no Math.random. */
function hashSeed(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Tile image heights, varied per project so columns settle unevenly like a real mood board. */
const HEIGHT_CLASSES = ["h-56", "h-72", "h-80", "h-64"];

/**
 * Organic masonry wall — every project renders at once, in CSS multi-column
 * masonry with varied tile heights (hashed from id, so layout never shifts
 * between renders). No pagination, no reveal-on-scroll, no drag: everything
 * is visible immediately, the way a real curated wall of work would read.
 */
export function ProjectsMasonry({ projects }: { projects: Project[] }) {
  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
      {projects.map((p) => {
        const cover = projectCardSrc(p, DEFAULT_PORTRAIT_SRC);
        const categories = parseProjectCategories(p.category);
        const h = hashSeed(p.id);
        const heightClass = HEIGHT_CLASSES[h % HEIGHT_CLASSES.length];

        return (
          <Link
            key={p.id}
            href={`/projects/${p.slug}`}
            className="group mb-5 block break-inside-avoid"
          >
            <div className="relative overflow-hidden rounded-md border border-outline-variant bg-surface-container-low transition-colors duration-500 group-hover:border-primary-container">
              <div className={`relative w-full overflow-hidden ${heightClass}`}>
                <NextImage
                  src={cover}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  unoptimized={isRemoteImageSrc(cover)}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/0" />
                <span className="absolute right-3 top-3 flex size-7 translate-y-1 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </span>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
                  <span className="type-mono-sm text-white/70">
                    {categories.join(" · ")}
                  </span>
                  <h3 className="type-h3 mt-1 text-white transition-colors duration-300 group-hover:text-primary-container">
                    {p.title}
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
