import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { getProjects } from "@/lib/queries";

export const revalidate = 30;

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
          <p className="body-lg max-w-2xl text-on-surface-variant/75">
            Coursework highlights, personal builds, and experiments from my journey as
            a Software Engineering student—full-stack web apps with clear structure and
            attention to UX.
          </p>
        </header>
        <ProjectsGrid projects={projects} />
      </main>
    </PageFade>
  );
}
