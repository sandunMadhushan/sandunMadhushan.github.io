import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { fetchGithubRepoMetadataForRefresh } from "@/lib/github-import";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const githubLink =
    typeof body === "object" && body && "githubLink" in body
      ? String((body as { githubLink: unknown }).githubLink ?? "").trim()
      : "";

  if (!githubLink) {
    return NextResponse.json({ error: "Add a GitHub Repository link first." }, { status: 400 });
  }

  const result = await fetchGithubRepoMetadataForRefresh(githubLink);
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
  return NextResponse.json({ meta: result.meta });
}
