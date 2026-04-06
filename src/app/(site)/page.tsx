import NextImage from "next/image";
import LinkNext from "next/link";
import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { HeroFloat } from "@/components/motion/hero-float";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { CountUpOnView } from "@/components/motion/count-up-on-view";
import { MIcon } from "@/components/m-icon";
import { HeroTechBadges } from "@/components/public/hero-tech-badges";
import { normalizeHeroTechChips } from "@/lib/hero-tech-chips";
import { resolveHeroTagline, resolveHomeAboutBody } from "@/lib/about-content";
import { resolvePortraitSrc } from "@/lib/site-constants";
import { getAbout, getFeaturedProjects, getProjects } from "@/lib/queries";

/** Cache page shell so prefetched routes feel instant; refresh every 30s. */
export const revalidate = 30;

export default async function HomePage() {
  const [about, featured, allProjects] = await Promise.all([
    getAbout(),
    getFeaturedProjects(3),
    getProjects(),
  ]);

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

  let showcase = featured;
  if (showcase.length < 3) {
    const rest = allProjects.filter(
      (p) => !showcase.find((f) => f.id === p.id),
    );
    showcase = [...showcase, ...rest].slice(0, 3);
  }

  return (
    <PageFade>
      <SiteNav active="/" />
      <main className="pt-0">
        <section className="relative isolate box-border flex min-h-[100dvh] w-full flex-col justify-center overflow-x-clip pt-28 pb-10 md:pt-28 md:pb-12 lg:pt-20 lg:pb-10">
          {/* Full-bleed indigo ambient — not clipped by max-width container */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-[radial-gradient(ellipse_75%_90%_at_72%_45%,rgba(79,70,229,0.32),rgba(79,70,229,0.09)_42%,transparent_68%)]"
          />
          <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-12">
          <div className="z-10 space-y-6">
            <div className="label-md inline-flex items-center gap-2 rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Open to internships &amp; collaborations
            </div>
            <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tighter text-on-surface md:text-7xl">
              Sandun <br />{" "}
              <span className="text-primary-container">Madhushan</span>
            </h1>
            <p className="max-w-lg text-xl font-medium leading-relaxed text-on-surface-variant md:text-2xl">
              {tagline}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <LinkNext
                href="/projects"
                className="rounded-lg bg-primary-container px-8 py-4 font-bold text-on-primary-container shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all hover:brightness-110 active:scale-95"
              >
                View Projects
              </LinkNext>
              <LinkNext
                href="/contact"
                className="rounded-lg border border-outline-variant bg-transparent px-8 py-4 font-bold text-on-surface transition-all hover:bg-surface-bright active:scale-95"
              >
                Contact Me
              </LinkNext>
            </div>
          </div>
          <div className="relative flex w-full items-center justify-center md:justify-end md:-translate-x-5 lg:-translate-x-8">
            {/* Soft indigo bloom behind the portrait (matches reference glow) */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[min(92vw,520px)] w-[min(78vw,420px)] -translate-x-1/2 -translate-y-1/2 scale-110 rounded-full bg-primary-container/25 blur-[118px] md:scale-125"
            />
            <HeroFloat>
              <div className="group relative z-10 w-full max-w-[400px] shrink-0">
                {/* Gradient halo ring */}
                <div className="absolute -inset-[3px] rounded-[1.35rem] bg-gradient-to-r from-primary-container via-secondary to-primary-container opacity-40 blur-[2px] transition duration-1000 group-hover:opacity-65" />
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary-container via-secondary to-primary-container opacity-25 blur-md transition duration-1000 group-hover:opacity-45" />
                {/* Dark frame + lifted indigo shadow */}
                <div className="relative overflow-hidden rounded-3xl bg-surface-container-low p-2 shadow-[0_0_58px_-12px_rgba(79,70,229,0.5),0_28px_60px_-18px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.07]">
                  <NextImage
                    src={profileImage}
                    alt="Sandun Madhushan"
                    width={400}
                    height={500}
                    className="h-[min(400px,88vw)] w-full max-w-[400px] origin-[center_22%] scale-[1.14] rounded-2xl object-cover object-[center_22%] grayscale transition-all duration-700 [@media(hover:none)]:grayscale-0 [@media(hover:hover)]:group-hover:scale-[1.18] [@media(hover:hover)]:group-hover:grayscale-0 md:h-[500px]"
                    priority
                    unoptimized={profileImage.startsWith("http")}
                  />
                </div>
                {/* Floating skill chips — official brand marks via react-icons (Simple Icons) */}
                <HeroTechBadges chips={heroTechChips} />
              </div>
            </HeroFloat>
          </div>
          </div>
        </section>

        <ScrollReveal>
          <section className="bg-surface-container-low py-32">
            <div className="mx-auto max-w-[1440px] px-6 md:px-12">
              <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                    Portfolio Selection
                  </h2>
                  <h3 className="text-4xl font-bold tracking-tight">
                    Featured Projects
                  </h3>
                </div>
                <LinkNext
                  href="/projects"
                  className="flex items-center gap-2 text-on-surface-variant transition-colors hover:text-primary"
                >
                  Explore All <MIcon name="arrow_right_alt" />
                </LinkNext>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {showcase.map((p) => (
                  <LinkNext
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="group relative overflow-hidden rounded-xl bg-surface-container transition-all duration-500 hover:translate-y-[-8px]"
                  >
                    <div className="h-64 overflow-hidden">
                      <NextImage
                        src={p.images[0] ?? profileImage}
                        alt={p.title}
                        width={640}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized={(p.images[0] ?? "").startsWith("http")}
                      />
                    </div>
                    <div className="space-y-4 p-8">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary-fixed-dim">
                        {p.category}
                      </span>
                      <h4 className="text-2xl font-bold">{p.title}</h4>
                      <p className="text-sm leading-relaxed text-on-surface-variant">
                        {p.description}
                      </p>
                    </div>
                  </LinkNext>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="mx-auto max-w-[1440px] px-6 py-32 md:px-12">
            <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
              <div className="space-y-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  About me
                </h2>
                <h3 className="text-4xl font-extrabold tracking-tight">
                  {homeAboutHeadline}
                </h3>
                <p className="text-lg leading-relaxed text-on-surface-variant">
                  {homeAboutBody}
                </p>
                <div className="grid grid-cols-3 gap-8 pt-6">
                  {homeStats.map((s) => (
                    <div key={s.label}>
                      <div className="mb-1 text-4xl font-bold text-primary">
                        <CountUpOnView value={s.value} />
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface/50">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-surface-container p-12">
                <div className="absolute right-0 top-0 p-8 opacity-10">
                  <MIcon name="architecture" className="text-[120px]" />
                </div>
                <div className="space-y-6">
                  {[
                    {
                      icon: "bolt",
                      t: "Performance-aware builds",
                      d: "Faster loads and clearer UX—without sacrificing readability.",
                    },
                    {
                      icon: "shield",
                      t: "Maintainable structure",
                      d: "Code organized so teammates (and future me) can follow along.",
                    },
                    {
                      icon: "palette",
                      t: "Design-to-implementation",
                      d: "Turning layouts and specs into polished, responsive interfaces.",
                    },
                  ].map((x) => (
                    <div
                      key={x.t}
                      className="flex items-center gap-4 rounded-lg border-l-2 border-primary bg-surface-container-high p-4"
                    >
                      <MIcon name={x.icon} className="text-primary" />
                      <div>
                        <h5 className="text-sm font-bold">{x.t}</h5>
                        <p className="text-xs text-on-surface-variant">{x.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="mx-auto mb-32 max-w-[1440px] px-6 md:px-12">
            <div className="relative space-y-8 overflow-hidden rounded-[2rem] bg-primary-container p-16 text-center shadow-[0_40px_100px_rgba(79,70,229,0.35)] md:p-24">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.22),transparent_55%)]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 to-black/25" />
              <h2 className="relative z-10 text-4xl font-black tracking-tighter text-white drop-shadow-sm md:text-6xl">
                Want to work together?
              </h2>
              <p className="relative z-10 mx-auto max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
                I&apos;m open to internships, academic collaborations, and small
                full-stack web projects—tell me what you have in mind.
              </p>
              <LinkNext
                href="/contact"
                className="relative z-10 inline-flex items-center justify-center rounded-full bg-white px-12 py-5 text-lg font-bold text-primary-container shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all hover:bg-zinc-100 hover:text-[#4338ca] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Contact Me Now
              </LinkNext>
            </div>
          </section>
        </ScrollReveal>
      </main>
    </PageFade>
  );
}
