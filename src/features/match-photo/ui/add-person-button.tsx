'use client';

/**
 * AddPersonButton — 사람 추가 버튼
 *
 * @description
 * 최대 5명까지 추가 가능, 최대 도달 시 비활성화
 */

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface AddPersonButtonProps {
  canAdd: boolean;
  onAdd: () => void;
}

export function AddPersonButton({ canAdd, onAdd }: AddPersonButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onAdd}
      disabled={!canAdd}
      className={`flex h-14 w-14 items-center justify-center rounded-full border-3 border-dashed transition-all ${canAdd ? 'border-neutral-300 text-neutral-400 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-500' : 'cursor-not-allowed border-neutral-200 text-neutral-300'}`}
      whileHover={canAdd ? { scale: 1.05 } : {}}
      whileTap={canAdd ? { scale: 0.95 } : {}}
      aria-label="사람 추가"
      title={canAdd ? '사람 추가' : '최대 5명까지 추가 가능'}
    >
      <Plus size={24} strokeWidth={2.5} />
    </motion.button>
  );
}
