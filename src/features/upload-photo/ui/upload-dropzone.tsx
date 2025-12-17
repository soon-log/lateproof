'use client';

import { motion } from 'framer-motion';
import { ImagePlus, Upload } from 'lucide-react';
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import type { UploadDropzoneStatus } from '@/features/upload-photo/model/use-upload-dropzone';
import { UploadDropzoneStatus as UploadDropzoneStatusEnum } from '@/features/upload-photo/model/use-upload-dropzone';
import { cn } from '@/shared/lib/utils';

const containerToneClassByStatus = {
  [UploadDropzoneStatusEnum.ACTIVE]: 'border-brand-500 bg-brand-50',
  [UploadDropzoneStatusEnum.REJECT]: 'border-error bg-red-50',
  [UploadDropzoneStatusEnum.ERROR]: 'border-error bg-red-50',
  [UploadDropzoneStatusEnum.IDLE]:
    'border-neutral-300 bg-neutral-50 hover:border-brand-400 hover:bg-brand-50/50'
} as const;

const iconWrapperClassByStatus = {
  [UploadDropzoneStatusEnum.ACTIVE]: 'bg-brand-500',
  [UploadDropzoneStatusEnum.REJECT]: 'bg-error',
  [UploadDropzoneStatusEnum.ERROR]: 'bg-error',
  [UploadDropzoneStatusEnum.IDLE]: 'bg-brand-100'
} as const;

const iconClassByStatus = {
  [UploadDropzoneStatusEnum.ACTIVE]: 'text-white',
  [UploadDropzoneStatusEnum.REJECT]: 'text-white',
  [UploadDropzoneStatusEnum.ERROR]: 'text-white',
  [UploadDropzoneStatusEnum.IDLE]: 'text-brand-700'
} as const;

const primaryTextClassByStatus = {
  [UploadDropzoneStatusEnum.ACTIVE]: 'text-brand-700',
  [UploadDropzoneStatusEnum.REJECT]: 'text-error',
  [UploadDropzoneStatusEnum.ERROR]: 'text-error',
  [UploadDropzoneStatusEnum.IDLE]: 'text-neutral-900'
} as const;

const secondaryTextClassByStatus = {
  [UploadDropzoneStatusEnum.ACTIVE]: 'text-brand-600',
  [UploadDropzoneStatusEnum.REJECT]: 'text-neutral-500',
  [UploadDropzoneStatusEnum.ERROR]: 'text-neutral-500',
  [UploadDropzoneStatusEnum.IDLE]: 'text-brand-600'
} as const;

interface UploadDropzoneProps {
  rootProps: DropzoneRootProps;
  inputProps: DropzoneInputProps;
  status: UploadDropzoneStatus;
  primaryText: string;
  secondaryText?: string;
  isUploading?: boolean;
}

export function UploadDropzone({
  rootProps,
  inputProps,
  status,
  primaryText,
  secondaryText,
  isUploading = false
}: UploadDropzoneProps) {
  const isDragging =
    status === UploadDropzoneStatusEnum.ACTIVE || status === UploadDropzoneStatusEnum.REJECT;

  const Icon = isDragging ? Upload : ImagePlus;

  return (
    <div className="w-full">
      <motion.div
        whileHover={{ scale: isUploading ? 1 : 1.01 }}
        whileTap={{ scale: isUploading ? 1 : 0.99 }}
      >
        <div
          {...rootProps}
          className={cn(
            'relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-200',
            containerToneClassByStatus[status],
            isUploading && 'pointer-events-none opacity-60'
          )}
        >
          <input {...inputProps} />

          {/* Icon */}
          <motion.div
            className={cn(
              'mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-colors duration-200',
              iconWrapperClassByStatus[status]
            )}
            animate={{
              scale: isDragging ? 1.1 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            <Icon className={cn('h-10 w-10', iconClassByStatus[status])} />
          </motion.div>

          {/* Text */}
          <div className="text-center">
            <p className={cn('font-semibold text-lg', primaryTextClassByStatus[status])}>
              {primaryText}
            </p>
            {secondaryText && (
              <p className={cn('mt-2 text-sm', secondaryTextClassByStatus[status])}>
                {secondaryText}
              </p>
            )}
          </div>

          {/* Loading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
                <p className="font-medium text-neutral-700">사진을 올리고 있어요</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
