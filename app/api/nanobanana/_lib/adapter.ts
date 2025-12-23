import { randomUUID } from 'node:crypto';
import type {
  NanobananaGenerateRequest,
  NanobananaImage,
  NanobananaInlineImage
} from '@/features/generate-image/api';

export type GeminiGenerateContentRequest = {
  contents: Array<{
    role?: string;
    parts: Array<{
      text?: string;
      inlineData?: {
        mimeType: string;
        data: string;
      };
    }>;
  }>;
};

const DATA_URL_PREFIX = /^data:([^;]+);base64,/;

export function stripDataUrlPrefix(dataBase64: string): { dataBase64: string; mimeType?: string } {
  const match = dataBase64.match(DATA_URL_PREFIX);
  if (!match) {
    return { dataBase64 };
  }

  return {
    dataBase64: dataBase64.replace(DATA_URL_PREFIX, ''),
    mimeType: match[1]
  };
}

export function normalizeInlineImage(input: NanobananaInlineImage): NanobananaInlineImage {
  const normalized = stripDataUrlPrefix(input.dataBase64);
  return {
    dataBase64: normalized.dataBase64,
    mimeType: normalized.mimeType ?? input.mimeType
  };
}

export async function blobToInlineImage(blob: Blob): Promise<NanobananaInlineImage> {
  const buffer = Buffer.from(await blob.arrayBuffer());
  return {
    dataBase64: buffer.toString('base64'),
    mimeType: blob.type || 'application/octet-stream'
  };
}

export function buildGeminiRequestBody(
  input: NanobananaGenerateRequest
): GeminiGenerateContentRequest {
  const parts: GeminiGenerateContentRequest['contents'][number]['parts'] = [{ text: input.prompt }];

  if (input.baseImage) {
    const normalized = normalizeInlineImage(input.baseImage);
    parts.push({
      inlineData: {
        mimeType: normalized.mimeType,
        data: normalized.dataBase64
      }
    });
  }

  if (input.referenceImages) {
    for (const reference of input.referenceImages) {
      const normalized = normalizeInlineImage(reference);
      parts.push({
        inlineData: {
          mimeType: normalized.mimeType,
          data: normalized.dataBase64
        }
      });
    }
  }

  return {
    contents: [{ role: 'user', parts }]
  };
}

export function extractImagesFromGeminiResponse(responseBody: unknown): NanobananaImage[] {
  if (!responseBody || typeof responseBody !== 'object') return [];

  const candidates = (responseBody as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) return [];

  const firstCandidate = candidates[0] as {
    content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }> };
  };
  const parts = firstCandidate.content?.parts;
  if (!Array.isArray(parts)) return [];

  const images: NanobananaImage[] = [];
  for (const part of parts) {
    const inlineData = part.inlineData;
    if (!inlineData) continue;

    const mimeType = inlineData.mimeType;
    const data = inlineData.data;
    if (typeof mimeType !== 'string' || typeof data !== 'string') continue;

    const normalized = stripDataUrlPrefix(data);
    images.push({
      id: randomUUID(),
      dataBase64: normalized.dataBase64,
      mimeType: normalized.mimeType ?? mimeType
    });
  }

  return images;
}
