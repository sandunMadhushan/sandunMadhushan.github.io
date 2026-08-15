import { Skeleton } from "@/components/ui/skeleton";

export default function ContactLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-[1512px] px-5 sm:px-8 pb-20 pt-32 md:pt-40 lg:px-12">
      <div className="mb-8 space-y-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-full max-w-2xl" />
      </div>

      <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-sm bg-surface-container-low p-8 md:p-12">
            <Skeleton className="mb-8 h-4 w-full max-w-xl" />
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-40 rounded-sm" />
            </div>
          </div>
        </div>

        <div className="space-y-12 lg:col-span-5">
          <div className="space-y-6">
            <Skeleton className="h-6 w-44" />
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-sm" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-44" />
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-sm" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </div>
          </div>

          <Skeleton className="h-14 w-full rounded-sm" />

          <div className="rounded-sm bg-surface-container-lowest p-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-[85%]" />
            <div className="mt-4 flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
