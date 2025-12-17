'use client';

/**
 * PersonMarker — 이미지 위 사람 마커 컴포넌트
 *
 * @description
 * - 드래그로 위치 이동 가능
 * - 핀치/휠로 확대/축소
 * - 회전 핸들 드래그로 회전
 * - 이미지 오프셋 조정 (얼굴 위치 조정)
 * - 클릭 시 Active 상태로 전환 (업로드는 하단 패널에서만)
 */

import { motion } from 'framer-motion';
import { Move, User } from 'lucide-react';
import Image from 'next/image';
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject
} from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Person } from '@/entities/person';
import { PERSON_COLOR_VALUES } from '@/entities/person';

interface PersonMarkerProps {
  person: Person;
  isActive: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onPositionChange: (x: number, y: number) => void;
  onScaleChange: (scale: number) => void;
  onRotationChange: (rotation: number) => void;
  onImageOffsetChange: (offsetX: number, offsetY: number) => void;
  onImageScaleChange: (imageScale: number) => void;
  onSelect: () => void;
}

const MARKER_BASE_SIZE = 60; // 기본 마커 크기 (px)
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.75;
const MAX_IMAGE_OFFSET = 50; // 이미지 오프셋 최대 범위 (%)
const MIN_IMAGE_SCALE = 1;
const MAX_IMAGE_SCALE = 3;
const IMAGE_SCALE_STEP = 0.1;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeRotation(deg: number) {
  const normalized = deg % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function getContainerRect(containerRef: RefObject<HTMLDivElement | null>) {
  const container = containerRef.current;
  return container ? container.getBoundingClientRect() : null;
}

function getPixelPosition(
  containerRef: RefObject<HTMLDivElement | null>,
  position: { x: number; y: number }
) {
  const rect = getContainerRect(containerRef);
  if (!rect) return { x: 0, y: 0 };

  return {
    x: position.x * rect.width,
    y: position.y * rect.height
  };
}

function toNormalizedPosition(
  containerRef: RefObject<HTMLDivElement | null>,
  px: number,
  py: number
) {
  const rect = getContainerRect(containerRef);
  if (!rect) return { x: 0, y: 0 };

  return {
    x: clamp(px / rect.width, 0, 1),
    y: clamp(py / rect.height, 0, 1)
  };
}

function useMarkerDrag(params: {
  containerRef: RefObject<HTMLDivElement | null>;
  position: { x: number; y: number };
  onPositionChange: (x: number, y: number) => void;
}) {
  const { containerRef, position, onPositionChange } = params;
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('[data-action]')) return;

      e.preventDefault();
      e.stopPropagation();

      const rect = getContainerRect(containerRef);
      if (!rect) return;

      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: position.x * rect.width,
        posY: position.y * rect.height
      };

      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [containerRef, position.x, position.y]
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging || !dragStartRef.current) return;

      e.preventDefault();
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      const newX = dragStartRef.current.posX + deltaX;
      const newY = dragStartRef.current.posY + deltaY;

      const normalized = toNormalizedPosition(containerRef, newX, newY);
      onPositionChange(normalized.x, normalized.y);
    },
    [containerRef, isDragging, onPositionChange]
  );

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      setIsDragging(false);
      dragStartRef.current = null;

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture가 없는 환경(JSDOM 등)에서는 무시
      }
    },
    [isDragging]
  );

  return {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
}

function useWheelScale(params: {
  markerRef: RefObject<HTMLDivElement | null>;
  isActive: boolean;
  scale: number;
  onScaleChange: (scale: number) => void;
}) {
  const { markerRef, isActive, scale, onScaleChange } = params;

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isActive) return;

      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newScale = clamp(scale + delta, MIN_SCALE, MAX_SCALE);
      onScaleChange(newScale);
    };

    marker.addEventListener('wheel', handleWheel, { passive: false });
    return () => marker.removeEventListener('wheel', handleWheel);
  }, [isActive, markerRef, onScaleChange, scale]);
}

function useRotateHandle(params: {
  markerRef: RefObject<HTMLDivElement | null>;
  rotation: number;
  onRotationChange: (rotation: number) => void;
}) {
  const { markerRef, rotation, onRotationChange } = params;

  return useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      const marker = markerRef.current;
      if (!marker) return;

      const markerRect = marker.getBoundingClientRect();
      const centerX = markerRect.left + markerRect.width / 2;
      const centerY = markerRect.top + markerRect.height / 2;

      const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const startRotation = rotation;

      const handleMove = (ev: globalThis.PointerEvent) => {
        const currentAngle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
        const angleDiff = ((currentAngle - startAngle) * 180) / Math.PI;
        onRotationChange(normalizeRotation(startRotation + angleDiff));
      };

      const handleUp = () => {
        document.removeEventListener('pointermove', handleMove);
        document.removeEventListener('pointerup', handleUp);
      };

      document.addEventListener('pointermove', handleMove);
      document.addEventListener('pointerup', handleUp);
    },
    [markerRef, onRotationChange, rotation]
  );
}

