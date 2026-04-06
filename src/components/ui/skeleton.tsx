"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
  children?: ReactNode;
};

export function Skeleton({ className, children }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "skeleton-shimmer rounded-md bg-surface-container-high/70",
        className,
      )}
    >
      {children}
    </div>
  );
}
