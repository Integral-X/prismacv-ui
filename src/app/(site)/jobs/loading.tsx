export default function JobsLoading() {
  return (
    <div className='container mx-auto px-4 py-8 animate-pulse'>
      {/* Title skeleton */}
      <div className='h-8 w-40 bg-border rounded mb-6' />

      {/* Stats row */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className='h-20 rounded-lg bg-border' />
        ))}
      </div>

      {/* Toolbar */}
      <div className='flex gap-3 mb-6'>
        <div className='h-10 w-32 bg-border rounded' />
        <div className='h-10 w-32 bg-border rounded' />
        <div className='ml-auto h-10 w-28 bg-border rounded' />
      </div>

      {/* Kanban columns */}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        {[1, 2, 3, 4, 5].map((col) => (
          <div key={col} className='space-y-3'>
            <div className='h-6 w-24 bg-border rounded' />
            {[1, 2].map((card) => (
              <div key={card} className='h-28 rounded-lg bg-border' />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
