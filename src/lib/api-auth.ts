import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) as const };
  }
  return { session };
}
