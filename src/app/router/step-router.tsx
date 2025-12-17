'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Step } from '@/entities/step/model/step';
import { selectCurrentStep, useStepStore } from '@/entities/step/model/store';
import { SelectModePage } from '@/pages/select-mode';
import { UploadPhotoPage } from '@/pages/upload-photo';

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
            {currentStep === Step.MATCH && (
              <div className="flex w-full items-center justify-center py-24">
                <p className="text-2xl text-neutral-500">MATCH Step (예정)</p>
              </div>
            )}
            {currentStep === Step.PAYMENT && (
              <div className="flex w-full items-center justify-center py-24">
                <p className="text-2xl text-neutral-500">PAYMENT Step (예정)</p>
              </div>
            )}
            {currentStep === Step.GENERATE && (
              <div className="flex w-full items-center justify-center py-24">
                <p className="text-2xl text-neutral-500">GENERATE Step (예정)</p>
              </div>
            )}
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
