import { useCallback, useState } from 'react';
import type { NanobananaError, NanobananaImage } from '@/features/generate-image/api';
import { type GenerateImagePayload, requestNanobananaGenerate } from '../api/nanobanana-client';

export type GenerateImageStatus = 'idle' | 'loading' | 'success' | 'error';

export function useGenerateImage() {
  const [status, setStatus] = useState<GenerateImageStatus>('idle');
  const [images, setImages] = useState<NanobananaImage[]>([]);
  const [error, setError] = useState<NanobananaError | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setImages([]);
    setError(null);
  }, []);

  const generate = useCallback(async (payload: GenerateImagePayload) => {
    setStatus('loading');
    setImages([]);
    setError(null);

    const response = await requestNanobananaGenerate(payload);
    if (!response.success) {
      setStatus('error');
      setError(response.error);
      return;
    }

    setImages(response.images);
    setStatus('success');
  }, []);

  return {
    status,
    images,
    error,
    generate,
    reset
  };
}
