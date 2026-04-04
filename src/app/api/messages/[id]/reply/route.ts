import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { sendVisitorReplyEmail } from "@/lib/admin-reply-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

function defaultReplySubject(m: { subject: string | null }): string {
  const s = m.subject?.trim();
  return s ? `Re: ${s}` : "Re: Your portfolio message";
}

export async function POST(req: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const text = typeof o.text === "string" ? o.text.trim() : "";
  if (!text || text.length > 20_000) {
    return NextResponse.json(
      { error: "Reply text is required (max 20,000 characters)." },
      { status: 400 },
    );
  }

  const subjectRaw = typeof o.subject === "string" ? o.subject.trim() : "";
  const subjectLine = subjectRaw.slice(0, 300) || undefined;

  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  const finalSubject = subjectLine || defaultReplySubject(message);
  const result = await sendVisitorReplyEmail(message, text, finalSubject);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
