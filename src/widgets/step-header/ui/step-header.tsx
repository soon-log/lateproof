'use client';

import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { selectCanGoBack, selectPrevStep, useStepStore } from '@/entities/step';
import { Button } from '@/shared/components/ui/button';

interface StepHeaderProps {
  title: ReactNode;
  description: ReactNode;
  /**
   * 뒤로가기 버튼 클릭 시 prevStep() 실행 전에 호출되는 콜백
   * 예: MATCH Step에서 뒤로갈 때 인물 설정 초기화
   */
  onBeforeBack?: () => void;
}

export function StepHeader({ title, description, onBeforeBack }: StepHeaderProps) {
  const canGoBack = useStepStore(selectCanGoBack);
  const prevStep = useStepStore(selectPrevStep);

  const handleBack = useCallback(() => {
    // 뒤로가기 전에 필요한 작업 실행
    onBeforeBack?.();
    // 이전 Step으로 이동
    prevStep();
  }, [onBeforeBack, prevStep]);

  return (
    <div className="w-full">
      {canGoBack && (
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
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
