import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type FaceRectangle = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type AzureDetectFace = {
  faceRectangle?: FaceRectangle;
};

export type FaceValidationResponse = {
  success: boolean;
  hasFace: boolean;
  alertMessage?: string;
};

const MIN_FACE_BOX_PX = 40;

function getEnvConfig() {
  const endpoint = process.env.AZURE_FACE_ENDPOINT;
  const key = process.env.AZURE_FACE_KEY ?? process.env.AZURE_FACE_API_KEY;

  return { endpoint, key };
}

function createDetectUrl(endpoint: string) {
  const url = new URL('/face/v1.0/detect', endpoint);
  url.searchParams.set('returnFaceId', 'false');
  url.searchParams.set('returnFaceLandmarks', 'false');
  return url;
}

function isFaceRectangleLargeEnough(rect: FaceRectangle | undefined) {
  if (!rect) return false;
  return rect.width >= MIN_FACE_BOX_PX && rect.height >= MIN_FACE_BOX_PX;
}

function jsonResponse(body: FaceValidationResponse, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}

function isBlobLike(value: unknown): value is Blob {
  if (!value || typeof value !== 'object') return false;
  return typeof (value as Blob).arrayBuffer === 'function';
}

export async function POST(request: Request) {
  const { endpoint, key } = getEnvConfig();

  if (!endpoint || !key) {
    return jsonResponse({
      success: false,
      hasFace: false,
      alertMessage:
        '얼굴 검증 설정이 필요합니다. .env.local에 AZURE_FACE_ENDPOINT와 AZURE_FACE_KEY를 추가해주세요.'
    });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({
      success: false,
      hasFace: false,
      alertMessage: '업로드 데이터를 읽을 수 없습니다. 다시 시도해주세요.'
    });
  }

  const file = formData.get('file');
  if (!isBlobLike(file)) {
    return jsonResponse({
      success: false,
      hasFace: false,
      alertMessage: '이미지 파일이 없습니다. 다시 업로드해주세요.'
    });
  }

  const detectUrl = createDetectUrl(endpoint);

  let azureResponse: Response;
  try {
    const bytes = await file.arrayBuffer();
    azureResponse = await fetch(detectUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': key
      },
      body: Buffer.from(bytes)
    });
  } catch {
    return jsonResponse({
      success: false,
      hasFace: false,
      alertMessage: '얼굴 검증 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
    });
  }

  const responseText = await azureResponse.text();

  if (!azureResponse.ok) {
    let message = '얼굴 검증에 실패했습니다. 잠시 후 다시 시도해주세요.';
    try {
      const parsed = JSON.parse(responseText) as { error?: { message?: string } };
      const azureMessage = parsed.error?.message?.trim();
      if (azureMessage) message = `얼굴 검증에 실패했습니다: ${azureMessage}`;
    } catch {
      // ignore JSON parse failure
    }

    return jsonResponse({
      success: false,
      hasFace: false,
      alertMessage: message
    });
  }

  let faces: AzureDetectFace[] = [];
  try {
    const parsed = JSON.parse(responseText) as unknown;
    if (Array.isArray(parsed)) {
      faces = parsed as AzureDetectFace[];
    }
  } catch {
    return jsonResponse({
      success: false,
      hasFace: false,
      alertMessage: '얼굴 검증 응답을 처리할 수 없습니다. 다시 시도해주세요.'
    });
  }

  if (faces.length === 0) {
    return jsonResponse({
      success: false,
      hasFace: false,
      alertMessage: '얼굴을 인식할 수 없습니다. 얼굴이 선명하게 보이는 사진을 업로드해주세요.'
    });
  }

  const hasLargeEnoughFace = faces.some((f) => isFaceRectangleLargeEnough(f.faceRectangle));
  if (!hasLargeEnoughFace) {
    return jsonResponse({
      success: false,
      hasFace: true,
      alertMessage:
        '얼굴이 너무 작거나 해상도가 낮아 인식할 수 없습니다. 더 크게/선명하게 나온 얼굴 사진을 업로드해주세요.'
    });
  }

  return jsonResponse({
    success: true,
    hasFace: true
  });
}
