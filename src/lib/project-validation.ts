/** Shared rules for admin project create/update (client + API). */

import { normalizeProjectImageUrls } from "@/lib/image-url";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ProjectBodyInput = Record<string, unknown>;

export type ValidatedProjectData = {
  title: string;
  slug: string;
  description: string;
  content: string;
  technologies: string[];
  images: string[];
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

export function validateProjectBody(body: ProjectBodyInput): { ok: true; data: ValidatedProjectData } | { ok: false; error: string } {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slugRaw = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const technologies = strArray(body.technologies);
  const images = strArray(body.images);
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
  if (images.length === 0) {
    return { ok: false, error: "Add at least one cover or gallery image URL." };
  }

  const normalized = normalizeProjectImageUrls(images);
  if (!normalized.ok) return { ok: false, error: normalized.error };

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
      images: normalized.urls,
      githubLink,
      liveLink,
      featured,
      category,
      cardIcon,
      features,
    },
  };
}
