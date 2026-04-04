import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  if (typeof o.read !== "boolean") {
    return NextResponse.json({ error: "Body must include read: boolean." }, { status: 400 });
  }

  try {
    const row = await prisma.message.update({
      where: { id },
      data: { read: o.read },
    });
    return NextResponse.json(row);
  } catch {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const { id } = await ctx.params;
  await prisma.message.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
