import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

const STEP = 10;

/**
 * Persist list order as `sortOrder` ascending (index * STEP).
 * Body must list every project id exactly once (same set as the database).
 */
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;

  const body = (await req.json()) as { orderedIds?: unknown };
  if (!Array.isArray(body.orderedIds) || body.orderedIds.length === 0) {
    return NextResponse.json({ error: "orderedIds must be a non-empty array" }, { status: 400 });
  }

  const orderedIds = body.orderedIds.map((id) => (typeof id === "string" ? id.trim() : "")).filter(Boolean);
  if (orderedIds.length !== body.orderedIds.length) {
    return NextResponse.json({ error: "Invalid id in orderedIds" }, { status: 400 });
  }

  const seen = new Set<string>();
  for (const id of orderedIds) {
    if (seen.has(id)) {
      return NextResponse.json({ error: "Duplicate id in orderedIds" }, { status: 400 });
    }
    seen.add(id);
  }

  const rows = await prisma.project.findMany({ select: { id: true } });
  if (rows.length !== orderedIds.length) {
    return NextResponse.json(
      { error: "orderedIds must include every project exactly once" },
      { status: 400 },
    );
  }

  const dbSet = new Set(rows.map((r) => r.id));
  for (const id of orderedIds) {
    if (!dbSet.has(id)) {
      return NextResponse.json({ error: "Unknown project id" }, { status: 400 });
    }
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.project.update({
        where: { id },
        data: { sortOrder: index * STEP },
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}
