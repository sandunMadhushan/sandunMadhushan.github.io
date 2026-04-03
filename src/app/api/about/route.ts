import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const about = await prisma.about.findFirst({ orderBy: { updatedAt: "desc" } });
  if (!about) return NextResponse.json(null);
  return NextResponse.json(about);
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const body = await req.json();
  const existing = await prisma.about.findFirst({ orderBy: { updatedAt: "desc" } });
  if (!existing) {
    const created = await prisma.about.create({
      data: {
        content: body.content ?? "",
        stats: body.stats ?? {},
      },
    });
    return NextResponse.json(created);
  }
  const updated = await prisma.about.update({
    where: { id: existing.id },
    data: {
      ...(body.content !== undefined && { content: body.content }),
      ...(body.stats !== undefined && { stats: body.stats }),
    },
  });
  return NextResponse.json(updated);
}
