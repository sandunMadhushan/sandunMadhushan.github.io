"use client";

import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@prisma/client";
import { MIcon } from "@/components/m-icon";

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();

  async function toggleFeatured(p: Project) {
    await fetch(`/api/projects/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !p.featured }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-xl bg-surface-container shadow-2xl">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-surface-container-high/50">
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">
              Project Title
            </th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">
              Technologies
            </th>
            <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">
              Featured
            </th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">
              Created Date
            </th>
            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {projects.map((p) => (
            <tr key={p.id} className="group transition-colors hover:bg-surface-bright/30">
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-surface-container-lowest">
                    {p.images[0] && (
                      <NextImage
                        src={p.images[0]}
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                        unoptimized={p.images[0].startsWith("http")}
                      />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-on-surface transition-colors group-hover:text-primary">
                      {p.title}
                    </div>
                    <div className="text-[11px] text-on-surface-variant">{p.category}</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex flex-wrap gap-2">
                  {p.technologies.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="rounded-sm bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-8 py-6 text-center">
                <button
                  type="button"
                  onClick={() => toggleFeatured(p)}
                  className="relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none"
                  aria-label="Toggle featured"
                >
                  <span
                    className={`absolute mx-auto h-3 w-8 rounded-full transition-colors ${
                      p.featured ? "bg-primary-container" : "bg-surface-container-highest"
                    }`}
                  />
                  <span
                    className={`absolute left-0 inline-block h-5 w-5 transform rounded-full border border-primary-container shadow ring-0 transition ${
                      p.featured ? "translate-x-3 bg-on-primary" : "translate-x-0 bg-on-surface-variant/40"
                    }`}
                  />
                </button>
              </td>
              <td className="px-8 py-6">
                <div className="text-xs font-medium text-on-surface-variant">
                  {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link href={`/admin/projects/edit/${p.id}`} className="text-on-surface-variant hover:text-primary">
                    <MIcon name="edit" />
                  </Link>
                  <button type="button" onClick={() => remove(p.id)} className="text-on-surface-variant hover:text-error">
                    <MIcon name="delete" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between bg-surface-container-high/20 px-8 py-6">
        <span className="text-[11px] font-medium text-on-surface-variant/60">
          Showing {projects.length} projects
        </span>
      </div>
    </div>
  );
}
