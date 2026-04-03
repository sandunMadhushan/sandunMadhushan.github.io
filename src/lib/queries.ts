import { prisma } from "@/lib/prisma";
import { DEFAULT_SOCIAL_LINKS } from "@/lib/site-constants";

export async function getProjects() {
  return prisma.project.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getFeaturedProjects(limit = 3) {
  return prisma.project.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({ where: { slug } });
}

export async function getSkills() {
  return prisma.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });
}

export async function getAbout() {
  return prisma.about.findFirst({ orderBy: { updatedAt: "desc" } });
}

export async function getMessages() {
  return prisma.message.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getMessageCount() {
  return prisma.message.count();
}

async function dedupeSocialLinksByPlatform() {
  const grouped = await prisma.socialLink.groupBy({
    by: ["platform"],
    _count: { _all: true },
  });
  if (!grouped.some((g) => g._count._all > 1)) return;

  const all = await prisma.socialLink.findMany({ orderBy: [{ platform: "asc" }, { sortOrder: "asc" }, { id: "asc" }] });
  const seen = new Set<string>();
  const idsToRemove: string[] = [];
  for (const row of all) {
    if (seen.has(row.platform)) idsToRemove.push(row.id);
    else seen.add(row.platform);
  }
  if (idsToRemove.length > 0) {
    await prisma.socialLink.deleteMany({ where: { id: { in: idsToRemove } } });
  }
}

async function ensureDefaultSocialLinks() {
  await dedupeSocialLinksByPlatform();

  const existing = await prisma.socialLink.findMany({
    where: { platform: { in: DEFAULT_SOCIAL_LINKS.map((r) => r.platform) } },
    select: { platform: true },
  });
  const have = new Set(existing.map((e) => e.platform));
  const missing = DEFAULT_SOCIAL_LINKS.filter((r) => !have.has(r.platform));
  if (missing.length === 0) return;
  await prisma.socialLink.createMany({ data: [...missing] });
}

export async function getSocialLinks() {
  await ensureDefaultSocialLinks();
  return prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } });
}
