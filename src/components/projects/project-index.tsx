"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { isRemoteImageSrc } from "@/lib/image-url";

export type ProjectIndexRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  categories: string[];
  cover: string;
  year?: string;
};

/**
 * Editorial index of work — numbered rows that read like a table of
 * contents. On pointer devices a preview panel tracks the cursor and
 * cross-fades between rows; on touch each row shows its own thumbnail.
 */
export function ProjectIndex({ rows }: { rows: ProjectIndexRow[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const quickX = useRef<((v: number) => void) | null>(null);
  const quickY = useRef<((v: number) => void) | null>(null);

  function ensureQuick() {
    const el = previewRef.current;
    if (!el || quickX.current) return;
    quickX.current = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
    quickY.current = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });
  }

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const host = hostRef.current;
    if (!host) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ensureQuick();
    const rect = host.getBoundingClientRect();
    quickX.current?.(e.clientX - rect.left - 170);
    quickY.current?.(e.clientY - rect.top - 110);
  }

  return (
    <div
      ref={hostRef}
      className="relative"
      onMouseMove={handleMove}
      onMouseLeave={() => setActiveIndex(null)}
    >
      {/* Cursor-tracked preview — decorative, pointer devices only. */}
      <div
        ref={previewRef}
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 z-20 hidden h-[220px] w-[340px] overflow-hidden rounded-sm border border-outline-variant bg-surface-container-low transition-opacity duration-300 lg:block ${
          activeIndex === null ? "opacity-0" : "opacity-100"
        }`}
      >
        {rows.map((row, i) => (
          <NextImage
            key={row.id}
            src={row.cover}
            alt=""
            fill
            sizes="340px"
            className={`object-cover transition-opacity duration-300 ${
              activeIndex === i ? "opacity-100" : "opacity-0"
            }`}
            unoptimized={isRemoteImageSrc(row.cover)}
          />
        ))}
      </div>

      <ul className="relative">
        {rows.map((row, i) => (
          <li key={row.id}>
            <Link
              href={`/projects/${row.slug}`}
              onMouseEnter={() => setActiveIndex(i)}
              onFocus={() => setActiveIndex(i)}
              className="group grid grid-cols-12 items-center gap-4 border-t border-outline-variant py-7 transition-colors duration-500 last:border-b hover:border-primary-container md:py-9"
            >
              <span className="type-mono col-span-2 tabular-nums text-on-surface-variant transition-colors duration-300 group-hover:text-primary md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="col-span-10 md:col-span-5">
                <h3 className="type-h3 text-on-surface transition-transform duration-500 md:group-hover:translate-x-2">
                  {row.title}
                </h3>
                {/* Touch fallback: the description carries the weight. */}
                <p className="mt-1.5 line-clamp-2 text-sm text-on-surface-variant lg:hidden">
                  {row.description}
                </p>
              </div>

              <span className="type-mono-sm col-span-8 col-start-3 text-on-surface-variant md:col-span-4 md:col-start-auto">
                {row.categories.join(" · ")}
              </span>

              <span className="col-span-2 flex justify-end md:col-span-2">
                <ArrowUpRight
                  className="size-5 text-on-surface-variant transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
