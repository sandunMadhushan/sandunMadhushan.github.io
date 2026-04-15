/** Shared rules for admin project create/update (client + API). */

import { normalizeProjectImageUrl, normalizeProjectImageUrls } from "@/lib/image-url";
import type { Project } from "@prisma/client";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ProjectBodyInput = Record<string, unknown>;

/** Case study “The Friction” cards (stored as JSON on `Project.challenges`). */
export type ProjectChallenge = { title: string; description: string };

/** Case study “The Resolution” cards (stored as JSON on `Project.resolutions`). */
export type ProjectResolution = { title: string; description: string };

/** Case study “Impact Driven” stats (stored as JSON on `Project.results`). */
export type ProjectResult = { label: string; value: string };

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
  published: boolean;
  sortOrder: number;
  category: string;
  cardIcon: string;
  features: string[];
  challenges: ProjectChallenge[];
  resolutions: ProjectResolution[];
  results: ProjectResult[];
};

function strArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string").map((s) => s.trim()).filter(Boolean);
}

export function parseProjectChallenges(
  input: unknown,
): { ok: true; value: ProjectChallenge[] } | { ok: false; error: string } {
  if (input === null || input === undefined) return { ok: true, value: [] };
  if (!Array.isArray(input)) return { ok: false, error: "Challenges must be a list." };
  const out: ProjectChallenge[] = [];
  for (let i = 0; i < input.length; i++) {
    const row = input[i];
    if (row === null || typeof row !== "object" || Array.isArray(row)) {
      return { ok: false, error: `Challenge ${i + 1}: invalid entry.` };
    }
    const o = row as Record<string, unknown>;
    const title = typeof o.title === "string" ? o.title.trim() : "";
    const description = typeof o.description === "string" ? o.description.trim() : "";
    if (!title && !description) continue;
    if (!title || !description) {
      return {
        ok: false,
        error: `Challenge ${i + 1}: enter both a title and a description, or clear the row.`,
      };
    }
    out.push({ title, description });
  }
  return { ok: true, value: out };
}

export function parseProjectResults(
  input: unknown,
): { ok: true; value: ProjectResult[] } | { ok: false; error: string } {
  if (input === null || input === undefined) return { ok: true, value: [] };
  if (!Array.isArray(input)) return { ok: false, error: "Impact metrics must be a list." };
  const out: ProjectResult[] = [];
  for (let i = 0; i < input.length; i++) {
    const row = input[i];
    if (row === null || typeof row !== "object" || Array.isArray(row)) {
      return { ok: false, error: `Impact metric ${i + 1}: invalid entry.` };
    }
    const o = row as Record<string, unknown>;
    const label = typeof o.label === "string" ? o.label.trim() : "";
    const value = typeof o.value === "string" ? o.value.trim() : "";
    if (!label && !value) continue;
    if (!label || !value) {
      return {
        ok: false,
        error: `Impact metric ${i + 1}: enter both a label and a value, or clear the row.`,
      };
    }
    out.push({ label, value });
  }
  return { ok: true, value: out };
}

export function parseProjectResolutions(
  input: unknown,
): { ok: true; value: ProjectResolution[] } | { ok: false; error: string } {
  if (input === null || input === undefined) return { ok: true, value: [] };
  if (!Array.isArray(input)) return { ok: false, error: "Resolutions must be a list." };
  const out: ProjectResolution[] = [];
  for (let i = 0; i < input.length; i++) {
    const row = input[i];
    if (row === null || typeof row !== "object" || Array.isArray(row)) {
      return { ok: false, error: `Resolution ${i + 1}: invalid entry.` };
    }
    const o = row as Record<string, unknown>;
    const title = typeof o.title === "string" ? o.title.trim() : "";
    const description = typeof o.description === "string" ? o.description.trim() : "";
    if (!title && !description) continue;
    if (!title || !description) {
      return {
        ok: false,
        error: `Resolution ${i + 1}: enter both a title and a description, or clear the row.`,
      };
    }
    out.push({ title, description });
  }
  return { ok: true, value: out };
}

function parseSortOrder(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Math.trunc(Number(v));
  return fallback;
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
  const published = typeof body.published === "boolean" ? body.published : true;
  const sortOrder = parseSortOrder(body.sortOrder, 0);

  const challengesParsed = parseProjectChallenges(body.challenges);
  if (!challengesParsed.ok) return { ok: false, error: challengesParsed.error };
  const resolutionsParsed = parseProjectResolutions(body.resolutions);
  if (!resolutionsParsed.ok) return { ok: false, error: resolutionsParsed.error };
  const resultsParsed = parseProjectResults(body.results);
  if (!resultsParsed.ok) return { ok: false, error: resultsParsed.error };

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
      published,
      sortOrder,
      category,
      cardIcon,
      features,
      challenges: challengesParsed.value,
      resolutions: resolutionsParsed.value,
      results: resultsParsed.value,
    },
  };
}

/** Merge PATCH body with an existing row so partial updates (e.g. featured toggle) validate. */
export function mergeProjectPatch(existing: Project, body: ProjectBodyInput): ProjectBodyInput {
  const mergedChallenges = parseProjectChallenges(existing.challenges);
  const mergedResolutions = parseProjectResolutions((existing as unknown as { resolutions?: unknown }).resolutions);
  const mergedResults = parseProjectResults(existing.results);

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
    published: body.published !== undefined ? body.published : existing.published,
    sortOrder: body.sortOrder !== undefined ? body.sortOrder : existing.sortOrder,
    category: body.category !== undefined ? body.category : existing.category,
    cardIcon: body.cardIcon !== undefined ? body.cardIcon : existing.cardIcon,
    features: body.features !== undefined ? body.features : existing.features,
    challenges: body.challenges !== undefined ? body.challenges : mergedChallenges.ok ? mergedChallenges.value : [],
    resolutions:
      body.resolutions !== undefined ? body.resolutions : mergedResolutions.ok ? mergedResolutions.value : [],
    results: body.results !== undefined ? body.results : mergedResults.ok ? mergedResults.value : [],
  };
}
