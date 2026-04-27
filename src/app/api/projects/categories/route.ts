import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseProjectCategories } from "@/lib/project-categories";

export async function GET() {
  const rows = await prisma.project.findMany({ select: { category: true } });
  const set = new Set<string>();
  for (const r of rows) {
    for (const c of parseProjectCategories(r.category)) set.add(c);
  }
  const categories = Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  return NextResponse.json({ categories });
}

