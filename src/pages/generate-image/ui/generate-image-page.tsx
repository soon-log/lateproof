'use client';

import { Suspense } from 'react';
import { GenerateImageView } from '@/features/generate-image';
import { StepHeader } from '@/widgets/step-header';

function GenerateImageFallback() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-brand-100" />
      <p className="text-neutral-500 text-sm">잠시만 기다려주세요</p>
    </div>
  );
}

export function GenerateImagePage() {
  return (
    <div className="w-full">
      <StepHeader
        title="이미지를 만들 준비가 됐어요"
        description="프롬프트를 확인하고 생성 결과를 미리 확인해보세요"
      />
      <Suspense fallback={<GenerateImageFallback />}>
        <GenerateImageView />
      </Suspense>
    </div>
  );
}
