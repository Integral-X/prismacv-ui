export default function SkillsLoading() {
  return (
    <div className='container mx-auto px-4 py-8 animate-pulse'>
      {/* Title skeleton */}
      <div className='h-8 w-56 bg-border rounded mb-2' />
      <div className='h-4 w-80 bg-border rounded mb-8' />

      {/* Category cards grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className='h-40 rounded-lg bg-border' />
        ))}
      </div>
    </div>
  );
}
