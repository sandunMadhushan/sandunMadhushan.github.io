"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Message } from "@prisma/client";
import { MIcon } from "@/components/m-icon";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminFieldLabel } from "@/components/admin/field-label";
import { toast } from "sonner";

const POLL_MS = 12_000;

export function MessagesAdmin({ messages: initialMessages }: { messages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(initialMessages[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [readLoading, setReadLoading] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sendReplyLoading, setSendReplyLoading] = useState(false);

  const selected = useMemo(
    () => messages.find((m) => m.id === selectedId) ?? null,
    [messages, selectedId],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.subject ?? "").toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q),
    );
  }, [messages, query]);

  const syncMessages = useCallback(async () => {
    const res = await fetch("/api/messages", { credentials: "include" });
    if (!res.ok) return;
    const next = (await res.json()) as Message[];
    if (!Array.isArray(next)) return;
    setMessages(next);
    setSelectedId((prev) => {
      if (prev && next.some((m) => m.id === prev)) return prev;
      return next[0]?.id ?? null;
    });
  }, []);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (!selected) {
      setReplySubject("");
      setReplyBody("");
      return;
    }
    setReplySubject(selected.subject?.trim() ? `Re: ${selected.subject}` : "Re: Your portfolio message");
    setReplyBody("");
  }, [selected?.id]);

  useEffect(() => {
    void syncMessages();
    const id = setInterval(() => void syncMessages(), POLL_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") void syncMessages();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [syncMessages]);

  async function patchRead(id: string, read: boolean) {
    setReadLoading(true);
    const res = await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    setReadLoading(false);
    if (!res.ok) {
      toast.error("Could not update read status");
      return;
    }
    const updated = (await res.json()) as Message;
    setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
  }

  function selectMessage(m: Message) {
    setSelectedId(m.id);
    if (!m.read) {
      void patchRead(m.id, true);
    }
  }

  async function sendReply() {
    if (!selected) return;
    const text = replyBody.trim();
    if (!text) {
      toast.error("Write your reply before sending.");
      return;
    }
    setSendReplyLoading(true);
    const res = await fetch(`/api/messages/${selected.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        text,
        subject: replySubject.trim() || undefined,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setSendReplyLoading(false);
    if (!res.ok) {
      toast.error(typeof data.error === "string" ? data.error : "Could not send reply.");
      return;
    }
    toast.success("Reply sent to " + selected.email);
    setReplyBody("");
  }

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
    setDeleteId(null);
    setMessages((prev) => {
      const next = prev.filter((m) => m.id !== deleteId);
      if (selectedId === deleteId) setSelectedId(next[0]?.id ?? null);
      return next;
    });
    void syncMessages();
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <p className="border-b border-outline-variant/10 bg-surface-container-lowest px-6 py-3 text-xs leading-relaxed text-on-surface-variant md:px-8">
        Inbox syncs every {POLL_MS / 1000}s while this page is open (and when you return to the tab). Replies are
        sent with Resend to the visitor’s email.{" "}
        {unreadCount > 0 && (
          <span className="font-semibold text-primary">{unreadCount} unread</span>
        )}
      </p>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <section className="flex w-full max-w-sm flex-col border-r border-outline-variant/10 bg-surface-container-low md:max-w-md">
          <div className="p-6">
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant/50">
                search
              </span>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search inbox..."
                className="rounded-t-lg border-none border-b-2 border-outline-variant/20 bg-surface-container-lowest py-2.5 pl-10 text-sm"
              />
            </div>
          </div>
          <div className="custom-scrollbar flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-6 py-8 text-sm text-on-surface-variant/70">No messages match your search.</p>
            )}
            {filtered.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => selectMessage(m)}
                className={`relative w-full cursor-pointer px-6 py-5 text-left transition-all ${
                  selectedId === m.id
                    ? "bg-surface-container-high"
                    : "border-b border-outline-variant/5 hover:bg-surface-container"
                }`}
              >
                {selectedId === m.id && <div className="absolute bottom-0 left-0 top-0 w-1 bg-primary" />}
                <div className="mb-1 flex items-start justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2">
                    {!m.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_8px_rgba(79,70,229,0.8)]" title="Unread" />
                    )}
                    <span className={`truncate text-sm ${!m.read ? "font-bold text-on-surface" : "font-medium text-on-surface"}`}>
                      {m.name}
                    </span>
                  </span>
                  <span className="shrink-0 text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <h4 className={`mb-1 truncate text-sm ${!m.read ? "font-semibold text-primary" : "font-medium text-primary/90"}`}>
                  {m.subject ?? "(no subject)"}
                </h4>
                <p className="line-clamp-2 text-xs leading-relaxed text-on-surface-variant">{m.message}</p>
              </button>
            ))}
          </div>
        </section>
        <section className="flex flex-1 flex-col overflow-hidden bg-surface">
          {selected ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/10 bg-surface-container-low/30 px-6 py-4 md:px-10">
                <div className="flex flex-wrap items-center gap-2">
                  {selected.read ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={readLoading}
                      onClick={() => void patchRead(selected.id, false)}
                    >
                      <MIcon name="mark_email_unread" className="text-base" />
                      Mark unread
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={readLoading}
                      onClick={() => void patchRead(selected.id, true)}
                    >
                      <MIcon name="mark_email_read" className="text-base" />
                      Mark read
                    </Button>
                  )}
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
              <div className="custom-scrollbar flex-1 overflow-y-auto p-8 md:p-12">
                <div className="mx-auto max-w-3xl">
                  <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="h-16 w-16 shrink-0 rounded-full bg-surface-container-high ring-2 ring-primary/20" />
                    <div>
                      <h2 className="mb-1 text-2xl font-bold tracking-tight text-on-surface">{selected.name}</h2>
                      <p className="text-sm text-on-surface-variant">{selected.email}</p>
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
                    <p className="whitespace-pre-wrap">{selected.message}</p>
                  </div>

                  <div className="mt-12 rounded-xl border border-outline-variant/15 bg-surface-container-low/50 p-6 md:p-8">
                    <span className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-primary">
                      Send reply
                    </span>
                    <p className="mb-6 text-sm text-on-surface-variant">
                      Your reply is emailed to <span className="font-medium text-on-surface">{selected.email}</span>{" "}
                      via Resend (same setup as the contact form). Requires{" "}
                      <code className="rounded bg-surface-container-highest px-1 font-mono text-xs">RESEND_API_KEY</code>{" "}
                      and <code className="rounded bg-surface-container-highest px-1 font-mono text-xs">RESEND_FROM</code>.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <AdminFieldLabel htmlFor="reply-subject" className="mb-2">
                          Subject
                        </AdminFieldLabel>
                        <Input
                          id="reply-subject"
                          value={replySubject}
                          onChange={(e) => setReplySubject(e.target.value)}
                          placeholder="Re: …"
                          className="bg-surface-container-lowest"
                        />
                      </div>
                      <div>
                        <AdminFieldLabel htmlFor="reply-body" className="mb-2">
                          Message
                        </AdminFieldLabel>
                        <Textarea
                          id="reply-body"
                          value={replyBody}
                          onChange={(e) => setReplyBody(e.target.value)}
                          rows={6}
                          placeholder="Write your reply here…"
                          className="min-h-[160px] bg-surface-container-lowest"
                        />
                      </div>
                      <Button
                        type="button"
                        disabled={sendReplyLoading || !replyBody.trim()}
                        onClick={() => void sendReply()}
                        className="w-full sm:w-auto"
                      >
                        {sendReplyLoading ? (
                          "Sending…"
                        ) : (
                          <>
                            <MIcon name="send" className="text-base" />
                            Send email to visitor
                          </>
                        )}
                      </Button>
                    </div>
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
