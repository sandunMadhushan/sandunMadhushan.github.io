import NextImage from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { MIcon } from "@/components/m-icon";
import { DEFAULT_PORTRAIT_SRC } from "@/lib/site-constants";
import { isRemoteImageSrc } from "@/lib/image-url";
import { getProjectBySlug, getProjects } from "@/lib/queries";

export const revalidate = 30;

type Challenge = { title: string; description: string };
type Result = { label: string; value: string };

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const all = await getProjects();
  const idx = all.findIndex((p) => p.id === project.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  const challenges = (project.challenges as Challenge[] | null) ?? [];
  const results = (project.results as Result[] | null) ?? [];
  const gallery = project.images.length ? project.images : [DEFAULT_PORTRAIT_SRC];

  return (
    <PageFade>
      <SiteNav active="/projects" />
      <main className="pb-24 pt-32">
        <header className="mx-auto mb-24 max-w-[1440px] px-6 md:px-12">
          <div className="grid grid-cols-1 items-end gap-12 md:grid-cols-12">
            <div className="md:col-span-8">
              <span className="label-md mb-4 block font-bold uppercase tracking-widest text-primary">
                Case Study
              </span>
              <h1 className="mb-6 text-[2.5rem] font-extrabold leading-[0.95] tracking-tighter md:max-w-3xl md:text-[3.5rem]">
                {project.title}
              </h1>
              <p className="max-w-2xl text-xl font-medium leading-relaxed text-on-surface-variant">
                {project.description}
              </p>
            </div>
            <div className="flex flex-col gap-4 md:col-span-4">
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-primary-container py-4 text-lg font-bold text-on-primary-container shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all hover:opacity-90"
                >
                  <MIcon name="launch" />
                  Live Demo
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-outline-variant/15 bg-surface-container-high py-4 text-lg font-bold text-on-surface transition-all hover:bg-surface-bright"
                >
                  <MIcon name="code" />
                  View GitHub
                </a>
              )}
            </div>
          </div>
        </header>

        <section className="mx-auto mb-32 max-w-[1440px] px-6 md:px-12">
          <div className="relative h-[400px] w-full overflow-hidden rounded-xl group md:h-[600px]">
            <NextImage
              src={gallery[0]}
              alt={project.title}
              fill
              className="object-cover"
              priority
              unoptimized={isRemoteImageSrc(gallery[0])}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
          </div>
        </section>

        <section className="mx-auto mb-40 grid max-w-[1440px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-7">
            <h2 className="mb-8 text-[1.75rem] font-semibold tracking-tight text-on-surface">The Vision &amp; Overview</h2>
            <div className="space-y-6 text-lg leading-[1.6] text-on-surface-variant">
              {project.content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
          <div className="space-y-12 md:col-span-5">
            <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-10">
              <div className="absolute left-0 top-0 h-full w-1 bg-primary-container" />
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">Highlights</h3>
              <p className="mb-6 text-xl font-medium">Core deliverables</p>
              <ul className="space-y-3 text-on-surface-variant">
                {project.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <MIcon name="check_circle" className="mt-1 text-sm text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tech Stack</h3>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-outline-variant/15 bg-surface-container-high px-4 py-2 text-sm font-semibold text-primary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {gallery.length > 1 && (
          <section className="mx-auto mb-40 max-w-[1440px] px-6 md:px-12">
            <h2 className="mb-12 text-[1.75rem] font-semibold tracking-tight text-on-surface">Project Artifacts</h2>
            <div className="grid grid-cols-1 gap-6 md:h-[800px] md:grid-cols-4 md:grid-rows-2">
              {gallery.slice(1, 5).map((src, i) => (
                <div
                  key={src + i}
                  className={`group relative min-h-[220px] cursor-pointer overflow-hidden rounded-xl bg-surface-container md:min-h-0 ${
                    i === 0 ? "md:col-span-2 md:row-span-2" : i === 1 ? "md:col-span-2" : ""
                  }`}
                >
                  <NextImage
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized={isRemoteImageSrc(src)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-primary-container/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <MIcon name="zoom_in" className="text-4xl text-white" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {challenges.length > 0 && (
          <section className="mx-auto mb-40 max-w-[1440px] px-6 md:px-12">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div className="space-y-8">
                <h2 className="text-[1.75rem] font-semibold tracking-tight text-on-surface">The Friction</h2>
                {challenges.map((c, i) => (
                  <div key={i} className="rounded-r-lg border-l-4 border-error/50 bg-surface-container-lowest p-8">
                    <h4 className="mb-3 text-lg font-bold text-on-surface">{c.title}</h4>
                    <p className="leading-relaxed text-on-surface-variant">{c.description}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-8">
                <h2 className="text-[1.75rem] font-semibold tracking-tight text-on-surface">The Resolution</h2>
                {project.features.slice(0, challenges.length).map((f, i) => (
                  <div key={i} className="rounded-r-lg border-l-4 border-primary-container bg-surface-container-low p-8">
                    <h4 className="mb-3 text-lg font-bold text-primary">Feature focus</h4>
                    <p className="leading-relaxed text-on-surface-variant">{f}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {results.length > 0 && (
          <section className="mx-auto mb-40 max-w-[1440px] px-6 md:px-12">
            <div className="relative flex flex-col items-center justify-between gap-12 overflow-hidden rounded-2xl bg-primary-container p-16 md:flex-row">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3323cc,transparent_70%)] opacity-50" />
              <div className="relative z-10 text-center md:text-left">
                <h2 className="mb-4 text-4xl font-black text-on-primary-container">Impact Driven.</h2>
                <p className="max-w-md text-xl text-on-primary-container/80">Outcomes from shipping this build.</p>
              </div>
              <div className="relative z-10 flex flex-wrap justify-center gap-12">
                {results.map((r) => (
                  <div key={r.label} className="text-center">
                    <div className="mb-2 text-6xl font-black text-white">{r.value}</div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-on-primary-container/60">
                      {r.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto mb-32 flex max-w-[1440px] flex-col items-center justify-between gap-8 border-t border-outline-variant/10 px-6 pt-20 md:flex-row md:px-12">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group flex items-center gap-4 text-on-surface-variant transition-colors hover:text-on-surface"
            >
              <MIcon name="arrow_back" className="transition-transform group-hover:-translate-x-2" />
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/45">
                  Previous
                </span>
                <span className="text-xl font-bold">{prev.title}</span>
              </div>
            </Link>
          ) : (
            <div />
          )}
          <Link
            href="/projects"
            className="rounded-full border border-outline-variant/15 bg-surface-container-high px-10 py-5 font-bold transition-all hover:bg-surface-bright"
          >
            Back to Projects
          </Link>
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group flex items-center gap-4 text-right text-on-surface-variant transition-colors hover:text-on-surface"
            >
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/45">
                  Next Project
                </span>
                <span className="text-xl font-bold">{next.title}</span>
              </div>
              <MIcon name="arrow_forward" className="transition-transform group-hover:translate-x-2" />
            </Link>
          ) : (
            <div />
          )}
        </section>

        <div className="fixed bottom-8 left-8 z-40 hidden max-w-[280px] lg:block">
          <div className="relative overflow-hidden rounded-lg border border-outline-variant/15 bg-surface-container-lowest p-4 shadow-lg">
            <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
            <div className="mb-2 font-mono text-[10px] text-primary/60">// deploy_status.sh</div>
            <div className="font-mono text-[11px] leading-tight text-on-surface-variant">
              system.status == &quot;optimized&quot;
              <br />
              metrics.load &lt; 0.04
              <br />
              env.sync(&quot;active&quot;)
            </div>
          </div>
        </div>
      </main>
    </PageFade>
  );
}
