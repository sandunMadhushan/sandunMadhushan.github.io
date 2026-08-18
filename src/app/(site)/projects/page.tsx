import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { RevealText } from "@/components/motion/reveal-text";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { Container, Eyebrow, Rule } from "@/components/ui/primitives";
import { getProjects } from "@/lib/queries";

export const revalidate = 30;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <SiteNav active="/projects" />
      <PageFade>
        <main id="main" className="pb-28 pt-32 md:pt-40">
          <Container>
            <header className="mb-20 md:mb-28">
              <Rule />
              <div className="flex flex-wrap items-baseline justify-between gap-4 pt-4">
                <Eyebrow>Index of work</Eyebrow>
                <span className="type-mono-sm tabular-nums text-on-surface-variant">
                  {String(projects.length).padStart(2, "0")} total
                </span>
              </div>

              <h1 className="type-mega mt-10 text-on-surface md:mt-14">
                <RevealText text="Selected" as="span" onLoad delay={0.08} />
                <br />
                <span className="text-primary">
                  <RevealText text="Works" as="span" onLoad delay={0.18} />
                </span>
              </h1>

              <p className="type-lead mt-10 max-w-2xl text-on-surface-variant">
                Coursework highlights, personal builds, and experiments from my
                journey as a Software Engineering student—full-stack web apps
                with clear structure and attention to UX.
              </p>
            </header>

            <ProjectsGrid projects={projects} />
          </Container>
        </main>
      </PageFade>
    </>
  );
}
