import { useCallback, useEffect, useRef, useState } from 'react';
import { useUploadDropzone } from './use-upload-dropzone';

type UsePhotoUploadOptions = {
  onNext?: (context: { file: File }) => void;
};

export function usePhotoUpload(options: UsePhotoUploadOptions = {}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const { onNext } = options;

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    previewUrlRef.current = url;
  }, []);

  const dropzone = useUploadDropzone({ onFileSelect: handleFileSelect, isUploading: false });

  const handleRemoveFile = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  }, []);

  const handleNext = useCallback(() => {
    if (!selectedFile) return;
    onNext?.({ file: selectedFile });
  }, [selectedFile, onNext]);

  return {
    selectedFile,
    previewUrl,
    dropzone,
    handleRemoveFile,
    handleNext
  };
}
