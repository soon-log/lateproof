'use client';

import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useRef } from 'react';
import type { Person } from '@/entities/person';
import { PersonMarker } from './person-marker';

interface ImageCanvasProps {
  baseImageUrl: string;
  persons: Person[];
  activePersonId: string | null;
  onPositionChange: (id: string, x: number, y: number) => void;
  onScaleChange: (id: string, scale: number) => void;
  onRotationChange: (id: string, rotation: number) => void;
  onImageOffsetChange: (id: string, offsetX: number, offsetY: number) => void;
  onImageScaleChange: (id: string, imageScale: number) => void;
  onMarkerSelect: (id: string) => void;
}

export function ImageCanvas({
  baseImageUrl,
  persons,
  activePersonId,
  onPositionChange,
  onScaleChange,
  onRotationChange,
  onImageOffsetChange,
  onImageScaleChange,
  onMarkerSelect
}: ImageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePositionChange = useCallback(
    (id: string) => (x: number, y: number) => {
      onPositionChange(id, x, y);
    },
    [onPositionChange]
  );

  const handleScaleChange = useCallback(
    (id: string) => (scale: number) => {
      onScaleChange(id, scale);
    },
    [onScaleChange]
  );

  const handleRotationChange = useCallback(
    (id: string) => (rotation: number) => {
      onRotationChange(id, rotation);
    },
    [onRotationChange]
  );

  const handleImageOffsetChange = useCallback(
    (id: string) => (offsetX: number, offsetY: number) => {
      onImageOffsetChange(id, offsetX, offsetY);
    },
    [onImageOffsetChange]
  );

  const handleImageScaleChange = useCallback(
    (id: string) => (imageScale: number) => {
      onImageScaleChange(id, imageScale);
    },
    [onImageScaleChange]
  );

  const handleSelect = useCallback(
    (id: string) => () => {
      onMarkerSelect(id);
    },
    [onMarkerSelect]
  );

  const markers = persons.map((person) => (
    <PersonMarker
      key={person.id}
      person={person}
      isActive={person.id === activePersonId}
      containerRef={containerRef}
      onPositionChange={handlePositionChange(person.id)}
      onScaleChange={handleScaleChange(person.id)}
      onRotationChange={handleRotationChange(person.id)}
      onImageOffsetChange={handleImageOffsetChange(person.id)}
      onImageScaleChange={handleImageScaleChange(person.id)}
      onSelect={handleSelect(person.id)}
    />
  ));

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-lg"
      style={{ aspectRatio: '4/3' }}
    >
      {/* 베이스 이미지 */}
      <Image
        src={baseImageUrl}
        alt="베이스 이미지"
        fill
        className="object-contain"
        priority
        draggable={false}
      />

      {/* 마커 오버레이 */}
      <AnimatePresence>{markers}</AnimatePresence>

      {/* 안내 오버레이 */}
      {persons.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <p className="text-center text-white">마커가 없습니다</p>
        </div>
      )}
    </div>
  );
}
