import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary-container text-on-primary-container hover:scale-[1.02] active:scale-95",
        secondary:
          "border border-outline-variant bg-transparent text-on-surface hover:border-primary hover:text-primary active:scale-95",
        ghost:
          "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
        destructive:
          "border border-transparent text-error hover:border-error/40 hover:bg-error-container/20",
        outline:
          "border border-outline-variant bg-transparent text-on-surface hover:border-primary hover:text-primary",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3.5 text-[0.625rem]",
        lg: "h-12 px-8",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
