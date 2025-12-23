import { NextResponse } from 'next/server';
import type { NanobananaDownloadRequest } from '@/features/generate-image/api';
import { stripDataUrlPrefix } from '../_lib/adapter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}

function guessExtension(mimeType: string) {
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  return 'bin';
}

function buildFileName(fileName: string | undefined, mimeType: string) {
  const trimmed = fileName?.trim();
  if (trimmed) return trimmed;
  const extension = guessExtension(mimeType);
  return `nanobanana-${Date.now()}.${extension}`;
}

export async function POST(request: Request) {
  let body: NanobananaDownloadRequest | null = null;
  try {
    body = (await request.json()) as NanobananaDownloadRequest;
  } catch {
    return jsonResponse(
      {
        success: false,
        error: { type: 'api', message: '다운로드 요청을 처리할 수 없어요. 다시 시도해주세요.' }
      },
      400
    );
  }

  const dataBase64 = typeof body?.dataBase64 === 'string' ? body.dataBase64 : '';
  const mimeType = typeof body?.mimeType === 'string' ? body.mimeType : '';

  if (!dataBase64 || !mimeType) {
    return jsonResponse(
      {
        success: false,
        error: { type: 'api', message: '다운로드 정보가 부족해요. 다시 시도해주세요.' }
      },
      400
    );
  }

  const normalized = stripDataUrlPrefix(dataBase64);
  const buffer = Buffer.from(normalized.dataBase64, 'base64');
  const fileName = buildFileName(body.fileName, normalized.mimeType ?? mimeType);

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': normalized.mimeType ?? mimeType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-store'
    }
  });
}
