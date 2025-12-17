import { describe, expect, it, vi } from 'vitest';
import { POST } from './route';

function createFormDataRequest(file: File) {
  const formData = new FormData();
  formData.set('file', file);

  return new Request('http://localhost/api/face/validate', {
    method: 'POST',
    body: formData
  });
}

describe('/api/face/validate (Route Handler)', () => {
  it('얼굴 없음이면 success=false와 alertMessage를 반환한다', async () => {
    vi.stubEnv('AZURE_FACE_ENDPOINT', 'https://azure-face.test');
    vi.stubEnv('AZURE_FACE_KEY', 'dummy');

    const file = new File([new Uint8Array([0])], 'no-face.jpg', { type: 'image/jpeg' });
    const response = await POST(createFormDataRequest(file));
    const data = (await response.json()) as unknown;

    expect(data).toMatchObject({
      success: false,
      hasFace: false
    });
    expect((data as { alertMessage?: string }).alertMessage).toContain('얼굴');
  });

  it('얼굴 정상 감지면 success=true를 반환한다', async () => {
    vi.stubEnv('AZURE_FACE_ENDPOINT', 'https://azure-face.test');
    vi.stubEnv('AZURE_FACE_KEY', 'dummy');

    const file = new File([new Uint8Array([1])], 'face.jpg', { type: 'image/jpeg' });
    const response = await POST(createFormDataRequest(file));
    const data = (await response.json()) as unknown;

    expect(data).toMatchObject({
      success: true,
      hasFace: true
    });
  });

  it('얼굴이 감지되었지만 너무 작으면 success=false와 alertMessage를 반환한다', async () => {
    vi.stubEnv('AZURE_FACE_ENDPOINT', 'https://azure-face.test');
    vi.stubEnv('AZURE_FACE_KEY', 'dummy');

    const file = new File([new Uint8Array([2])], 'small-face.jpg', { type: 'image/jpeg' });
    const response = await POST(createFormDataRequest(file));
    const data = (await response.json()) as unknown;

    expect(data).toMatchObject({
      success: false,
      hasFace: true
    });
    expect((data as { alertMessage?: string }).alertMessage).toContain('얼굴');
  });
});
