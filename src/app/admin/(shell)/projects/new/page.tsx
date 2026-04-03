import { AdminTopbar } from "@/components/admin/admin-topbar";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <>
      <AdminTopbar title="System Overview" />
      <main className="min-h-screen bg-surface">
        <ProjectForm />
      </main>
    </>
  );
}
