/**
 * SelectModeView — 모드 선택 화면
 *
 * @description
 * Photo Mode / Map Mode 선택 UI
 * - Stealth UX: 자연스러운 언어 사용
 * - FSM Store 연동
 * - 페이지 전환 애니메이션
 */

'use client';

import { motion } from 'framer-motion';
import { Camera, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Mode, Step, useStepStore } from '@/entities/step';
import { Button } from '@/shared/components/ui/button';
import { ModeCard } from './mode-card';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function SelectModeView() {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const { setMode, nextStep } = useStepStore();

  const handleModeSelect = (mode: Mode) => {
    setSelectedMode(mode);
  };

  const handleNext = () => {
    if (!selectedMode) return;
    setMode(selectedMode);
    nextStep(Step.UPLOAD, `Mode selected: ${selectedMode}`);
  };

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-neutral-50 p-4"
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="w-full max-w-4xl" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="mb-12 text-center" variants={fadeInUp}>
          <h1 className="mb-4 font-bold text-4xl text-neutral-900">어떤 방식으로 만들까요?</h1>
          <p className="text-lg text-neutral-500">사진을 올리거나, 장소를 선택해주세요</p>
        </motion.div>

        {/* Mode Cards */}
        <motion.div className="mb-8 grid gap-6 md:grid-cols-2" variants={staggerContainer}>
          {/* Photo Mode */}
          <motion.div variants={fadeInUp}>
            <ModeCard
              icon={Camera}
              title="사진으로 만들기"
              description="내가 찍은 사진에 자연스럽게 인물을 추가해요"
              badge={
                <span className="rounded-full bg-brand-500 px-3 py-1 font-semibold text-white text-xs">
                  추천
                </span>
              }
              onClick={() => handleModeSelect(Mode.PHOTO)}
              isSelected={selectedMode === Mode.PHOTO}
            />
          </motion.div>

          {/* Map Mode */}
          <motion.div variants={fadeInUp}>
            <ModeCard
              icon={MapPin}
              title="장소로 만들기"
              description="원하는 장소를 선택하면 그 분위기로 만들어요"
              onClick={() => handleModeSelect(Mode.MAP)}
              isSelected={selectedMode === Mode.MAP}
            />
          </motion.div>
        </motion.div>

        {/* Next Button */}
        <motion.div className="flex justify-center" variants={fadeInUp}>
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!selectedMode}
            className="px-8 py-6 text-lg"
          >
            다음으로
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
