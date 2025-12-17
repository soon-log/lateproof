export type FaceValidationResponse = {
  success: boolean;
  hasFace: boolean;
  alertMessage?: string;
};

function isFaceValidationResponse(value: unknown): value is FaceValidationResponse {
  if (!value || typeof value !== 'object') return false;

  const v = value as Record<string, unknown>;
  const successOk = typeof v.success === 'boolean';
  const hasFaceOk = typeof v.hasFace === 'boolean';
  const alertOk = v.alertMessage === undefined || typeof v.alertMessage === 'string';

  return successOk && hasFaceOk && alertOk;
}

export async function validateFacePhoto(file: File): Promise<FaceValidationResponse> {
  const formData = new FormData();
  formData.append('file', file);

  let response: Response;
  try {
    response = await fetch('/api/face/validate', {
      method: 'POST',
      body: formData
    });
  } catch {
    return {
      success: false,
      hasFace: false,
      alertMessage: '얼굴 검증 요청에 실패했습니다. 네트워크 상태를 확인해주세요.'
    };
  }

  if (!response.ok) {
    return {
      success: false,
      hasFace: false,
      alertMessage: '얼굴 검증 요청에 실패했습니다. 잠시 후 다시 시도해주세요.'
    };
  }

  const data = (await response.json()) as unknown;
  if (!isFaceValidationResponse(data)) {
    return {
      success: false,
      hasFace: false,
      alertMessage: '얼굴 검증 응답 형식이 올바르지 않습니다. 잠시 후 다시 시도해주세요.'
    };
  }

  return data;
}
