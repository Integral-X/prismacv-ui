'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface OnboardingStepperProps {
  currentStep: number;
  totalSteps?: number;
}

export const OnboardingStepper = ({
  currentStep,
  totalSteps = 3,
}: OnboardingStepperProps) => {
  return (
    <div className='flex items-center justify-center w-full mb-12'>
      <div className='flex items-center w-full max-w-md'>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={stepNumber}>
              {/* Step Circle */}
              <div className='flex flex-col items-center relative z-10'>
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md scale-110'
                      : isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-200 text-gray-500'
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < totalSteps - 1 && (
                <div className='flex-1 h-0.5 mx-2 relative'>
                  <div
                    className={cn(
                      'h-full transition-all duration-500',
                      index < currentStep - 1 ? 'bg-primary' : 'bg-gray-200'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
