"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Message } from "@prisma/client";
import { MIcon } from "@/components/m-icon";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";

export function MessagesAdmin({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Message | null>(messages[0] ?? null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function executeDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);
    const res = await fetch(`/api/messages/${deleteId}`, { method: "DELETE" });
    setDeleteLoading(false);
    if (!res.ok) {
      toast.error("Could not delete message");
      return;
    }
    toast.success("Message deleted");
    if (selected?.id === deleteId) setSelected(null);
    setDeleteId(null);
    router.refresh();
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <p className="border-b border-outline-variant/10 bg-surface-container-lowest px-6 py-3 text-xs leading-relaxed text-on-surface-variant md:px-8">
        Each submission is{" "}
        <span className="font-medium text-on-surface-variant">saved here</span> and{" "}
        <span className="font-medium text-on-surface-variant">emailed to you</span> when{" "}
        <code className="rounded bg-surface-container-high px-1 font-mono text-[0.65rem]">RESEND_API_KEY</code>{" "}
        +{" "}
        <code className="rounded bg-surface-container-high px-1 font-mono text-[0.65rem]">CONTACT_NOTIFY_EMAIL</code>{" "}
        are set (see <code className="rounded bg-surface-container-high px-1 font-mono text-[0.65rem]">.env.example</code>
        ). Requires{" "}
        <code className="rounded bg-surface-container-high px-1 font-mono text-[0.65rem]">DATABASE_URL</code> on Vercel.
      </p>
      <div className="flex min-h-0 flex-1 overflow-hidden">
      <section className="flex w-full max-w-sm flex-col border-r border-outline-variant/10 bg-surface-container-low md:max-w-md">
        <div className="p-6">
          <div className="relative">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant/50">
              search
            </span>
            <input
              readOnly
              placeholder="Search inbox..."
              className="w-full rounded-t-lg border-none border-b-2 border-outline-variant/20 bg-surface-container-lowest py-2.5 pl-10 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-0"
            />
          </div>
        </div>
        <div className="custom-scrollbar flex-1 overflow-y-auto">
          {messages.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelected(m)}
              className={`relative w-full cursor-pointer px-6 py-5 text-left transition-all ${
                selected?.id === m.id
                  ? "bg-surface-container-high"
                  : "border-b border-outline-variant/5 hover:bg-surface-container"
              }`}
            >
              {selected?.id === m.id && <div className="absolute bottom-0 left-0 top-0 w-1 bg-primary" />}
              <div className="mb-1 flex items-start justify-between">
                <span className="text-sm font-bold text-on-surface">{m.name}</span>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <h4 className="mb-1 truncate text-sm font-semibold text-primary">{m.subject ?? "(no subject)"}</h4>
              <p className="line-clamp-2 text-xs leading-relaxed text-on-surface-variant">{m.message}</p>
            </button>
          ))}
        </div>
      </section>
      <section className="flex flex-1 flex-col overflow-hidden bg-surface">
        {selected ? (
          <>
            <div className="flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-low/30 px-10 py-6">
              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary transition-all hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                >
                  <MIcon name="reply" className="text-sm" />
                  Reply
                </button>
              </div>
              <button
                type="button"
                onClick={() => setDeleteId(selected.id)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-error transition-all hover:bg-error-container/20"
              >
                <MIcon name="delete" className="text-sm" />
                Delete
              </button>
            </div>
            <div className="custom-scrollbar flex-1 overflow-y-auto p-12">
              <div className="mx-auto max-w-3xl">
                <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="h-16 w-16 shrink-0 rounded-full bg-surface-container-high ring-2 ring-primary/20" />
                  <div>
                    <h2 className="mb-1 text-2xl font-bold tracking-tight text-on-surface">{selected.name}</h2>
                    <p className="text-sm text-on-surface-variant/60">{selected.email}</p>
                  </div>
                  <div className="text-right sm:ml-auto">
                    <span className="mb-1 block text-[10px] uppercase tracking-widest text-on-surface-variant/40">
                      Received
                    </span>
                    <span className="text-sm font-medium text-on-surface">
                      {new Date(selected.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mb-10">
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-primary">
                    Subject
                  </span>
                  <h3 className="text-3xl font-extrabold leading-tight tracking-tighter text-on-surface">
                    {selected.subject ?? "Message"}
                  </h3>
                </div>
                <div className="space-y-6 text-lg font-light leading-relaxed text-on-surface-variant">
                  <p>{selected.message}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-on-surface-variant">Select a message</div>
        )}
      </section>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open && !deleteLoading) setDeleteId(null);
        }}
        title="Delete this message?"
        description="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        loading={deleteLoading}
        onConfirm={executeDelete}
      />
    </div>
  );
}
