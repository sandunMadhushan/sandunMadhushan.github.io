import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Page gutter + max width. Every section uses this so the grid never drifts. */
export function Container({
  children,
  className,
  wide,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        wide ? "max-w-[1680px]" : "max-w-[1512px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Vertical rhythm. `tight` for stacked bands, default for major sections. */
export function Section({
  children,
  className,
  id,
  tight,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tight?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(tight ? "py-16 md:py-24" : "py-24 md:py-36 lg:py-44", className)}
    >
      {children}
    </section>
  );
}

/** Hairline divider. The structural workhorse of the whole design. */
export function Rule({
  className,
  strong,
}: {
  className?: string;
  strong?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(strong ? "rule-strong" : "rule", className)}
    />
  );
}

/**
 * Numbered monospace label — `01 — SELECTED WORK`.
 * The index is what makes the site read as a document rather than a page.
 */
export function Eyebrow({
  index,
  children,
  className,
  accent = true,
}: {
  index?: string;
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <span
      className={cn(
        "type-mono inline-flex items-center gap-3",
        accent ? "text-primary" : "text-on-surface-variant",
        className,
      )}
    >
      {index ? (
        <>
          <span className="tabular-nums">{index}</span>
          <span aria-hidden className="h-px w-6 bg-current opacity-40" />
        </>
      ) : null}
      {children}
    </span>
  );
}

/**
 * Standard section head: rule, then eyebrow on the left and an optional
 * action on the right, then the title. Asymmetric by construction.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  action,
  className,
}: {
  index?: string;
  eyebrow: string;
  title?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 md:mb-20", className)}>
      <Rule />
      <div className="flex flex-wrap items-baseline justify-between gap-4 pt-4">
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
        {action}
      </div>
      {title ? (
        <h2 className="type-h1 mt-8 max-w-4xl text-on-surface md:mt-12">
          {title}
        </h2>
      ) : null}
    </div>
  );
}

/** Small monospace key/value pair used across the metadata rails. */
export function MetaItem({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="type-mono-sm text-on-surface-variant">{label}</span>
      <span className="text-sm font-medium text-on-surface">{children}</span>
    </div>
  );
}
