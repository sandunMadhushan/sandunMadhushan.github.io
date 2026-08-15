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
        "skeleton-shimmer rounded-sm bg-surface-container-high",
        className,
      )}
    >
      {children}
    </div>
  );
}
