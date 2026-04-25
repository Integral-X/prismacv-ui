'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/common/Footer';
import { OnboardingStepper } from '@/components/pages/onboarding/OnboardingStepper';
import { WavyPattern } from '@/components/common/WavyPattern';
import { LinkedInImport } from '@/components/pages/onboarding/LinkedInImport';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function ImportLinkedInPageClient() {
  const router = useRouter();
  const [importedUrl, setImportedUrl] = React.useState<string | null>(null);

  const handleImport = (url: string) => {
    setImportedUrl(url);
  };

  const handleRemove = () => {
    setImportedUrl(null);
  };

  const handleContinue = () => {
    if (importedUrl) {
      // Navigate to template selection (Step 3)
      router.push('/onboarding/select-template');
    }
  };

  const handleBack = () => {
    router.push('/onboarding');
  };

  const handleSkip = () => {
    // TODO: Navigate to manual entry or skip this step
    // router.push('/onboarding/manual-entry');
  };

  return (
    <>
      <main className='flex-1 flex flex-col py-8 md:py-12 px-4 relative'>
        <div className='container max-w-4xl mx-auto animate-fade-in w-full'>
          {/* Stepper */}
          <div className='mb-6 md:mb-8'>
            <OnboardingStepper currentStep={2} totalSteps={3} />
          </div>

          {/* Back Button */}
          <Button
            variant='ghost'
            onClick={handleBack}
            className='mb-6 -ml-2 text-gray-600 hover:text-gray-900'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>

          {/* Main Heading */}
          <div className='text-center mb-8 md:mb-12 px-4'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-gray-900'>
              Import from LinkedIn
            </h1>
            <p className='text-base md:text-lg text-gray-600 max-w-2xl mx-auto'>
              We&apos;ll import your profile information and automatically fill
              in your details
            </p>
          </div>

          {/* LinkedIn Import Component */}
          <div className='mb-8 px-4'>
            <LinkedInImport onImport={handleImport} onRemove={handleRemove} />
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center px-4'>
            <Button
              onClick={handleContinue}
              disabled={!importedUrl}
              className='bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 rounded-md text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto'
            >
              Continue
            </Button>

            <Button
              variant='ghost'
              onClick={handleSkip}
              className='text-gray-600 hover:text-gray-900 w-full sm:w-auto'
            >
              Skip for now
            </Button>
          </div>

          {/* Help Text */}
          <p className='text-center text-sm text-gray-500 mt-8 px-4'>
            Your data is secure and will only be used to create your resume
          </p>
        </div>
      </main>

      {/* Wavy Pattern Footer */}
      <div className='mt-auto w-full'>
        <WavyPattern height={200} />
      </div>

      <Footer />
    </>
  );
}
