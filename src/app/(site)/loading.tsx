export default function SiteLoading() {
  return (
    <div className="w-full max-w-full overflow-x-hidden px-6 pt-28 pb-16 md:px-12">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="h-9 w-40 animate-pulse rounded-md bg-surface-container-high" />
        <div className="h-12 max-w-xl animate-pulse rounded-md bg-surface-container-high/80" />
        <div className="h-4 max-w-2xl animate-pulse rounded bg-surface-container-high/50" />
        <div className="h-4 max-w-lg animate-pulse rounded bg-surface-container-high/40" />
      </div>
    </div>
  );
}
