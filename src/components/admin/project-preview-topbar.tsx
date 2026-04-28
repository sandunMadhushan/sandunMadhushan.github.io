"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MIcon } from "@/components/m-icon";
import { cn } from "@/lib/utils";

export function ProjectPreviewTopbar({
  projectId,
  projectTitle,
  published,
}: {
  projectId: string;
  projectTitle: string;
  published: boolean;
}) {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);

  const statusLabel = useMemo(() => (published ? "Published" : "Draft"), [published]);

  async function publish() {
    setPublishing(true);
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: true }),
    });
    setPublishing(false);

    if (!res.ok) {
      toast.error("Could not publish project");
      return;
    }
    toast.success("Published on site");
    router.refresh();
  }

  return (
    <div className="sticky top-0 z-40 border-b border-outline-variant/15 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-12">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-bright"
              title="Back to projects"
            >
              <MIcon name="arrow_back" />
              Back
            </Link>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]",
                published
                  ? "bg-primary/15 text-primary"
                  : "bg-surface-container-highest text-on-surface-variant",
              )}
            >
              {statusLabel}
            </span>
          </div>
          <div className="mt-2 truncate text-lg font-extrabold tracking-tight text-on-surface">{projectTitle}</div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!published ? (
            <button
              type="button"
              onClick={() => void publish()}
              disabled={publishing}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary-container shadow-[0_0_12px_rgba(79,70,229,0.25)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              title="Publish project"
            >
              <MIcon name={publishing ? "progress_activity" : "publish"} />
              {publishing ? "Publishing..." : "Publish"}
            </button>
          ) : null}

          <Link
            href={`/admin/projects/edit/${projectId}`}
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/25 bg-surface-container-high px-5 py-2.5 text-sm font-semibold text-on-surface transition-all hover:bg-surface-bright"
            title="Edit project"
          >
            <MIcon name="edit" />
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

