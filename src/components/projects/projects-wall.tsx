"use client";

import NextImage from "next/image";
import Link from "next/link";
import type { Project } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import { isRemoteImageSrc } from "@/lib/image-url";
import { projectCardSrc } from "@/lib/project-media";
import { DEFAULT_PORTRAIT_SRC } from "@/lib/site-constants";
import { parseProjectCategories } from "@/lib/project-categories";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Every project, uniform size, tidy rows — no drag, no pagination, no
 * uneven masonry heights. The "see everything at once" brief without the
 * visual noise that varied tile sizes/positions introduced when the source
 * screenshots don't share a consistent style.
 */
export function ProjectsWall({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, i) => {
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
                    <span key={t} className="type-mono-sm text-on-surface-variant/70">
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
  );
}
