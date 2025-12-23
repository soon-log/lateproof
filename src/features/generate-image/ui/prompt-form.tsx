'use client';

import type { ChangeEvent } from 'react';
import type { NanobananaModel as NanobananaModelType } from '@/features/generate-image/api';
import { NanobananaModel } from '@/features/generate-image/api';
import { NextStepButton } from '@/shared/components/ui';
import { cn } from '@/shared/lib/utils';
import type { GenerateImageStatus } from '../model/use-generate-image';

const STATUS_CONFIG = {
  idle: {
    label: '대기 중',
    className: 'bg-neutral-100 text-neutral-700'
  },
  loading: {
    label: '준비 중',
    className: 'bg-amber-50 text-amber-700'
  },
  success: {
    label: '완료',
    className: 'bg-emerald-50 text-emerald-700'
  },
  error: {
    label: '문제 발생',
    className: 'bg-red-50 text-red-700'
  }
} as const;

interface PromptFormProps {
  prompt: string;
  model: NanobananaModelType;
  status: GenerateImageStatus;
  isLoading: boolean;
  baseImageLabel: string;
  referenceImageLabel: string;
  onPromptChange: (value: string) => void;
  onModelChange: (value: NanobananaModelType) => void;
  onSubmit: () => void;
}

export function PromptForm({
  prompt,
  model,
  status,
  isLoading,
  baseImageLabel,
  referenceImageLabel,
  onPromptChange,
  onModelChange,
  onSubmit
}: PromptFormProps) {
  const statusConfig = STATUS_CONFIG[status];

  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onModelChange(event.target.value as NanobananaModelType);
  };

  const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onPromptChange(event.target.value);
  };

  return (
    <form
      className="rounded-2xl bg-white p-6 shadow-lg"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-neutral-900 text-xl">프롬프트 준비</h2>
        <span className={cn('rounded-full px-3 py-1 font-medium text-xs', statusConfig.className)}>
          {statusConfig.label}
        </span>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-neutral-600 text-sm">
          모델 선택
          <select
            value={model}
            onChange={handleModelChange}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-800"
          >
            <option value={NanobananaModel.PRO}>Pro (고품질)</option>
            <option value={NanobananaModel.FLASH}>Flash (빠른 응답)</option>
          </select>
        </label>

        <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm">
          <p className="font-medium text-neutral-700">이미지 입력</p>
          <p className="mt-1 text-neutral-500">{baseImageLabel}</p>
          <p className="text-neutral-500">{referenceImageLabel}</p>
        </div>
      </div>

      <label className="flex flex-col gap-2 text-neutral-600 text-sm">
        프롬프트 내용
        <textarea
          value={prompt}
          onChange={handlePromptChange}
          rows={10}
          className="resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-800 text-sm"
        />
      </label>

      <div className="mt-6">
        <NextStepButton
          type="submit"
          isLoading={isLoading}
          loadingText="이미지를 준비하는 중..."
          disabled={prompt.trim().length === 0}
        >
          이미지 생성하기
        </NextStepButton>
      </div>
    </form>
  );
}
