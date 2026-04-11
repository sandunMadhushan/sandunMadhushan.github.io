import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AboutEditor } from "@/components/admin/about-editor";
import { getAbout, getProjectsForAdmin } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const [about, adminProjects] = await Promise.all([getAbout(), getProjectsForAdmin()]);
  const projectOptions = adminProjects.map((p) => ({
    id: p.id,
    title: p.title,
    published: p.published,
  }));

  return (
    <>
      <AdminTopbar title="About" />
      <section className="p-12">
        <AboutEditor about={about} adminProjects={projectOptions} />
      </section>
    </>
  );
}
