import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { optionalJson } from "@/lib/prisma-json";
import { requireAdmin } from "@/lib/api-auth";
import { validateProjectBody } from "@/lib/project-validation";

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const body = await req.json();
  const v = validateProjectBody(body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const { challenges, results } = body as { challenges?: unknown; results?: unknown };
  const project = await prisma.project.create({
    data: {
      ...v.data,
      ...(challenges !== undefined ? { challenges: optionalJson(challenges) } : {}),
      ...(results !== undefined ? { results: optionalJson(results) } : {}),
    },
  });
  return NextResponse.json(project);
}
