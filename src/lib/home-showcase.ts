import type { Project } from "@prisma/client";

/** Stored in `About.stats` — ordered CUIDs; public home resolves against published projects only. */
export const HOME_SHOWCASE_PROJECT_IDS_KEY = "homeFeaturedProjectIds" as const;

export function parseHomeFeaturedProjectIds(
  stats: Record<string, unknown> | undefined,
): string[] {
  if (!stats) return [];
  const raw = stats[HOME_SHOWCASE_PROJECT_IDS_KEY];
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .slice(0, 3);
}

/**
 * Home “Featured Projects” row: use explicit IDs from About stats when set; otherwise the first
 * three published projects in portfolio order (`sortOrder`, then `createdAt`).
 */
export function resolveHomeShowcaseProjects(
  publishedProjects: Project[],
  stats: Record<string, unknown> | undefined,
): Project[] {
  const byId = new Map(publishedProjects.map((p) => [p.id, p]));
  const requested = parseHomeFeaturedProjectIds(stats);
  if (requested.length > 0) {
    const out: Project[] = [];
    for (const id of requested) {
      const p = byId.get(id);
      if (p) out.push(p);
    }
    return out;
  }
  return publishedProjects.slice(0, 3);
}

export function omitHomeShowcaseIdsFromStats(stats: Record<string, unknown>): Record<string, unknown> {
  const { [HOME_SHOWCASE_PROJECT_IDS_KEY]: _, ...rest } = stats;
  return rest;
}
