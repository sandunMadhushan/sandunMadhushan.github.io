import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(skills);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const body = await req.json();
  const skill = await prisma.skill.create({
    data: {
      name: body.name,
      category: body.category,
      description: body.description ?? null,
      proficiency: body.proficiency ?? null,
      icon: body.icon ?? null,
    },
  });
  return NextResponse.json(skill);
}
