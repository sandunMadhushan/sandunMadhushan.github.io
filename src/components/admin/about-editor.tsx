"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { About } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function AboutEditor({ about }: { about: About | null }) {
  const router = useRouter();
  const [content, setContent] = useState(about?.content ?? "");
  const [statsJson, setStatsJson] = useState(JSON.stringify(about?.stats ?? {}, null, 2));
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setErr(null);
    let stats: object;
    try {
      stats = JSON.parse(statsJson);
    } catch {
      setErr("Invalid JSON in stats");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, stats }),
    });
    setSaving(false);
    if (!res.ok) setErr("Save failed");
    else router.refresh();
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="mb-2 text-3xl font-bold text-on-surface">About Content</h2>
        <p className="text-on-surface-variant">Bio paragraph and structured stats (JSON) power the home and about pages.</p>
      </div>
      {err && <p className="text-sm text-error">{err}</p>}
      <div className="space-y-2">
        <label className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">Bio / content</label>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
      </div>
      <div className="space-y-2">
        <label className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
          Stats JSON (projects, technologies, experience, heroTagline, timeline, …)
        </label>
        <Textarea value={statsJson} onChange={(e) => setStatsJson(e.target.value)} rows={20} className="font-mono text-sm" />
      </div>
      <Button type="button" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save About"}
      </Button>
    </div>
  );
}
