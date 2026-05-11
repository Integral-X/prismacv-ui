'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Footer } from '@/components/common/Footer';
import { OnboardingStepper } from '@/components/pages/onboarding/OnboardingStepper';
import { WavyPattern } from '@/components/common/WavyPattern';
import { FileUpload } from '@/components/pages/onboarding/FileUpload';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { importCvFromFileAction } from '@/modules/cv/data/actions';

export function UploadCVPageClient() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleContinue = () => {
    startTransition(async () => {
      if (selectedFile) {
        try {
          const result = await importCvFromFileAction(selectedFile);
          if (result.ok && result.redirectTo) {
            router.push(result.redirectTo);
          } else if (result.ok) {
            toast.error('Something went wrong. Please try again.');
          } else {
            toast.error(result.message);
          }
        } catch {
          toast.error('Something went wrong. Please try again.');
        }
        return;
      }
      router.push('/onboarding/select-template');
    });
  };

  const handleBack = () => {
    router.push('/onboarding');
  };

  const handleSkip = () => {
    router.push('/onboarding/select-template');
  };

  return (
    <>
      <main className='flex-1 flex flex-col py-8 md:py-12 px-4 relative'>
        <div className='container max-w-4xl mx-auto animate-fade-in w-full'>
          <div className='mb-6 md:mb-8'>
            <OnboardingStepper currentStep={2} totalSteps={3} />
          </div>

          <Button
            variant='ghost'
            onClick={handleBack}
            className='mb-6 -ml-2 text-content-secondary hover:text-content-primary'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>

          <div className='text-center mb-8 md:mb-12 px-4'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-content-primary'>
              Bring your CV (optional)
            </h1>
            <p className='text-base md:text-lg text-content-secondary max-w-2xl mx-auto'>
              Upload a PDF or Word (.docx) resume and we&apos;ll map it into
              Experience, Education, Skills, and Projects using section anchors
              first, then AI fallback when needed. We also keep the imported
              text in your summary so you can quickly refine it later.
            </p>
          </div>

          <div className='mb-8 px-4'>
            <FileUpload
              maxSizeMB={5}
              acceptedFormats={['.pdf', '.docx']}
              onFileSelect={(file) => setSelectedFile(file)}
              onFileRemove={() => setSelectedFile(null)}
            />
          </div>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center px-4'>
            <Button
              onClick={handleContinue}
              disabled={isPending}
              className='bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 rounded-md text-base font-medium transition-all w-full sm:w-auto'
            >
              {isPending ? (
                <>
                  <Loader2 className='inline-block w-4 h-4 mr-2 animate-spin' />
                  {selectedFile ? 'Importing…' : 'Continue'}
                </>
              ) : selectedFile ? (
                'Import & continue'
              ) : (
                'Continue'
              )}
            </Button>

            <Button
              variant='ghost'
              onClick={handleSkip}
              disabled={isPending}
              className='text-content-secondary hover:text-content-primary w-full sm:w-auto'
            >
              Skip for now
            </Button>
          </div>

          <p className='text-center text-sm text-content-muted mt-8 px-4 max-w-xl mx-auto'>
            Files are sent securely to PrismaCV for parsing (max 5 MB). PDF and
            DOCX are supported, and imported sections are always editable in the
            CV editor.
          </p>
        </div>
      </main>

      <div className='mt-auto w-full'>
        <WavyPattern height={200} />
      </div>

      <Footer />
    </>
  );
}
