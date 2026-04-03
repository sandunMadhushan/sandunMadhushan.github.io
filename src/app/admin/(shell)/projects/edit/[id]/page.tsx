import { notFound } from "next/navigation";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { ProjectForm } from "@/components/admin/project-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <>
      <AdminTopbar title="System Overview" />
      <main className="min-h-screen bg-surface">
        <ProjectForm project={project} />
      </main>
    </>
  );
}
