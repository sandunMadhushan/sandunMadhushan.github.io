import { SiteNav } from "@/components/public/site-nav";
import { PageFade } from "@/components/motion/page-fade";
import { RevealText } from "@/components/motion/reveal-text";
import { ContactForm } from "@/components/contact/contact-form";
import { CopyValue, LocalTime } from "@/components/contact/contact-aside";
import { ContactSocialRow } from "@/components/public/public-social-blocks";
import { Container, Eyebrow, Rule } from "@/components/ui/primitives";
import { getAbout, getSocialLinks } from "@/lib/queries";

export const revalidate = 30;

const EMAIL = "hello@madhushan.me";
const PHONE_DISPLAY = "+94 71 134 9060";
const PHONE_HREF = "+94711349060";

export default async function ContactPage() {
  const [, socialLinks] = await Promise.all([getAbout(), getSocialLinks()]);

  return (
    <>
      <SiteNav active="/contact" />
      <PageFade>
        <main id="main" className="pb-28 pt-32 md:pt-40">
          <Container>
            <header className="mb-20 md:mb-28">
              <Rule />
              <div className="flex flex-wrap items-baseline justify-between gap-4 pt-4">
                <Eyebrow>
                  <span className="pulse-dot mr-1 inline-block size-1.5 rounded-full bg-primary-container align-middle" />
                  Usually replies within a day
                </Eyebrow>
                <span className="type-mono-sm text-on-surface-variant">
                  Matale, LK — <LocalTime />
                </span>
              </div>

              <h1 className="type-mega mt-10 text-on-surface md:mt-14">
                <RevealText text="Let's" as="span" onLoad delay={0.08} />
                <br />
                <span className="text-primary">
                  <RevealText text="talk." as="span" onLoad delay={0.18} />
                </span>
              </h1>

              <p className="type-lead mt-10 max-w-2xl text-on-surface-variant">
                Internships, academic collaborations, code review, or just a
                thoughtful technical conversation — I read every message, and
                I&apos;ll reply at the address you provide.
              </p>
            </header>

            <div className="grid grid-cols-12 gap-y-20 md:gap-8">
              {/* ---------- FORM ---------- */}
              <div className="col-span-12 md:col-span-7">
                <Rule />
                <div className="pt-4">
                  <Eyebrow index="01">Send a message</Eyebrow>
                </div>
                <div className="mt-10">
                  <ContactForm />
                </div>
              </div>

              {/* ---------- DIRECT + SOCIAL ---------- */}
              <aside className="col-span-12 md:col-span-4 md:col-start-9">
                <Rule />
                <div className="pt-4">
                  <Eyebrow index="02">Direct</Eyebrow>
                </div>

                <dl className="mt-10">
                  <div className="border-t border-outline-variant py-5">
                    <dt className="type-mono-sm text-on-surface-variant">
                      Email
                    </dt>
                    <dd className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      <a
                        href={`mailto:${EMAIL}`}
                        className="link-wipe text-lg font-medium text-on-surface"
                      >
                        {EMAIL}
                      </a>
                      <CopyValue value={EMAIL} label="email address" />
                    </dd>
                  </div>

                  <div className="border-y border-outline-variant py-5">
                    <dt className="type-mono-sm text-on-surface-variant">
                      Phone
                    </dt>
                    <dd className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      <a
                        href={`tel:${PHONE_HREF}`}
                        className="link-wipe text-lg font-medium text-on-surface"
                      >
                        {PHONE_DISPLAY}
                      </a>
                      <CopyValue value={PHONE_DISPLAY} label="phone number" />
                    </dd>
                  </div>
                </dl>

                <div className="mt-12">
                  <ContactSocialRow links={socialLinks} />
                </div>

                <figure className="mt-12 border-l-2 border-primary-container pl-6">
                  <blockquote className="font-display text-xl leading-snug text-on-surface">
                    &ldquo;I&apos;m always up for a thoughtful technical
                    conversation—whether it&apos;s an internship, a team
                    project, or feedback on something I&apos;ve shipped.&rdquo;
                  </blockquote>
                  <figcaption className="type-mono-sm mt-4 text-on-surface-variant">
                    Sandun Madhushan
                  </figcaption>
                </figure>
              </aside>
            </div>
          </Container>
        </main>
      </PageFade>
    </>
  );
}
