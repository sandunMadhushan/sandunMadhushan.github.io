import { Skeleton } from "@/components/ui/skeleton";

export default function SiteLoading() {
  return (
    <div className="w-full max-w-full overflow-x-hidden px-6 pb-16 pt-32 md:pt-40 lg:px-12">
      <div className="mx-auto max-w-[1440px] space-y-10">
        <div className="space-y-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-12 w-full max-w-2xl" />
          <Skeleton className="h-5 w-full max-w-xl" />
          <Skeleton className="h-5 w-full max-w-lg" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-sm border border-outline-variant bg-surface-container-low"
            >
              <Skeleton className="h-56 w-full rounded-none" />
              <div className="space-y-3 p-6">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-[85%]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[70%]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