function useScaleHandle(params: {
  markerRef: RefObject<HTMLDivElement | null>;
  scale: number;
  onScaleChange: (scale: number) => void;
}) {
  const { markerRef, scale, onScaleChange } = params;

  return useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      const marker = markerRef.current;
      if (!marker) return;

      const markerRect = marker.getBoundingClientRect();
      const centerX = markerRect.left + markerRect.width / 2;
      const centerY = markerRect.top + markerRect.height / 2;

      const startDistance = Math.sqrt((e.clientX - centerX) ** 2 + (e.clientY - centerY) ** 2);
      const startScale = scale;

      const handleMove = (ev: globalThis.PointerEvent) => {
        const currentDistance = Math.sqrt(
          (ev.clientX - centerX) ** 2 + (ev.clientY - centerY) ** 2
        );
        const scaleRatio = currentDistance / startDistance;
        const newScale = clamp(startScale * scaleRatio, MIN_SCALE, MAX_SCALE);
        onScaleChange(newScale);
      };

      const handleUp = () => {
        document.removeEventListener('pointermove', handleMove);
        document.removeEventListener('pointerup', handleUp);
      };

      document.addEventListener('pointermove', handleMove);
      document.addEventListener('pointerup', handleUp);
    },
    [markerRef, onScaleChange, scale]
  );
}

function useImageOffsetHandle(params: {
  offset: { x: number; y: number };
  onImageOffsetChange: (offsetX: number, offsetY: number) => void;
}) {
  const { offset, onImageOffsetChange } = params;
  const [isAdjustingImage, setIsAdjustingImage] = useState(false);

  const handleImageOffsetPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      setIsAdjustingImage(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const startOffsetX = offset.x;
      const startOffsetY = offset.y;

      const handleMove = (ev: globalThis.PointerEvent) => {
        const deltaX = ev.clientX - startX;
        const deltaY = ev.clientY - startY;

        const newOffsetX = clamp(startOffsetX + deltaX, -MAX_IMAGE_OFFSET, MAX_IMAGE_OFFSET);
        const newOffsetY = clamp(startOffsetY + deltaY, -MAX_IMAGE_OFFSET, MAX_IMAGE_OFFSET);

        onImageOffsetChange(newOffsetX, newOffsetY);
      };

      const handleUp = () => {
        setIsAdjustingImage(false);
        document.removeEventListener('pointermove', handleMove);
        document.removeEventListener('pointerup', handleUp);
      };

      document.addEventListener('pointermove', handleMove);
      document.addEventListener('pointerup', handleUp);
    },
    [offset.x, offset.y, onImageOffsetChange]
  );

  return { isAdjustingImage, handleImageOffsetPointerDown };
}

