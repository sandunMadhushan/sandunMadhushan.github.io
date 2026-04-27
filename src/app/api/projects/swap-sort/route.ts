import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

/** Swap `sortOrder` between two projects (admin list move up / down). */
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;

  const body = (await req.json()) as { aId?: string; bId?: string };
  const aId = typeof body.aId === "string" ? body.aId.trim() : "";
  const bId = typeof body.bId === "string" ? body.bId.trim() : "";
  if (!aId || !bId || aId === bId) {
    return NextResponse.json({ error: "Invalid project pair" }, { status: 400 });
  }

  const [a, b] = await Promise.all([
    prisma.project.findUnique({ where: { id: aId }, select: { id: true, sortOrder: true } }),
    prisma.project.findUnique({ where: { id: bId }, select: { id: true, sortOrder: true } }),
  ]);
  if (!a || !b) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.project.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
    prisma.project.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
  ]);

  revalidatePath("/");
  revalidatePath("/projects");
  return NextResponse.json({ ok: true });
}
