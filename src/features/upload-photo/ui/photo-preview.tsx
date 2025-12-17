'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/shared/components/ui/button';

interface PhotoPreviewProps {
  previewUrl: string;
  onRemove: () => void;
}

export function PhotoPreview({ previewUrl, onRemove }: PhotoPreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
      {/* Preview Image */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={previewUrl}
          alt="업로드된 사진 미리보기"
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-contain"
        />
      </div>

      {/* Overlay Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onRemove}
          className="bg-white/90 shadow-md hover:bg-white"
        >
          <X className="mr-1 h-4 w-4" />
          다시 선택
        </Button>
      </div>
    </div>
  );
}
