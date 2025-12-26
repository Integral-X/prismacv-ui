'use client';

import Image from "next/image";

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

const features1 = [
  "Wording and readability analysis",
  "Eliminate typos and grammatical errors",
  "Content siggestions based on your job and experience",
];

const features2 = [
  "Wording and readability analysis",
  "Eliminate typos and grammatical errors",
  "Content siggestions based on your job and experience",
];

export const Features2 = () => {
  return (
    <div className="py-16 md:py-20">
      {/* Feature 1 - Grammar Checker */}
      <section className="container mx-auto px-4 mb-24 md:mb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Ensure your resume is free of grammar and punctuation errors.
            </h2>
            <p className="text-lg text-muted-foreground">
              A built in - content cheacker tool helping you stay on top grammer errors and analysis
            </p>
            <ul className="space-y-4">
              {features1.map((feature, index) => (
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
              src="/images/landing-page/frame_1.svg"
              alt="Grammar checking tool interface"
              width={573}
              height={511}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Feature 2 - Personalize Resume */}
      <section className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Image */}
          <div className="relative order-2 lg:order-1">
            <Image
              src="/images/landing-page/frame_2.svg"
              alt="Resume personalization interface"
              width={573}
              height={511}
              className="w-full h-auto"
            />
          </div>

          {/* Right Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Personalize Your Resume for Each Application
            </h2>
            <p className="text-lg text-muted-foreground">
              A built in - content cheacker tool helping you stay on top grammer errors and analysis
            </p>
            <ul className="space-y-4">
              {features2.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-base md:text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

