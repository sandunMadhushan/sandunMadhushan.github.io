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
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (!name) return NextResponse.json({ error: "Skill name is required." }, { status: 400 });
  if (!description) return NextResponse.json({ error: "Description is required." }, { status: 400 });
  const skill = await prisma.skill.create({
    data: {
      name,
      category: typeof body.category === "string" ? body.category : "Frontend",
      description,
      proficiency:
        typeof body.proficiency === "number" && Number.isFinite(body.proficiency) ? body.proficiency : null,
      icon: body.icon ?? null,
    },
  });
  return NextResponse.json(skill);
}
