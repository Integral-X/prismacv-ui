"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { OnboardingStepper } from "@/components/pages/onboarding/OnboardingStepper";
import { WavyPattern } from "@/components/common/WavyPattern";
import { FileUpload } from "@/components/pages/onboarding/FileUpload";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function UploadCVPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  const handleContinue = () => {
    if (selectedFile) {
      // Navigate to template selection (Step 3)
      router.push("/onboarding/select-template");
    }
  };

  const handleBack = () => {
    router.push("/onboarding");
  };

  const handleSkip = () => {
    // TODO: Navigate to manual entry or skip this step
    // router.push('/onboarding/manual-entry');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 flex flex-col py-8 md:py-12 px-4 relative">
        <div className="container max-w-4xl mx-auto animate-fade-in w-full">
          {/* Stepper */}
          <div className="mb-6 md:mb-8">
            <OnboardingStepper currentStep={2} totalSteps={3} />
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Main Heading */}
          <div className="text-center mb-8 md:mb-12 px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-gray-900">
              Upload Your CV
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;ll analyze your resume and automatically fill in your
              details
            </p>
          </div>

          {/* File Upload Component */}
          <div className="mb-8 px-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              maxSizeMB={5}
              acceptedFormats={[".pdf", ".doc", ".docx"]}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <Button
              onClick={handleContinue}
              disabled={!selectedFile}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 rounded-md text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              Continue
            </Button>

            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-600 hover:text-gray-900 w-full sm:w-auto"
            >
              Skip for now
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500 mt-8 px-4">
            Your data is secure and will only be used to create your resume
          </p>
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
