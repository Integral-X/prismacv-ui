export default function InterviewLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 w-52 bg-surface-elevated rounded mb-6" />

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="h-10 w-36 bg-surface-elevated rounded" />
        <div className="h-10 w-36 bg-surface-elevated rounded" />
        <div className="h-10 w-36 bg-surface-elevated rounded" />
        <div className="ml-auto h-10 w-28 bg-surface-elevated rounded" />
      </div>

      {/* Question cards */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 rounded-lg bg-surface-elevated" />
        ))}
      </div>
    </div>
  );
}
