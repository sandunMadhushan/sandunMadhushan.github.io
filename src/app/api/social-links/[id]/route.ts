import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { isSocialPlatformId, normalizeSocialUrl } from "@/lib/social-platforms";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const { id } = await ctx.params;
  const body = await req.json();

  const data: { platform?: string; url?: string; sortOrder?: number } = {};

  if (body.platform !== undefined) {
    const platform = String(body.platform).trim().toLowerCase();
    if (!isSocialPlatformId(platform)) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }
    data.platform = platform;
  }
  if (body.url !== undefined) {
    const url = normalizeSocialUrl(String(body.url));
    if (!url) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }
    data.url = url;
  }
  if (body.sortOrder !== undefined) {
    const n = Number(body.sortOrder);
    if (!Number.isFinite(n)) {
      return NextResponse.json({ error: "Invalid sort order" }, { status: 400 });
    }
    data.sortOrder = Math.round(n);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No changes" }, { status: 400 });
  }

  try {
    const link = await prisma.socialLink.update({
      where: { id },
      data,
    });
    return NextResponse.json(link);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const { id } = await ctx.params;
  try {
    await prisma.socialLink.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
