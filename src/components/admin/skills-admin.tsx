"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Skill } from "@prisma/client";
import { MIcon } from "@/components/m-icon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { AdminFieldLabel } from "@/components/admin/field-label";
import { SKILL_ICON_CHOICES, SkillTechIcon } from "@/components/skill-tech-icon";
import { resolveSkillDescription, sortSkillsLikeWebsite } from "@/lib/skill-auto";
import { toast } from "sonner";

const CATS = [
  "Frontend",
  "Backend",
  "Languages",
  "Database",
  "Mobile",
  "Tools",
  "Deployment",
];

const SKILL_OPTIONS_BY_CATEGORY: Record<string, string[]> = {
  Frontend: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "JavaScript", "TypeScript", "Vue.js", "Angular"],
  Backend: ["Node.js", "Express", "NestJS", "Flask", "Django", "Spring Boot", "GraphQL", "PHP", "Laravel"],
  Languages: ["JavaScript", "TypeScript", "Python", "Java", "Go", "C++", "PHP", "Rust", "Kotlin"],
  Database: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma", "Supabase"],
  Mobile: ["React Native", "Android", "Kotlin", "Firebase"],
  Tools: ["Git", "GitHub", "VS Code", "Figma", "Postman", "Docker", "Linux", "Vite", "Webpack"],
  Deployment: ["AWS", "Microsoft Azure", "Vercel", "Netlify", "Render", "Railway", "Cloudflare"],
};

/** Mirrors the public skills page groupings and order. */
const DASHBOARD_SECTIONS: { title: string; subtitle: string; categories: string[] }[] = [
  {
    title: "01 · Frontend & Languages",
    subtitle: "Presentation layer",
    categories: ["Frontend", "Languages"],
  },
  { title: "02 · Backend Core", subtitle: "Logic", categories: ["Backend"] },
  { title: "03 · Native & Mobile", subtitle: "Platforms & devices", categories: ["Mobile"] },
  { title: "04 · Database Systems", subtitle: "Persistence", categories: ["Database"] },
  { title: "05 · Digital Workbench", subtitle: "Infrastructure & workflow", categories: ["Tools"] },
  { title: "06 · Deployment Platforms", subtitle: "Hosting & cloud delivery", categories: ["Deployment"] },
];

function emptyForm() {
  const firstCategory = "Frontend";
  return {
    name: SKILL_OPTIONS_BY_CATEGORY[firstCategory][0] ?? "",
    category: firstCategory,
    description: "",
    icon: "",
    proficiency: 90,
  };
}

function SkillCard({
  s,
  editingId,
  onEdit,
  onDelete,
}: {
  s: Skill;
  editingId: string | null;
  onEdit: (s: Skill) => void;
  onDelete: (id: string) => void;
}) {
  const blurb = resolveSkillDescription(s.description, s.name, s.icon);

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-low p-6 transition-all hover:border-primary-container/30 hover:bg-surface-container-high ${
        editingId === s.id ? "ring-2 ring-primary-container ring-offset-2 ring-offset-surface" : ""
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
          <SkillTechIcon name={s.name} iconKey={s.icon} size={28} />
        </div>
        <div className="flex gap-0.5">
          <button
            type="button"
            onClick={() => onEdit(s)}
            className="p-2 text-on-surface-variant hover:text-primary"
            title="Edit skill"
          >
            <MIcon name="edit" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(s.id)}
            className="p-2 text-on-surface-variant hover:text-error"
            title="Delete skill"
          >
            <MIcon name="delete" />
          </button>
        </div>
      </div>
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
        {s.category}
      </span>
      <h3 className="mb-2 text-lg font-bold leading-tight text-on-surface">{s.name}</h3>
      <p className="text-sm leading-relaxed text-on-surface-variant">{blurb}</p>
    </div>
  );
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

  const sortedSkills = useMemo(() => sortSkillsLikeWebsite(skills), [skills]);

  const autoPreview = useMemo(
    () =>
      resolveSkillDescription(
        description.trim() ? description : null,
        name.trim() || "Skill name",
        icon || null,
      ),
    [description, name, icon],
  );
  const skillOptions = useMemo(() => SKILL_OPTIONS_BY_CATEGORY[category] ?? [], [category]);

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
    const payload = {
      name,
      category,
      description: description.trim() || null,
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
            Curate categories and proficiency. Layout matches the public skills page. Leave the description empty
            to use auto-generated text from the skill name and icon (like auto icons).
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
                  <select
                    id="skill-name"
                    title="Skill name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-0 border-b border-outline-variant/30 bg-surface-container-lowest py-4 text-on-surface"
                    aria-required
                  >
                    {skillOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                    {editingId && name && !skillOptions.includes(name) && <option value={name}>{name} (current)</option>}
                  </select>
                </div>
                <div>
                  <label htmlFor="skill-category" className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-primary">
                    Category
                  </label>
                  <select
                    id="skill-category"
                    title="Skill category"
                    value={category}
                    onChange={(e) => {
                      const nextCategory = e.target.value;
                      setCategory(nextCategory);
                      const nextOptions = SKILL_OPTIONS_BY_CATEGORY[nextCategory] ?? [];
                      if (!nextOptions.includes(name)) {
                        setName(nextOptions[0] ?? "");
                      }
                    }}
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
                    title="Skill icon"
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
                    className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-primary"
                  >
                    Description
                  </AdminFieldLabel>
                  <p className="mb-2 text-xs text-on-surface-variant/80">
                    Optional. If left blank, a short line is generated from the name and icon (see preview below).
                  </p>
                  <Textarea
                    id="skill-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Custom copy, or leave empty for auto-generated text"
                  />
                  <p className="mt-2 rounded-lg bg-surface-container-highest/80 px-3 py-2 text-xs leading-relaxed text-on-surface-variant">
                    <span className="font-semibold text-primary">Preview:</span> {autoPreview}
                  </p>
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

      <div className="space-y-12">
        {DASHBOARD_SECTIONS.map((section) => {
          const inSection = sortedSkills.filter((s) => section.categories.includes(s.category));
          return (
            <section key={section.title} className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/50 p-6 md:p-8">
              <div className="mb-6 border-b border-outline-variant/15 pb-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{section.subtitle}</p>
                <h3 className="text-xl font-bold tracking-tight text-[#e5e2e3] md:text-2xl">{section.title}</h3>
              </div>
              {inSection.length === 0 ? (
                <p className="text-sm text-on-surface-variant/70">No skills in this section yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {inSection.map((s) => (
                    <SkillCard
                      key={s.id}
                      s={s}
                      editingId={editingId}
                      onEdit={startEdit}
                      onDelete={setDeleteId}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
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
