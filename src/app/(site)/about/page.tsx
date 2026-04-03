import NextImage from "next/image";
import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { MIcon } from "@/components/m-icon";
import { getAbout } from "@/lib/queries";

export const dynamic = "force-dynamic";

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
  const headline =
    (stats.aboutHeadline as string) ??
    "Crafting digital landscapes with surgical precision.";
  const intro = (stats.aboutIntro as string[]) ?? [about?.content ?? ""];
  const portrait =
    (stats.aboutPortrait as string) ??
    "https://lh3.googleusercontent.com/aida-public/AB6AXuClJpvBYdqCFJ9Vz9cQWM928ui3MwViPKGfXbmdMGtXDZ_vteOLztuE9HOR-UMqcIEP3x4PGnyAGsR0rCV41AX-vKedlumb2Bho3KdoPH3Xc9eD5RXDyLkI0nfdw26N2dpN9Ufa5J7M5NWazDiJF_ohA-O3QOfT8ch9mQvD_QkDz7w8nRB5eJJRrMrbytdelKx_Mv5K0byqKh_i494Vx-im4a8sXBt3AgBO5J67jQhUhnVA-yBy4GVpI-ahvYBQZ0yE7ixzfjwQqw";
  const statCards = (stats.statCards as {
    value: string;
    label: string;
    icon: string;
  }[]) ?? [
    { value: "6+", label: "Projects Orchestrated", icon: "terminal" },
    { value: "10", label: "Technologies Mastered", icon: "verified" },
    { value: "2+", label: "Years of Experience", icon: "history_edu" },
  ];
  const timeline = (stats.timeline as TimelineItem[]) ?? [];
  const skillArtifacts = (stats.skillArtifacts as {
    name: string;
    icon: string;
  }[]) ?? [
    { name: "TypeScript", icon: "code" },
    { name: "Tailwind", icon: "layers" },
    { name: "PostgreSQL", icon: "database" },
  ];

  return (
    <PageFade>
      <SiteNav active="/about" />
      <main className="pb-20 pt-32">
        <section className="mx-auto mb-32 max-w-[1440px] px-6 md:px-12">
          <div className="flex flex-col items-start gap-20 md:flex-row">
            <div className="md:w-1/2">
              <span className="mb-6 block text-[0.75rem] font-bold uppercase tracking-widest text-primary">
                The Visionary
              </span>
              <h1 className="mb-12 text-[2.5rem] font-extrabold leading-[1.1] tracking-tighter md:text-[3.5rem]">
                Crafting digital <br />
                <span className="text-primary-container drop-shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                  landscapes
                </span>{" "}
                with surgical precision.
              </h1>
              <div className="max-w-xl space-y-6 text-[1.125rem] leading-[1.8] text-on-surface-variant">
                {intro.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="relative md:w-1/2">
              <div className="glass-card relative z-10 aspect-square overflow-hidden rounded-xl p-4">
                <NextImage
                  src={portrait}
                  alt="Portrait"
                  width={800}
                  height={800}
                  className="h-full w-full rounded-lg object-cover grayscale transition-all duration-700 hover:grayscale-0"
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-10 -right-10 -z-10 h-64 w-64 rounded-full bg-primary-container/20 blur-[100px]" />
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
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg glass-card">
                    <MIcon name={s.icon} className="text-3xl" />
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
