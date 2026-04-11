import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";

/** Regenerate when projects change; keeps sitemap fresh without heavy DB load on every request. */
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/skills`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  ];

  const projects = await getProjects();
  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/projects/${encodeURIComponent(p.slug)}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticEntries, ...projectEntries];
}
