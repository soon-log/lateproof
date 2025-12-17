'use client';

/**
 * ExpressionPersonButton — 표정 선택용 인물 버튼
 *
 * @description
 * EXPRESSION Step 상단에서 인물을 선택하는 버튼
 * - 인물 이미지 (또는 기본 아이콘) + 번호 표시
 * - 선택된 표정 이모티콘이 있으면 함께 표시
 * - active 상태 시 시각적 구분
 */

import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import Image from 'next/image';
import type { Person, PersonColorType } from '@/entities/person';
import { PERSON_COLOR_VALUES } from '@/entities/person';
import { cn } from '@/shared/lib/utils';

interface ExpressionPersonButtonProps {
  person: Person;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}

export function ExpressionPersonButton({
  person,
  index,
  isActive,
  onSelect
}: ExpressionPersonButtonProps) {
  const colorClasses = PERSON_COLOR_VALUES[person.color as PersonColorType];

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative flex flex-col items-center gap-1 rounded-xl p-3 transition-all',
        'hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        isActive && `ring-2 ${colorClasses.border} bg-brand-50 shadow-md`
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      aria-pressed={isActive}
      aria-label={`인물 ${index + 1} 선택`}
    >
      {/* 인물 이미지 */}
      <div className="relative">
        <div
          className={cn(
            'relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-3 shadow-md transition-transform',
            colorClasses.border,
            person.facePhotoUrl ? 'bg-white' : colorClasses.bg,
            isActive && 'scale-110'
          )}
        >
          {person.facePhotoUrl ? (
            <Image
              src={person.facePhotoUrl}
              alt={`인물 ${index + 1}`}
              width={56}
              height={56}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-6 w-6 text-white" strokeWidth={2.5} />
          )}
        </div>

        {/* 선택된 표정 이모티콘 배지 - 원 밖 오른쪽 상단 */}
        {person.expression && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="-right-2 -top-2 absolute flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-100 text-lg shadow-lg"
          >
            {person.expression}
          </motion.div>
        )}
      </div>

      {/* 인물 번호 */}
      <span
        className={cn('font-semibold text-xs', isActive ? colorClasses.text : 'text-neutral-500')}
      >
        인물 {index + 1}
      </span>
    </motion.button>
  );
}
