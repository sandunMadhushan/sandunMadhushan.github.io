import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { MIcon } from "@/components/m-icon";
import Link from "next/link";
import { getAbout, getSkills } from "@/lib/queries";

export const revalidate = 30;

const iconFor = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("react") || n.includes("next")) return "javascript";
  if (n.includes("tailwind")) return "palette";
  if (n.includes("typescript") || n.includes("javascript")) return "javascript";
  if (n.includes("framer")) return "animation";
  if (n.includes("node")) return "api";
  if (n.includes("express")) return "terminal";
  if (n.includes("mongo")) return "data_object";
  if (n.includes("postgres")) return "database";
  if (n.includes("git")) return "commit";
  return "code";
};

/** `variable` is not a reliable Material Symbols ligature and renders as literal text. */
function resolveSkillIcon(stored: string | null | undefined, name: string) {
  if (!stored || stored === "variable") return iconFor(name);
  return stored;
}

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
              <div className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
                {presentation.length === 0 && (
                  <p className="col-span-full text-sm text-on-surface-variant/70">
                    No frontend or language skills yet — add them in the admin.
                  </p>
                )}
                {presentation.map((s) => {
                  const pct = s.proficiency ?? 88;
                  return (
                    <div key={s.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-highest">
                            <MIcon
                              name={resolveSkillIcon(s.icon, s.name)}
                              className="text-primary"
                            />
                          </div>
                          <span className="text-lg font-semibold">
                            {s.name}
                          </span>
                        </div>
                        <span className="font-mono text-sm text-primary">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-[2px] w-full overflow-hidden rounded-full bg-surface-container-highest">
                        <div
                          className="h-full bg-primary-container shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
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
                    <MIcon
                      name={resolveSkillIcon(s.icon, s.name)}
                      className="text-3xl text-on-surface-variant transition-colors group-hover:text-primary"
                    />
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-sm text-on-surface-variant">
                        {s.description ?? "Production APIs"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border-l-2 border-primary-container/20 bg-surface-container-low p-8 md:col-span-4">
              <span className="label-md mb-2 block text-[0.75rem] font-bold uppercase tracking-widest text-primary">
                03 / Persistence
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
                    <MIcon name="database" className="text-primary" />
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
                  Infrastructure &amp; Workflow
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
                    <MIcon
                      name={resolveSkillIcon(s.icon, s.name)}
                      className="text-primary"
                    />
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative mt-24 flex flex-col items-center justify-between overflow-hidden rounded-xl bg-gradient-to-r from-primary-container to-[#3323cc] p-12 md:flex-row">
            <div className="relative z-10 mb-8 text-center md:mb-0 md:text-left">
              <h3 className="mb-4 text-3xl font-black tracking-tighter text-on-primary">
                Current Specialization
              </h3>
              <p className="max-w-lg text-on-primary/80">{cta}</p>
            </div>
            <div className="relative z-10">
              <Link
                href="/projects"
                className="rounded-lg bg-on-primary px-8 py-4 font-bold text-primary-container transition-colors hover:bg-surface-bright"
              >
                View Case Studies
              </Link>
            </div>
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-on-primary/10 blur-3xl" />
          </div>
        </ScrollReveal>
      </main>
    </PageFade>
  );
}
