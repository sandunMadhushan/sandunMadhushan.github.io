import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
  return (
    <main className="mx-auto max-w-[1440px] px-6 pb-24 pt-32 md:px-12">
      <header className="mb-16 space-y-4">
        <Skeleton className="h-14 w-full max-w-md" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-low"
          >
            <Skeleton className="aspect-[4/3] w-full max-h-[min(52vw,280px)] rounded-none sm:max-h-[min(48vw,320px)] md:aspect-auto md:h-64 md:max-h-none" />
            <div className="space-y-3 p-8">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-[80%]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[65%]" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
