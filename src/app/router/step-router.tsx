/**
 * StepRouter — Step 기반 페이지 라우팅
 *
 * @description
 * FSM Store의 currentStep에 따라 적절한 페이지 컴포넌트 렌더링
 * - Framer Motion 페이지 전환 애니메이션
 * - AnimatePresence로 부드러운 전환
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Step } from '@/entities/step/model/step';
import { selectCurrentStep, useStepStore } from '@/entities/step/model/store';
import { SelectModePage } from '@/pages/select-mode';

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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        {currentStep === Step.SELECT_MODE && <SelectModePage />}
        {currentStep === Step.UPLOAD && (
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-2xl text-neutral-500">UPLOAD Step (예정)</p>
          </div>
        )}
        {currentStep === Step.MATCH && (
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-2xl text-neutral-500">MATCH Step (예정)</p>
          </div>
        )}
        {currentStep === Step.PAYMENT && (
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-2xl text-neutral-500">PAYMENT Step (예정)</p>
          </div>
        )}
        {currentStep === Step.GENERATE && (
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-2xl text-neutral-500">GENERATE Step (예정)</p>
          </div>
        )}
        {currentStep === Step.RESULT && (
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-2xl text-neutral-500">RESULT Step (예정)</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
