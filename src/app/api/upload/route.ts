import { put } from "@vercel/blob";
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

  const ext = path.extname(file.name || "") || ".webp";
  const safeExt = ext.length <= 8 && /^\.[a-z0-9]+$/i.test(ext) ? ext : ".bin";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${safeExt}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(name, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return NextResponse.json({ url: blob.url });
    } catch (e) {
      console.error("[upload] Vercel Blob failed:", e);
      return NextResponse.json(
        { error: "Upload storage failed. Check BLOB_READ_WRITE_TOKEN in project env." },
        { status: 500 },
      );
    }
  }

  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "File upload on this host needs Vercel Blob. In the Vercel dashboard: Storage → Blob → create store → link BLOB_READ_WRITE_TOKEN to the project and redeploy. You can also paste image URLs instead (e.g. Google Drive file share links, one per line).",
      },
      { status: 503 },
    );
  }

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const fsPath = path.join(dir, name);
    await writeFile(fsPath, buf);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (e) {
    console.error("[upload] Local write failed:", e);
    return NextResponse.json({ error: "Could not save file to disk." }, { status: 500 });
  }
}
