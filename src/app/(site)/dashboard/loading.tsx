export default function DashboardLoading() {
  return (
    <>
      <div className="h-[73px] shrink-0 animate-pulse" />
      <div className="flex-1 animate-pulse space-y-6 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">
        <div className="h-40 rounded-xl bg-surface-elevated" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-surface-elevated" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 rounded-xl bg-surface-elevated" />
          ))}
        </div>
      </div>
    </>
  );
}
