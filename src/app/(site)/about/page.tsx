import type { ReactNode } from "react";
import NextImage from "next/image";
import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { StaggerIn } from "@/components/motion/stagger-in";
import { TimelineLine } from "@/components/motion/timeline-line";
import { CountUpOnView } from "@/components/motion/count-up-on-view";
import { SkillTechIcon } from "@/components/skill-tech-icon";
import { Container, Eyebrow, Rule } from "@/components/ui/primitives";
import {
  ABOUT_HEADLINE_ACCENT,
  DEFAULT_ABOUT_HEADLINE,
  DEFAULT_ABOUT_INTRO,
  stripColomboFromCopy,
} from "@/lib/about-content";
import { resolveDisplayImageSrc } from "@/lib/image-url";
import { resolvePortraitSrc } from "@/lib/site-constants";
import { getAbout } from "@/lib/queries";

export const revalidate = 30;

/** Highlights `ABOUT_HEADLINE_ACCENT` in the headline when present (case-insensitive match). */
function formatAboutHeadline(headline: string): ReactNode {
  const lower = headline.toLowerCase();
  const key = ABOUT_HEADLINE_ACCENT.toLowerCase();
  const idx = lower.indexOf(key);
  if (idx === -1) {
    return headline.includes("\n") ? (
      <span className="whitespace-pre-line">{headline}</span>
    ) : (
      headline
    );
  }

  const word = headline.slice(idx, idx + key.length);
  const before = headline.slice(0, idx);
  const after = headline.slice(idx + key.length);
  return (
    <>
      {before}
      <span className="text-primary">{word}</span>
      {after}
    </>
  );
}

type TimelineItem = {
  period: string;
  title: string;
  body: string;
  image?: string;
  align?: "left" | "right";
};

