import { prisma } from "@/lib/prisma";

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
