'use client';

const trackingCards = [
  {
    id: 1,
    letter: 'S',
    title: 'aved',
    fullTitle: 'Saved',
    description:
      'Save job opportunities you are interested in and review them later.',
    bgColor: 'bg-primary/15',
    textColor: 'text-primary',
    icon: (
      <svg
        className='w-6 h-6'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
        />
      </svg>
    ),
  },
  {
    id: 2,
    letter: 'A',
    title: 'pplied',
    fullTitle: 'Applied',
    description: 'Track all the jobs you have applied for in one place.',
    bgColor: 'bg-feedback-success/20',
    textColor: 'text-feedback-success',
    icon: (
      <svg
        className='w-6 h-6'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        />
      </svg>
    ),
  },
  {
    id: 3,
    letter: 'I',
    title: 'nterview',
    fullTitle: 'Interview',
    description: 'Keep your interview dates, notes, and follow-ups organized.',
    bgColor: 'bg-feedback-info/20',
    textColor: 'text-feedback-info',
    icon: (
      <svg
        className='w-6 h-6'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
        />
      </svg>
    ),
  },
  {
    id: 4,
    letter: 'O',
    title: 'ffer',
    fullTitle: 'Offer',
    description: 'Record the job offers you receive and compare easily.',
    bgColor: 'bg-feedback-success/20',
    textColor: 'text-feedback-success',
    icon: (
      <svg
        className='w-6 h-6'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
        />
      </svg>
    ),
  },
  {
    id: 5,
    letter: 'R',
    title: 'ejected',
    fullTitle: 'Rejected',
    description:
      'See which applications were rejected and learn where to improve.',
    bgColor: 'bg-feedback-error/20',
    textColor: 'text-feedback-error',
    icon: (
      <svg
        className='w-6 h-6'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    ),
  },
];

export const JobTracking = () => {
  return (
    <section className='bg-linear-to-b from-surface-page to-primary/10 py-16 md:py-20'>
      <div className='container mx-auto px-4'>
        {/* Section Title */}
        <div className='text-center mb-12 md:mb-16 max-w-4xl mx-auto'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-semibold mb-4'>
            Track Your Job Applications
          </h2>
          <p className='text-lg text-muted-foreground'>
            Stay organized and in control of your job search. Our tracker helps
            you manage every application, from saved opportunities to final
            offers, all in one place.
          </p>
        </div>

        {/* Tracking Cards Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6'>
          {trackingCards.map((card) => (
            <div key={card.id} className='relative'>
              {/* Card Header with colored background */}
              <div
                className={`${card.bgColor} rounded-t-2xl p-6 pb-20 flex flex-col gap-3`}
              >
                <h3 className={`text-4xl font-bold ${card.textColor}`}>
                  {card.letter}
                  <span className={`text-2xl font-normal ${card.textColor}`}>
                    {card.title}
                  </span>
                </h3>
              </div>

              {/* Description Card - Overlapping the header */}
              <div className='relative -mt-18 bg-surface-card rounded-xl shadow-lg px-4 py-6 min-h-32'>
                <p className='text-sm text-content-primary leading-relaxed'>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
