import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { optionalJson } from "@/lib/prisma-json";
import { requireAdmin } from "@/lib/api-auth";
import { mergeProjectPatch, validateProjectBody } from "@/lib/project-validation";

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
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const v = validateProjectBody(mergeProjectPatch(existing, body));
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const { challenges, results } = body as { challenges?: unknown; results?: unknown };
  try {
    const updateData: Prisma.ProjectUpdateInput = { ...v.data };
    if (challenges !== undefined) updateData.challenges = optionalJson(challenges);
    if (results !== undefined) updateData.results = optionalJson(results);

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
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
