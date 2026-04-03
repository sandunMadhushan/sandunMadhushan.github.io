import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-md border-0 border-b border-outline-variant/30 bg-surface-container-lowest px-1 py-3 text-on-surface placeholder:text-on-surface-variant/30 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
