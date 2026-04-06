"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CountUpOnViewProps = {
  value: string;
  durationMs?: number;
  className?: string;
  startOnMount?: boolean;
};

function parseDisplayValue(value: string) {
  const trimmed = value.trim();
  const m = trimmed.match(/^([^0-9]*)([0-9]+)(.*)$/);
  if (!m) return null;
  return {
    prefix: m[1] ?? "",
    target: Number(m[2]),
    suffix: m[3] ?? "",
  };
}

export function CountUpOnView({
  value,
  durationMs = 1000,
  className,
  startOnMount = false,
}: CountUpOnViewProps) {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const [displayNumber, setDisplayNumber] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const parsed = useMemo(() => parseDisplayValue(value), [value]);

  useEffect(() => {
    if (!parsed || hasStarted) return;
    const node = rootRef.current;
    let observer: IntersectionObserver | undefined;

    if (startOnMount) {
      setHasStarted(true);
    } else {
      if (!node) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          setHasStarted(true);
          observer?.disconnect();
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -5% 0px",
        },
      );
      observer.observe(node);
    }

    return () => {
      observer?.disconnect();
    };
  }, [hasStarted, parsed, startOnMount]);

  useEffect(() => {
    if (!parsed || !hasStarted) return;
    let rafId = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayNumber(Math.round(parsed.target * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDisplayNumber(parsed.target);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [durationMs, hasStarted, parsed]);

  if (!parsed) return <span className={className}>{value}</span>;

  return (
    <span ref={rootRef} className={className}>
      {parsed.prefix}
      {hasStarted ? displayNumber : 0}
      {parsed.suffix}
    </span>
  );
}
