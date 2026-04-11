"use client";

import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { MIcon } from "@/components/m-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export type GithubRepoRow = {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  htmlUrl: string;
  description: string | null;
  fork: boolean;
  homepage: string | null;
  language: string | null;
  topics: string[];
  private: boolean;
  updatedAt: string;
  avatarUrl: string;
};

export function GithubImportPanel({
  initialRepos,
  initialError,
}: {
  initialRepos: GithubRepoRow[];
  initialError: string | null;
}) {
  const router = useRouter();
  const [repos, setRepos] = useState<GithubRepoRow[]>(initialRepos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [query, setQuery] = useState("");
  const [hideForks, setHideForks] = useState(true);
  const [visibility, setVisibility] = useState<"all" | "public" | "private">("all");
  const [importing, setImporting] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/github/repos");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Could not load repositories.");
      setRepos([]);
      setLoading(false);
      return;
    }
    setRepos(Array.isArray(data.repos) ? data.repos : []);
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return repos.filter((r) => {
      if (hideForks && r.fork) return false;
      if (visibility === "public" && r.private) return false;
      if (visibility === "private" && !r.private) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q)
      );
    });
  }, [repos, query, hideForks, visibility]);

  async function importRepo(r: GithubRepoRow) {
    setImporting(r.id);
    const res = await fetch("/api/admin/github/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner: r.owner, name: r.name }),
    });
    const data = await res.json().catch(() => ({}));
    setImporting(null);
    if (!res.ok) {
      toast.error(typeof data.error === "string" ? data.error : "Import failed.");
      return;
    }
    toast.success("Project imported");
    router.push(`/admin/projects/edit/${data.id}`);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-on-surface">Your GitHub repositories</h3>
          <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
            Repositories are listed using{" "}
            <code className="rounded bg-surface-container-highest px-1.5 py-0.5 font-mono text-xs">GITHUB_TOKEN</code>{" "}
            (recommended) or{" "}
            <code className="rounded bg-surface-container-highest px-1.5 py-0.5 font-mono text-xs">GITHUB_USERNAME</code>{" "}
            for public repos only. Import creates a draft project with README-based copy and a GitHub link; you can edit
            everything afterward.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => void load()} disabled={loading}>
          <MIcon name="refresh" className="mr-2" />
          Refresh
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="relative min-w-0 flex-1">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name or description..."
            className="pl-10"
            aria-label="Filter repositories by name or description"
          />
        </div>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Visibility</span>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as "all" | "public" | "private")}
              aria-label="Filter by repository visibility"
              className="min-w-40 rounded-md border-0 border-b border-outline-variant/30 bg-surface-container-lowest py-2.5 pl-1 pr-8 text-sm text-on-surface"
            >
              <option value="all">All repositories</option>
              <option value="public">Public only</option>
              <option value="private">Private only</option>
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-2 pb-1 text-sm text-on-surface-variant sm:pb-0">
            <input
              type="checkbox"
              checked={hideForks}
              onChange={(e) => setHideForks(e.target.checked)}
              className="rounded border-outline-variant"
            />
            Hide forks
          </label>
        </div>
      </div>

      {loading && (
        <p className="py-12 text-center text-sm text-on-surface-variant">Loading repositories…</p>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-error/30 bg-error/10 p-4 text-sm text-on-surface">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-on-surface-variant">
          No repositories match your filters.
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                <th className="py-3 pr-4">Repository</th>
                <th className="py-3 pr-4">Info</th>
                <th className="py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-outline-variant/10 last:border-0">
                  <td className="py-4 pr-4 align-top">
                    <div className="flex items-start gap-3">
                      <NextImage
                        src={r.avatarUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="mt-0.5 h-10 w-10 rounded-lg bg-surface-container-highest object-cover"
                      />
                      <div>
                        <a
                          href={r.htmlUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-on-surface hover:text-primary hover:underline"
                        >
                          {r.fullName}
                        </a>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {r.fork && (
                            <span className="rounded bg-surface-container-highest px-2 py-0.5 text-[10px] font-bold uppercase text-on-surface-variant">
                              Fork
                            </span>
                          )}
                          {r.private && (
                            <span className="rounded bg-surface-container-highest px-2 py-0.5 text-[10px] font-bold uppercase text-on-surface-variant">
                              Private
                            </span>
                          )}
                          {r.language && (
                            <span className="text-xs text-on-surface-variant/80">{r.language}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-md py-4 pr-4 align-top text-on-surface-variant">
                    <p className="line-clamp-2">{r.description ?? "—"}</p>
                    {r.topics.length > 0 && (
                      <p className="mt-2 text-xs text-on-surface-variant/60">{r.topics.slice(0, 5).join(" · ")}</p>
                    )}
                  </td>
                  <td className="py-4 align-top text-right">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void importRepo(r)}
                      disabled={importing !== null}
                    >
                      {importing === r.id ? (
                        "Importing…"
                      ) : (
                        <>
                          <MIcon name="download" className="mr-1.5" />
                          Import
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-on-surface-variant/60">
        After import, projects appear on{" "}
        <Link href="/projects" className="text-primary hover:underline">
          Selected Works
        </Link>{" "}
        like any other entry.
      </p>
    </div>
  );
}
