import NextImage from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Newspaper } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { StaggerIn } from "@/components/motion/stagger-in";
import { RevealText } from "@/components/motion/reveal-text";
import { ProjectDetailLayout } from "@/components/projects/project-detail-layout";
import { Container, Eyebrow, Rule } from "@/components/ui/primitives";
import { DEFAULT_PORTRAIT_SRC } from "@/lib/site-constants";
import { isRemoteImageSrc } from "@/lib/image-url";
import { projectGallerySrcs, projectHeroSrc } from "@/lib/project-media";
import { parseProjectCategories } from "@/lib/project-categories";
import { getProjectBySlug, getProjects } from "@/lib/queries";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProjectPreviewTopbar } from "@/components/admin/project-preview-topbar";

export const revalidate = 30;

type Challenge = { title: string; description: string };
type Resolution = { title: string; description: string };
type Result = { label: string; value: string };

function isDividerParagraph(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  // Treat repeated separator glyphs as a visual divider, not content text.
  return /^[─━\-_*=~·•]{6,}$/.test(t);
}

function paragraphToBullets(text: string): string[] | null {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;
  const bulletLines = lines.filter((line) => /^[-*]\s+/.test(line));
  if (bulletLines.length < 2 || bulletLines.length !== lines.length) return null;
  return bulletLines.map((line) => line.replace(/^[-*]\s+/, "").trim()).filter(Boolean);
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = (await searchParams) ?? {};
  const preview = sp.preview === "1";

  const project = preview
    ? await prisma.project.findFirst({ where: { slug } })
    : await getProjectBySlug(slug);
  if (!project) notFound();

  if (preview) {
    const session = await auth();
    if (!session?.user?.email) redirect("/admin/login");
  }

  const all = preview ? [] : await getProjects();
  const idx = preview ? -1 : all.findIndex((p) => p.id === project.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const challenges = (project.challenges as Challenge[] | null) ?? [];
  const resolutionsRaw =
    ((project as unknown as { resolutions?: unknown }).resolutions as
      | Resolution[]
      | null) ?? [];
  const results = (project.results as Result[] | null) ?? [];
  const resolutions =
    resolutionsRaw.length > 0
      ? resolutionsRaw
      : project.features.slice(0, challenges.length).map((f) => ({
          title: "Feature focus",
          description: f,
        }));
  const heroSrc = projectHeroSrc(project, DEFAULT_PORTRAIT_SRC);
  const artifacts = projectGallerySrcs(project);
  const categories = parseProjectCategories(project.category);

  const links = [
    project.liveLink
      ? { href: project.liveLink, label: "Live demo", Icon: ArrowUpRight }
      : null,
    project.githubLink
      ? { href: project.githubLink, label: "Source", Icon: SiGithub }
      : null,
    project.blogLink
      ? { href: project.blogLink, label: "Blog post", Icon: Newspaper }
      : null,
  ].filter(Boolean) as { href: string; label: string; Icon: typeof ArrowUpRight }[];

  return (
    <PageFade>
      <SiteNav active="/projects" />
      {preview ? (
        <ProjectPreviewTopbar
          projectId={project.id}
          projectTitle={project.title}
          published={project.published}
          topClassName="top-[68px]"
        />
      ) : null}

      <main id="main" className="pb-28 pt-32 md:pt-40">
        <ProjectDetailLayout
          title={project.title}
          githubLink={project.githubLink}
          liveLink={project.liveLink}
          blogLink={project.blogLink}
          header={
            <Container>
              <header className="mb-16 md:mb-24">
                <Rule />
                <div className="flex flex-wrap items-baseline justify-between gap-4 pt-4">
                  <Eyebrow>{preview ? "Preview" : "Case Study"}</Eyebrow>
                  <span className="type-mono-sm text-on-surface-variant">
                    {categories.join(" · ")}
                  </span>
                </div>

                <h1 className="type-display mt-10 max-w-4xl text-on-surface md:mt-14">
                  <RevealText text={project.title} as="span" onLoad delay={0.08} />
                </h1>

                <p className="type-lead mt-8 max-w-2xl text-on-surface-variant">
                  {project.description}
                </p>

                {links.length > 0 ? (
                  <div className="mt-10 flex flex-wrap gap-3">
                    {links.map(({ href, label, Icon }) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="type-mono group inline-flex items-center gap-2.5 rounded-sm border border-outline-variant px-6 py-3.5 text-on-surface transition-colors hover:border-primary hover:text-primary"
                      >
                        <Icon className="size-4 shrink-0" aria-hidden />
                        {label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </header>
            </Container>
          }
        >
          {/* ---------- HERO IMAGE ---------- */}
          <Container>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-outline-variant bg-surface-container-low md:aspect-[21/9]">
              <NextImage
                src={heroSrc}
                alt={project.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                unoptimized={isRemoteImageSrc(heroSrc)}
              />
            </div>
          </Container>

          {/* ---------- OVERVIEW + STICKY META RAIL ---------- */}
          <Container className="mt-24 md:mt-36">
            <div className="grid grid-cols-12 gap-y-14 md:gap-8">
              {/* Sticky metadata */}
              <aside className="col-span-12 md:col-span-3">
                <div className="md:sticky md:top-28">
                  <Rule />
                  <dl className="pt-5">
                    <dt className="type-mono-sm text-on-surface-variant">
                      Stack
                    </dt>
                    <dd className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
                      {project.technologies.map((t) => (
                        <span
                          key={t}
                          className="type-mono-sm text-on-surface"
                        >
                          {t}
                        </span>
                      ))}
                    </dd>

                    <dt className="type-mono-sm mt-8 text-on-surface-variant">
                      Category
                    </dt>
                    <dd className="type-mono-sm mt-3 text-on-surface">
                      {categories.join(" · ")}
                    </dd>

                    {project.features.length > 0 ? (
                      <>
                        <dt className="type-mono-sm mt-8 text-on-surface-variant">
                          Deliverables
                        </dt>
                        <dd className="mt-3">
                          <ul className="flex flex-col gap-2.5">
                            {project.features.map((f) => (
                              <li
                                key={f}
                                className="flex gap-2.5 text-sm leading-relaxed text-on-surface-variant"
                              >
                                <span
                                  aria-hidden
                                  className="mt-2 size-1 shrink-0 bg-primary-container"
                                />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </>
                    ) : null}
                  </dl>
                </div>
              </aside>

              {/* Long-form content */}
              <div className="col-span-12 md:col-span-8 md:col-start-5">
                <Rule />
                <div className="pt-5">
                  <Eyebrow index="01">Overview</Eyebrow>
                </div>
                <div className="type-body mt-10 space-y-6 text-on-surface-variant">
                  {project.content.split("\n\n").map((para, i) =>
                    isDividerParagraph(para) ? (
                      <Rule key={i} className="my-10" />
                    ) : paragraphToBullets(para) ? (
                      <ul key={i} className="space-y-3">
                        {paragraphToBullets(para)!.map((item, idx) => (
                          <li key={`${i}-${idx}`} className="flex gap-3">
                            <span
                              aria-hidden
                              className="mt-2.5 size-1 shrink-0 bg-primary-container"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p key={i} className="whitespace-pre-line">
                        {para}
                      </p>
                    ),
                  )}
                </div>
              </div>
            </div>
          </Container>

          {/* ---------- ARTIFACTS ---------- */}
          {artifacts.length > 0 && (
            <Container className="mt-28 md:mt-40">
              <Rule />
              <div className="flex items-baseline justify-between pt-4">
                <Eyebrow index="02">Artifacts</Eyebrow>
                <span className="type-mono-sm tabular-nums text-on-surface-variant">
                  {String(artifacts.length).padStart(2, "0")}
                </span>
              </div>
              <StaggerIn
                selector="figure"
                className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {artifacts.map((src, i) => (
                  <figure
                    key={src + i}
                    className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-outline-variant bg-surface-container-low"
                  >
                    <NextImage
                      src={src}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      unoptimized={isRemoteImageSrc(src)}
                    />
                    <figcaption className="type-mono-sm absolute bottom-0 left-0 bg-background/85 px-3 py-1.5 text-on-surface-variant backdrop-blur-sm">
                      Fig. {String(i + 1).padStart(2, "0")}
                    </figcaption>
                  </figure>
                ))}
              </StaggerIn>
            </Container>
          )}

          {/* ---------- FRICTION ↔ RESOLUTION LEDGER ---------- */}
          {(challenges.length > 0 || resolutions.length > 0) && (
            <Container className="mt-28 md:mt-40">
              <Rule />
              <div className="pt-4">
                <Eyebrow index="03">Problems &amp; Resolutions</Eyebrow>
              </div>

              <div className="mt-12 md:mt-16">
                {challenges.map((c, i) => {
                  const r = resolutions[i];
                  return (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-y-6 border-t border-outline-variant py-10 last:border-b md:gap-8 md:py-14"
                    >
                      <span className="type-mono col-span-12 tabular-nums text-on-surface-variant md:col-span-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <div className="col-span-12 md:col-span-5">
                        <span className="type-mono-sm text-[color:var(--ember)]">
                          Friction
                        </span>
                        <h3 className="type-h3 mt-3 text-on-surface">
                          {c.title}
                        </h3>
                        <p className="mt-3 leading-relaxed text-on-surface-variant">
                          {c.description}
                        </p>
                      </div>

                      {r ? (
                        <div className="col-span-12 md:col-span-5 md:col-start-8">
                          <span className="type-mono-sm text-primary">
                            Resolution
                          </span>
                          <h3 className="type-h3 mt-3 text-on-surface">
                            {r.title}
                          </h3>
                          <p className="mt-3 leading-relaxed text-on-surface-variant">
                            {r.description}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                {/* Resolutions with no paired challenge still get shown. */}
                {resolutions.slice(challenges.length).map((r, i) => (
                  <div
                    key={`extra-${i}`}
                    className="grid grid-cols-12 gap-y-6 border-t border-outline-variant py-10 last:border-b md:gap-8 md:py-14"
                  >
                    <span className="type-mono col-span-12 tabular-nums text-on-surface-variant md:col-span-1">
                      {String(challenges.length + i + 1).padStart(2, "0")}
                    </span>
                    <div className="col-span-12 md:col-span-5 md:col-start-8">
                      <span className="type-mono-sm text-primary">
                        Resolution
                      </span>
                      <h3 className="type-h3 mt-3 text-on-surface">{r.title}</h3>
                      <p className="mt-3 leading-relaxed text-on-surface-variant">
                        {r.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          )}

          {/* ---------- RESULTS ---------- */}
          {results.length > 0 && (
            <Container className="mt-28 md:mt-40">
              <Rule />
              <div className="pt-4">
                <Eyebrow index="04">Outcomes</Eyebrow>
              </div>
              <dl className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((r, i) => (
                  <div
                    key={r.label}
                    className={`border-t border-outline-variant py-10 ${
                      i % 3 !== 0 ? "lg:border-l lg:pl-8" : ""
                    }`}
                  >
                    <dd className="type-num font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.9] text-primary">
                      {r.value}
                    </dd>
                    <dt className="type-mono-sm mt-3 text-on-surface-variant">
                      {r.label}
                    </dt>
                  </div>
                ))}
              </dl>
              <Rule />
            </Container>
          )}

          {/* ---------- PREV / NEXT ---------- */}
          <Container className="mt-28 md:mt-40">
            <Rule />
            <div className="grid grid-cols-1 md:grid-cols-2">
              {prev ? (
                <Link
                  href={`/projects/${prev.slug}`}
                  className="group flex flex-col gap-2 border-b border-outline-variant py-10 transition-colors hover:bg-surface-container-lowest md:border-b-0 md:border-r md:pr-8"
                >
                  <span className="type-mono-sm flex items-center gap-2 text-on-surface-variant">
                    <ArrowLeft
                      className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1"
                      aria-hidden
                    />
                    Previous
                  </span>
                  <span className="type-h3 text-on-surface transition-colors group-hover:text-primary">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div className="hidden md:block" />
              )}

              {next ? (
                <Link
                  href={`/projects/${next.slug}`}
                  className="group flex flex-col items-start gap-2 border-b border-outline-variant py-10 transition-colors hover:bg-surface-container-lowest md:items-end md:border-b-0 md:pl-8 md:text-right"
                >
                  <span className="type-mono-sm flex items-center gap-2 text-on-surface-variant">
                    Next
                    <ArrowRight
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                  <span className="type-h3 text-on-surface transition-colors group-hover:text-primary">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <div className="hidden md:block" />
              )}
            </div>
            <Rule />

            <div className="mt-10 flex justify-center">
              <Link
                href="/projects"
                className="type-mono link-wipe inline-flex items-center gap-2 text-on-surface-variant transition-colors hover:text-primary"
              >
                <ArrowLeft className="size-3.5" aria-hidden />
                All projects
              </Link>
            </div>
          </Container>
        </ProjectDetailLayout>
      </main>
    </PageFade>
  );
}
