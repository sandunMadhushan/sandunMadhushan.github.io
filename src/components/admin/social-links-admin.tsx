"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SocialLink } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SOCIAL_PLATFORM_OPTIONS } from "@/lib/social-platforms";
import { SocialBrandGlyph } from "@/components/public/social-brand-glyph";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { AdminFieldLabel } from "@/components/admin/field-label";
import { toast } from "sonner";

export function SocialLinksAdmin({ links }: { links: SocialLink[] }) {
  const router = useRouter();
  const [platform, setPlatform] = useState<(typeof SOCIAL_PLATFORM_OPTIONS)[number]["id"]>("github");
  const [url, setUrl] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/social-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, url }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast.error(typeof j.error === "string" ? j.error : "Could not add link");
      return;
    }
    toast.success("Social link added");
    setUrl("");
    router.refresh();
  }

  async function updateRow(
    id: string,
    payload: { url?: string; platform?: string; sortOrder?: number },
  ): Promise<boolean> {
    const res = await fetch(`/api/social-links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast.error(typeof j.error === "string" ? j.error : "Save failed");
      return false;
    }
    toast.success("Changes saved");
    router.refresh();
    return true;
  }

  async function executeDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);
    const res = await fetch(`/api/social-links/${deleteId}`, { method: "DELETE" });
    setDeleteLoading(false);
    if (!res.ok) {
      toast.error("Could not remove link");
      return;
    }
    toast.success("Social link removed");
    setDeleteId(null);
    router.refresh();
  }

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h2 className="mb-2 text-3xl font-bold text-on-surface">Social links</h2>
        <p className="text-on-surface-variant">
          URLs shown in the site footer and on the contact page. Order is controlled by sort order (lower
          first).
        </p>
        <p className="mt-3 text-sm text-on-surface-variant/90">
          <span className="font-semibold text-on-surface">Saving:</span> edit platform, URL, or sort on a row,
          then click <span className="font-semibold text-primary">Save changes</span> for that row. The footer
          and contact page update after a successful save.
        </p>
      </div>

      <ul className="space-y-4">
        {links.map((row) => (
          <EditableSocialRow key={row.id} row={row} onSave={updateRow} onRequestRemove={() => setDeleteId(row.id)} />
        ))}
      </ul>

      <div className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-6">
        <h3 className="mb-4 text-lg font-semibold text-on-surface">Add link</h3>
        <form onSubmit={add} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="sm:w-44">
            <AdminFieldLabel
              htmlFor="social-add-platform"
              className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
            >
              Platform
            </AdminFieldLabel>
            <select
              id="social-add-platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as typeof platform)}
              className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-sm text-on-surface"
            >
              {SOCIAL_PLATFORM_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0 flex-1">
            <AdminFieldLabel
              htmlFor="social-add-url"
              required
              className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
            >
              URL
            </AdminFieldLabel>
            <Input
              id="social-add-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              required
              aria-required
            />
          </div>
          <Button type="submit">Add</Button>
        </form>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open && !deleteLoading) setDeleteId(null);
        }}
        title="Remove this social link?"
        description="It will no longer appear in the footer or on the contact page."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        destructive
        loading={deleteLoading}
        onConfirm={executeDelete}
      />
    </div>
  );
}

function EditableSocialRow({
  row,
  onSave,
  onRequestRemove,
}: {
  row: SocialLink;
  onSave: (id: string, payload: { url?: string; platform?: string; sortOrder?: number }) => Promise<boolean>;
  onRequestRemove: () => void;
}) {
  const [platformDraft, setPlatformDraft] = useState(row.platform);
  const [urlDraft, setUrlDraft] = useState(row.url);
  const [sortDraft, setSortDraft] = useState(String(row.sortOrder));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPlatformDraft(row.platform);
    setUrlDraft(row.url);
    setSortDraft(String(row.sortOrder));
  }, [row.id, row.platform, row.url, row.sortOrder]);

  const dirty =
    platformDraft !== row.platform ||
    urlDraft.trim() !== row.url ||
    sortDraft.trim() !== String(row.sortOrder);

  async function handleSave() {
    if (!dirty) return;
    const n = Number(sortDraft);
    if (!Number.isFinite(n)) return;
    setSaving(true);
    await onSave(row.id, {
      platform: platformDraft,
      url: urlDraft.trim(),
      sortOrder: n,
    });
    setSaving(false);
  }

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-outline-variant/15 bg-surface-container-low p-4 md:flex-row md:items-end">
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-end">
        <div className="sm:w-44">
          <label
            htmlFor={`social-platform-${row.id}`}
            className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
          >
            Platform
          </label>
          <select
            id={`social-platform-${row.id}`}
            value={platformDraft}
            onChange={(e) => setPlatformDraft(e.target.value)}
            className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-sm text-on-surface"
          >
            {SOCIAL_PLATFORM_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0 flex-1">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            URL
          </label>
          <Input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            className="font-mono text-sm"
          />
        </div>
        <div className="w-24">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Sort
          </label>
          <Input type="number" value={sortDraft} onChange={(e) => setSortDraft(e.target.value)} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 md:pb-0.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
          <SocialBrandGlyph platform={platformDraft} className="h-[18px] w-[18px]" />
        </span>
        <Button type="button" onClick={handleSave} disabled={!dirty || saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" className="text-error" onClick={onRequestRemove}>
          Remove
        </Button>
      </div>
    </li>
  );
}
