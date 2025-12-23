'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Step } from '@/entities/step/model/step';
import { selectCurrentStep, useStepStore } from '@/entities/step/model/store';
import { ExpressionSelectPage } from '@/pages/expression-select';
import { GenerateImagePage } from '@/pages/generate-image';
import { MatchPhotoPage } from '@/pages/match-photo';
import { SelectModePage } from '@/pages/select-mode';
import { UploadPhotoPage } from '@/pages/upload-photo';
import { NextStepButton } from '@/shared/components/ui';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.3
};

export function StepRouter() {
  const currentStep = useStepStore(selectCurrentStep);
  const nextStep = useStepStore((state) => state.nextStep);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-neutral-50 p-4">
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="w-full"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            {currentStep === Step.SELECT_MODE && <SelectModePage />}
            {currentStep === Step.UPLOAD && <UploadPhotoPage />}
            {currentStep === Step.MATCH && <MatchPhotoPage />}
            {currentStep === Step.EXPRESSION && <ExpressionSelectPage />}
            {currentStep === Step.PAYMENT && (
              <div className="flex w-full flex-col items-center justify-center gap-6 py-24 text-center">
                <p className="text-2xl text-neutral-500">결제 단계 준비 중</p>
                <NextStepButton onClick={() => nextStep(Step.GENERATE, 'PAYMENT 테스트 통과')}>
                  결제 없이 생성 테스트
                </NextStepButton>
              </div>
            )}
            {currentStep === Step.GENERATE && <GenerateImagePage />}
            {currentStep === Step.RESULT && (
              <div className="flex w-full items-center justify-center py-24">
                <p className="text-2xl text-neutral-500">RESULT Step (예정)</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
