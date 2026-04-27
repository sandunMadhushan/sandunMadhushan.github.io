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
import {
  parseProjectChallenges,
  parseProjectResolutions,
  parseProjectResults,
  validateProjectBody,
  type ProjectChallenge,
  type ProjectResolution,
  type ProjectResult,
} from "@/lib/project-validation";
import {
  DEFAULT_PROJECT_CATEGORIES,
  parseProjectCategories,
} from "@/lib/project-categories";
import { toast } from "sonner";

const ICONS = [
  "code",
  "web",
  "language",
  "smartphone",
  "phonelink",
  "psychology",
  "robot_2",
  "analytics",
  "insights",
  "cloud",
  "data_object",
  "description",
];

function challengesFromDb(p?: Project): ProjectChallenge[] {
  const r = parseProjectChallenges(p?.challenges ?? undefined);
  return r.ok ? r.value : [];
}

function resultsFromDb(p?: Project): ProjectResult[] {
  const r = parseProjectResults(p?.results ?? undefined);
  return r.ok ? r.value : [];
}

function resolutionsFromDb(p?: Project): ProjectResolution[] {
  const raw = (p as unknown as { resolutions?: unknown } | undefined)?.resolutions;
  const r = parseProjectResolutions(raw ?? undefined);
  return r.ok ? r.value : [];
}

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const isEdit = Boolean(project);
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [content, setContent] = useState(project?.content ?? "");
  const [githubLink, setGithubLink] = useState(project?.githubLink ?? "");
  const [liveLink, setLiveLink] = useState(project?.liveLink ?? "");
  const [blogLink, setBlogLink] = useState(project?.blogLink ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [published, setPublished] = useState(project?.published ?? true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    () => parseProjectCategories(project?.category),
  );
  const [customCategory, setCustomCategory] = useState("");
  const [cardIcon, setCardIcon] = useState(project?.cardIcon ?? "code");
  const [technologies, setTechnologies] = useState((project?.technologies ?? []).join(", "));
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? "");
  const [heroImage, setHeroImage] = useState(project?.heroImage ?? "");
  const [galleryImages, setGalleryImages] = useState((project?.galleryImages ?? []).join("\n"));
  const [features, setFeatures] = useState((project?.features ?? []).join("\n"));
  const [challenges, setChallenges] = useState<ProjectChallenge[]>(() => challengesFromDb(project));
  const [resolutions, setResolutions] = useState<ProjectResolution[]>(() => resolutionsFromDb(project));
  const [results, setResults] = useState<ProjectResult[]>(() => resultsFromDb(project));
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
      blogLink: blogLink || null,
      featured,
      categories: selectedCategories,
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
      challenges,
      resolutions,
      results,
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
    <div className="max-w-6xl px-4 py-8 sm:px-6 md:px-12 md:py-12">
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
            {isEdit ? "Edit Project" : "New Project"}
          </h2>
          <p className="font-medium text-on-surface-variant">Refine metadata and case study content.</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
          {isEdit && (
            <Button type="button" variant="destructive" className="w-full gap-2 sm:w-auto" onClick={() => setDeleteOpen(true)}>
              <MIcon name="delete" className="text-[20px]" />
              Delete
            </Button>
          )}
          <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => router.push("/admin/projects")}>
            Cancel
          </Button>
          <Button type="button" className="w-full sm:w-auto" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="space-y-6 rounded-xl bg-surface-container-low p-5 sm:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                  Categories
                </label>
                <p className="text-[11px] text-on-surface-variant">
                  Select one or more categories. Add new ones if needed.
                </p>
                <div className="flex flex-wrap gap-2 rounded-md border border-outline-variant/20 bg-surface-container-lowest p-3">
                  {Array.from(
                    new Set([...DEFAULT_PROJECT_CATEGORIES, ...selectedCategories]),
                  ).map((c) => {
                    const active = selectedCategories.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          setSelectedCategories((prev) => {
                            if (prev.includes(c)) {
                              const next = prev.filter((x) => x !== c);
                              return next.length > 0 ? next : ["Web"];
                            }
                            return [...prev, c];
                          })
                        }
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                          active
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-outline-variant/25 text-on-surface-variant hover:border-primary/50"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Add custom category"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      const next = customCategory.trim();
                      if (!next) return;
                      setSelectedCategories((prev) =>
                        prev.includes(next) ? prev : [...prev, next],
                      );
                      setCustomCategory("");
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Card icon (Material)
                </label>
                <div className="grid grid-cols-3 gap-2 rounded-md border border-outline-variant/20 bg-surface-container-lowest p-3">
                  {ICONS.map((c) => {
                    const active = cardIcon === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        title={c}
                        onClick={() => setCardIcon(c)}
                        className={`flex flex-col items-center gap-1 rounded-md border px-2 py-2 text-xs transition-colors ${
                          active
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-outline-variant/25 text-on-surface-variant hover:border-primary/50"
                        }`}
                      >
                        <MIcon name={c} className="text-xl" />
                        <span className="truncate">{c}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-surface-container-low p-5 sm:p-8">
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

          <section className="space-y-6 rounded-xl bg-surface-container-low p-5 sm:p-8">
            <div>
              <h3 className="text-sm font-semibold text-on-surface">The Friction</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-on-surface-variant">
                Public case study: left column under “The Friction”.
              </p>
            </div>
            {challenges.length === 0 ? (
              <p className="text-sm text-on-surface-variant">No challenge cards — that section stays hidden on the site.</p>
            ) : (
              <div className="space-y-4">
                {challenges.map((c, i) => (
                  <div
                    key={i}
                    className="space-y-3 rounded-lg border border-outline-variant/15 bg-surface-container-lowest p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Challenge {i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChallenges((prev) => prev.filter((_, j) => j !== i))}
                        className="text-[11px] font-semibold text-error hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <Input
                      value={c.title}
                      onChange={(e) =>
                        setChallenges((prev) =>
                          prev.map((row, j) => (j === i ? { ...row, title: e.target.value } : row)),
                        )
                      }
                      placeholder="Title (e.g. Compliance)"
                    />
                    <Textarea
                      value={c.description}
                      onChange={(e) =>
                        setChallenges((prev) =>
                          prev.map((row, j) => (j === i ? { ...row, description: e.target.value } : row)),
                        )
                      }
                      placeholder="Description"
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setChallenges((prev) => [...prev, { title: "", description: "" }])}
            >
              Add challenge
            </Button>
          </section>

          <section className="space-y-6 rounded-xl bg-surface-container-low p-5 sm:p-8">
            <div>
              <h3 className="text-sm font-semibold text-on-surface">The Resolution</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-on-surface-variant">
                Public case study: right column under “The Resolution”.
              </p>
            </div>
            {resolutions.length === 0 ? (
              <p className="text-sm text-on-surface-variant">No resolution cards — that section stays hidden on the site.</p>
            ) : (
              <div className="space-y-4">
                {resolutions.map((r, i) => (
                  <div
                    key={i}
                    className="space-y-3 rounded-lg border border-outline-variant/15 bg-surface-container-lowest p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Resolution {i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setResolutions((prev) => prev.filter((_, j) => j !== i))}
                        className="text-[11px] font-semibold text-error hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <Input
                      value={r.title}
                      onChange={(e) =>
                        setResolutions((prev) =>
                          prev.map((row, j) => (j === i ? { ...row, title: e.target.value } : row)),
                        )
                      }
                      placeholder="Title (e.g. Feature focus)"
                    />
                    <Textarea
                      value={r.description}
                      onChange={(e) =>
                        setResolutions((prev) =>
                          prev.map((row, j) => (j === i ? { ...row, description: e.target.value } : row)),
                        )
                      }
                      placeholder="Description"
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setResolutions((prev) => [...prev, { title: "", description: "" }])}
            >
              Add resolution
            </Button>
          </section>

          <section className="space-y-6 rounded-xl bg-surface-container-low p-5 sm:p-8">
            <div>
              <h3 className="text-sm font-semibold text-on-surface">Impact Driven banner</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-on-surface-variant">
                Big numbers on the purple banner (e.g. value <strong className="text-on-surface">12</strong>, label{" "}
                <strong className="text-on-surface">CLINICS ONBOARDED</strong>). Leave empty to hide the banner.
              </p>
            </div>
            {results.length === 0 ? (
              <p className="text-sm text-on-surface-variant">No metrics — banner stays hidden on the site.</p>
            ) : (
              <div className="space-y-4">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className="grid gap-3 rounded-lg border border-outline-variant/15 bg-surface-container-lowest p-4 sm:grid-cols-2"
                  >
                    <div className="sm:col-span-2 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Metric {i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setResults((prev) => prev.filter((_, j) => j !== i))}
                        className="text-[11px] font-semibold text-error hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <Input
                      value={r.value}
                      onChange={(e) =>
                        setResults((prev) =>
                          prev.map((row, j) => (j === i ? { ...row, value: e.target.value } : row)),
                        )
                      }
                      placeholder="Value (e.g. 12 or 3k+)"
                    />
                    <Input
                      value={r.label}
                      onChange={(e) =>
                        setResults((prev) =>
                          prev.map((row, j) => (j === i ? { ...row, label: e.target.value } : row)),
                        )
                      }
                      placeholder="Label (e.g. CLINICS ONBOARDED)"
                    />
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setResults((prev) => [...prev, { label: "", value: "" }])}
            >
              Add metric
            </Button>
          </section>

          <section className="grid grid-cols-1 gap-6 rounded-xl bg-surface-container-low p-5 sm:grid-cols-2 sm:p-8">
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
            <div className="space-y-2 sm:col-span-2">
              <label className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
                Blog post (optional)
              </label>
              <p className="text-[11px] leading-relaxed text-on-surface-variant">
                Shown on the public case study under the short description and in the sticky bar when set.
              </p>
              <div className="flex items-center border-b border-outline-variant/30 bg-surface-container-lowest px-3 py-1">
                <MIcon name="article" className="mr-3 text-on-surface-variant" />
                <Input
                  value={blogLink}
                  onChange={(e) => setBlogLink(e.target.value)}
                  placeholder="https://your-blog.com/post/…"
                  className="border-0 bg-transparent"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="space-y-4 rounded-xl bg-surface-container-low p-5 sm:p-8">
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

          <section className="space-y-4 rounded-xl bg-surface-container-low p-5 sm:p-8">
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

          <section className="space-y-4 rounded-xl bg-surface-container-low p-5 sm:p-8">
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

          <section className="space-y-4 rounded-xl bg-surface-container-low p-5 sm:p-8">
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

          <section className="space-y-4 rounded-xl bg-surface-container-low p-5 sm:p-8">
            <label className="block text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
              Features (one per line)
            </label>
            <p className="text-[11px] leading-relaxed text-on-surface-variant">
              Checklist under <strong className="text-on-surface">Highlights</strong>.
            </p>
            <Textarea value={features} onChange={(e) => setFeatures(e.target.value)} rows={5} />
          </section>

          <section className="space-y-6 rounded-xl bg-surface-container-low p-5 sm:p-8">
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
