import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { importGithubRepoAsProject } from "@/lib/github-import";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const owner = typeof body === "object" && body && "owner" in body ? String((body as { owner: unknown }).owner ?? "").trim() : "";
  const name =
    typeof body === "object" && body && "name" in body ? String((body as { name: unknown }).name ?? "").trim() : "";

  if (!owner || !name) {
    return NextResponse.json({ error: "Request must include owner and name (repository name)." }, { status: 400 });
  }

  const result = await importGithubRepoAsProject(owner, name);
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
  return NextResponse.json({ id: result.projectId, slug: result.slug });
}
