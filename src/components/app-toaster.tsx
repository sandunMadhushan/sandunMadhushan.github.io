"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      theme="dark"
      richColors
      position="bottom-right"
      closeButton
      duration={4500}
      toastOptions={{
        classNames: {
          toast:
            "border border-outline-variant/25 bg-surface-container-highest text-on-surface shadow-xl backdrop-blur-sm",
          title: "text-on-surface font-semibold",
          description: "text-on-surface-variant",
          actionButton: "bg-primary-container text-on-primary-container",
          cancelButton: "bg-surface-container-high text-on-surface",
          closeButton: "bg-surface-container-high text-on-surface border-outline-variant/20",
        },
      }}
    />
  );
}
