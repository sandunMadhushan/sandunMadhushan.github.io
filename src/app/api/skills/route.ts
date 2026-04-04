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
  const descRaw = body.description;
  const description =
    typeof descRaw === "string" && descRaw.trim() ? descRaw.trim() : null;
  if (!name) return NextResponse.json({ error: "Skill name is required." }, { status: 400 });
  const iconRaw = body.icon;
  const icon =
    typeof iconRaw === "string" && iconRaw.trim() ? iconRaw.trim() : null;

  const skill = await prisma.skill.create({
    data: {
      name,
      category: typeof body.category === "string" ? body.category : "Frontend",
      description,
      proficiency:
        typeof body.proficiency === "number" && Number.isFinite(body.proficiency) ? body.proficiency : null,
      icon,
    },
  });
  return NextResponse.json(skill);
}
