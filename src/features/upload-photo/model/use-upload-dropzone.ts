import { useCallback, useMemo } from 'react';
import type { DropzoneInputProps, DropzoneRootProps, FileRejection } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { ACCEPTED_TYPES, MAX_FILE_SIZE } from './file';

export const UploadDropzoneStatus = {
  ACTIVE: 'active',
  REJECT: 'reject',
  ERROR: 'error',
  IDLE: 'idle'
} as const;

export type UploadDropzoneStatus = (typeof UploadDropzoneStatus)[keyof typeof UploadDropzoneStatus];

export type UploadDropzoneViewModel = {
  rootProps: DropzoneRootProps;
  inputProps: DropzoneInputProps;
  status: UploadDropzoneStatus;
  primaryText: string;
  secondaryText?: string;
  isUploading: boolean;
  fileRejections: readonly FileRejection[];
};

type UseUploadDropzoneParams = {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
};

export function useUploadDropzone({
  onFileSelect,
  isUploading = false
}: UseUploadDropzoneParams): UploadDropzoneViewModel {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isUploading
  });

  const status = useMemo<UploadDropzoneStatus>(() => {
    if (isDragActive && !isDragReject) return UploadDropzoneStatus.ACTIVE;
    if (isDragReject) return UploadDropzoneStatus.REJECT;
    if (fileRejections.length > 0) return UploadDropzoneStatus.ERROR;
    return UploadDropzoneStatus.IDLE;
  }, [fileRejections.length, isDragActive, isDragReject]);

  const { primaryText, secondaryText } = useMemo(() => {
    if (status === UploadDropzoneStatus.ACTIVE) {
      return { primaryText: '여기에 놓아주세요' };
    }

    if (status === UploadDropzoneStatus.REJECT) {
      return {
        primaryText: '이 파일은 사용할 수 없어요',
        secondaryText: 'JPG, PNG, WebP 파일만 가능해요'
      };
    }

    if (status === UploadDropzoneStatus.ERROR) {
      const code = fileRejections[0]?.errors[0]?.code;

      if (code === 'file-too-large') {
        return {
          primaryText: '사진 크기가 너무 커요',
          secondaryText: '10MB 이하의 사진을 선택해주세요'
        };
      }

      return {
        primaryText: '이 파일은 사용할 수 없어요',
        secondaryText: 'JPG, PNG, WebP 파일만 가능해요'
      };
    }

    return {
      primaryText: '사진을 여기로 끌어다 놓거나',
      secondaryText: '클릭해서 선택해주세요'
    };
  }, [fileRejections, status]);

  return {
    rootProps: getRootProps(),
    inputProps: getInputProps(),
    status,
    primaryText,
    secondaryText,
    isUploading,
    fileRejections
  };
}
