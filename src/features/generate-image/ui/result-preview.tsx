'use client';

import Image from 'next/image';
import type { JSX } from 'react';
import type { NanobananaImage } from '@/features/generate-image/api';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type { GenerateImageStatus } from '../model/use-generate-image';

const STATUS_STYLE = {
  idle: 'border-neutral-200 bg-neutral-50',
  loading: 'border-amber-200 bg-amber-50',
  success: 'border-emerald-200 bg-emerald-50',
  error: 'border-red-200 bg-red-50'
} as const;

interface ResultPreviewProps {
  images: NanobananaImage[];
  status: GenerateImageStatus;
  onDownload: (image: NanobananaImage, index: number) => void;
  onDownloadAll: () => void;
}

function toDataUrl(image: NanobananaImage) {
  return `data:${image.mimeType};base64,${image.dataBase64}`;
}

export function ResultPreview({ images, status, onDownload, onDownloadAll }: ResultPreviewProps) {
  const containerStyle = STATUS_STYLE[status];
  const imageCards: JSX.Element[] = [];

  for (const [index, image] of images.entries()) {
    imageCards.push(
      <div
        key={image.id}
        className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
      >
        <div className="relative h-48 w-full">
          <Image
            src={toDataUrl(image)}
            alt={`생성 이미지 ${index + 1}`}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-neutral-600 text-sm">#{index + 1}</span>
          <Button size="sm" onClick={() => onDownload(image, index)}>
            다운로드
          </Button>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'rounded-2xl border p-6 text-center text-neutral-500 text-sm',
          containerStyle
        )}
      >
        아직 결과가 없어요. 생성 버튼을 눌러 이미지를 만들어보세요.
      </div>
    );
  }

  return (
    <div className={cn('rounded-2xl border p-6', containerStyle)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-lg text-neutral-900">생성 결과</h3>
          <p className="text-neutral-500 text-sm">원하는 이미지를 골라 다운로드하세요.</p>
        </div>
        {images.length > 1 && (
          <Button variant="secondary" onClick={onDownloadAll}>
            모두 다운로드
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">{imageCards}</div>
    </div>
  );
}
