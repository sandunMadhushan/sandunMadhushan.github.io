import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { isSocialPlatformId, normalizeSocialUrl } from "@/lib/social-platforms";

export async function GET() {
  const links = await prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(links);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const body = await req.json();
  const platform = typeof body.platform === "string" ? body.platform.trim().toLowerCase() : "";
  if (!isSocialPlatformId(platform)) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
  }
  const url = normalizeSocialUrl(typeof body.url === "string" ? body.url : "");
  if (!url) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  let sortOrder: number;
  if (typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)) {
    sortOrder = Math.round(body.sortOrder);
  } else {
    const max = (await prisma.socialLink.aggregate({ _max: { sortOrder: true } }))._max.sortOrder;
    sortOrder = (max ?? -1) + 1;
  }

  const link = await prisma.socialLink.create({
    data: { platform, url, sortOrder },
  });
  return NextResponse.json(link);
}
