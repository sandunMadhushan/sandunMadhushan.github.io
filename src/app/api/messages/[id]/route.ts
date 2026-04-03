import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const { id } = await ctx.params;
  await prisma.message.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
