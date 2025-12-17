'use client';

import { useCallback } from 'react';
import { usePersonStore } from '@/entities/person';
import { MatchPhotoView } from '@/features/match-photo';
import { StepHeader } from '@/widgets/step-header';

export function MatchPhotoPage() {
  const reset = usePersonStore((s) => s.reset);

  // 뒤로가기 시 인물 설정 전체 초기화
  const handleBeforeBack = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="w-full">
      <StepHeader
        title="인물을 배치해주세요"
        description="사진 속 얼굴을 올릴 위치에 마커를 배치하고, 각 인물의 얼굴 사진을 업로드하세요"
        onBeforeBack={handleBeforeBack}
      />
      <MatchPhotoView />
    </div>
  );
}
