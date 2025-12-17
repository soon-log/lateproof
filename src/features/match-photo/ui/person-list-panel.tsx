'use client';

/**
 * PersonListPanel — 하단 사람 목록 패널
 *
 * @description
 * - 사람 버튼들 나열
 * - 추가 버튼 포함
 * - 숨겨진 파일 input 관리
 * - 초기화 버튼 포함
 */

import { AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useRef } from 'react';
import type { Person } from '@/entities/person';
import { AddPersonButton } from './add-person-button';
import { PersonButton } from './person-button';

interface PersonListPanelProps {
  persons: Person[];
  activePersonId: string | null;
  canAddPerson: boolean;
  canRemovePerson: boolean;
  onSelectPerson: (id: string) => void;
  onAddPerson: () => void;
  onRemovePerson: (id: string) => void;
  onUploadPhoto: (id: string, file: File) => void;
  onReset: () => void;
}

export function PersonListPanel({
  persons,
  activePersonId,
  canAddPerson,
  canRemovePerson,
  onSelectPerson,
  onAddPerson,
  onRemovePerson,
  onUploadPhoto,
  onReset
}: PersonListPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetIdRef = useRef<string | null>(null);

  const handleUploadClick = (personId: string) => {
    onSelectPerson(personId);
    uploadTargetIdRef.current = personId;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTargetIdRef.current) {
      onUploadPhoto(uploadTargetIdRef.current, file);
    }
    // 같은 파일 재선택 허용을 위해 value 초기화
    e.target.value = '';
    uploadTargetIdRef.current = null;
  };

  const personButtons = persons.map((person) => (
    <PersonButton
      key={person.id}
      person={person}
      isActive={person.id === activePersonId}
      canDelete={canRemovePerson}
      onSelect={() => onSelectPerson(person.id)}
      onDelete={() => onRemovePerson(person.id)}
      onUploadClick={() => handleUploadClick(person.id)}
    />
  ));

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-neutral-700 text-sm">인물 설정</h3>
          <span className="text-neutral-400 text-xs">({persons.length}/5명)</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-neutral-500 text-xs transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          title="인물 설정 초기화"
        >
          <RotateCcw size={12} />
          초기화
        </button>
      </div>

      {/* 안내 문구 */}
      <p className="text-neutral-400 text-xs">
        1~5명의 인물을 등록할 수 있습니다. 각 인물의 원형 버튼을 클릭하여 얼굴 사진을 업로드하세요.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <AnimatePresence mode="sync">{personButtons}</AnimatePresence>

        <AddPersonButton canAdd={canAddPerson} onAdd={onAddPerson} />
      </div>

      {/* 숨겨진 파일 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
