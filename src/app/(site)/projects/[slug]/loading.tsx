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

      <Skeleton className="mt-10 h-[420px] w-full rounded-2xl" />

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </main>
  );
}