function MarkerContent(props: {
  person: Person;
  isActive: boolean;
  colorClasses: { bg: string; border: string; text: string };
  isAdjustingImage: boolean;
  onRotatePointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onScalePointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onImageOffsetPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}) {
  const {
    person,
    isActive,
    colorClasses,
    isAdjustingImage,
    onRotatePointerDown,
    onScalePointerDown,
    onImageOffsetPointerDown,
    onZoomIn,
    onZoomOut
  } = props;

  const faceTranslate = `translate(${person.transform.imageOffsetX}%, ${person.transform.imageOffsetY}%)`;
  const faceSize = `${Math.round(person.transform.imageScale * 100)}%`;
  const markerBodyClassName = `flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 shadow-lg transition-all ${colorClasses.border} ${isActive ? 'ring-4 ring-white/50' : ''} ${person.facePhotoUrl ? 'bg-white' : colorClasses.bg}`;
  const offsetHandleClassName = `-bottom-3 -left-3 absolute flex h-6 w-6 cursor-move items-center justify-center rounded-full border-2 border-white shadow-md ${isAdjustingImage ? 'bg-blue-500' : 'bg-neutral-700 hover:bg-neutral-600'}`;

  return (
    <div
      className="relative h-full w-full"
      style={{ transform: `rotate(${person.transform.rotation}deg)` }}
    >
      <div className={markerBodyClassName}>
        {person.facePhotoUrl ? (
          <Image
            src={person.facePhotoUrl}
            alt="얼굴 사진"
            width={90}
            height={90}
            unoptimized
            className="max-w-none object-cover"
            style={{ width: faceSize, height: faceSize, transform: faceTranslate }}
            draggable={false}
          />
        ) : (
          <User className="h-1/2 w-1/2 text-white" strokeWidth={2.5} />
        )}
      </div>

      {isActive && (
        <div
          data-action="rotate"
          className="-top-8 -translate-x-1/2 absolute left-1/2 h-6 w-6 cursor-grab rounded-full border-2 border-white bg-neutral-700 shadow-md hover:bg-neutral-600 active:cursor-grabbing"
          onPointerDown={onRotatePointerDown}
          title="드래그하여 회전"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            className="h-full w-full p-1"
          >
            <path d="M3 12a9 9 0 1 0 9-9" />
            <path d="m3 3 3 3-3 3" />
          </svg>
        </div>
      )}

      {isActive && (
        <div
          data-action="scale"
          className="-bottom-3 -right-3 absolute flex h-6 w-6 cursor-nwse-resize items-center justify-center rounded-full border-2 border-white bg-neutral-700 shadow-md hover:bg-neutral-600"
          onPointerDown={onScalePointerDown}
          title="드래그하여 크기 조절"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-4 w-4">
            <path d="M21 21 9 9m12 12h-7m7 0v-7" />
          </svg>
        </div>
      )}

      {isActive && person.facePhotoUrl && (
        <div className="-top-3 -left-3 absolute flex gap-1">
          <button
            type="button"
            data-action="image-zoom-out"
            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-neutral-700 text-white shadow-md hover:bg-neutral-600"
            onClick={onZoomOut}
            title="얼굴 이미지 축소"
            aria-label="얼굴 이미지 축소"
          >
            <span className="font-semibold text-[12px]" aria-hidden>
              −
            </span>
          </button>
          <button
            type="button"
            data-action="image-zoom-in"
            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-neutral-700 text-white shadow-md hover:bg-neutral-600"
            onClick={onZoomIn}
            title="얼굴 이미지 확대"
            aria-label="얼굴 이미지 확대"
          >
            <span className="font-semibold text-[12px]" aria-hidden>
              +
            </span>
          </button>
        </div>
      )}

      {isActive && person.facePhotoUrl && (
        <div
          data-action="offset"
          className={offsetHandleClassName}
          onPointerDown={onImageOffsetPointerDown}
          title="드래그하여 얼굴 위치 조정"
        >
          <Move size={14} className="text-white" />
        </div>
      )}
    </div>
  );
}

export function PersonMarker({
  person,
  isActive,
  containerRef,
  onPositionChange,
  onScaleChange,
  onRotationChange,
  onImageOffsetChange,
  onImageScaleChange,
  onSelect
}: PersonMarkerProps) {
  const markerRef = useRef<HTMLDivElement>(null);
  const colorClasses = PERSON_COLOR_VALUES[person.color];
  const size = MARKER_BASE_SIZE * person.transform.scale;

  const { isDragging, handlePointerDown, handlePointerMove, handlePointerUp } = useMarkerDrag({
    containerRef,
    position: { x: person.transform.x, y: person.transform.y },
    onPositionChange
  });

  useWheelScale({
    markerRef,
    isActive,
    scale: person.transform.scale,
    onScaleChange
  });

  const handleClick = useCallback(
    (e: ReactMouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-action]')) return;
      if (!isDragging) onSelect();
    },
    [isDragging, onSelect]
  );

  const handleRotatePointerDown = useRotateHandle({
    markerRef,
    rotation: person.transform.rotation,
    onRotationChange
  });

  const handleScalePointerDown = useScaleHandle({
    markerRef,
    scale: person.transform.scale,
    onScaleChange
  });

  const { isAdjustingImage, handleImageOffsetPointerDown } = useImageOffsetHandle({
    offset: { x: person.transform.imageOffsetX, y: person.transform.imageOffsetY },
    onImageOffsetChange
  });

  const handleZoomIn = useCallback(() => {
    onImageScaleChange(
      clamp(person.transform.imageScale + IMAGE_SCALE_STEP, MIN_IMAGE_SCALE, MAX_IMAGE_SCALE)
    );
  }, [onImageScaleChange, person.transform.imageScale]);

  const handleZoomOut = useCallback(() => {
    onImageScaleChange(
      clamp(person.transform.imageScale - IMAGE_SCALE_STEP, MIN_IMAGE_SCALE, MAX_IMAGE_SCALE)
    );
  }, [onImageScaleChange, person.transform.imageScale]);

  const pixelPos = useMemo(
    () => getPixelPosition(containerRef, { x: person.transform.x, y: person.transform.y }),
    [containerRef, person.transform.x, person.transform.y]
  );

  return (
    <motion.div
      ref={markerRef}
      className={`absolute touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: pixelPos.x,
        top: pixelPos.y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        zIndex: isActive ? 20 : 10
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <MarkerContent
        person={person}
        isActive={isActive}
        colorClasses={colorClasses}
        isAdjustingImage={isAdjustingImage}
        onRotatePointerDown={handleRotatePointerDown}
        onScalePointerDown={handleScalePointerDown}
        onImageOffsetPointerDown={handleImageOffsetPointerDown}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </motion.div>
  );
}
