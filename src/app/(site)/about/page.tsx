import type { ReactNode } from "react";
import NextImage from "next/image";
import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { MIcon } from "@/components/m-icon";
import { SkillTechIcon } from "@/components/skill-tech-icon";
import {
  ABOUT_HEADLINE_ACCENT,
  DEFAULT_ABOUT_HEADLINE,
  DEFAULT_ABOUT_INTRO,
  stripColomboFromCopy,
} from "@/lib/about-content";
import { resolvePortraitSrc } from "@/lib/site-constants";
import { getAbout } from "@/lib/queries";

export const revalidate = 30;

const headlineAccentClass =
  "text-primary-container drop-shadow-[0_0_15px_rgba(79,70,229,0.3)]";

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
      <span className={headlineAccentClass}>{word}</span>
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
  const portrait = resolvePortraitSrc(
    stats.aboutPortrait as string | undefined,
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
      <main className="pb-20 pt-0">
        <section className="box-border mb-24 flex min-h-[100dvh] flex-col justify-center overflow-x-clip pt-28 pb-10 md:mb-32 md:pt-28 md:pb-12 lg:pt-24">
          <div className="mx-auto grid w-full min-h-0 max-w-[1440px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:gap-12 md:px-12 lg:gap-16">
            <div className="min-h-0">
              <span className="mb-4 block max-w-xl text-[0.8125rem] font-semibold leading-snug tracking-wide text-primary md:mb-6">
                Aspiring Software Engineer
              </span>
              <h1 className="mb-6 max-w-3xl text-[2rem] font-extrabold leading-[1.12] tracking-tighter text-on-surface sm:text-[2.5rem] md:mb-8 md:text-[3rem] lg:text-[3.25rem]">
                {formatAboutHeadline(headline)}
              </h1>
              <div className="max-w-xl space-y-4 text-base leading-[1.75] text-on-surface-variant md:space-y-5 md:text-[1.0625rem] md:leading-[1.8]">
                {intro.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="relative flex min-h-0 w-full justify-center md:justify-end">
              <div className="glass-card relative z-10 aspect-square w-[min(100%,min(420px,min(85vw,min(46dvh,calc(100dvh-15rem)))))] max-w-full shrink-0 overflow-hidden rounded-xl shadow-lg md:ml-auto md:w-[min(420px,min(54dvh,calc(100dvh-10.5rem)))]">
                <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                  <NextImage
                    src={portrait}
                    alt="Portrait"
                    fill
                    sizes="(max-width: 768px) 90vw, 420px"
                    unoptimized
                    className="object-cover object-[center_24%] scale-105 grayscale transition-all duration-700 [@media(hover:none)]:grayscale-0 [@media(hover:hover)]:hover:scale-110 [@media(hover:hover)]:hover:grayscale-0"
                    priority
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-8 -right-4 -z-10 h-48 w-48 rounded-full bg-primary-container/20 blur-[80px] md:-bottom-10 md:-right-10 md:h-64 md:w-64 md:blur-[100px]" />
            </div>
          </div>
        </section>

        <ScrollReveal>
          <section className="mx-auto mb-40 max-w-[1440px] px-6 md:px-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {statCards.map((s) => (
                <div
                  key={s.label}
                  className="group flex h-64 flex-col justify-between rounded-xl bg-surface-container-low p-10 transition-colors duration-500 hover:bg-surface-container"
                >
                  <MIcon
                    name={s.icon}
                    className="text-4xl text-primary"
                    filled
                  />
                  <div>
                    <h3 className="mb-2 text-5xl font-black tracking-tighter">
                      {s.value}
                    </h3>
                    <p className="font-medium tracking-tight text-on-surface-variant">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="mx-auto max-w-[1440px] px-6 md:px-12">
            <div className="mb-16 flex flex-col items-end gap-12 md:flex-row">
              <div className="md:w-1/3">
                <h2 className="text-[2.5rem] font-bold leading-none tracking-tighter">
                  Journey &amp; <br />
                  <span className="text-primary-container">Evolution</span>
                </h2>
              </div>
              <div className="md:w-2/3">
                <div className="mb-2 h-px w-full bg-outline-variant/30" />
              </div>
            </div>
            <div className="relative py-12">
              {timeline.length === 0 ? (
                <p className="pl-6 text-on-surface-variant/70 md:pl-0 md:text-center">
                  Timeline entries can be added from the admin About section.
                </p>
              ) : (
                <>
                  <div className="absolute bottom-0 left-0 top-0 w-[2px] bg-surface-container-highest md:left-1/2 md:-translate-x-1/2" />
                  {timeline.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative mb-32 grid grid-cols-1 items-center gap-12 md:grid-cols-2"
                    >
                      {item.align === "right" ? (
                        <>
                          <div className="hidden md:block">
                            {item.image && (
                              <div className="glass-card aspect-video overflow-hidden rounded-lg bg-surface-container-low p-2">
                                <NextImage
                                  src={item.image}
                                  alt=""
                                  width={640}
                                  height={360}
                                  className="h-full w-full rounded object-cover shadow-lg"
                                  unoptimized
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="mb-4 inline-block rounded-full bg-surface-container-highest px-4 py-1 text-[0.75rem] font-bold uppercase tracking-widest text-primary">
                              {item.period}
                            </span>
                            <h4 className="mb-4 text-2xl font-bold">
                              {item.title}
                            </h4>
                            <p className="max-w-md leading-relaxed text-on-surface-variant">
                              {item.body}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={item.image ? "md:text-right" : ""}>
                            <span className="mb-4 inline-block rounded-full bg-surface-container-highest px-4 py-1 text-[0.75rem] font-bold uppercase tracking-widest text-primary">
                              {item.period}
                            </span>
                            <h4 className="mb-4 text-2xl font-bold">
                              {item.title}
                            </h4>
                            <p
                              className={`max-w-md leading-relaxed text-on-surface-variant ${item.image ? "md:ml-auto" : ""}`}
                            >
                              {item.body}
                            </p>
                          </div>
                          <div className="hidden md:block">
                            {item.image && (
                              <div className="glass-card aspect-video overflow-hidden rounded-lg bg-surface-container-low p-2">
                                <NextImage
                                  src={item.image}
                                  alt=""
                                  width={640}
                                  height={360}
                                  className="h-full w-full rounded object-cover shadow-lg"
                                  unoptimized
                                />
                              </div>
                            )}
                          </div>
                        </>
                      )}
                      <div className="absolute left-[-5px] top-0 h-3 w-3 rounded-full bg-primary-container shadow-[0_0_15px_rgba(79,70,229,0.5)] md:left-1/2 md:-translate-x-1/2" />
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="mx-auto mt-48 max-w-[1440px] px-6 md:px-12">
            <h3 className="label-md mb-16 text-center text-[0.75rem] uppercase tracking-[0.2em] text-on-surface-variant/50">
              Selected Skill Artifacts
            </h3>
            <div className="flex flex-wrap justify-center gap-12 opacity-70">
              {skillArtifacts.map((s) => (
                <div key={s.name} className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg glass-card text-primary">
                    <SkillTechIcon name={s.name} iconKey={s.icon} size={36} />
                  </div>
                  <span className="text-[0.75rem] font-bold uppercase tracking-widest">
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </main>
    </PageFade>
  );
}
