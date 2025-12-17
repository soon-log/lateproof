'use client';

import { useState } from 'react';
import { type Mode, Step, useStepStore } from '@/entities/step';
import { SelectModeView } from '@/features/select-mode';
import { NextStepButton } from '@/shared/components/ui';
import { StepHeader } from '@/widgets/step-header';

export function SelectModePage() {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const { setMode, nextStep } = useStepStore();

  const handleNext = () => {
    if (!selectedMode) return;
    setMode(selectedMode);
    nextStep(Step.UPLOAD, `Mode selected: ${selectedMode}`);
  };

  return (
    <div className="w-full">
      <StepHeader
        title="어떤 방식으로 만들까요?"
        description="사진을 올리거나, 장소를 선택해주세요"
      />
      <SelectModeView selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
      <NextStepButton onClick={handleNext} disabled={!selectedMode} />
    </div>
  );
}
