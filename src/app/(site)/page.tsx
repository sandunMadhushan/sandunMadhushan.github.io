import NextImage from "next/image";
import LinkNext from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { RevealText } from "@/components/motion/reveal-text";
import { StaggerIn } from "@/components/motion/stagger-in";
import { Magnetic } from "@/components/motion/magnetic";
import { Parallax } from "@/components/motion/parallax";
import { VelocityMarquee } from "@/components/motion/velocity-marquee";
import { CountUpOnView } from "@/components/motion/count-up-on-view";
import { ProjectIndex } from "@/components/projects/project-index";
import { Container, Eyebrow, Rule, Section } from "@/components/ui/primitives";
import {
  normalizeHeroTechChips,
  resolveHeroTechIcon,
} from "@/lib/hero-tech-chips";
import { resolveHeroTagline, resolveHomeAboutBody } from "@/lib/about-content";
import { resolvePortraitSrc } from "@/lib/site-constants";
import { isRemoteImageSrc } from "@/lib/image-url";
import { projectCardSrc } from "@/lib/project-media";
import { resolveHomeShowcaseProjects } from "@/lib/home-showcase";
import { parseProjectCategories } from "@/lib/project-categories";
import { getAbout, getProjects } from "@/lib/queries";

/** Cache page shell so prefetched routes feel instant; refresh every 30s. */
export const revalidate = 30;

const PRINCIPLES = [
  {
    t: "Performance-aware builds",
    d: "Faster loads and clearer UX—without sacrificing readability.",
  },
  {
    t: "Maintainable structure",
    d: "Code organized so teammates (and future me) can follow along.",
  },
  {
    t: "Design-to-implementation",
    d: "Turning layouts and specs into polished, responsive interfaces.",
  },
];

