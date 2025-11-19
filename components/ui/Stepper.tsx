
import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  const adjustedCurrentStep = currentStep - 1; // Adjust to be 0-indexed

  return (
    <nav aria-label="Progress" className="w-full py-4">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
            {stepIdx < adjustedCurrentStep ? (
              // Completed Step
              <>
                <div className="absolute inset-0 top-1/2 -translate-y-1/2 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-border-dark" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary transition-all duration-300">
                  <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xs text-center w-28 text-text-primary mt-1">{step}</span>
              </>
            ) : stepIdx === adjustedCurrentStep ? (
              // Current Step
              <>
                <div className="absolute inset-0 top-1/2 -translate-y-1/2 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${stepIdx === 0 ? 'bg-transparent' : 'bg-border-dark'}`} />
                  <div className="h-0.5 w-full bg-border-dark" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background-dark-soft transition-all duration-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
                </div>
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xs text-center w-28 font-semibold text-primary mt-1">{step}</span>
              </>
            ) : (
              // Upcoming Step
              <>
                <div className="absolute inset-0 top-1/2 -translate-y-1/2 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-border-dark" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-border-dark bg-background-dark-soft transition-all duration-300">
                </div>
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xs text-center w-28 text-text-secondary mt-1">{step}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper;
