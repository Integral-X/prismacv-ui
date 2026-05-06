export default function CvEditLoading() {
  return (
    <div className='flex h-[calc(100vh-4rem)] animate-pulse'>
      {/* Sidebar */}
      <div className='w-64 border-r border-border p-4 space-y-4'>
        <div className='h-6 w-32 bg-border rounded' />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='h-10 w-full bg-border rounded' />
        ))}
      </div>

      {/* Main editor area */}
      <div className='flex-1 p-6 space-y-6'>
        <div className='h-8 w-64 bg-border rounded' />
        <div className='space-y-3'>
          <div className='h-4 w-full bg-border rounded' />
          <div className='h-4 w-5/6 bg-border rounded' />
          <div className='h-4 w-4/6 bg-border rounded' />
        </div>
        <div className='h-40 w-full bg-border rounded-lg' />
        <div className='space-y-3'>
          <div className='h-4 w-full bg-border rounded' />
          <div className='h-4 w-3/4 bg-border rounded' />
        </div>
      </div>
    </div>
  );
}
