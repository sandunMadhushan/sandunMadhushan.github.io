"use client";

import { useState } from "react";
import { MIcon } from "@/components/m-icon";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject"),
      message: fd.get("message"),
    };
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      e.currentTarget.reset();
    } catch {
      setStatus("err");
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative z-10 space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="contact-name"
            className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant/70"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            className="rounded-none border-0 border-b border-outline-variant/15 bg-surface-container-lowest px-0 py-3 text-on-surface placeholder:text-on-surface/25 focus:border-primary focus:shadow-[0_4px_12px_-4px_rgba(79,70,229,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
            placeholder="John Doe"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="contact-email"
            className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant/70"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-none border-0 border-b border-outline-variant/15 bg-surface-container-lowest px-0 py-3 text-on-surface placeholder:text-on-surface/25 focus:border-primary focus:shadow-[0_4px_12px_-4px_rgba(79,70,229,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
            placeholder="john@example.com"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-subject"
          className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant/70"
        >
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          className="rounded-none border-0 border-b border-outline-variant/15 bg-surface-container-lowest px-0 py-3 text-on-surface placeholder:text-on-surface/25 focus:border-primary focus:shadow-[0_4px_12px_-4px_rgba(79,70,229,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
          placeholder="Project Inquiry"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-message"
          className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant/70"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="resize-none rounded-none border-0 border-b border-outline-variant/15 bg-surface-container-lowest px-0 py-3 text-on-surface placeholder:text-on-surface/25 focus:border-primary focus:shadow-[0_4px_12px_-4px_rgba(79,70,229,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
          placeholder="Tell me about your vision..."
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-3 rounded-lg bg-primary-container px-10 py-4 font-bold text-on-primary-container shadow-[0_0_15px_rgba(79,70,229,0.2)] transition-all hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] hover:brightness-110 active:scale-95 disabled:opacity-60 md:w-auto"
      >
        Send Message
        <MIcon name="arrow_forward" />
      </button>
      {status === "ok" && <p className="text-sm text-primary">Message sent. I&apos;ll get back to you soon.</p>}
      {status === "err" && <p className="text-sm text-error">Something went wrong. Please try again.</p>}
    </form>
  );
}
