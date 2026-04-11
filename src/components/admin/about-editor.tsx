"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { About } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { HeroTechChip } from "@/lib/hero-tech-chips";
import {
  HERO_TECH_ICON_OPTIONS,
  normalizeHeroTechChips,
} from "@/lib/hero-tech-chips";
import {
  HOME_SHOWCASE_PROJECT_IDS_KEY,
  omitHomeShowcaseIdsFromStats,
  parseHomeFeaturedProjectIds,
} from "@/lib/home-showcase";

export type AboutAdminProjectOption = {
  id: string;
  title: string;
  published: boolean;
};

function homeSlotsFromAbout(about: About | null): [string, string, string] {
  if (!about?.stats) return ["", "", ""];
  const ids = parseHomeFeaturedProjectIds(about.stats as Record<string, unknown>);
  return [ids[0] ?? "", ids[1] ?? "", ids[2] ?? ""];
}

function buildHomeFeaturedIds(slots: [string, string, string]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of slots) {
    const t = raw.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out.slice(0, 3);
}

export function AboutEditor({
  about,
  adminProjects = [],
}: {
  about: About | null;
  adminProjects?: AboutAdminProjectOption[];
}) {
  const router = useRouter();
  const [content, setContent] = useState(about?.content ?? "");
  const [statsJson, setStatsJson] = useState(() =>
    JSON.stringify(omitHomeShowcaseIdsFromStats((about?.stats as Record<string, unknown>) ?? {}), null, 2),
  );
  const [heroChips, setHeroChips] = useState<HeroTechChip[]>(() =>
    normalizeHeroTechChips((about?.stats as Record<string, unknown> | undefined)?.heroTechChips),
  );
  const [homeSlots, setHomeSlots] = useState<[string, string, string]>(() => homeSlotsFromAbout(about));
  const [saving, setSaving] = useState(false);

  const sortedAdminProjects = useMemo(
    () =>
      [...adminProjects].sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
      ),
    [adminProjects],
  );

  useEffect(() => {
    if (!about) return;
    setContent(about.content ?? "");
    setStatsJson(
      JSON.stringify(
        omitHomeShowcaseIdsFromStats((about.stats as Record<string, unknown>) ?? {}),
        null,
        2,
      ),
    );
    setHeroChips(
      normalizeHeroTechChips((about.stats as Record<string, unknown> | undefined)?.heroTechChips),
    );
    setHomeSlots(homeSlotsFromAbout(about));
  }, [about]);

  function setChip(i: number, patch: Partial<HeroTechChip>) {
    setHeroChips((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], ...patch };
      return next;
    });
  }

  async function save() {
    let stats: Record<string, unknown>;
    try {
      stats = JSON.parse(statsJson) as Record<string, unknown>;
    } catch {
      toast.error("Invalid JSON in stats");
      return;
    }
    const picks = buildHomeFeaturedIds(homeSlots);
    if (picks.length > 0) {
      stats[HOME_SHOWCASE_PROJECT_IDS_KEY] = picks;
    } else {
      delete stats[HOME_SHOWCASE_PROJECT_IDS_KEY];
    }
    stats.heroTechChips = normalizeHeroTechChips(heroChips);
    setSaving(true);
    const res = await fetch("/api/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, stats }),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Save failed");
      return;
    }
    toast.success("About content saved");
    router.refresh();
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="mb-2 text-3xl font-bold text-on-surface">About Content</h2>
        <p className="text-on-surface-variant">Bio paragraph and structured stats (JSON) power the home and about pages.</p>
      </div>
      <div className="space-y-2">
        <label className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">Bio / content</label>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
      </div>

      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6">
        <h3 className="mb-1 text-lg font-semibold text-on-surface">Home hero portrait badges</h3>
        <p className="mb-4 text-sm text-on-surface-variant">
          Three floating chips on the home page next to your photo. Labels are free text; icons use Simple Icons (brand marks).
        </p>
        <div className="space-y-4">
          {heroChips.map((chip, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-lg border border-outline-variant/15 bg-surface-container p-4 sm:flex-row sm:items-end"
            >
              <div className="min-w-0 flex-1 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Badge {i + 1} label
                </label>
                <Input
                  value={chip.label}
                  onChange={(e) => setChip(i, { label: e.target.value })}
                  placeholder="e.g. React.js"
                />
              </div>
              <div className="w-full sm:w-56 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Icon
                </label>
                <select
                  aria-label={`Badge ${i + 1} icon`}
                  value={chip.icon}
                  onChange={(e) => setChip(i, { icon: e.target.value })}
                  className="h-10 w-full rounded-md border border-outline-variant/30 bg-surface-container-highest px-3 text-sm text-on-surface"
                >
                  {HERO_TECH_ICON_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6">
        <h3 className="mb-1 text-lg font-semibold text-on-surface">Home — Featured Projects row</h3>
        <p className="mb-4 text-sm text-on-surface-variant">
          Pick up to three projects for the home page grid only. Order here is independent of the Project Portfolio list
          order (drag handles on <span className="font-medium text-on-surface">Admin → Projects</span>), which controls
          the public <span className="font-medium text-on-surface">Projects</span> page. Leave a slot as None to show
          fewer than three cards. If all three are None, the first three published projects in portfolio order are used.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {([0, 1, 2] as const).map((i) => (
            <div key={i} className="space-y-1.5">
              <label
                htmlFor={`home-showcase-${i}`}
                className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant"
              >
                Slot {i + 1}
              </label>
              <select
                id={`home-showcase-${i}`}
                value={homeSlots[i]}
                onChange={(e) =>
                  setHomeSlots((prev) => {
                    const next: [string, string, string] = [...prev];
                    next[i] = e.target.value;
                    return next;
                  })
                }
                className="h-10 w-full rounded-md border border-outline-variant/30 bg-surface-container-highest px-3 text-sm text-on-surface"
              >
                <option value="">None</option>
                {sortedAdminProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                    {!p.published ? " (draft)" : ""}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
          Stats JSON (projects, technologies, experience, heroTagline, timeline, …)
        </label>
        <p className="text-sm text-on-surface-variant">
          Journey images: in <code className="rounded bg-surface-container-highest px-1 py-0.5 text-xs">timeline</code>, add{" "}
          <code className="rounded bg-surface-container-highest px-1 py-0.5 text-xs">&quot;image&quot;</code> with a direct URL, a path like{" "}
          <code className="rounded bg-surface-container-highest px-1 py-0.5 text-xs">/photo.jpg</code>, or a Google Drive{" "}
          <strong>file</strong> share link (Anyone with the link). Folder links are not supported. The site converts Drive file links when the page loads.
        </p>
        <Textarea value={statsJson} onChange={(e) => setStatsJson(e.target.value)} rows={20} className="font-mono text-sm" />
      </div>
      <Button type="button" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save About"}
      </Button>
    </div>
  );
}
