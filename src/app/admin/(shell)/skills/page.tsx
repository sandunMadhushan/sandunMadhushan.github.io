import { AdminTopbar } from "@/components/admin/admin-topbar";
import { SkillsAdmin } from "@/components/admin/skills-admin";
import { getSkills } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <>
      <AdminTopbar title="Skills Management" />
      <section className="max-w-[1440px] p-12">
        <SkillsAdmin skills={skills} />
      </section>
      <footer className="mt-24 w-full border-t border-[#e5e2e3]/10 bg-[#131314] px-12 py-20">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-8 md:flex-row">
          <p className="text-lg leading-relaxed text-[#e5e2e3]/40">
            © {new Date().getFullYear()} The Digital Curator.
          </p>
          <div className="flex gap-12 text-[#e5e2e3]/40">
            <span>GitHub</span>
            <span>LinkedIn</span>
            <span>Twitter</span>
          </div>
        </div>
      </footer>
    </>
  );
}
