"use client";

import { useEffect } from "react";

export function DisableContextMenu() {
  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };
    const preventDragStart = (event: DragEvent) => {
      event.preventDefault();
    };
    const preventSelectStart = (event: Event) => {
      event.preventDefault();
    };
    const preventClipboard = (event: ClipboardEvent) => {
      event.preventDefault();
    };
    const preventCopyShortcuts = (event: KeyboardEvent) => {
      const isCtrlOrMetaPressed = event.ctrlKey || event.metaKey;
      const isShiftPressed = event.shiftKey;
      const key = event.key.toLowerCase();

      if (event.key === "F12") {
        event.preventDefault();
        return;
      }

      if (!isCtrlOrMetaPressed) return;

      if (key === "a" || key === "c" || key === "x" || key === "s" || key === "p") {
        event.preventDefault();
        return;
      }

      // Common DevTools/view-source shortcuts (best-effort only).
      if (
        (isShiftPressed && (key === "i" || key === "j")) ||
        (!isShiftPressed && key === "u")
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("dragstart", preventDragStart);
    document.addEventListener("selectstart", preventSelectStart);
    document.addEventListener("copy", preventClipboard);
    document.addEventListener("cut", preventClipboard);
    document.addEventListener("keydown", preventCopyShortcuts);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("dragstart", preventDragStart);
      document.removeEventListener("selectstart", preventSelectStart);
      document.removeEventListener("copy", preventClipboard);
      document.removeEventListener("cut", preventClipboard);
      document.removeEventListener("keydown", preventCopyShortcuts);
    };
  }, []);

  return null;
}
