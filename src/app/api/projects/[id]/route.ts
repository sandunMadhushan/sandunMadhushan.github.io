import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const { id } = await ctx.params;
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
  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(content !== undefined && { content }),
        ...(technologies !== undefined && { technologies }),
        ...(images !== undefined && { images }),
        ...(githubLink !== undefined && { githubLink: githubLink || null }),
        ...(liveLink !== undefined && { liveLink: liveLink || null }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(category !== undefined && { category }),
        ...(cardIcon !== undefined && { cardIcon }),
        ...(features !== undefined && { features }),
        ...(challenges !== undefined && { challenges }),
        ...(results !== undefined && { results }),
      },
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const { id } = await ctx.params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
