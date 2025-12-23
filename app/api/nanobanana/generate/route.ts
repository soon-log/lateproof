import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import type { NanobananaError, NanobananaGenerateRequest } from '@/features/generate-image/api';
import { NanobananaModel } from '@/features/generate-image/api';
import {
  blobToInlineImage,
  buildGeminiRequestBody,
  extractImagesFromGeminiResponse,
  normalizeInlineImage
} from '../_lib/adapter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}

function parseModel(value: unknown): NanobananaModel | null {
  if (value === NanobananaModel.FLASH || value === NanobananaModel.PRO) {
    return value;
  }
  return null;
}

function isInlineImage(value: unknown): value is { dataBase64: string; mimeType: string } {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { dataBase64?: unknown; mimeType?: unknown };
  return typeof candidate.dataBase64 === 'string' && typeof candidate.mimeType === 'string';
}

function errorResponse(error: NanobananaError, status = 400) {
  return jsonResponse({ success: false, error }, status);
}

type JsonRequestBody = {
  model?: unknown;
  prompt?: unknown;
  baseImage?: unknown;
  referenceImages?: unknown;
};

function getPrompt(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function buildGenerateError(error: unknown): { error: NanobananaError; status: number } {
  if (error instanceof Error) {
    const message = error.message.trim();
    const isNetwork = error.name === 'TypeError' || /network/i.test(message);
    if (isNetwork) {
      return {
        error: {
          type: 'network',
          message: '생성 서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.'
        },
        status: 502
      };
    }
    if (message) {
      return {
        error: {
          type: 'api',
          message: `이미지 생성에 실패했어요: ${message}`
        },
        status: 500
      };
    }
  }

  return {
    error: {
      type: 'api',
      message: '이미지 생성에 실패했어요. 잠시 후 다시 시도해주세요.'
    },
    status: 500
  };
}

function buildGenerateRequest(params: {
  model: NanobananaModel | null;
  prompt: string;
  baseImage?: NanobananaGenerateRequest['baseImage'] | null;
  referenceImages?: NanobananaGenerateRequest['referenceImages'];
}): NanobananaGenerateRequest {
  if (!params.model || !params.prompt) {
    throw new Error('INVALID_INPUT');
  }

  const referenceImages = params.referenceImages ?? [];

  return {
    model: params.model,
    prompt: params.prompt,
    baseImage: params.baseImage ?? undefined,
    referenceImages: referenceImages.length > 0 ? referenceImages : undefined
  };
}

async function parseJsonBody(request: Request): Promise<NanobananaGenerateRequest> {
  const body = (await request.json()) as JsonRequestBody;
  const model = parseModel(body.model);
  const prompt = getPrompt(body.prompt);
  const baseImage = isInlineImage(body.baseImage) ? normalizeInlineImage(body.baseImage) : null;
  const referenceImages = Array.isArray(body.referenceImages)
    ? body.referenceImages.filter(isInlineImage).map((image) => normalizeInlineImage(image))
    : [];

  return buildGenerateRequest({ model, prompt, baseImage, referenceImages });
}

async function parseFormDataBody(request: Request): Promise<NanobananaGenerateRequest> {
  const formData = await request.formData();
  const model = parseModel(formData.get('model'));
  const prompt = getPrompt(formData.get('prompt'));
  const baseImageEntry = formData.get('baseImage');
  const baseImage = baseImageEntry instanceof Blob ? await blobToInlineImage(baseImageEntry) : null;
  const referenceEntries = formData.getAll('referenceImages');
  const referenceImages = (
    await Promise.all(
      referenceEntries.map(async (entry) => {
        if (entry instanceof Blob) {
          return blobToInlineImage(entry);
        }
        return null;
      })
    )
  ).filter((image): image is NonNullable<NanobananaGenerateRequest['baseImage']> => Boolean(image));

  return buildGenerateRequest({ model, prompt, baseImage, referenceImages });
}

async function parseRequestBody(request: Request): Promise<NanobananaGenerateRequest> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return parseJsonBody(request);
  }

  if (contentType.includes('multipart/form-data')) {
    return parseFormDataBody(request);
  }

  throw new Error('INVALID_CONTENT_TYPE');
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return errorResponse(
      {
        type: 'api',
        message: '이미지 생성 설정이 필요합니다. .env.local에 GEMINI_API_KEY를 추가해주세요.'
      },
      500
    );
  }

  let input: NanobananaGenerateRequest;
  try {
    input = await parseRequestBody(request);
  } catch (error) {
    const message =
      error instanceof Error && error.message === 'INVALID_CONTENT_TYPE'
        ? '요청 형식이 올바르지 않습니다. 다시 시도해주세요.'
        : '입력 값을 확인해주세요.';

    return errorResponse({ type: 'api', message }, 400);
  }

  let responseJson: unknown;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const { contents } = buildGeminiRequestBody(input);
    const response = await ai.models.generateContent({
      model: input.model,
      contents
    });
    responseJson = response;
  } catch (error) {
    const failure = buildGenerateError(error);
    return errorResponse(failure.error, failure.status);
  }

  const images = extractImagesFromGeminiResponse(responseJson);
  if (images.length === 0) {
    return errorResponse(
      {
        type: 'api',
        message: '생성된 이미지를 찾을 수 없어요. 다시 시도해주세요.'
      },
      502
    );
  }

  return jsonResponse({ success: true, images });
}
