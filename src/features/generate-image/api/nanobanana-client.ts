import type {
  NanobananaGenerateResponse,
  NanobananaImage,
  NanobananaModel
} from '@/features/generate-image/api';

export type GenerateImagePayload = {
  model: NanobananaModel;
  prompt: string;
  baseImageFile?: File | null;
  referenceImageFiles?: File[];
};

const DEFAULT_ERROR = {
  type: 'api',
  message: '요청을 처리할 수 없어요. 잠시 후 다시 시도해주세요.'
} as const;

function isNanobananaImage(value: unknown): value is NanobananaImage {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as {
    id?: unknown;
    dataBase64?: unknown;
    mimeType?: unknown;
  };
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.dataBase64 === 'string' &&
    typeof candidate.mimeType === 'string'
  );
}

function isGenerateResponse(value: unknown): value is NanobananaGenerateResponse {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { success?: unknown };
  if (candidate.success === true) {
    const images = (value as { images?: unknown }).images;
    return Array.isArray(images) && images.every(isNanobananaImage);
  }
  if (candidate.success === false) {
    const error = (value as { error?: unknown }).error as
      | { type?: unknown; message?: unknown }
      | undefined;
    return typeof error?.type === 'string' && typeof error?.message === 'string';
  }
  return false;
}

export async function requestNanobananaGenerate(
  payload: GenerateImagePayload
): Promise<NanobananaGenerateResponse> {
  const formData = new FormData();
  formData.append('model', payload.model);
  formData.append('prompt', payload.prompt);

  if (payload.baseImageFile) {
    formData.append('baseImage', payload.baseImageFile);
  }

  if (payload.referenceImageFiles) {
    for (const file of payload.referenceImageFiles) {
      formData.append('referenceImages', file);
    }
  }

  let response: Response;
  try {
    response = await fetch('/api/nanobanana/generate', {
      method: 'POST',
      body: formData
    });
  } catch {
    return {
      success: false,
      error: {
        type: 'network',
        message: '네트워크가 불안정해요. 잠시 후 다시 시도해주세요.'
      }
    };
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    return {
      success: false,
      error: DEFAULT_ERROR
    };
  }

  if (isGenerateResponse(data)) {
    return data;
  }

  if (!response.ok) {
    return {
      success: false,
      error: DEFAULT_ERROR
    };
  }

  return {
    success: false,
    error: {
      type: 'unknown',
      message: '알 수 없는 응답이 도착했어요. 다시 시도해주세요.'
    }
  };
}
