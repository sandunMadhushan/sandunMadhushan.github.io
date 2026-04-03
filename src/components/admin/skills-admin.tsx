"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Skill } from "@prisma/client";
import { MIcon } from "@/components/m-icon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const CATS = ["Frontend", "Backend", "Languages", "Database", "Tools"];

export function SkillsAdmin({ skills }: { skills: Skill[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [description, setDescription] = useState("");
  const [proficiency, setProficiency] = useState(90);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, description, proficiency }),
    });
    setName("");
    setDescription("");
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete skill?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <div
            key={s.id}
            className="group relative overflow-hidden rounded-xl bg-surface-container-low p-8 transition-all hover:bg-surface-container-high"
          >
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface-container-high text-primary-fixed-dim">
                <MIcon name="architecture" className="text-3xl" />
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" onClick={() => remove(s.id)} className="p-2 text-on-surface-variant hover:text-error">
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

      <div className="mt-24 max-w-4xl">
        <div className="overflow-hidden rounded-2xl bg-surface-container-low shadow-2xl">
          <div className="p-12">
            <h2 className="mb-8 text-3xl font-bold text-[#e5e2e3]">Curate New Artifact</h2>
            <form onSubmit={add} className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div className="space-y-8">
                <div>
                  <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-primary">
                    Skill Name
                  </label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. GraphQL" />
                </div>
                <div>
                  <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-primary">
                    Category
                  </label>
                  <select
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
                  <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-primary">
                    Description
                  </label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
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
                <Button type="submit" className="w-full">
                  Save Artifact
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
