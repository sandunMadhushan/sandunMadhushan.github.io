import { AdminTopbar } from "@/components/admin/admin-topbar";
import { MessagesAdmin } from "@/components/admin/messages-admin";
import { getMessages } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div className="flex min-h-screen flex-col">
      <AdminTopbar title="System Overview" />
      <MessagesAdmin messages={messages} />
    </div>
  );
}
