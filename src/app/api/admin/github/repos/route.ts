import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { fetchGithubReposForAdmin } from "@/lib/github-import";

export async function GET() {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;

  const result = await fetchGithubReposForAdmin();
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
  return NextResponse.json({ repos: result.repos });
}
