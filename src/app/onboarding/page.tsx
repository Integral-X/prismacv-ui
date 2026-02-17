'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { OnboardingStepper } from '@/components/pages/onboarding/OnboardingStepper';
import { OnboardingCard } from '@/components/pages/onboarding/OnboardingCard';
import { WavyPattern } from '@/components/common/WavyPattern';
import { Button } from '@/components/ui/button';
import { Upload, Linkedin, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );

  const handleCardClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (selectedOption === 'upload') {
      router.push('/onboarding/upload-cv');
    } else if (selectedOption === 'linkedin') {
      router.push('/onboarding/import-linkedin');
    } else if (selectedOption === 'scratch') {
      // TODO: Navigate to manual entry page
      // router.push('/onboarding/manual-entry');
    }
  };

  const cardOptions = [
    {
      id: 'upload',
      title: 'Upload Existing CV',
      description:
        "Have a resume? We'll parse it and fill in the details for you.",
      icon: <Upload className="w-10 h-10" strokeWidth={1.5} />,
    },
    {
      id: 'linkedin',
      title: 'Import from LinkedIn',
      description: 'Get a head start by importing your profile from LinkedIn.',
      icon: <Linkedin className="w-10 h-10" strokeWidth={1.5} />,
    },
    {
      id: 'scratch',
      title: 'Start from Scratch',
      description: 'Build your resume step-by-step with our guided process.',
      icon: <FileText className="w-10 h-10" strokeWidth={1.5} />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 flex flex-col items-center py-12 md:py-16 px-4 relative">
        <div className="container max-w-5xl mx-auto animate-fade-in w-full">
          {/* Stepper */}
          <div className="mb-8 md:mb-12">
            <OnboardingStepper currentStep={1} totalSteps={3} />
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8 md:mb-12 text-gray-900 px-4">
            Choose how you&apos;d like to create your resume.
          </h1>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 px-4">
            {cardOptions.map((option) => (
              <OnboardingCard
                key={option.id}
                title={option.title}
                description={option.description}
                icon={option.icon}
                onClick={() => handleCardClick(option.id)}
                className={cn(
                  selectedOption === option.id &&
                    'border-primary shadow-lg scale-[1.02] md:scale-105'
                )}
              />
            ))}
          </div>

          {/* Reassurance Text */}
          <p className="text-center text-muted-foreground mb-6 md:mb-8 text-sm md:text-base px-4">
            Don&apos;t worry, you can always change or update your information
            later
          </p>

          {/* Continue Button */}
          <div className="flex justify-center px-4">
            <Button
              onClick={handleContinue}
              disabled={!selectedOption}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 rounded-md text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
            >
              Continue
            </Button>
          </div>
        </div>
      </main>

      {/* Wavy Pattern Footer */}
      <div className="mt-auto w-full">
        <WavyPattern height={200} />
      </div>

      <Footer />
    </div>
  );
}
