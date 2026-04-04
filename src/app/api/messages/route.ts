import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { sendContactInboxEmail } from "@/lib/contact-email";
import { validateContactMessage } from "@/lib/contact-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isDatabaseUnavailable(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return ["P1001", "P1002", "P1017"].includes(error.code);
  }
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientRustPanicError) return true;
  return false;
}

export async function GET() {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(messages);
  } catch (e) {
    console.error("[GET /api/messages]", e);
    return NextResponse.json({ error: "Could not load messages." }, { status: 503 });
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const v = validateContactMessage(body);
  if (!v.ok) {
    return NextResponse.json({ error: v.error }, { status: 400 });
  }

  try {
    const row = await prisma.message.create({
      data: {
        name: v.data.name,
        email: v.data.email,
        subject: v.data.subject,
        message: v.data.message,
      },
    });

    const emailResult = await sendContactInboxEmail(row);
    if (!emailResult.ok) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[POST /api/messages] Inbox email skipped or failed:", emailResult.error);
      } else {
        console.error("[POST /api/messages] Inbox email:", emailResult.error);
      }
    }

    return NextResponse.json(row);
  } catch (e) {
    console.error("[POST /api/messages]", e);
    if (isDatabaseUnavailable(e)) {
      return NextResponse.json(
        {
          error:
            "Message could not be saved right now. Please try again later or email me directly.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "Could not save your message. Please try again or use email." },
      { status: 500 },
    );
  }
}
