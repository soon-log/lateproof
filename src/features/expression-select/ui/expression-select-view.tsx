'use client';

/**
 * ExpressionSelectView — EXPRESSION Step 메인 뷰
 *
 * @description
 * MATCH Step에서 선택된 인물들을 기준으로 각 인물별 표정을 선택할 수 있는 UI
 *
 * 구조:
 * - 상단: 인물 버튼 목록 (최대 5명)
 * - 하단: 표정 선택 UI 또는 안내 문구
 *
 * 동작:
 * - 인물 버튼 클릭 → active 상태로 변경
 * - 표정 이모티콘 클릭 → active 인물에 표정 설정
 * - 초기화 버튼 → active 인물의 표정 해제
 */

import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { JSX } from 'react';
import { useCallback, useState } from 'react';
import type { ExpressionEmoji } from '@/entities/person';
import { selectPersons, usePersonStore } from '@/entities/person';
import { Step } from '@/entities/step/model/step';
import { useStepStore } from '@/entities/step/model/store';
import { NextStepButton } from '@/shared/components/ui';
import { ExpressionGrid } from './expression-grid';
import { ExpressionPersonButton } from './expression-person-button';

export function ExpressionSelectView() {
  const persons = usePersonStore(selectPersons);
  const setExpression = usePersonStore((s) => s.setExpression);
  const clearExpression = usePersonStore((s) => s.clearExpression);
  const nextStep = useStepStore((s) => s.nextStep);

  // 현재 선택된 인물 ID (EXPRESSION Step 내부 상태)
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  // 인물 선택 핸들러
  const handleSelectPerson = useCallback((personId: string) => {
    setSelectedPersonId(personId);
  }, []);

  const personButtons: JSX.Element[] = [];
  for (const [index, person] of persons.entries()) {
    personButtons.push(
      <ExpressionPersonButton
        key={person.id}
        person={person}
        index={index}
        isActive={person.id === selectedPersonId}
        onSelect={() => handleSelectPerson(person.id)}
      />
    );
  }

  // 선택된 인물 찾기
  const selectedPerson = persons.find((p) => p.id === selectedPersonId) ?? null;
  const selectedPersonIndex = persons.findIndex((p) => p.id === selectedPersonId);

  // 표정 선택 핸들러
  const handleSelectExpression = useCallback(
    (emoji: ExpressionEmoji) => {
      if (!selectedPersonId) return;
      setExpression(selectedPersonId, emoji);
    },
    [selectedPersonId, setExpression]
  );

  // 표정 초기화 핸들러
  const handleResetExpression = useCallback(() => {
    if (!selectedPersonId) return;
    clearExpression(selectedPersonId);
  }, [selectedPersonId, clearExpression]);

  // 다음 Step으로 이동
  const handleNext = useCallback(() => {
    nextStep(Step.PAYMENT, 'EXPRESSION 완료');
  }, [nextStep]);

  return (
    <div className="flex flex-col gap-6">
      {/* 상단: 인물 버튼 목록 */}
      <div className="rounded-2xl bg-white p-4 shadow-lg">
        <h3 className="mb-3 font-semibold text-neutral-800">인물 선택</h3>
        <div className="flex flex-wrap justify-center gap-2">{personButtons}</div>
      </div>

      {/* 하단: 표정 선택 UI 또는 안내 문구 */}
      <AnimatePresence mode="wait">
        {selectedPerson ? (
          <ExpressionGrid
            key={selectedPersonId}
            selectedExpression={selectedPerson.expression}
            onSelect={handleSelectExpression}
            onReset={handleResetExpression}
            personIndex={selectedPersonIndex}
          />
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 py-16"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              className="mb-4 text-6xl"
            >
              <Sparkles className="h-16 w-16 text-brand-400" />
            </motion.div>
            <h2 className="mb-2 font-bold text-2xl text-neutral-800">표정을 선택해보세요</h2>
            <p className="text-center text-neutral-500">
              위에서 인물을 클릭하면
              <br />
              해당 인물의 표정을 선택할 수 있어요
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 안내 메시지 */}
      <div className="rounded-xl bg-brand-50 p-4">
        <p className="text-brand-700 text-sm">
          💡 표정 선택은 선택 사항이에요. 원하시면 바로 다음으로 넘어가도 돼요!
        </p>
      </div>

      {/* 다음 버튼 */}
      <div className="mt-2">
        <NextStepButton onClick={handleNext}>결제하기</NextStepButton>
      </div>
    </div>
  );
}
