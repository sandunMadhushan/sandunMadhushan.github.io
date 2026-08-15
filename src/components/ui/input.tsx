import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-none border-0 border-b border-outline-variant bg-transparent px-0 py-3 text-on-surface transition-colors placeholder:text-on-surface-variant/50 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
