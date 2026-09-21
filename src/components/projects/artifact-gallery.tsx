"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import NextImage from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { isRemoteImageSrc } from "@/lib/image-url";

const pad = (n: number) => String(n).padStart(2, "0");

export function ArtifactGallery({ srcs, title }: { srcs: string[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const [mounted, setMounted] = useState(false);
  const total = srcs.length;

  useEffect(() => setMounted(true), []);

  const go = useCallback(
    (step: number) => {
      setDir(step);
      setOpen((i) => (i === null ? i : (i + step + total) % total));
    },
    [total],
  );

  const jump = (i: number) => {
    setDir(i > (open ?? 0) ? 1 : -1);
    setOpen(i);
  };

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, go]);

  const navBtn =
    "absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition hover:scale-110 hover:bg-white/20";

  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {srcs.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => {
              setDir(1);
              setOpen(i);
            }}
            aria-label={`View figure ${i + 1} full size`}
            className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-sm border border-outline-variant bg-surface-container-low text-left"
          >
            <NextImage
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              unoptimized={isRemoteImageSrc(src)}
            />
            <span className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md">
                <Expand size={20} />
              </span>
            </span>
            <span className="type-mono-sm absolute bottom-0 left-0 bg-background/85 px-3 py-1.5 text-on-surface-variant backdrop-blur-sm">
              Fig. {pad(i + 1)}
            </span>
          </button>
        ))}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open !== null && (
              <motion.div
                key="lightbox"
                role="dialog"
                aria-modal="true"
                aria-label="Artifact viewer"
                className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setOpen(null)}
              >
                <div
                  className="flex items-center justify-between px-5 py-4 text-white md:px-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="type-mono-sm tracking-widest">
                    <span className="text-primary">{pad(open + 1)}</span>
                    <span className="opacity-50"> / {pad(total)}</span>
                    {title && <span className="ml-4 hidden opacity-60 sm:inline">{title}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(null)}
                    aria-label="Close viewer"
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/25"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="relative min-h-0 flex-1 px-4 md:px-20" onClick={(e) => e.stopPropagation()}>
                  <AnimatePresence initial={false} custom={dir} mode="popLayout">
                    <motion.div
                      key={open}
                      custom={dir}
                      className="absolute inset-0 mx-4 md:mx-20"
                      variants={{
                        enter: (d: number) => ({ opacity: 0, x: d * 80, scale: 0.96 }),
                        center: { opacity: 1, x: 0, scale: 1 },
                        exit: (d: number) => ({ opacity: 0, x: d * -80, scale: 0.96 }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      drag={total > 1 ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.3}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -80) go(1);
                        else if (info.offset.x > 80) go(-1);
                      }}
                    >
                      <NextImage
                        src={srcs[open]}
                        alt={`Figure ${open + 1}`}
                        fill
                        sizes="100vw"
                        priority
                        draggable={false}
                        className="select-none object-contain drop-shadow-2xl"
                        unoptimized={isRemoteImageSrc(srcs[open])}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {total > 1 && (
                    <>
                      <button type="button" onClick={() => go(-1)} aria-label="Previous" className={`${navBtn} left-2 md:left-5`}>
                        <ChevronLeft size={22} />
                      </button>
                      <button type="button" onClick={() => go(1)} aria-label="Next" className={`${navBtn} right-2 md:right-5`}>
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}
                </div>

                {total > 1 && (
                  <div
                    className="flex justify-center gap-2 overflow-x-auto px-5 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {srcs.map((src, i) => (
                      <button
                        key={src + i}
                        type="button"
                        onClick={() => jump(i)}
                        aria-label={`Go to figure ${i + 1}`}
                        className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition ${
                          i === open ? "border-primary opacity-100" : "border-transparent opacity-45 hover:opacity-80"
                        }`}
                      >
                        <NextImage src={src} alt="" fill sizes="80px" className="object-cover" unoptimized={isRemoteImageSrc(src)} />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
