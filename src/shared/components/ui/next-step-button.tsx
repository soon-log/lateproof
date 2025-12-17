/**
 * NextStepButton — Step 전환용 공통 버튼
 *
 * @description
 * 모든 Step에서 사용되는 "다음으로" 버튼의 스타일 통일을 위한 컴포넌트
 * - Button의 모든 Props 지원
 * - 로딩 상태 처리
 * - Framer Motion 애니메이션 내장
 * - 중앙 정렬 레이아웃
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <NextStepButton onClick={handleNext} disabled={!isValid} />
 *
 * // 로딩 상태
 * <NextStepButton onClick={handleNext} isLoading={isUploading} loadingText="올리는 중..." />
 *
 * // 커스텀 텍스트
 * <NextStepButton onClick={handleNext}>확인하기</NextStepButton>
 * ```
 */

'use client';

import type { VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/utils';
import { Button, type buttonVariants } from './button';

interface NextStepButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  /**
   * 로딩 상태 여부
   * @default false
   */
  isLoading?: boolean;
  /**
   * 로딩 중 표시할 텍스트
   * @default "처리 중..."
   */
  loadingText?: string;
  /**
   * asChild prop (Radix Slot 사용)
   * @default false
   */
  asChild?: boolean;
}

export function NextStepButton({
  children = '다음으로',
  isLoading = false,
  loadingText = '처리 중...',
  disabled,
  className,
  variant,
  size = 'lg',
  asChild,
  ...props
}: NextStepButtonProps) {
  return (
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Button
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        className={cn('px-8 py-6 text-lg', className)}
        asChild={asChild}
        {...props}
      >
        {isLoading ? loadingText : children}
      </Button>
    </motion.div>
  );
}
