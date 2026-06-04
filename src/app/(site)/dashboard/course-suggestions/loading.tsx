export default function CourseSuggestionsLoading() {
  return (
    <>
      <div className='h-[88px] shrink-0 animate-pulse' />
      <div className='flex-1 animate-pulse space-y-6 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8'>
        <div className='h-10 rounded-lg bg-surface-elevated' />
        <div className='h-10 rounded-lg bg-surface-elevated' />
        <div className='flex gap-2'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className='h-9 w-24 shrink-0 rounded-full bg-surface-elevated'
            />
          ))}
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className='h-80 rounded-xl bg-surface-elevated' />
          ))}
        </div>
      </div>
    </>
  );
}
