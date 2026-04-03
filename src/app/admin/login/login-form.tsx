"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { MIcon } from "@/components/m-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function AdminLoginForm() {
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") ?? "/admin/dashboard";
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr(false);
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl });
    setLoading(false);
    if (res?.ok) window.location.href = callbackUrl;
    else setErr(true);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface font-sans selection:bg-primary/30">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>
      <main className="relative z-10 w-full max-w-[420px] px-6">
        <div className="mb-12 flex flex-col items-center">
          <div className="ghost-border mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-surface-container-high">
            <MIcon name="lock" className="text-3xl text-primary" />
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tighter text-on-surface">
            Architect Portfolio
          </h1>
          <p className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">
            Administrative Access
          </p>
        </div>
        <div className="glass-panel ghost-border rounded-xl p-10 shadow-2xl">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="ml-1">
                Email Address
              </Label>
              <Input id="email" name="email" type="email" placeholder="admin@portfolio.local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="ml-1">
                Secure Password
              </Label>
              <Input id="password" name="password" type="password" placeholder="••••••••••••" required />
            </div>
            <div className="flex items-center justify-between py-2">
              <label htmlFor="remember" className="group flex cursor-pointer items-center">
                <Checkbox id="remember" />
                <span className="ml-3 text-xs text-on-surface-variant transition-colors group-hover:text-on-surface">
                  Remember device
                </span>
              </label>
              <span className="text-xs font-medium text-on-surface-variant/50" title="Contact your administrator">
                Forgot password?
              </span>
            </div>
            {err && <p className="text-sm text-error">Invalid email or password.</p>}
            <button
              type="submit"
              disabled={loading}
              className="primary-glow group flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-4 font-semibold text-on-primary-container transition-all duration-300 active:scale-[0.98] disabled:opacity-60"
            >
              Sign In
              <MIcon name="arrow_forward" className="text-[18px] transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-on-surface-variant/60 transition-colors hover:text-on-surface"
          >
            <MIcon name="keyboard_backspace" className="text-[18px] transition-transform group-hover:-translate-x-1" />
            Go back to portfolio
          </Link>
        </div>
      </main>
      <footer className="mt-auto w-full py-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between px-12 opacity-40 md:flex-row">
          <p className="mb-4 text-xs text-on-surface md:mb-0">© {new Date().getFullYear()} The Digital Curator.</p>
          <div className="flex gap-8 text-xs">
            <span className="hover:text-primary">GitHub</span>
            <span className="hover:text-primary">LinkedIn</span>
            <span className="hover:text-primary">Facebook</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
