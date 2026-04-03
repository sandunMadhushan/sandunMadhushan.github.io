import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { getProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <PageFade>
      <SiteNav active="/projects" />
      <main className="mx-auto max-w-[1440px] px-6 pb-24 pt-32 md:px-12">
        <header className="mb-16">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tighter text-on-surface md:text-7xl">
            Selected Works
          </h1>
          <p className="body-lg max-w-2xl leading-relaxed text-[#e5e2e3]/60">
            Exploring the intersection of human-centric design and scalable architecture. A collection of digital
            experiences built with precision and intent.
          </p>
        </header>
        <ProjectsGrid projects={projects} />
      </main>
    </PageFade>
  );
}
