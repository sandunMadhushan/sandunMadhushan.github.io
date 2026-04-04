"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Skill } from "@prisma/client";
import { MIcon } from "@/components/m-icon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { AdminFieldLabel } from "@/components/admin/field-label";
import { SKILL_ICON_CHOICES, SkillTechIcon } from "@/components/skill-tech-icon";
import { toast } from "sonner";

const CATS = [
  "Frontend",
  "Backend",
  "Languages",
  "Database",
  "Mobile",
  "Tools",
];

function emptyForm() {
  return {
    name: "",
    category: "Frontend",
    description: "",
    icon: "",
    proficiency: 90,
  };
}

export function SkillsAdmin({ skills }: { skills: Skill[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [proficiency, setProficiency] = useState(90);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function resetForm() {
    const e = emptyForm();
    setName(e.name);
    setCategory(e.category);
    setDescription(e.description);
    setIcon(e.icon);
    setProficiency(e.proficiency);
    setEditingId(null);
  }

  function startEdit(s: Skill) {
    setEditingId(s.id);
    setName(s.name);
    setCategory(s.category);
    setDescription(s.description ?? "");
    setIcon(s.icon ?? "");
    setProficiency(s.proficiency ?? 90);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Skill name is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }
    const payload = {
      name,
      category,
      description,
      proficiency,
      icon: icon.trim() || null,
    };

    setSaving(true);
    const url = editingId ? `/api/skills/${editingId}` : "/api/skills";
    const res = await fetch(url, {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error(editingId ? "Could not update skill" : "Could not add skill");
      return;
    }
    toast.success(editingId ? "Skill updated" : "Skill added");
    resetForm();
    router.refresh();
  }

  async function executeDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);
    const res = await fetch(`/api/skills/${deleteId}`, { method: "DELETE" });
    setDeleteLoading(false);
    if (!res.ok) {
      toast.error("Could not delete skill");
      return;
    }
    toast.success("Skill deleted");
    if (deleteId === editingId) resetForm();
    setDeleteId(null);
    router.refresh();
  }

  return (
    <>
      <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-xl">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tighter text-[#e5e2e3]">The Skills Gallery</h2>
          <p className="text-lg leading-relaxed text-on-surface-variant">
            Curate categories and proficiency. Changes reflect immediately on the public skills page.
          </p>
        </div>
      </div>

      <div ref={formRef} className="mb-16 max-w-4xl scroll-mt-24">
        <div className="overflow-hidden rounded-2xl bg-surface-container-low shadow-2xl">
          <div className="p-12">
            <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <h2 className="text-3xl font-bold text-[#e5e2e3]">
                {editingId ? "Edit skill" : "Add or update a skill"}
              </h2>
              {editingId && (
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel edit
                </Button>
              )}
            </div>
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div className="space-y-8">
                <div>
                  <AdminFieldLabel
                    htmlFor="skill-name"
                    required
                    className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-primary"
                  >
                    Skill Name
                  </AdminFieldLabel>
                  <Input
                    id="skill-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. GraphQL"
                    aria-required
                  />
                </div>
                <div>
                  <label htmlFor="skill-category" className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-primary">
                    Category
                  </label>
                  <select
                    id="skill-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border-0 border-b border-outline-variant/30 bg-surface-container-lowest py-4 text-on-surface"
                  >
                    {CATS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <AdminFieldLabel
                    htmlFor="skill-icon"
                    className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-primary"
                  >
                    Tool icon
                  </AdminFieldLabel>
                  <select
                    id="skill-icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full border-0 border-b border-outline-variant/30 bg-surface-container-lowest py-4 text-on-surface"
                  >
                    <option value="">Auto (match name)</option>
                    {editingId &&
                      icon &&
                      !SKILL_ICON_CHOICES.some((o) => o.value === icon) && (
                        <option value={icon}>{icon} (current)</option>
                      )}
                    {SKILL_ICON_CHOICES.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <AdminFieldLabel
                    htmlFor="skill-description"
                    required
                    className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-primary"
                  >
                    Description
                  </AdminFieldLabel>
                  <Textarea
                    id="skill-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    aria-required
                  />
                </div>
                <div>
                  <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-primary">
                    Proficiency (0–100)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={proficiency}
                    onChange={(e) => setProficiency(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-end gap-4">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? "Saving…" : editingId ? "Update skill" : "Add skill"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <div
            key={s.id}
            className={`group relative overflow-hidden rounded-xl bg-surface-container-low p-8 transition-all hover:bg-surface-container-high ${
              editingId === s.id ? "ring-2 ring-primary-container ring-offset-2 ring-offset-surface" : ""
            }`}
          >
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                <SkillTechIcon name={s.name} iconKey={s.icon} size={32} />
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(s)}
                  className="p-2 text-on-surface-variant hover:text-primary"
                  title="Edit skill"
                >
                  <MIcon name="edit" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(s.id)}
                  className="p-2 text-on-surface-variant hover:text-error"
                  title="Delete skill"
                >
                  <MIcon name="delete" />
                </button>
              </div>
            </div>
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              {s.category}
            </span>
            <h3 className="mb-2 text-2xl font-bold text-on-surface">{s.name}</h3>
            <p className="text-sm leading-relaxed text-on-surface-variant">{s.description ?? "—"}</p>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open && !deleteLoading) setDeleteId(null);
        }}
        title="Delete this skill?"
        description="It will be removed from the public skills page."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        loading={deleteLoading}
        onConfirm={executeDelete}
      />
    </>
  );
}
