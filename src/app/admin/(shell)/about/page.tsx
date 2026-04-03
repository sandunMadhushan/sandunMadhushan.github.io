import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AboutEditor } from "@/components/admin/about-editor";
import { getAbout } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const about = await getAbout();

  return (
    <>
      <AdminTopbar title="About" />
      <section className="p-12">
        <AboutEditor about={about} />
      </section>
    </>
  );
}
