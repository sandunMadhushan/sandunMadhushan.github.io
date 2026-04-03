import NextImage from "next/image";
import LinkNext from "next/link";
import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { HeroFloat } from "@/components/motion/hero-float";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { MIcon } from "@/components/m-icon";
import { getAbout, getFeaturedProjects, getProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [about, featured, allProjects] = await Promise.all([
    getAbout(),
    getFeaturedProjects(3),
    getProjects(),
  ]);

  const stats = (about?.stats as Record<string, unknown>) ?? {};
  const tagline =
    (stats.heroTagline as string) ??
    "Full-Stack Developer building modern, scalable web applications with editorial precision.";
  const profileImage = (stats.profileImage as string) || "/vercel.svg";
  const homeAboutHeadline = (stats.homeAboutHeadline as string) ?? "Crafting code like architecture.";
  const homeAboutBody =
    (stats.homeAboutBody as string) ??
    "I am a Full-Stack Developer based in Colombo, obsessed with the intersection of clean code and editorial design.";
  const homeStats = (stats.homeStats as { value: string; label: string }[]) ?? [
    { value: String(stats.projects ?? "6"), label: "Projects Delivered" },
    { value: String(stats.technologies ?? "10"), label: "Tech Stack" },
    { value: String(stats.experience ?? "2+"), label: "Years Experience" },
  ];

  let showcase = featured;
  if (showcase.length < 3) {
    const rest = allProjects.filter((p) => !showcase.find((f) => f.id === p.id));
    showcase = [...showcase, ...rest].slice(0, 3);
  }

  return (
    <PageFade>
      <SiteNav active="/" />
      <main className="pt-24">
        <section className="mx-auto flex min-h-[819px] max-w-[1440px] flex-col items-center gap-16 overflow-hidden px-6 py-20 md:grid md:grid-cols-2 md:px-12">
          <div className="z-10 space-y-8">
            <div className="label-md inline-flex items-center gap-2 rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Available for New Projects
            </div>
            <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tighter text-on-surface md:text-7xl">
              Sandun <br /> <span className="text-primary-container">Madhushan</span>
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
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 scale-150 rounded-full bg-primary-container/20 blur-[120px]" />
            <HeroFloat>
              <div className="relative group">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary-container via-secondary to-primary-container opacity-30 blur transition duration-1000 group-hover:opacity-60" />
                <div className="relative overflow-hidden rounded-3xl bg-surface-container-low p-2">
                  <NextImage
                    src={profileImage}
                    alt="Sandun Madhushan"
                    width={400}
                    height={500}
                    className="h-[400px] w-[min(100%,400px)] rounded-2xl object-cover grayscale transition-all duration-700 hover:scale-[1.02] hover:grayscale-0 md:h-[500px]"
                    priority
                    unoptimized={profileImage.startsWith("http")}
                  />
                </div>
                <div className="glass-panel absolute -right-6 -top-6 flex items-center gap-3 rounded-xl border border-outline-variant/20 p-4 shadow-2xl">
                  <MIcon name="javascript" className="text-3xl text-primary" />
                  <span className="text-sm font-bold tracking-tight">React.js</span>
                </div>
                <div className="glass-panel absolute top-1/2 -left-12 flex items-center gap-3 rounded-xl border border-outline-variant/20 p-4 shadow-2xl max-md:hidden">
                  <MIcon name="terminal" className="text-3xl text-tertiary" />
                  <span className="text-sm font-bold tracking-tight">TypeScript</span>
                </div>
                <div className="glass-panel absolute -bottom-8 right-12 flex items-center gap-3 rounded-xl border border-outline-variant/20 p-4 shadow-2xl max-md:hidden">
                  <MIcon name="layers" className="text-3xl text-secondary" />
                  <span className="text-sm font-bold tracking-tight">Full Stack</span>
                </div>
              </div>
            </HeroFloat>
          </div>
        </section>

        <ScrollReveal>
          <section className="bg-surface-container-low py-32">
            <div className="mx-auto max-w-[1440px] px-6 md:px-12">
              <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Portfolio Selection</h2>
                  <h3 className="text-4xl font-bold tracking-tight">Featured Projects</h3>
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
                      <p className="text-sm leading-relaxed text-on-surface-variant">{p.description}</p>
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
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">About the Developer</h2>
                <h3 className="text-4xl font-extrabold tracking-tight">{homeAboutHeadline}</h3>
                <p className="text-lg leading-relaxed text-on-surface-variant">{homeAboutBody}</p>
                <div className="grid grid-cols-3 gap-8 pt-6">
                  {homeStats.map((s) => (
                    <div key={s.label}>
                      <div className="mb-1 text-4xl font-bold text-primary">{s.value}</div>
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
                    { icon: "bolt", t: "Performance First", d: "Optimized Core Web Vitals for every build." },
                    { icon: "shield", t: "Scalable Architecture", d: "Clean, maintainable, and modular codebase." },
                    { icon: "palette", t: "Design-Led Development", d: "Pixel-perfect translation from design to code." },
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
            <div className="relative space-y-8 overflow-hidden rounded-[2rem] bg-primary-container p-16 text-center shadow-[0_40px_100px_rgba(79,70,229,0.3)] md:p-24">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)]" />
              <h2 className="text-4xl font-black tracking-tighter text-on-primary md:text-6xl">
                Ready to start a project?
              </h2>
              <p className="mx-auto max-w-2xl text-xl opacity-80 text-on-primary-container">
                Let&apos;s collaborate to build something exceptional — SaaS, e-commerce, or custom web apps.
              </p>
              <LinkNext
                href="/contact"
                className="relative z-10 inline-block rounded-full bg-on-primary px-12 py-5 text-lg font-black text-primary-container transition-all hover:bg-surface-bright hover:text-on-surface active:scale-95"
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
