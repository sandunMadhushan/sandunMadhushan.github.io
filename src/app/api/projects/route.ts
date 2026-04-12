import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { validateProjectBody } from "@/lib/project-validation";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const body = await req.json();
  const v = validateProjectBody(body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const maxSo = await prisma.project.aggregate({ _max: { sortOrder: true } });
  const nextSort = (maxSo._max.sortOrder ?? 0) + 10;
  const project = await prisma.project.create({
    data: {
      ...v.data,
      sortOrder: nextSort,
    },
  });
  return NextResponse.json(project);
}
