"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project } from "@prisma/client";
import { MIcon } from "@/components/m-icon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { AdminFieldLabel } from "@/components/admin/field-label";
import { validateProjectBody } from "@/lib/project-validation";
import { toast } from "sonner";

const CATEGORIES = ["Web", "Mobile", "AI"];
const ICONS = ["code", "smartphone", "psychology", "analytics", "restaurant", "calendar_month", "description"];

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const isEdit = Boolean(project);
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [content, setContent] = useState(project?.content ?? "");
  const [githubLink, setGithubLink] = useState(project?.githubLink ?? "");
  const [liveLink, setLiveLink] = useState(project?.liveLink ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [published, setPublished] = useState(project?.published ?? true);
  const [category, setCategory] = useState(project?.category ?? "Web");
  const [cardIcon, setCardIcon] = useState(project?.cardIcon ?? "code");
  const [technologies, setTechnologies] = useState((project?.technologies ?? []).join(", "));
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? "");
  const [heroImage, setHeroImage] = useState(project?.heroImage ?? "");
  const [galleryImages, setGalleryImages] = useState((project?.galleryImages ?? []).join("\n"));
  const [features, setFeatures] = useState((project?.features ?? []).join("\n"));
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function uploadFile(file: File, onUrl: (url: string) => void) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(typeof data.error === "string" ? data.error : "Upload failed");
      return;
    }
    if (data.url) {
      onUrl(data.url);
      toast.success("Image uploaded");
    } else toast.error("Upload failed");
  }

  async function save() {
    const payload = {
      title,
      slug: slug.trim(),
      description,
      content,
      githubLink: githubLink || null,
      liveLink: liveLink || null,
      featured,
      category,
      cardIcon,
      technologies: technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      coverImage: coverImage.trim() || null,
      heroImage: heroImage.trim() || null,
      galleryImages: galleryImages
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
      features: features
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
      published,
      ...(isEdit && project ? { sortOrder: project.sortOrder } : {}),
    };
    const v = validateProjectBody(payload);
    if (!v.ok) {
      toast.error(v.error);
      return;
    }
    setSaving(true);
    const url = isEdit ? `/api/projects/${project!.id}` : "/api/projects";
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v.data),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Could not save project");
      return;
    }
    toast.success(isEdit ? "Project saved" : "Project created");
    router.push("/admin/projects");
  }

  async function executeDelete() {
    if (!project) return;
    setDeleteLoading(true);
    const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    setDeleteLoading(false);
    if (!res.ok) {
      toast.error("Could not delete project");
      return;
    }
    toast.success("Project deleted");
    setDeleteOpen(false);
    router.push("/admin/projects");
  }

  return (
    <div className="max-w-6xl px-6 py-12 md:px-12">
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="mb-2 text-4xl font-bold tracking-tight text-on-surface">
            {isEdit ? "Edit Project" : "New Project"}
          </h2>
          <p className="font-medium text-on-surface-variant">Refine metadata and case study content.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isEdit && (
            <Button type="button" variant="destructive" className="gap-2" onClick={() => setDeleteOpen(true)}>
              <MIcon name="delete" className="text-[20px]" />
              Delete
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={() => router.push("/admin/projects")}>
            Cancel
          </Button>
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="space-y-6 rounded-xl bg-surface-container-low p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2 sm:col-span-1">
                <AdminFieldLabel
                  htmlFor="project-title"
                  required
                  className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant"
                >
                  Project Title
                </AdminFieldLabel>
                <Input
                  id="project-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  autoComplete="off"
                  aria-required
                />
              </div>
              <div className="col-span-2 space-y-2 sm:col-span-1">
                <AdminFieldLabel
                  htmlFor="project-slug"
                  required
                  className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant"
                >
                  URL Slug
                </AdminFieldLabel>
                <div className="flex items-center text-sm text-on-surface-variant/40">
                  <span className="mr-2">/projects/</span>
                  <Input
                    id="project-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="my-project"
                    autoComplete="off"
                    aria-required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <AdminFieldLabel
                htmlFor="project-description"
                required
                className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant"
              >
                Short Description
              </AdminFieldLabel>
              <Textarea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                aria-required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border-0 border-b border-outline-variant/30 bg-surface-container-lowest py-3 text-on-surface"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Card icon (Material)
                </label>
                <select
                  value={cardIcon}
                  onChange={(e) => setCardIcon(e.target.value)}
                  className="w-full rounded-md border-0 border-b border-outline-variant/30 bg-surface-container-lowest py-3 text-on-surface"
                >
                  {ICONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-surface-container-low p-8">
            <AdminFieldLabel
              htmlFor="project-content"
              required
              className="mb-6 block text-[12px] font-bold uppercase tracking-widest text-on-surface-variant"
            >
              Full Case Study Content
            </AdminFieldLabel>
            <Textarea
              id="project-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              className="min-h-[320px]"
              aria-required
            />
          </section>

          <section className="grid grid-cols-2 gap-6 rounded-xl bg-surface-container-low p-8">
            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
                GitHub Repository
              </label>
              <div className="flex items-center border-b border-outline-variant/30 bg-surface-container-lowest px-3 py-1">
                <MIcon name="code" className="mr-3 text-on-surface-variant" />
                <Input value={githubLink} onChange={(e) => setGithubLink(e.target.value)} placeholder="https://github.com/..." className="border-0 bg-transparent" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
                Live Demo Link
              </label>
              <div className="flex items-center border-b border-outline-variant/30 bg-surface-container-lowest px-3 py-1">
                <MIcon name="language" className="mr-3 text-on-surface-variant" />
                <Input value={liveLink} onChange={(e) => setLiveLink(e.target.value)} placeholder="https://..." className="border-0 bg-transparent" />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="space-y-4 rounded-xl bg-surface-container-low p-8">
            <AdminFieldLabel
              htmlFor="project-cover-image"
              className="block text-[12px] font-bold uppercase tracking-widest text-on-surface-variant"
            >
              Cover image
            </AdminFieldLabel>
            <p className="text-[11px] leading-relaxed text-on-surface-variant">
              Shown on project cards, the /projects grid, and the home “Featured” strip. Square or 4:3 thumbnails work well.
            </p>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-outline-variant/20 bg-surface-container-highest py-6 hover:border-primary/50">
              <MIcon name="cloud_upload" className="mb-1 text-3xl text-on-surface-variant" />
              <span className="text-xs text-on-surface-variant">Upload cover</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f, setCoverImage);
                }}
              />
            </label>
            <Input
              id="project-cover-image"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://… or /uploads/…"
              autoComplete="off"
            />
          </section>

          <section className="space-y-4 rounded-xl bg-surface-container-low p-8">
            <AdminFieldLabel
              htmlFor="project-hero-image"
              className="block text-[12px] font-bold uppercase tracking-widest text-on-surface-variant"
            >
              Hero image
            </AdminFieldLabel>
            <p className="text-[11px] leading-relaxed text-on-surface-variant">
              Large banner on the public case-study page. If empty, the cover image is used. Fills the frame edge-to-edge (may crop slightly if the aspect ratio differs).
            </p>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-outline-variant/20 bg-surface-container-highest py-6 hover:border-primary/50">
              <MIcon name="cloud_upload" className="mb-1 text-3xl text-on-surface-variant" />
              <span className="text-xs text-on-surface-variant">Upload hero</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f, setHeroImage);
                }}
              />
            </label>
            <Input
              id="project-hero-image"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              placeholder="https://… or /uploads/…"
              autoComplete="off"
            />
          </section>

          <section className="space-y-4 rounded-xl bg-surface-container-low p-8">
            <AdminFieldLabel
              htmlFor="project-gallery-images"
              className="block text-[12px] font-bold uppercase tracking-widest text-on-surface-variant"
            >
              Gallery (artifacts)
            </AdminFieldLabel>
            <p className="text-[11px] leading-relaxed text-on-surface-variant">
              Optional extra shots under <strong className="text-on-surface">Project Artifacts</strong> on the case-study page.
              One URL per line. You need at least a cover, a hero, or one gallery URL overall.
            </p>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-outline-variant/20 bg-surface-container-highest py-6 hover:border-primary/50">
              <MIcon name="cloud_upload" className="mb-1 text-3xl text-on-surface-variant" />
              <span className="text-xs text-on-surface-variant">Append upload to gallery</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f)
                    uploadFile(f, (url) => {
                      const list = galleryImages.split("\n").filter(Boolean);
                      list.push(url);
                      setGalleryImages(list.join("\n"));
                    });
                }}
              />
            </label>
            <Textarea
              id="project-gallery-images"
              value={galleryImages}
              onChange={(e) => setGalleryImages(e.target.value)}
              rows={5}
              placeholder={"One URL per line. Google Drive: file share links only (not folders)."}
            />
          </section>

          <section className="space-y-4 rounded-xl bg-surface-container-low p-8">
            <AdminFieldLabel
              htmlFor="project-technologies"
              required
              className="block text-[12px] font-bold uppercase tracking-widest text-on-surface-variant"
            >
              Technologies (comma separated)
            </AdminFieldLabel>
            <Input
              id="project-technologies"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="React, TypeScript, Node.js"
              aria-required
            />
          </section>

          <section className="space-y-4 rounded-xl bg-surface-container-low p-8">
            <label className="block text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
              Features (one per line)
            </label>
            <Textarea value={features} onChange={(e) => setFeatures(e.target.value)} rows={5} />
          </section>

          <section className="space-y-6 rounded-xl bg-surface-container-low p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-on-surface">Published on site</h3>
                <p className="text-[11px] text-on-surface-variant">
                  Drafts are hidden from /projects, the home page, and sitemap. You can still edit them here.
                </p>
              </div>
              <Switch checked={published} onCheckedChange={setPublished} />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-outline-variant/10 pt-6">
              <div>
                <h3 className="text-sm font-semibold text-on-surface">Featured project</h3>
                <p className="text-[11px] text-on-surface-variant">Spotlight on the projects page (when published).</p>
              </div>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </div>
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!open && !deleteLoading) setDeleteOpen(false);
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
  );
}
