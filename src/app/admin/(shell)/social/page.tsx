import { AdminTopbar } from "@/components/admin/admin-topbar";
import { SocialLinksAdmin } from "@/components/admin/social-links-admin";
import { getSocialLinks } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminSocialPage() {
  const links = await getSocialLinks();

  return (
    <>
      <AdminTopbar title="Social links" />
      <section className="max-w-[1440px] px-4 py-6 sm:px-6 md:p-12">
        <SocialLinksAdmin links={links} />
      </section>
    </>
  );
}
