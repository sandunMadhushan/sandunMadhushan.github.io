"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { MIcon } from "@/components/m-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export function AdminLoginForm() {
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") ?? "/admin/dashboard";
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const email = fd.get("email") as string;
      const password = fd.get("password") as string;
      const res = await signIn("credentials", { email, password, redirect: false, callbackUrl });

      if (res?.error) {
        const msg =
          res.error === "CredentialsSignin"
            ? "Invalid email or password."
            : `Could not sign in: ${res.error}`;
        toast.error(msg);
        setLoading(false);
        return;
      }

      if (res?.ok) {
        toast.success("Signed in successfully.");
        window.setTimeout(() => {
          window.location.href = callbackUrl;
        }, 450);
        return;
      }

      toast.error("Sign in failed. Please try again.");
      setLoading(false);
    } catch {
      toast.error("Something went wrong. Check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans">
      <div
        aria-hidden
        className="grid-overlay pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]"
      />

      <main className="relative z-10 mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center px-6 py-16">
        <div className="mb-12">
          <Link
            href="/"
            className="group inline-flex items-baseline gap-2"
            aria-label="Portfolio home"
          >
            <span className="font-display text-2xl leading-none text-on-surface">
              Sandun
            </span>
            <span
              aria-hidden
              className="size-1.5 bg-primary-container transition-transform duration-300 group-hover:scale-150"
            />
          </Link>

          <div className="mt-10 h-px w-full bg-outline-variant" />
          <span className="type-mono mt-4 block text-primary">
            Administrative access
          </span>
          <h1 className="type-display mt-4 text-on-surface">Sign in</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-8" data-allow-paste="true">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@portfolio.local"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="remember"
              className="group flex cursor-pointer items-center"
            >
              <Checkbox id="remember" />
              <span className="type-mono-sm ml-3 text-on-surface-variant transition-colors group-hover:text-on-surface">
                Remember device
              </span>
            </label>
            <span
              className="type-mono-sm text-on-surface-variant/50"
              title="Contact your administrator"
            >
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="type-mono group flex w-full items-center justify-center gap-3 rounded-sm bg-primary-container py-4 text-on-primary-container transition-transform duration-300 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
            <MIcon
              name={loading ? "progress_activity" : "arrow_forward"}
              className="text-base transition-transform group-hover:translate-x-1"
            />
          </button>
        </form>

        <div className="mt-12">
          <div className="h-px w-full bg-outline-variant" />
          <Link
            href="/"
            className="type-mono group mt-5 inline-flex items-center gap-2 text-on-surface-variant transition-colors hover:text-primary"
          >
            <MIcon
              name="keyboard_backspace"
              className="text-base transition-transform group-hover:-translate-x-1"
            />
            Back to portfolio
          </Link>
        </div>
      </main>

      <footer className="relative z-10 w-full px-6 py-8">
        <p className="type-mono-sm mx-auto max-w-[440px] text-on-surface-variant">
          © {new Date().getFullYear()} Sandun Madhushan
        </p>
      </footer>
    </div>
  );
}
