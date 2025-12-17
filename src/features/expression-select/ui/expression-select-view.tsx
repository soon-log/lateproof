'use client';

/**
 * ExpressionSelectView — EXPRESSION Step 메인 뷰
 *
 * @description
 * 표정 선택 기능 (추후 구현 예정)
 * 현재는 placeholder UI
 */

import Image from 'next/image';
import { useCallback } from 'react';
import { selectActivePersonId, selectPersons, usePersonStore } from '@/entities/person';
import { Step } from '@/entities/step/model/step';
import { useStepStore } from '@/entities/step/model/store';
import { NextStepButton } from '@/shared/components/ui';

export function ExpressionSelectView() {
  const persons = usePersonStore(selectPersons);
  const activePersonId = usePersonStore(selectActivePersonId);
  const nextStep = useStepStore((s) => s.nextStep);

  // 다음 Step으로 이동
  const handleNext = useCallback(() => {
    nextStep(Step.PAYMENT, 'EXPRESSION 완료');
  }, [nextStep]);

  const personChips = persons.map((person, index) => {
    const chipClassName =
      person.id === activePersonId
        ? 'bg-brand-100 text-brand-700'
        : 'bg-neutral-100 text-neutral-600';

    return (
      <div
        key={person.id}
        className={`flex items-center gap-2 rounded-full px-4 py-2 ${chipClassName}`}
      >
        {person.facePhotoUrl ? (
          <Image
            src={person.facePhotoUrl}
            alt=""
            width={24}
            height={24}
            unoptimized
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <div className="h-6 w-6 rounded-full bg-neutral-300" />
        )}
        <span className="font-medium text-sm">인물 {index + 1}</span>
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* 인물 목록 요약 */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 font-semibold text-lg text-neutral-800">등록된 인물</h3>
        <div className="flex flex-wrap gap-3">{personChips}</div>
      </div>

      {/* Placeholder */}
      <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="mb-4 text-6xl">😊</div>
        <h2 className="mb-2 font-bold text-2xl text-neutral-800">표정 선택</h2>
        <p className="text-center text-neutral-500">
          각 인물에 적용할 표정을 선택하세요.
          <br />
          <span className="text-sm">(기능 구현 예정)</span>
        </p>
      </div>

      {/* 안내 메시지 */}
      <div className="rounded-xl bg-amber-50 p-4">
        <p className="text-amber-700 text-sm">
          ⚠️ 이 Step은 아직 구현 중입니다. 뒤로가기 버튼을 눌러 MATCH Step으로 돌아갈 수 있습니다.
        </p>
      </div>

      {/* 다음 버튼 */}
      <div className="mt-2">
        <NextStepButton onClick={handleNext}>결제하기</NextStepButton>
      </div>
    </div>
  );
}
