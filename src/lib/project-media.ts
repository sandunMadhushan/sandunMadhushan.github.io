import { resolveProjectImageSrc } from "@/lib/image-url";
import type { Project } from "@prisma/client";

/** Card / listing thumbnail: cover → hero → first gallery → fallback. */
export function projectCardSrc(project: Project, fallback: string): string {
  const raw = project.coverImage ?? project.heroImage ?? project.galleryImages[0] ?? "";
  if (!raw) return fallback;
  return resolveProjectImageSrc(raw);
}

/** Case-study hero: hero → cover → first gallery → fallback. */
export function projectHeroSrc(project: Project, fallback: string): string {
  const raw = project.heroImage ?? project.coverImage ?? project.galleryImages[0] ?? "";
  if (!raw) return fallback;
  return resolveProjectImageSrc(raw);
}

/** Artifact grid only (does not duplicate hero/cover). */
export function projectGallerySrcs(project: Project): string[] {
  return project.galleryImages.map((u) => resolveProjectImageSrc(u)).filter(Boolean);
}
