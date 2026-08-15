"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Live clock in the author's timezone — a small signal that a person is here. */
export function LocalTime({ timeZone = "Asia/Colombo" }: { timeZone?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone,
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  /* Renders nothing until mounted so server and client markup agree. */
  return (
    <span className="type-num tabular-nums">{time ?? "--:--:--"}</span>
  );
}

/**
 * Copy-to-clipboard control.
 *
 * Writes through the async Clipboard API rather than a `copy` event, so it
 * keeps working alongside the site-wide copy guard.
 */
export function CopyValue({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      /* clipboard unavailable — the mailto/tel link is still the fallback */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className="type-mono-sm inline-flex items-center gap-1.5 text-on-surface-variant transition-colors hover:text-primary"
    >
      {copied ? (
        <>
          <Check className="size-3" aria-hidden />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-3" aria-hidden />
          Copy
        </>
      )}
    </button>
  );
}
