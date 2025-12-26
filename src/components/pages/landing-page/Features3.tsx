'use client';

import Image from 'next/image';

const CheckIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
  >
    <circle cx="12" cy="12" r="10" fill="#4ECCA3" fillOpacity="0.2" />
    <circle cx="12" cy="12" r="8" fill="#4ECCA3" />
    <path
      d="M8 12L11 15L16 9"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const courseFeatures = [
  'Curated Couses',
  'Role-Based Learning',
  'Verified Platforms',
];

const skillGapFeatures = [
  {
    title: 'Role-Based Assessment',
    description:
      'Choose from 50+ roles and get a personalized skill gap analysis tailored to industry standards.',
  },
  {
    title: 'Real-Time Recommendations',
    description:
      'Receive instant course suggestions and learning paths based on your current skill level.',
  },
  {
    title: 'Track Your Progress',
    description:
      'Monitor your skill development with detailed analytics and achievement milestones.',
  },
];

export const Features3 = () => {
  return (
    <div className="py-16 md:py-20">
      {/* Feature 3 - Course Recommendations */}
      <section className="container mx-auto px-4 mb-24 md:mb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Course Recommendations{' '}
              <span className="text-primary">Just for You</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              We match you with top-rated courses tailored to your goals and
              skill level, so you always know what to learn next from beginner
              basics to advanced mastery.
            </p>
            <ul className="space-y-4">
              {courseFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-base md:text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Image */}
          <div className="relative">
            <Image
              src="/images/landing-page/frame_3.svg"
              alt="Course recommendations interface"
              width={573}
              height={511}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Feature 4 - Skill Gap Analysis */}
      <section className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Image */}
          <div className="relative order-2 lg:order-1">
            <Image
              src="/images/landing-page/frame_4.svg"
              alt="Skill gap analysis interface"
              width={573}
              height={511}
              className="w-full h-auto"
            />
          </div>

          {/* Right Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Identify Your Skill Gaps Instantly
            </h2>
            <p className="text-lg text-muted-foreground">
              Select your target role and get a comprehensive analysis of your
              skills with personalized learning paths.
            </p>
            <ul className="space-y-6">
              {skillGapFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon />
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-semibold text-primary mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
