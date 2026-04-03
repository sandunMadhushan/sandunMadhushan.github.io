import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export function AdminFieldLabel({ className, required, children, ...props }: Props) {
  return (
    <label className={cn(className)} {...props}>
      {children}
      {required ? (
        <>
          {" "}
          <span className="text-error" aria-hidden>
            *
          </span>
          <span className="sr-only">(required)</span>
        </>
      ) : null}
    </label>
  );
}
