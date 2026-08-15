import NextImage from "next/image";
import LinkNext from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { RevealText } from "@/components/motion/reveal-text";
import { StaggerIn } from "@/components/motion/stagger-in";
import { Magnetic } from "@/components/motion/magnetic";
import { Marquee } from "@/components/motion/marquee";
import { CountUpOnView } from "@/components/motion/count-up-on-view";
import { ProjectIndex } from "@/components/projects/project-index";
import { Container, Eyebrow, Rule, Section } from "@/components/ui/primitives";
import { normalizeHeroTechChips, resolveHeroTechIcon } from "@/lib/hero-tech-chips";
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
  const profileImage = resolvePortraitSrc(stats.profileImage as string | undefined);
  const homeAboutHeadline =
    (stats.homeAboutHeadline as string) ?? "Learning by shipping real software.";
  const homeAboutBody = resolveHomeAboutBody(stats.homeAboutBody);
  const homeStats = (stats.homeStats as { value: string; label: string }[]) ?? [
    { value: String(stats.projects ?? "6"), label: "Projects & coursework" },
    { value: String(stats.technologies ?? "10"), label: "Technologies in play" },
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
    <PageFade>
      <SiteNav active="/" />
      <main id="main">
        {/* ============ 01 · HERO ============ */}
        <section className="relative isolate flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-28 pb-16 md:pt-32">
          <div
            aria-hidden
            className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"
          />

          <Container>
            <div className="grid grid-cols-12 items-end gap-y-10 md:gap-8">
              {/* Metadata rail */}
              <div className="col-span-12 flex flex-wrap items-center gap-x-6 gap-y-2 md:col-span-12">
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
              </div>

              <div className="col-span-12 mt-2 md:col-span-7">
                <h1 className="type-mega text-on-surface">
                  <RevealText text="Sandun" as="span" onLoad delay={0.1} />
                  <br />
                  <span className="text-primary">
                    <RevealText text="Madhushan" as="span" onLoad delay={0.22} />
                  </span>
                </h1>

                <p className="type-lead mt-8 max-w-xl text-on-surface-variant">
                  {tagline}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
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

              {/* Duotone portrait panel */}
              <div className="col-span-12 md:col-span-4 md:col-start-9">
                {/* Capped so the portrait stays a supporting element rather
                   than competing with the display type. */}
                <div className="mx-auto w-full max-w-[260px] sm:max-w-[300px] md:ml-auto md:mr-0 md:max-w-[340px]">
                  <div className="duotone-wrap duotone-onload relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-outline-variant bg-surface-container-low">
                    <NextImage
                      src={profileImage}
                      alt="Sandun Madhushan"
                      fill
                      sizes="(max-width: 640px) 260px, (max-width: 768px) 300px, 340px"
                      className="duotone object-cover object-[center_20%]"
                      priority
                      unoptimized={isRemoteImageSrc(profileImage)}
                    />
                  </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="type-mono-sm text-on-surface-variant">
                    Fig. 01 — Portrait
                  </span>
                  <span className="type-mono-sm text-on-surface-variant">
                    SE Undergrad
                  </span>
                </div>
                </div>
              </div>
            </div>
          </Container>

          <Container className="mt-16 md:mt-20">
            <Rule />
            <div className="flex items-center justify-between pt-4">
              <span className="type-mono-sm flex items-center gap-2 text-on-surface-variant">
                <ArrowDown className="size-3.5 animate-bounce" aria-hidden />
                Scroll
              </span>
              <span className="type-mono-sm text-on-surface-variant">
                {new Date().getFullYear()}
              </span>
            </div>
          </Container>
        </section>

        {/* ============ TECH MARQUEE ============ */}
        <div className="border-y border-outline-variant bg-surface-container-lowest py-5">
          <Marquee duration={38}>
            {[...heroTechChips, ...heroTechChips, ...heroTechChips].map(
              (chip, i) => {
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
              },
            )}
          </Marquee>
        </div>

        {/* ============ 02 · SELECTED WORK ============ */}
        <Section>
          <Container>
            <div className="mb-12 md:mb-16">
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
              <h2 className="type-display mt-8 max-w-3xl text-on-surface md:mt-12">
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

            <div className="mt-12 grid grid-cols-12 gap-y-14 md:mt-20 md:gap-8">
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
            <div className="mt-20 md:mt-28">
              <Rule />
              <dl className="grid grid-cols-1 sm:grid-cols-3">
                {homeStats.map((s, i) => (
                  <div
                    key={s.label}
                    className={`border-b border-outline-variant py-8 sm:border-b-0 sm:py-10 ${
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
  );
}
