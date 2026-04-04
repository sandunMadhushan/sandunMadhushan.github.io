import NextImage from "next/image";
import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { ContactForm } from "@/components/contact/contact-form";
import { MIcon } from "@/components/m-icon";
import { resolvePortraitSrc } from "@/lib/site-constants";
import { getAbout, getSocialLinks } from "@/lib/queries";
import { ContactSocialRow } from "@/components/public/public-social-blocks";

export const revalidate = 30;

export default async function ContactPage() {
  const [about, socialLinks] = await Promise.all([
    getAbout(),
    getSocialLinks(),
  ]);
  const stats = (about?.stats as Record<string, unknown>) ?? {};
  const profile = resolvePortraitSrc(stats.profileImage as string | undefined);

  return (
    <PageFade>
      <SiteNav active="/contact" />
      <main className="mx-auto min-h-screen max-w-[1440px] px-6 pb-20 pt-32 md:px-12">
        <div className="mb-8 lg:col-span-12">
          <span className="mb-4 block text-[0.75rem] font-bold uppercase tracking-[0.2em] text-primary">
            Get in touch
          </span>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem]">
            Let&apos;s talk{" "}
            <span className="text-primary">code, coursework,</span> and
            what&apos;s next.
          </h1>
        </div>
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-8 md:p-12">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-container/10 blur-[100px]" />
              <ContactForm />
            </div>
          </div>
          <div className="space-y-12 lg:col-span-5">
            <div>
              <h3 className="mb-6 text-lg font-semibold">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="group flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-high text-primary transition-transform duration-300 group-hover:scale-110">
                    <MIcon name="alternate_email" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-on-surface-variant">
                      Email
                    </p>
                    <p className="text-lg font-medium">hello@sandun.me</p>
                  </div>
                </div>
                <div className="group flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-high text-primary transition-transform duration-300 group-hover:scale-110">
                    <MIcon name="call" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-on-surface-variant">
                      Phone
                    </p>
                    <p className="text-lg font-medium">+94 71 134 9060</p>
                  </div>
                </div>
              </div>
            </div>
            <ContactSocialRow links={socialLinks} />
            <div className="rounded-xl border-l-2 border-primary-container bg-surface-container-lowest p-6">
              <p className="text-sm italic leading-relaxed text-on-surface-variant/80">
                &quot;I&apos;m always up for a thoughtful technical
                conversation—whether it&apos;s an internship, a team project, or
                feedback on something I&apos;ve shipped.&quot;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-surface-container">
                  <NextImage
                    src={profile}
                    alt="Sandun Madhushan"
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                    unoptimized={profile.startsWith("http")}
                  />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-on-surface">
                    Sandun Madhushan
                  </span>
                  <span className="text-[0.7rem] font-bold tracking-wide text-primary">
                    Aspiring Software Engineer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageFade>
  );
}
