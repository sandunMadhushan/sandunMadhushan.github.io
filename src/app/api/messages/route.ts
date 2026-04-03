import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, subject, message } = body;
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const row = await prisma.message.create({
    data: {
      name,
      email,
      subject: subject ?? null,
      message,
    },
  });
  return NextResponse.json(row);
}
