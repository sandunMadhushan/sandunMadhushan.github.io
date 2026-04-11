/** Shared rules for admin project create/update (client + API). */

import { normalizeProjectImageUrl, normalizeProjectImageUrls } from "@/lib/image-url";
import type { Project } from "@prisma/client";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ProjectBodyInput = Record<string, unknown>;

export type ValidatedProjectData = {
  title: string;
  slug: string;
  description: string;
  content: string;
  technologies: string[];
  coverImage: string | null;
  heroImage: string | null;
  galleryImages: string[];
  githubLink: string | null;
  liveLink: string | null;
  featured: boolean;
  category: string;
  cardIcon: string;
  features: string[];
};

function strArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string").map((s) => s.trim()).filter(Boolean);
}

function normOptionalUrl(raw: unknown): { ok: true; url: string | null } | { ok: false; error: string } {
  if (raw === null || raw === undefined) return { ok: true, url: null };
  if (typeof raw !== "string") return { ok: false, error: "Image URL must be text." };
  const t = raw.trim();
  if (!t) return { ok: true, url: null };
  return normalizeProjectImageUrl(t);
}

export function validateProjectBody(body: ProjectBodyInput): { ok: true; data: ValidatedProjectData } | { ok: false; error: string } {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slugRaw = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const technologies = strArray(body.technologies);
  const galleryRaw = strArray(body.galleryImages);
  const features = strArray(body.features);

  if (!title) return { ok: false, error: "Project title is required." };
  if (!slugRaw) return { ok: false, error: "URL slug is required." };
  if (!SLUG_PATTERN.test(slugRaw)) {
    return {
      ok: false,
      error: "URL slug must use lowercase letters, numbers, and hyphens only (e.g. mealbridge-app).",
    };
  }
  if (!description) return { ok: false, error: "Short description is required." };
  if (!content) return { ok: false, error: "Full case study content is required." };
  if (technologies.length === 0) {
    return { ok: false, error: "Add at least one technology (comma-separated)." };
  }

  const coverNorm = normOptionalUrl(body.coverImage);
  if (!coverNorm.ok) return { ok: false, error: coverNorm.error };
  const heroNorm = normOptionalUrl(body.heroImage);
  if (!heroNorm.ok) return { ok: false, error: heroNorm.error };

  if (!coverNorm.url && !heroNorm.url && galleryRaw.length === 0) {
    return {
      ok: false,
      error: "Add a cover image, a hero image, or at least one gallery image URL.",
    };
  }

  const galleryNorm = normalizeProjectImageUrls(galleryRaw);
  if (!galleryNorm.ok) return { ok: false, error: galleryNorm.error };

  const category = typeof body.category === "string" && body.category.trim() ? body.category.trim() : "Web";
  const cardIcon = typeof body.cardIcon === "string" && body.cardIcon.trim() ? body.cardIcon.trim() : "code";
  const githubLink =
    typeof body.githubLink === "string" && body.githubLink.trim() ? body.githubLink.trim() : null;
  const liveLink = typeof body.liveLink === "string" && body.liveLink.trim() ? body.liveLink.trim() : null;
  const featured = Boolean(body.featured);

  return {
    ok: true,
    data: {
      title,
      slug: slugRaw,
      description,
      content,
      technologies,
      coverImage: coverNorm.url,
      heroImage: heroNorm.url,
      galleryImages: galleryNorm.urls,
      githubLink,
      liveLink,
      featured,
      category,
      cardIcon,
      features,
    },
  };
}

/** Merge PATCH body with an existing row so partial updates (e.g. featured toggle) validate. */
export function mergeProjectPatch(existing: Project, body: ProjectBodyInput): ProjectBodyInput {
  return {
    title: body.title !== undefined ? body.title : existing.title,
    slug: body.slug !== undefined ? body.slug : existing.slug,
    description: body.description !== undefined ? body.description : existing.description,
    content: body.content !== undefined ? body.content : existing.content,
    technologies: body.technologies !== undefined ? body.technologies : existing.technologies,
    coverImage: body.coverImage !== undefined ? body.coverImage : existing.coverImage,
    heroImage: body.heroImage !== undefined ? body.heroImage : existing.heroImage,
    galleryImages: body.galleryImages !== undefined ? body.galleryImages : existing.galleryImages,
    githubLink: body.githubLink !== undefined ? body.githubLink : existing.githubLink,
    liveLink: body.liveLink !== undefined ? body.liveLink : existing.liveLink,
    featured: body.featured !== undefined ? body.featured : existing.featured,
    category: body.category !== undefined ? body.category : existing.category,
    cardIcon: body.cardIcon !== undefined ? body.cardIcon : existing.cardIcon,
    features: body.features !== undefined ? body.features : existing.features,
  };
}
