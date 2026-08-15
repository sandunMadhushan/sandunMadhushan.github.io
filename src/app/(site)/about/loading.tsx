import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <main className="px-6 pb-20 pt-32 md:pt-40 lg:px-12">
      <section className="mx-auto mb-24 grid max-w-[1440px] grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-12 w-full max-w-xl" />
          <Skeleton className="h-12 w-full max-w-lg" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <Skeleton className="aspect-square w-full max-w-[420px] justify-self-center rounded-sm md:justify-self-end" />
      </section>

      <section className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-sm border border-outline-variant bg-surface-container-low p-10"
            >
              <Skeleton className="mb-8 h-8 w-8" />
              <Skeleton className="mb-2 h-12 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
