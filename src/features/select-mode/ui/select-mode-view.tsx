'use client';

import { motion } from 'framer-motion';
import { Camera, MapPin } from 'lucide-react';
import { Mode } from '@/entities/step';
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

type SelectModeViewProps = {
  selectedMode: Mode | null;
  setSelectedMode: (mode: Mode) => void;
};

export function SelectModeView({ selectedMode, setSelectedMode }: SelectModeViewProps) {
  const handleModeSelect = (mode: Mode) => {
    setSelectedMode(mode);
  };

  return (
    <motion.div className="w-full" initial="initial" animate="animate" exit="exit">
      <motion.div className="w-full" variants={staggerContainer}>
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
      </motion.div>
    </motion.div>
  );
}
