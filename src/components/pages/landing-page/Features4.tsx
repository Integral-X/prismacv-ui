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

const customizationFeatures = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
        <text x="6" y="18" fontSize="16" fill="#4ECCA3" fontWeight="bold">T</text>
      </svg>
    ),
    title: "Custom Typography",
    description: "Select from premium fonts and customize text styles to match your personal brand.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
        <circle cx="12" cy="12" r="8" fill="none" stroke="#4ECCA3" strokeWidth="2"/>
        <circle cx="8" cy="12" r="2" fill="#4ECCA3"/>
        <circle cx="16" cy="12" r="2" fill="#E28957"/>
      </svg>
    ),
    title: "Color Customization",
    description: "Pick your perfect color scheme with our intuitive palette selector and live preview.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
        <circle cx="12" cy="12" r="8" fill="none" stroke="#4ECCA3" strokeWidth="2"/>
        <path d="M12 8V12L15 15" stroke="#4ECCA3" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Easy Configuration",
    description: "Fine-tune every detail with simple, intuitive controls for a truly personalized result.",
  },
];

const atsFeatures = [
  "Integrate relevant keywords that match job descriptions and industry standards.",
  "Automatically adjust your resume to be ATS-friendly, improving your chances of landing an interview.",
  "Automatically adjust your resume to be ATS-friendly, improving your chances of landing an interview.",
];

const resumeSections = [
  {
    text: "Professional sections like ",
    highlights: ["Experience", "Skills", "Summary", "Education"],
  },
  {
    text: "Personal sections like ",
    highlights: ["Strengths", "Quotes", "Books", "Interests", "My Time"],
  },
  {
    text: "Other sections like ",
    highlights: ["Certifications", "Awards", "Achievements", "Languages"],
    extraText: " and ",
    extraHighlights: ["References"],
  },
];

export const Features4 = () => {
  return (
    <div className="py-16 md:py-20">
      {/* Feature 5 - Customize Every Detail */}
      <section className="container mx-auto px-4 mb-24 md:mb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Customize Every Detail
            </h2>
            <p className="text-lg text-muted-foreground">
              Create a resume that stands out with powerful customization tools designed for
            </p>
            <ul className="space-y-6">
              {customizationFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="mt-1">{feature.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-semibold mb-1">
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

          {/* Right Image */}
          <div className="relative">
            <Image
              src="/images/landing-page/frame_5.svg"
              alt="Customization tools interface"
              width={573}
              height={511}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Feature 6 - ATS Score */}
      <section className="container mx-auto px-4 mb-24 md:mb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Image */}
          <div className="relative order-2 lg:order-1">
            <Image
              src="/images/landing-page/frame_6.svg"
              alt="ATS score optimization interface"
              width={573}
              height={511}
              className="w-full h-auto"
            />
          </div>

          {/* Right Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Boost Your Resume&apos;s ATS Score
            </h2>
            <p className="text-lg text-muted-foreground">
              Make sure your resume gets past applicant tracking systems and lands in the recruiter&apos;s hands.
            </p>
            <ul className="space-y-4">
              {atsFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-base md:text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Feature 7 - Resume Sections */}
      <section className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              We offer resume sections for every profession.
            </h2>
            <ul className="space-y-4">
              {resumeSections.map((section, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon />
                  <div className="text-base md:text-lg">
                    <span className="text-muted-foreground">{section.text}</span>
                    {section.highlights.map((highlight, idx) => (
                      <span key={idx}>
                        <span className="text-primary font-medium">{highlight}</span>
                        {idx < section.highlights.length - 1 && <span className="text-muted-foreground">, </span>}
                      </span>
                    ))}
                    {section.extraText && (
                      <>
                        <span className="text-muted-foreground">{section.extraText}</span>
                        {section.extraHighlights?.map((highlight, idx) => (
                          <span key={idx} className="text-primary font-medium">{highlight}</span>
                        ))}
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Image */}
          <div className="relative">
            <Image
              src="/images/landing-page/frame_7.svg"
              alt="Resume sections interface"
              width={573}
              height={511}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