export default async function HomePage() {
  const [about, allProjects] = await Promise.all([getAbout(), getProjects()]);

  const stats = (about?.stats as Record<string, unknown>) ?? {};
  const tagline = resolveHeroTagline(stats.heroTagline);
  const profileImage = resolvePortraitSrc(
    stats.profileImage as string | undefined,
  );
  const homeAboutHeadline =
    (stats.homeAboutHeadline as string) ??
    "Learning by shipping real software.";
  const homeAboutBody = resolveHomeAboutBody(stats.homeAboutBody);
  const homeStats = (stats.homeStats as { value: string; label: string }[]) ?? [
    { value: String(stats.projects ?? "6"), label: "Projects & coursework" },
    {
      value: String(stats.technologies ?? "10"),
      label: "Technologies in play",
    },
    { value: String(stats.experience ?? "2+"), label: "Years building" },
  ];
  const heroTechChips = normalizeHeroTechChips(stats.heroTechChips);

  const showcase = resolveHomeShowcaseProjects(
    allProjects,
    about?.stats as Record<string, unknown> | undefined,
  );

  const indexRows = showcase.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    categories: parseProjectCategories(p.category),
    cover: projectCardSrc(p, profileImage),
  }));

  return (
    <>
      <SiteNav active="/" />
      <PageFade>
        <main id="main">
          {/* ============ 01 · HERO ============ */}
          {/* The portrait is absolutely positioned on desktop so it can sit
            behind the headline without ever adding to the section's height —
            the previous in-flow version stacked and made the hero two
            viewports tall. Its left edge is masked to a soft fade so the
            type crosses it cleanly instead of colliding with a hard border. */}
          <section className="relative isolate flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-28 pb-12 md:pt-32">
            <div
              aria-hidden
              className="grid-overlay pointer-events-none absolute inset-0 -z-20 opacity-70 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,black,transparent)]"
            />

            <Container>
              {/* Metadata rail */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <Eyebrow>
                  <span className="pulse-dot mr-1 inline-block size-1.5 rounded-full bg-primary-container align-middle" />
                  Open to internships
                </Eyebrow>
                <span className="type-mono text-on-surface-variant">
                  Matale, LK
                </span>
                <span className="type-mono text-on-surface-variant">
                  Full-stack
                </span>
                <span className="type-mono ml-auto hidden text-on-surface-variant sm:block">
                  {new Date().getFullYear()}
                </span>
              </div>
              <Rule className="mt-4" />

              <div className="relative mt-10 md:mt-14">
                {/* Portrait — out of flow from md up, centred against the name */}
                <div className="pointer-events-none relative z-0 mx-auto w-[62%] max-w-[260px] md:absolute md:right-0 md:top-1/2 md:mx-0 md:w-[27%] md:max-w-none md:-translate-y-1/2">
                  <Parallax speed={-0.14}>
                    <div className="duotone-wrap duotone-onload relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-outline-variant bg-surface-container-low md:border-0 md:[mask-image:linear-gradient(to_right,transparent,black_30%)]">
                      <NextImage
                        src={profileImage}
                        alt="Sandun Madhushan"
                        fill
                        sizes="(max-width: 768px) 62vw, 30vw"
                        className="duotone object-cover object-[center_18%]"
                        priority
                        unoptimized={isRemoteImageSrc(profileImage)}
                      />
                    </div>
                  </Parallax>
                </div>

                {/* Headline sits in front of the portrait */}
                <h1 className="type-mega relative z-10 text-on-surface">
                  <RevealText
                    text="Sandun"
                    as="span"
                    onLoad
                    delay={0.08}
                    split="char"
                  />
                  <br />
                  <span className="text-primary">
                    <RevealText
                      text="Madhushan"
                      as="span"
                      onLoad
                      delay={0.24}
                      split="char"
                    />
                  </span>
                </h1>

                <div className="relative z-10 mt-8 max-w-lg md:mt-10">
                  <p className="type-lead text-on-surface-variant">{tagline}</p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Magnetic>
                      <LinkNext
                        href="/projects"
                        className="type-mono inline-flex items-center gap-2.5 rounded-sm bg-primary-container px-7 py-4 text-on-primary-container transition-transform duration-300 hover:scale-[1.02] active:scale-95"
                      >
                        View Projects
                        <ArrowUpRight className="size-4" aria-hidden />
                      </LinkNext>
                    </Magnetic>
                    <LinkNext
                      href="/contact"
                      className="type-mono inline-flex items-center gap-2.5 rounded-sm border border-outline-variant px-7 py-4 text-on-surface transition-colors duration-300 hover:border-primary hover:text-primary"
                    >
                      Contact Me
                    </LinkNext>
                  </div>
                </div>
              </div>

              <div className="mt-12 md:mt-16">
                <Rule />
                <div className="flex items-center justify-between pt-4">
                  <span className="type-mono-sm flex items-center gap-2 text-on-surface-variant">
                    <ArrowDown
                      className="size-3.5 animate-bounce"
                      aria-hidden
                    />
                    Scroll
                  </span>
                  <span className="type-mono-sm text-on-surface-variant">
                    Fig. 01 — Portrait
                  </span>
                </div>
              </div>
            </Container>
          </section>

          {/* ============ TECH MARQUEE ============ */}
          <div className="border-y border-outline-variant bg-surface-container-lowest py-5">
            <VelocityMarquee baseSpeed={0.5}>
              {[...heroTechChips, ...heroTechChips].map((chip, i) => {
                const { Icon } = resolveHeroTechIcon(chip.icon);
                return (
                  <span
                    key={`${chip.label}-${i}`}
                    className="type-mono flex items-center gap-3 px-7 text-on-surface-variant"
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {chip.label}
                    <span
                      aria-hidden
                      className="ml-7 size-1 bg-primary-container"
                    />
                  </span>
                );
              })}
            </VelocityMarquee>
          </div>

          {/* ============ 02 · SELECTED WORK ============ */}
          <Section>
            <Container>
              <div className="mb-10 md:mb-12">
                <Rule />
                <div className="flex flex-wrap items-baseline justify-between gap-4 pt-4">
                  <Eyebrow index="02">Selected Work</Eyebrow>
                  <LinkNext
                    href="/projects"
                    className="type-mono link-wipe inline-flex items-center gap-2 text-on-surface-variant transition-colors hover:text-primary"
                  >
                    All projects
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </LinkNext>
                </div>
                <h2 className="type-display mt-6 max-w-3xl text-on-surface md:mt-8">
                  <RevealText text="Things I've built." as="span" />
                </h2>
              </div>

              <ProjectIndex rows={indexRows} />
            </Container>
          </Section>

          {/* ============ 03 · APPROACH ============ */}
          <Section className="bg-surface-container-lowest">
            <Container>
              <Rule />
              <div className="pt-4">
                <Eyebrow index="03">Approach</Eyebrow>
              </div>

              <div className="mt-10 grid grid-cols-12 gap-y-12 md:mt-14 md:gap-8">
                <div className="col-span-12 md:col-span-7">
                  <h2 className="type-display text-on-surface">
                    <RevealText text={homeAboutHeadline} as="span" />
                  </h2>
                  <p className="type-body mt-8 max-w-xl text-on-surface-variant">
                    {homeAboutBody}
                  </p>
                </div>

                <div className="col-span-12 md:col-span-4 md:col-start-9">
                  <StaggerIn selector="li" className="block">
                    <ol className="flex flex-col">
                      {PRINCIPLES.map((x, i) => (
                        <li
                          key={x.t}
                          className="group border-t border-outline-variant py-6 transition-colors last:border-b hover:border-primary-container"
                        >
                          <div className="flex items-baseline gap-4">
                            <span className="type-mono-sm tabular-nums text-primary">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <div>
                              <h3 className="text-base font-semibold text-on-surface">
                                {x.t}
                              </h3>
                              <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
                                {x.d}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </StaggerIn>
                </div>
              </div>

              {/* Stats rail — hairline separated, no cards. */}
              <div className="mt-16 md:mt-20">
                <Rule />
                <dl className="grid grid-cols-1 sm:grid-cols-3">
                  {homeStats.map((s, i) => (
                    <div
                      key={s.label}
                      className={`border-b border-outline-variant py-8 sm:border-b-0 sm:py-10 ${
                        i > 0
                          ? "sm:border-l sm:border-outline-variant sm:pl-8"
                          : ""
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
              </div>
            </Container>
          </Section>

          {/* ============ 04 · CTA BAND ============ */}
          <section className="relative overflow-hidden bg-primary-container py-24 md:py-36">
            <Container>
              <div className="grid grid-cols-12 items-end gap-y-10 md:gap-8">
                <div className="col-span-12 md:col-span-8">
                  <span className="type-mono text-on-primary-container/70">
                    05 — Let&apos;s work together
                  </span>
                  <h2 className="font-display mt-6 text-[clamp(2.75rem,9vw,7.5rem)] leading-[0.88] tracking-[-0.035em] text-on-primary-container">
                    Want to build
                    <br />
                    something?
                  </h2>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <p className="text-lg leading-relaxed text-on-primary-container/80">
                    I&apos;m open to internships, academic collaborations, and
                    small full-stack web projects—tell me what you have in mind.
                  </p>
                  <Magnetic className="mt-8 block">
                    <LinkNext
                      href="/contact"
                      className="type-mono inline-flex items-center gap-2.5 rounded-sm bg-on-primary-container px-8 py-4 text-primary-container transition-transform duration-300 hover:scale-[1.03] active:scale-95"
                    >
                      Contact me now
                      <ArrowUpRight className="size-4" aria-hidden />
                    </LinkNext>
                  </Magnetic>
                </div>
              </div>
            </Container>
          </section>
        </main>
      </PageFade>
    </>
  );
}
