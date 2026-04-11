"use client";

import NextImage from "next/image";
import { isRemoteImageSrc } from "@/lib/image-url";
import { projectCardSrc } from "@/lib/project-media";
import { DEFAULT_PORTRAIT_SRC } from "@/lib/site-constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Project } from "@prisma/client";
import { MIcon } from "@/components/m-icon";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

type RowProps = {
  project: Project;
  index: number;
  rowCount: number;
  reordering: boolean;
  onSwap: (i: number, j: number) => void;
  onToggleFeatured: (p: Project) => void;
  onTogglePublished: (p: Project) => void;
  onRequestDelete: (id: string) => void;
};

function SortableProjectRow({
  project: p,
  index: i,
  rowCount,
  reordering,
  onSwap,
  onToggleFeatured,
  onTogglePublished,
  onRequestDelete,
}: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: p.id,
    disabled: reordering,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const thumb = projectCardSrc(p, DEFAULT_PORTRAIT_SRC);

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "group transition-colors hover:bg-surface-bright/30",
        isDragging && "relative z-10 opacity-60",
      )}
    >
      <td className="px-4 py-6 align-middle md:px-6">
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            className={cn(
              "touch-none rounded p-1 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
              reordering && "pointer-events-none opacity-40",
            )}
            aria-label={`Drag to reorder ${p.title}`}
            {...attributes}
            {...listeners}
          >
            <MIcon name="drag_indicator" className="text-xl" />
          </button>
          <div className="flex flex-col items-center gap-0.5">
            <button
              type="button"
              disabled={i === 0 || reordering}
              onClick={() => void onSwap(i, i - 1)}
              className="rounded p-1 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface disabled:opacity-25"
              aria-label={`Move ${p.title} up`}
            >
              <MIcon name="arrow_upward" className="text-lg" />
            </button>
            <button
              type="button"
              disabled={i === rowCount - 1 || reordering}
              onClick={() => void onSwap(i, i + 1)}
              className="rounded p-1 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface disabled:opacity-25"
              aria-label={`Move ${p.title} down`}
            >
              <MIcon name="arrow_downward" className="text-lg" />
            </button>
          </div>
        </div>
      </td>
      <td className="px-4 py-6 md:px-8">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-container-lowest md:h-12 md:w-12">
            <NextImage
              src={thumb}
              alt=""
              width={48}
              height={48}
              className="h-full w-full object-cover"
              unoptimized={isRemoteImageSrc(thumb)}
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-on-surface transition-colors group-hover:text-primary">{p.title}</div>
            <div className="text-[11px] text-on-surface-variant">{p.category}</div>
          </div>
        </div>
      </td>
      <td className="hidden py-6 align-top lg:table-cell lg:px-8">
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
      <td className="px-4 py-6 text-center align-middle md:px-6">
        <button
          type="button"
          onClick={() => void onTogglePublished(p)}
          className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
            p.published
              ? "bg-primary/15 text-primary hover:bg-primary/25"
              : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          {p.published ? "Published" : "Draft"}
        </button>
      </td>
      <td className="px-4 py-6 text-center align-middle md:px-6">
        <button
          type="button"
          title="Toggle featured"
          onClick={() => void onToggleFeatured(p)}
          className="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none"
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
      <td className="hidden py-6 align-middle md:table-cell md:px-8">
        <div className="text-xs font-medium text-on-surface-variant">{new Date(p.createdAt).toLocaleDateString()}</div>
      </td>
      <td className="px-4 py-6 text-right align-middle md:px-8">
        <div className="flex justify-end gap-3 opacity-100 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
          <Link href={`/admin/projects/edit/${p.id}`} className="text-on-surface-variant hover:text-primary">
            <MIcon name="edit" />
          </Link>
          <button
            type="button"
            onClick={() => onRequestDelete(p.id)}
            className="text-on-surface-variant hover:text-error"
            aria-label="Delete project"
          >
            <MIcon name="delete" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [items, setItems] = useState<Project[]>(() => sortProjects(projects));

  useEffect(() => {
    setItems(sortProjects(projects));
  }, [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const persistOrder = useCallback(async (ordered: Project[]) => {
    setReordering(true);
    const res = await fetch("/api/projects/reorder-sort", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: ordered.map((p) => p.id) }),
    });
    setReordering(false);
    if (!res.ok) {
      toast.error("Could not save project order");
      return false;
    }
    toast.success("Order updated");
    router.refresh();
    return true;
  }, [router]);

  async function swapRows(i: number, j: number) {
    const a = items[i];
    const b = items[j];
    if (!a || !b) return;
    setReordering(true);
    const res = await fetch("/api/projects/swap-sort", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aId: a.id, bId: b.id }),
    });
    setReordering(false);
    if (!res.ok) {
      toast.error("Could not reorder projects");
      return;
    }
    toast.success("Order updated");
    router.refresh();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((x) => x.id === active.id);
    const newIndex = items.findIndex((x) => x.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const previous = items;
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    const ok = await persistOrder(reordered);
    if (!ok) {
      setItems(previous);
    }
  }

  async function toggleFeatured(p: Project) {
    const res = await fetch(`/api/projects/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !p.featured }),
    });
    if (!res.ok) {
      toast.error("Could not update featured state");
      return;
    }
    toast.success(p.featured ? "Removed from featured" : "Marked as featured");
    router.refresh();
  }

  async function togglePublished(p: Project) {
    const res = await fetch(`/api/projects/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    });
    if (!res.ok) {
      toast.error("Could not update visibility");
      return;
    }
    toast.success(p.published ? "Moved to draft" : "Published on site");
    router.refresh();
  }

  async function executeDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);
    const res = await fetch(`/api/projects/${deleteId}`, { method: "DELETE" });
    setDeleteLoading(false);
    if (!res.ok) {
      toast.error("Could not delete project");
      return;
    }
    toast.success("Project deleted");
    setDeleteId(null);
    router.refresh();
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => void handleDragEnd(e)}>
      <div className="overflow-hidden rounded-xl bg-surface-container shadow-2xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-high/50">
              <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 md:px-6">
                Order
              </th>
              <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 md:px-8">
                Project Title
              </th>
              <th className="hidden px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 lg:table-cell lg:px-8">
                Technologies
              </th>
              <th className="px-4 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 md:px-6">
                Status
              </th>
              <th className="px-4 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 md:px-6">
                Featured
              </th>
              <th className="hidden px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 md:table-cell md:px-8">
                Created
              </th>
              <th className="px-4 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 md:px-8">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              {items.map((p, i) => (
                <SortableProjectRow
                  key={p.id}
                  project={p}
                  index={i}
                  rowCount={items.length}
                  reordering={reordering}
                  onSwap={swapRows}
                  onToggleFeatured={toggleFeatured}
                  onTogglePublished={togglePublished}
                  onRequestDelete={setDeleteId}
                />
              ))}
            </SortableContext>
          </tbody>
        </table>
        <div className="flex flex-col gap-1 bg-surface-container-high/20 px-6 py-6 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <span className="text-[11px] font-medium text-on-surface-variant/60">
            {projects.length} projects · {projects.filter((p) => p.published).length} published ·{" "}
            {projects.filter((p) => !p.published).length} drafts
          </span>
          <span className="text-[11px] text-on-surface-variant/50">
            Public order: lowest sort value first. Drag the handle or use arrows—values update automatically.
          </span>
        </div>

        <ConfirmDialog
          open={deleteId !== null}
          onOpenChange={(open) => {
            if (!open && !deleteLoading) setDeleteId(null);
          }}
          title="Delete this project?"
          description="The project and its case study will be removed from the site."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          destructive
          loading={deleteLoading}
          onConfirm={executeDelete}
        />
      </div>
    </DndContext>
  );
}
