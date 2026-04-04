import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { GithubImportPanel } from "@/components/admin/github-import-panel";
import { MIcon } from "@/components/m-icon";
import { fetchGithubReposForAdmin } from "@/lib/github-import";

export const dynamic = "force-dynamic";

export default async function AdminGithubImportPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/admin/login");

  const result = await fetchGithubReposForAdmin();
  const initialRepos = result.ok ? result.repos : [];
  const initialError = result.ok ? null : result.message;

  return (
    <>
      <AdminTopbar title="Import from GitHub" />
      <section className="mx-auto max-w-[1440px] p-6 md:p-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/admin/projects"
              className="mb-4 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-primary hover:underline"
            >
              <MIcon name="arrow_back" />
              Back to projects
            </Link>
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-primary">
              Management
            </span>
            <h1 className="text-3xl font-extrabold tracking-tighter text-on-surface md:text-4xl">
              Import from GitHub
            </h1>
            <p className="mt-3 max-w-2xl text-on-surface-variant">
              Pull repositories into your portfolio as new projects. Each import fills in title, description, tech tags,
              GitHub URL, optional homepage, and README-based body text.
            </p>
          </div>
        </div>
        <GithubImportPanel initialRepos={initialRepos} initialError={initialError} />
      </section>
    </>
  );
}
