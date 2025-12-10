/**
 * ModeCard — 모드 선택 카드 컴포넌트
 *
 * @description
 * Photo Mode / Map Mode 선택을 위한 인터랙티브 카드
 * - Stealth UX: "AI 생성" 대신 자연스러운 언어 사용
 * - 브랜드 Purple 색상 시스템
 * - Hover/Active 상태 애니메이션
 */

'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: ReactNode;
  onClick: () => void;
  isSelected?: boolean;
}

export function ModeCard({
  icon: Icon,
  title,
  description,
  badge,
  onClick,
  isSelected = false
}: ModeCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => {
        if (isSelected) return;
        onClick();
      }}
      className={`relative w-full rounded-lg border-2 p-8 transition-all duration-200 ${
        isSelected
          ? 'border-brand-500 bg-brand-50 shadow-lg'
          : 'border-neutral-200 bg-white hover:border-brand-300 hover:shadow-md'
      }focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`${title} 선택`}
    >
      {/* Badge (optional) */}
      {badge && <div className="absolute top-4 right-4">{badge}</div>}

      {/* Icon */}
      <div
        className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${isSelected ? 'bg-brand-500' : 'bg-brand-100'}transition-colors duration-200`}
      >
        <Icon
          className={`h-8 w-8 ${isSelected ? 'text-white' : 'text-brand-700'}
          `}
        />
      </div>

      {/* Title */}
      <h3 className="mb-2 font-bold text-2xl text-neutral-900">{title}</h3>

      {/* Description */}
      <p className="text-neutral-500 leading-relaxed">{description}</p>

      {/* Selected Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-4 inline-flex items-center gap-2 font-semibold text-brand-700"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          선택됨
        </motion.div>
      )}
    </motion.button>
  );
}
