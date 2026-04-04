import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const { id } = await ctx.params;
  const body = await req.json();

  let nameTrimmed: string | undefined;
  if (body.name !== undefined) {
    nameTrimmed = typeof body.name === "string" ? body.name.trim() : "";
    if (!nameTrimmed) return NextResponse.json({ error: "Skill name is required." }, { status: 400 });
  }
  let descriptionUpdate: string | null | undefined;
  if (body.description !== undefined) {
    const raw = typeof body.description === "string" ? body.description.trim() : "";
    descriptionUpdate = raw === "" ? null : raw;
  }

  const proficiency =
    body.proficiency === undefined
      ? undefined
      : typeof body.proficiency === "number" && Number.isFinite(body.proficiency)
        ? body.proficiency
        : null;

  const skill = await prisma.skill.update({
    where: { id },
    data: {
      ...(nameTrimmed !== undefined && { name: nameTrimmed }),
      ...(body.category !== undefined && { category: body.category }),
      ...(descriptionUpdate !== undefined && { description: descriptionUpdate }),
      ...(body.proficiency !== undefined && { proficiency }),
      ...(body.icon !== undefined && {
        icon: typeof body.icon === "string" && body.icon.trim() ? body.icon.trim() : null,
      }),
    },
  });
  return NextResponse.json(skill);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const { id } = await ctx.params;
  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
