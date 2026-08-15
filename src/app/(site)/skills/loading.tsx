import { Skeleton } from "@/components/ui/skeleton";

export default function SkillsLoading() {
  return (
    <main className="mx-auto max-w-[1512px] px-5 sm:px-8 pb-20 pt-32 md:pt-40 lg:px-12">
      <header className="mb-24 space-y-4">
        <Skeleton className="h-12 w-full max-w-md" />
        <Skeleton className="h-12 w-full max-w-sm" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <section className="rounded-sm bg-surface-container-low p-8 md:col-span-8">
          <div className="mb-12 flex items-end justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-8 w-52" />
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
          <div className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-6">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-sm bg-surface-container-low p-8 md:col-span-4">
          <div className="mb-8 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-6">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <Skeleton className="h-52 w-full rounded-sm md:col-span-12" />
        <Skeleton className="h-64 w-full rounded-sm md:col-span-4" />
        <Skeleton className="h-64 w-full rounded-sm md:col-span-8" />
      </div>

      <Skeleton className="mt-24 h-44 w-full rounded-2xl" />
    </main>
  );
}
