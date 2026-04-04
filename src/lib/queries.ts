import { Prisma } from "@prisma/client";
import type { About, Message, Project, Skill, SocialLink } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SOCIAL_LINKS } from "@/lib/site-constants";

/** True when Prisma cannot reach the DB (offline dev, Neon asleep, bad URL, firewall). */
function isDatabaseUnavailable(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return ["P1001", "P1002", "P1017"].includes(error.code);
  }
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientRustPanicError) return true;
  return false;
}

async function withDbFallback<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (e) {
    if (isDatabaseUnavailable(e)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[${label}] Database unreachable — using fallback. Check DATABASE_URL and that your database is running.`,
        );
      }
      return fallback;
    }
    throw e;
  }
}

/** Minimal rows so footer/contact can render without a live DB (ids are synthetic). */
function staticSocialLinksFallback(): SocialLink[] {
  const now = new Date();
  return DEFAULT_SOCIAL_LINKS.map((r) => ({
    id: `fallback-${r.platform}`,
    platform: r.platform,
    url: r.url,
    sortOrder: r.sortOrder,
    createdAt: now,
    updatedAt: now,
  }));
}

export async function getProjects(): Promise<Project[]> {
  return withDbFallback("getProjects", () =>
    prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
    [],
  );
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  return withDbFallback(
    "getFeaturedProjects",
    () =>
      prisma.project.findMany({
        where: { featured: true },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    [],
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return withDbFallback("getProjectBySlug", () => prisma.project.findUnique({ where: { slug } }), null);
}

export async function getSkills(): Promise<Skill[]> {
  return withDbFallback(
    "getSkills",
    () => prisma.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    [],
  );
}

export async function getAbout(): Promise<About | null> {
  return withDbFallback(
    "getAbout",
    () => prisma.about.findFirst({ orderBy: { updatedAt: "desc" } }),
    null,
  );
}

export async function getMessages(): Promise<Message[]> {
  return withDbFallback(
    "getMessages",
    () => prisma.message.findMany({ orderBy: { createdAt: "desc" } }),
    [],
  );
}

export async function getMessageCount(): Promise<number> {
  return withDbFallback("getMessageCount", () => prisma.message.count(), 0);
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

export async function getSocialLinks(): Promise<SocialLink[]> {
  return withDbFallback(
    "getSocialLinks",
    async () => {
      await ensureDefaultSocialLinks();
      return prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } });
    },
    staticSocialLinksFallback(),
  );
}
