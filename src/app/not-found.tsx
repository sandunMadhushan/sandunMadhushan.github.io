import Link from "next/link";
import { PageFade } from "@/components/motion/page-fade";
import { MIcon } from "@/components/m-icon";
import { SiteNav } from "@/components/public/site-nav";

export default function NotFound() {
  return (
    <PageFade>
      <SiteNav />
      <main className="relative flex min-h-screen items-center overflow-hidden px-6 pb-24 pt-32 md:px-12">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-12%] top-[-12%] h-[38rem] w-[38rem] rounded-full bg-primary-container/10 blur-[120px]" />
          <div className="absolute bottom-[-18%] right-[-12%] h-[36rem] w-[36rem] rounded-full bg-primary/10 blur-[140px]" />
        </div>

        <section className="relative mx-auto w-full max-w-4xl rounded-2xl border border-outline-variant/15 bg-surface-container-low/70 p-8 shadow-2xl backdrop-blur md:p-12">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-high px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            <MIcon name="warning" className="text-sm" />
            404 Error
          </p>

          <h1 className="mb-5 text-5xl font-black tracking-tighter text-on-surface md:text-7xl">
            Page Not Found
          </h1>
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
            This link does not exist anymore, or it may have been moved. Use one of the
            options below to continue exploring the portfolio.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-6 py-3 font-semibold text-on-primary-container transition-all hover:brightness-110 active:scale-95"
            >
              <MIcon name="home" className="text-lg" />
              Back to Home
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-high px-6 py-3 font-semibold text-on-surface transition-all hover:bg-surface-bright active:scale-95"
            >
              <MIcon name="work" className="text-lg" />
              View Projects
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/20 bg-transparent px-6 py-3 font-semibold text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface active:scale-95"
            >
              <MIcon name="mail" className="text-lg" />
              Contact Me
            </Link>
          </div>
        </section>
      </main>
    </PageFade>
  );
}
