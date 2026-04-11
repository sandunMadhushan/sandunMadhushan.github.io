import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailLoading() {
  return (
    <main className="mx-auto max-w-[1440px] px-6 pb-24 pt-32 md:px-12">
      <div className="space-y-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full max-w-2xl" />
        <Skeleton className="h-4 w-full max-w-3xl" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      <Skeleton className="mt-10 aspect-[16/10] w-full max-h-[min(80dvh,520px)] rounded-2xl sm:aspect-video md:aspect-auto md:h-[min(520px,calc(100vw-6rem))] md:max-h-none lg:h-[600px]" />

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </main>
  );
}
