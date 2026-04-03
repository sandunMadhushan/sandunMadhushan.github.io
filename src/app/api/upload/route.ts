import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/api-auth";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file || !file.size) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".webp";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const fsPath = path.join(dir, name);
  await writeFile(fsPath, buf);
  const url = `/uploads/${name}`;
  return NextResponse.json({ url });
}
