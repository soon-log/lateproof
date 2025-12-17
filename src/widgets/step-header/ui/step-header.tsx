'use client';

import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { selectCanGoBack, selectPrevStep, useStepStore } from '@/entities/step';
import { Button } from '@/shared/components/ui/button';

interface StepHeaderProps {
  title: ReactNode;
  description: ReactNode;
}

export function StepHeader({ title, description }: StepHeaderProps) {
  const canGoBack = useStepStore(selectCanGoBack);
  const prevStep = useStepStore(selectPrevStep);

  return (
    <div className="w-full">
      {canGoBack && (
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevStep}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            이전으로
          </Button>
        </div>
      )}

      <div className="mb-8 text-center">
        <h1 className="mb-3 font-bold text-3xl text-neutral-900">{title}</h1>
        <p className="text-lg text-neutral-500">{description}</p>
      </div>
    </div>
  );
}
