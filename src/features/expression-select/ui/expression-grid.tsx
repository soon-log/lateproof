'use client';

/**
 * ExpressionGrid — 표정 이모티콘 선택 Picker
 *
 * @description
 * emoji-picker-react를 사용하여 다양한 이모티콘 중 선택 가능
 * - 이모티콘 클릭 시 현재 active 인물에 표정 설정
 * - 선택된 표정은 상단에 미리보기로 표시
 * - 초기화 버튼으로 표정 해제 가능
 */

import EmojiPicker, { type EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui';

interface ExpressionGridProps {
  selectedExpression: string | null;
  onSelect: (emoji: string) => void;
  onReset: () => void;
  personIndex: number;
}

export function ExpressionGrid({
  selectedExpression,
  onSelect,
  onReset,
  personIndex
}: ExpressionGridProps) {
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onSelect(emojiData.emoji);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl bg-white p-6 shadow-lg"
    >
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-lg text-neutral-800">
          인물 {personIndex + 1}의 표정 선택
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={!selectedExpression}
          className="gap-1 text-neutral-500 hover:text-neutral-700"
        >
          <RotateCcw size={14} />
          초기화
        </Button>
      </div>

      {/* 선택된 표정 미리보기 */}
      <div className="mb-4 flex items-center justify-center gap-3 rounded-xl bg-brand-50 py-4">
        {selectedExpression ? (
          <>
            <span className="text-4xl">{selectedExpression}</span>
            <span className="text-brand-700 text-sm">선택됨</span>
          </>
        ) : (
          <span className="text-neutral-400 text-sm">표정을 선택해주세요 (선택 사항)</span>
        )}
      </div>

      {/* Emoji Picker */}
      <div className="flex justify-center">
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          emojiStyle={EmojiStyle.APPLE}
          height={350}
          width="100%"
          searchPlaceHolder="표정 검색..."
          previewConfig={{ showPreview: false }}
          skinTonesDisabled
        />
      </div>
    </motion.div>
  );
}
