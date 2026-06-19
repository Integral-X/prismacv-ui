export default function DocumentsLoading() {
  return (
    <>
      <div className="h-[73px] shrink-0 animate-pulse" />
      <div className="flex-1 animate-pulse space-y-6 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">
        <div className="h-16 max-w-md rounded-lg bg-surface-elevated" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-surface-elevated" />
          ))}
        </div>
      </div>
    </>
  );
}
