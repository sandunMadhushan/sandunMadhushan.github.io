import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const body = await req.json();
  const {
    title,
    slug,
    description,
    content,
    technologies,
    images,
    githubLink,
    liveLink,
    featured,
    category,
    cardIcon,
    features,
    challenges,
    results,
  } = body;
  const project = await prisma.project.create({
    data: {
      title,
      slug,
      description,
      content: content ?? "",
      technologies: technologies ?? [],
      images: images ?? [],
      githubLink: githubLink || null,
      liveLink: liveLink || null,
      featured: Boolean(featured),
      category: category ?? "Web",
      cardIcon: cardIcon ?? "code",
      features: features ?? [],
      challenges: challenges ?? undefined,
      results: results ?? undefined,
    },
  });
  return NextResponse.json(project);
}
