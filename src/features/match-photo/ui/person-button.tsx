'use client';

/**
 * PersonButton — 하단 설정란의 사람 버튼 컴포넌트
 *
 * @description
 * - 얼굴 사진 썸네일 또는 사용자 아이콘 표시
 * - X 버튼으로 삭제 (최소 1명일 때 비활성화)
 * - 카드 영역 클릭으로 Active 변경
 * - 원형 버튼 클릭으로 사진 업로드
 */

import { motion } from 'framer-motion';
import { Upload, User, X } from 'lucide-react';
import Image from 'next/image';
import type { Person } from '@/entities/person';
import { PERSON_COLOR_VALUES } from '@/entities/person';

interface PersonButtonProps {
  person: Person;
  isActive: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUploadClick: () => void;
}

export function PersonButton({
  person,
  isActive,
  canDelete,
  onSelect,
  onDelete,
  onUploadClick
}: PersonButtonProps) {
  const colorClasses = PERSON_COLOR_VALUES[person.color];

  return (
    <motion.div
      className={`relative flex flex-col items-center gap-1 rounded-xl p-2 transition-all ${isActive ? `ring-2 ${colorClasses.border} bg-neutral-50` : 'hover:bg-neutral-50'}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
    >
      {/* 삭제 버튼 */}
      {canDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="-right-1 -top-1 absolute z-10 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700 text-white shadow-md transition-colors hover:bg-red-500"
          aria-label="삭제"
        >
          <X size={14} strokeWidth={3} />
        </button>
      )}

      {/* 카드 영역 클릭 시 Active 변경 (중첩 button 방지: 오버레이 버튼) */}
      <button
        type="button"
        onClick={onSelect}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 z-0 rounded-xl"
      />

      <div className="relative z-10 flex flex-col items-center gap-1">
        {/* 원형 버튼 - 클릭 시 업로드 */}
        <button
          type="button"
          className={`relative flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full border-3 shadow-md transition-all hover:shadow-lg ${colorClasses.border} ${person.facePhotoUrl ? 'bg-white' : colorClasses.bg}`}
          onClick={onUploadClick}
          aria-label="사진 업로드"
        >
          {person.facePhotoUrl ? (
            <>
              <Image
                src={person.facePhotoUrl}
                alt="얼굴 사진"
                width={56}
                height={56}
                unoptimized
                className="h-full w-full object-cover"
              />
              {/* 호버 시 업로드 오버레이 */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                <Upload size={20} className="text-white" />
              </div>
            </>
          ) : (
            <User className="h-6 w-6 text-white" strokeWidth={2.5} />
          )}
        </button>

        {/* 선택 버튼 (Active 변경) */}
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={isActive}
          aria-label="인물 선택"
          className="focus:outline-none"
        >
          <span
            className={`font-medium text-xs ${isActive ? colorClasses.text : 'text-neutral-500'}`}
          >
            {person.facePhotoUrl ? '교체' : '업로드'}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
