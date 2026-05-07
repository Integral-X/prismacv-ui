'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Footer } from '@/components/common/Footer';
import { OnboardingStepper } from '@/components/pages/onboarding/OnboardingStepper';
import { WavyPattern } from '@/components/common/WavyPattern';
import { TemplateSelector } from '@/components/pages/onboarding/TemplateSelector';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  createCvAction,
  importLinkedInToCvAction,
} from '@/modules/cv/data/actions';
import { toast } from 'sonner';

export function SelectTemplatePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const importId = searchParams.get('importId');
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(
    null
  );
  const [isPending, startTransition] = React.useTransition();

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    if (!selectedTemplate) return;

    startTransition(async () => {
      const result = importId
        ? await importLinkedInToCvAction({
            importId,
            title: 'My CV',
            templateId: selectedTemplate,
          })
        : await createCvAction({
            title: 'My CV',
            templateId: selectedTemplate,
          });

      if (result.ok && result.redirectTo) {
        router.push(result.redirectTo);
      } else if (!result.ok) {
        toast.error(result.message);
      }
    });
  };

  const handleBack = () => {
    // Go back to previous step (upload-cv or import-linkedin)
    router.back();
  };

  return (
    <>
      <main className='flex-1 flex flex-col py-8 md:py-12 px-4 relative'>
        <div className='container max-w-7xl mx-auto animate-fade-in w-full'>
          {/* Stepper */}
          <div className='mb-6 md:mb-8'>
            <OnboardingStepper currentStep={3} totalSteps={3} />
          </div>

          {/* Back Button */}
          <Button
            variant='ghost'
            onClick={handleBack}
            className='mb-6 -ml-2 text-content-secondary hover:text-content-primary'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>

          {/* Main Heading */}
          <div className='text-center mb-8 md:mb-12 px-4'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-content-primary'>
              Job-winning templates for you.
            </h1>
            <p className='text-base md:text-lg text-content-secondary max-w-2xl mx-auto'>
              Select a professional template that matches your style
            </p>
          </div>

          {/* Template Selector Component */}
          <div className='mb-8 px-4'>
            <TemplateSelector
              onSelect={handleTemplateSelect}
              selectedTemplate={selectedTemplate}
            />
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center px-4'>
            <Button
              onClick={handleContinue}
              disabled={!selectedTemplate || isPending}
              className='bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 rounded-md text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto'
            >
              {isPending ? 'Creating...' : 'Continue'}
            </Button>
          </div>

          {/* Help Text */}
          <p className='text-center text-sm text-content-muted mt-8 px-4'>
            You can change your template later in the editor
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
