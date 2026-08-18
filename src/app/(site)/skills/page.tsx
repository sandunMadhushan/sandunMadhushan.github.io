import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Skill } from "@prisma/client";
import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { RevealText } from "@/components/motion/reveal-text";
import { StaggerIn } from "@/components/motion/stagger-in";
import { Magnetic } from "@/components/motion/magnetic";
import { SkillTechIcon } from "@/components/skill-tech-icon";
import { Container, Eyebrow, Rule } from "@/components/ui/primitives";
import { resolveSkillDescription } from "@/lib/skill-auto";
import { getAbout, getSkills } from "@/lib/queries";

export const revalidate = 30;

/**
 * The page is a single indexed ledger. Each group is a numbered band with a
 * hairline rule, and every skill is a row — which is what the old `01 /`
 * numbering promised but the card grid never delivered.
 */
const GROUPS: {
  index: string;
  label: string;
  sub: string;
  match: (s: Skill) => boolean;
}[] = [
  {
    index: "01",
    label: "Presentation Layer",
    sub: "Frontend & Languages",
    match: (s) => s.category === "Frontend" || s.category === "Languages",
  },
  {
    index: "02",
    label: "Logic",
    sub: "Backend Core",
    match: (s) => s.category === "Backend",
  },
  {
    index: "03",
    label: "Native & Mobile",
    sub: "Platforms & devices",
    match: (s) => s.category === "Mobile",
  },
  {
    index: "04",
    label: "Persistence",
    sub: "Database systems",
    match: (s) => s.category === "Database",
  },
  {
    index: "05",
    label: "Infrastructure & Workflow",
    sub: "The digital workbench",
    match: (s) => s.category === "Tools",
  },
  {
    index: "06",
    label: "Hosting & Cloud Delivery",
    sub: "Deployment platforms",
    match: (s) => s.category === "Deployment",
  },
];

export default async function SkillsPage() {
  const [skills, about] = await Promise.all([getSkills(), getAbout()]);
  const stats = (about?.stats as Record<string, unknown>) ?? {};
  const cta =
    (stats.ctaSpecialization as string) ??
    "Full-stack web apps, TypeScript/React, and APIs—always learning deeper.";

  const groups = GROUPS.map((g) => ({ ...g, items: skills.filter(g.match) }));

  return (
    <>
      <SiteNav active="/skills" />
      <PageFade>
        <main id="main" className="pb-28 pt-32 md:pt-40">
          <Container>
            <header className="mb-20 md:mb-28">
              <Rule />
              <div className="flex flex-wrap items-baseline justify-between gap-4 pt-4">
                <Eyebrow>Capabilities</Eyebrow>
                <span className="type-mono-sm tabular-nums text-on-surface-variant">
                  {String(skills.length).padStart(2, "0")} entries
                </span>
              </div>

              <h1 className="type-mega mt-10 text-on-surface md:mt-14">
                <RevealText text="Expertise" as="span" onLoad delay={0.08} />
                <br />
                <span className="text-primary">
                  <RevealText
                    text="&amp; Tools"
                    as="span"
                    onLoad
                    delay={0.18}
                  />
                </span>
              </h1>

              <p className="type-lead mt-10 max-w-2xl text-on-surface-variant">
                Tools and languages I use in coursework and personal projects as
                I grow toward a career in software engineering—frontend,
                backend, and everything in between.
              </p>
            </header>

            {/* ---------- LEDGER ---------- */}
            <div className="flex flex-col gap-20 md:gap-28">
              {groups.map((g) => (
                <section key={g.index}>
                  <Rule />
                  <div className="grid grid-cols-12 gap-y-8 pt-5 md:gap-8">
                    {/* Group heading — sticks while its rows scroll past. */}
                    <div className="col-span-12 md:col-span-3">
                      <div className="md:sticky md:top-28">
                        <Eyebrow index={g.index}>{g.label}</Eyebrow>
                        <h2 className="type-h3 mt-4 text-on-surface">
                          {g.sub}
                        </h2>
                        <span className="type-mono-sm mt-3 block tabular-nums text-on-surface-variant">
                          {String(g.items.length).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-8 md:col-start-5">
                      {g.items.length === 0 ? (
                        <p className="type-mono border border-dashed border-outline-variant py-10 text-center text-on-surface-variant">
                          Nothing listed yet
                        </p>
                      ) : (
                        <StaggerIn selector="li">
                          <ul className="flex flex-col">
                            {g.items.map((s) => (
                              <li
                                key={s.id}
                                className="group flex items-start gap-5 border-b border-outline-variant py-5 transition-colors first:border-t hover:border-primary-container"
                              >
                                <span className="mt-0.5 shrink-0 text-on-surface-variant transition-colors duration-300 group-hover:text-primary">
                                  <SkillTechIcon
                                    name={s.name}
                                    iconKey={s.icon}
                                    size={26}
                                  />
                                </span>
                                <div className="min-w-0">
                                  <p className="font-medium text-on-surface">
                                    {s.name}
                                  </p>
                                  <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                                    {resolveSkillDescription(
                                      s.description,
                                      s.name,
                                      s.icon,
                                    )}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </StaggerIn>
                      )}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* ---------- SPECIALIZATION BAND ---------- */}
            <section className="mt-28 md:mt-40">
              <div className="rounded-sm bg-primary-container px-8 py-14 md:px-14 md:py-20">
                <div className="grid grid-cols-12 items-end gap-y-10 md:gap-8">
                  <div className="col-span-12 md:col-span-8">
                    <span className="type-mono text-on-primary-container/70">
                      Current specialization
                    </span>
                    <p className="font-display mt-6 text-[clamp(2rem,5vw,3.75rem)] leading-[0.95] tracking-[-0.03em] text-on-primary-container">
                      {cta}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-4 md:flex md:justify-end">
                    <Magnetic>
                      <Link
                        href="/projects"
                        className="type-mono inline-flex items-center gap-2.5 rounded-sm bg-on-primary-container px-8 py-4 text-primary-container transition-transform duration-300 hover:scale-[1.03] active:scale-95"
                      >
                        View case studies
                        <ArrowUpRight className="size-4" aria-hidden />
                      </Link>
                    </Magnetic>
                  </div>
                </div>
              </div>
            </section>
          </Container>
        </main>
      </PageFade>
    </>
  );
}