export default async function AboutPage() {
  const about = await getAbout();
  const stats = (about?.stats as Record<string, unknown>) ?? {};
  const headline = (stats.aboutHeadline as string) ?? DEFAULT_ABOUT_HEADLINE;
  const introFromStats = stats.aboutIntro as string[] | undefined;
  const intro =
    introFromStats && introFromStats.length > 0
      ? introFromStats.map((p) => stripColomboFromCopy(p))
      : about?.content
        ? [stripColomboFromCopy(about.content)]
        : [...DEFAULT_ABOUT_INTRO];
  const portrait = resolveDisplayImageSrc(
    resolvePortraitSrc(stats.aboutPortrait as string | undefined),
  );
  const statCards = (stats.statCards as {
    value: string;
    label: string;
    icon: string;
  }[]) ?? [
    { value: "6+", label: "Projects & builds", icon: "terminal" },
    { value: "10", label: "Technologies", icon: "verified" },
    { value: "2+", label: "Years learning & shipping", icon: "history_edu" },
  ];
  const timeline = (stats.timeline as TimelineItem[]) ?? [];
  const skillArtifacts = (stats.skillArtifacts as {
    name: string;
    icon: string;
  }[]) ?? [
    { name: "TypeScript", icon: "typescript" },
    { name: "Tailwind", icon: "tailwindcss" },
    { name: "PostgreSQL", icon: "postgresql" },
  ];

  return (
    <PageFade>
      <SiteNav active="/about" />
      <main id="main" className="pb-28 pt-32 md:pt-40">
        {/* ---------- INTRO ---------- */}
        <Container>
          <Rule />
          <div className="flex flex-wrap items-baseline justify-between gap-4 pt-4">
            <Eyebrow>Aspiring Software Engineer</Eyebrow>
            <span className="type-mono-sm text-on-surface-variant">
              Matale, Sri Lanka
            </span>
          </div>

          <div className="mt-12 grid grid-cols-12 gap-y-12 md:mt-16 md:gap-8">
            <div className="col-span-12 md:col-span-7">
              <h1 className="type-display text-on-surface">
                {formatAboutHeadline(headline)}
              </h1>
              <div className="type-body mt-10 max-w-xl space-y-5 text-on-surface-variant">
                {intro.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 md:col-start-9">
              <div className="mx-auto w-full max-w-[260px] sm:max-w-[300px] md:ml-auto md:mr-0 md:max-w-[340px]">
                <div className="duotone-wrap duotone-onload panel-rise relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-outline-variant bg-surface-container-low">
                  <NextImage
                    src={portrait}
                    alt="Sandun Madhushan"
                    fill
                    sizes="(max-width: 640px) 260px, (max-width: 768px) 300px, 340px"
                    unoptimized
                    className="duotone object-cover object-[center_22%]"
                    priority
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="type-mono-sm text-on-surface-variant">
                    Fig. 01 — Portrait
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* ---------- STAT RAIL ---------- */}
        <Container className="mt-24 md:mt-36">
          <Rule />
          <dl className="grid grid-cols-1 sm:grid-cols-3">
            {statCards.map((s, i) => (
              <div
                key={s.label}
                className={`border-b border-outline-variant py-10 sm:border-b-0 ${
                  i > 0 ? "sm:border-l sm:border-outline-variant sm:pl-8" : ""
                }`}
              >
                <dd className="type-num font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.9] text-on-surface">
                  <CountUpOnView value={s.value} />
                </dd>
                <dt className="type-mono-sm mt-3 text-on-surface-variant">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
          <Rule className="hidden sm:block" />
        </Container>

        {/* ---------- TIMELINE ---------- */}
        <Container className="mt-28 md:mt-44">
          <Rule />
          <div className="pt-4">
            <Eyebrow index="02">Journey &amp; Evolution</Eyebrow>
          </div>

          {timeline.length === 0 ? (
            <p className="type-mono mt-12 border border-dashed border-outline-variant py-16 text-center text-on-surface-variant">
              Timeline entries can be added from the admin About section.
            </p>
          ) : (
            <div className="relative mt-16 pl-8 md:mt-24 md:pl-0">
              <TimelineLine className="left-0 md:left-[16.6667%]" />

              <StaggerIn selector="[data-entry]" stagger={0.12}>
                {timeline.map((item, idx) => (
                  <article
                    key={idx}
                    data-entry
                    className="relative grid grid-cols-12 gap-y-5 pb-16 last:pb-0 md:gap-8 md:pb-24"
                  >
                    {/* Node on the spine */}
                    <span
                      aria-hidden
                      className="absolute -left-8 top-1.5 size-2 bg-primary-container md:left-[16.6667%] md:-translate-x-1/2"
                    />

                    <div className="col-span-12 md:col-span-2">
                      <span className="type-mono tabular-nums text-primary">
                        {item.period}
                      </span>
                    </div>

                    <div className="col-span-12 md:col-span-5 md:col-start-4">
                      <h3 className="type-h2 text-on-surface">{item.title}</h3>
                      <p className="type-body mt-4 text-on-surface-variant">
                        {item.body}
                      </p>
                    </div>

                    {item.image ? (
                      <div className="col-span-12 md:col-span-3 md:col-start-10">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-outline-variant bg-surface-container-low">
                          <NextImage
                            src={resolveDisplayImageSrc(item.image)}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, 280px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </StaggerIn>
            </div>
          )}
        </Container>

        {/* ---------- ARTIFACTS ---------- */}
        <Container className="mt-28 md:mt-40">
          <Rule />
          <div className="pt-4">
            <Eyebrow index="03">Selected Skill Artifacts</Eyebrow>
          </div>
          <StaggerIn
            selector="[data-artifact]"
            className="mt-12 flex flex-wrap gap-x-12 gap-y-10"
          >
            {skillArtifacts.map((s) => (
              <div
                key={s.name}
                data-artifact
                className="group flex items-center gap-4"
              >
                <span className="flex size-14 items-center justify-center rounded-sm border border-outline-variant text-on-surface-variant transition-colors duration-300 group-hover:border-primary group-hover:text-primary">
                  <SkillTechIcon name={s.name} iconKey={s.icon} size={28} />
                </span>
                <span className="type-mono text-on-surface">{s.name}</span>
              </div>
            ))}
          </StaggerIn>
        </Container>
      </main>
    </PageFade>
  );
}
