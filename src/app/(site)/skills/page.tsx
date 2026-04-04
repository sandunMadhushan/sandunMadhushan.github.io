import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { MIcon } from "@/components/m-icon";
import { SkillTechIcon } from "@/components/skill-tech-icon";
import Link from "next/link";
import { resolveSkillDescription } from "@/lib/skill-auto";
import { getAbout, getSkills } from "@/lib/queries";

export const revalidate = 30;

export default async function SkillsPage() {
  const [skills, about] = await Promise.all([getSkills(), getAbout()]);
  const stats = (about?.stats as Record<string, unknown>) ?? {};
  const cta =
    (stats.ctaSpecialization as string) ??
    "Full-stack web apps, TypeScript/React, and APIs—always learning deeper.";

  const presentation = skills.filter(
    (s) => s.category === "Frontend" || s.category === "Languages",
  );
  const backend = skills.filter((s) => s.category === "Backend");
  const mobile = skills.filter((s) => s.category === "Mobile");
  const database = skills.filter((s) => s.category === "Database");
  const tools = skills.filter((s) => s.category === "Tools");

  return (
    <PageFade>
      <SiteNav active="/skills" />
      <main className="mx-auto max-w-[1440px] px-6 pb-20 pt-32 md:px-12">
        <header className="mb-24">
          <h1 className="mb-6 text-4xl font-black leading-[1.05] tracking-tighter text-on-surface sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem]">
            Expertise &amp; <br />
            <span className="text-primary-container">Capabilities</span>
          </h1>
          <p className="max-w-2xl text-lg leading-[1.6] text-on-surface-variant">
            Tools and languages I use in coursework and personal projects as I grow
            toward a career in software engineering—frontend, backend, and everything
            in between.
          </p>
        </header>

        <ScrollReveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <section className="glass-card group rounded-xl p-8 transition-all duration-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.15)] md:col-span-8">
              <div className="mb-12 flex items-end justify-between">
                <div>
                  <span className="label-md mb-2 block text-[0.75rem] font-bold uppercase tracking-widest text-primary">
                    01 / Presentation Layer
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Frontend &amp; Languages
                  </h2>
                </div>
                <MIcon name="devices" className="text-4xl text-primary/40" />
              </div>
              <div className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
                {presentation.length === 0 && (
                  <p className="col-span-full text-sm text-on-surface-variant/70">
                    No frontend or language skills yet — add them in the admin.
                  </p>
                )}
                {presentation.map((s) => (
                  <div key={s.id} className="flex items-center gap-6">
                    <span className="text-on-surface-variant transition-colors group-hover:text-primary">
                      <SkillTechIcon name={s.name} iconKey={s.icon} size={32} />
                    </span>
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-sm text-on-surface-variant">
                        {resolveSkillDescription(s.description, s.name, s.icon)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="group rounded-xl bg-surface-container-low p-8 transition-colors duration-300 hover:bg-surface-container md:col-span-4">
              <span className="label-md mb-2 block text-[0.75rem] font-bold uppercase tracking-widest text-primary">
                02 / Logic
              </span>
              <h2 className="mb-8 text-2xl font-bold tracking-tight">
                Backend Core
              </h2>
              <div className="space-y-8">
                {backend.length === 0 && (
                  <p className="text-sm text-on-surface-variant/70">No backend skills listed.</p>
                )}
                {backend.map((s) => (
                  <div key={s.id} className="flex items-center gap-6">
                    <span className="text-on-surface-variant transition-colors group-hover:text-primary">
                      <SkillTechIcon name={s.name} iconKey={s.icon} size={32} />
                    </span>
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-sm text-on-surface-variant">
                        {resolveSkillDescription(s.description, s.name, s.icon)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-card group rounded-xl p-8 transition-all duration-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.12)] md:col-span-12">
              <div className="mb-10 flex items-end justify-between">
                <div>
                  <span className="label-md mb-2 block text-[0.75rem] font-bold uppercase tracking-widest text-primary">
                    03 / Native &amp; Mobile
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Platforms &amp; devices
                  </h2>
                </div>
                <MIcon name="smartphone" className="text-4xl text-primary/40" />
              </div>
              <div className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
                {mobile.length === 0 && (
                  <p className="col-span-full text-sm text-on-surface-variant/70">
                    No mobile or native platform skills yet — add them in the admin.
                  </p>
                )}
                {mobile.map((s) => (
                  <div key={s.id} className="flex items-center gap-6">
                    <span className="text-on-surface-variant transition-colors group-hover:text-primary">
                      <SkillTechIcon name={s.name} iconKey={s.icon} size={32} />
                    </span>
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-sm text-on-surface-variant">
                        {resolveSkillDescription(s.description, s.name, s.icon)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border-l-2 border-primary-container/20 bg-surface-container-low p-8 md:col-span-4">
              <span className="label-md mb-2 block text-[0.75rem] font-bold uppercase tracking-widest text-primary">
                04 / Persistence
              </span>
              <h2 className="mb-6 text-xl font-bold tracking-tight">
                Database Systems
              </h2>
              <ul className="space-y-4">
                {database.length === 0 && (
                  <li className="rounded-lg bg-surface-container p-4 text-sm text-on-surface-variant/70">
                    No database skills listed.
                  </li>
                )}
                {database.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-lg bg-surface-container p-4"
                  >
                    <span className="font-medium text-on-surface">
                      {s.name}
                    </span>
                    <span className="text-primary">
                      <SkillTechIcon name={s.name} iconKey={s.icon} size={24} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="glass-card rounded-xl p-8 md:col-span-8">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">
                  The Digital Workbench
                </h2>
                <span className="font-mono text-sm text-on-surface-variant">
                  05 / Infrastructure &amp; Workflow
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                {tools.length === 0 && (
                  <p className="w-full text-sm text-on-surface-variant/70">No tools listed.</p>
                )}
                {tools.map((s) => (
                  <div
                    key={s.id}
                    className="flex cursor-default items-center gap-3 rounded-lg border border-outline-variant/10 bg-surface-container-highest px-6 py-3 transition-colors hover:border-primary-container/50"
                  >
                    <span className="text-primary">
                      <SkillTechIcon name={s.name} iconKey={s.icon} size={22} />
                    </span>
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative mt-24 flex flex-col items-stretch justify-between gap-8 overflow-hidden rounded-2xl bg-primary-container p-10 shadow-[0_40px_80px_rgba(79,70,229,0.28)] md:flex-row md:items-center md:gap-12 md:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_90%_-10%,rgba(255,255,255,0.2),transparent_55%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 to-black/25"
            />
            <div className="relative z-10 text-center md:min-w-0 md:flex-1 md:text-left">
              <h3 className="mb-4 text-2xl font-black tracking-tighter text-white drop-shadow-sm md:text-3xl">
                Current Specialization
              </h3>
              <p className="max-w-lg text-base leading-relaxed text-white/90 md:text-lg">{cta}</p>
            </div>
            <div className="relative z-10 flex w-full shrink-0 justify-center md:w-auto md:justify-end">
              <Link
                href="/projects"
                className="inline-flex w-full min-w-[200px] items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-primary-container shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-0.5 hover:bg-zinc-100 hover:text-[#4338ca] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[0.98] md:w-auto"
              >
                View Case Studies
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </main>
    </PageFade>
  );
}
