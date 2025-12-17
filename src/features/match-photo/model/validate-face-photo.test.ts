import { describe, expect, it, vi } from 'vitest';
import { validateFacePhoto } from './validate-face-photo';

describe('validateFacePhoto', () => {
  it('성공 응답을 그대로 반환한다', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, hasFace: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const file = new File(['x'], 'face.png', { type: 'image/png' });
    const result = await validateFacePhoto(file);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/face/validate');

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(init.method).toBe('POST');
    expect(init.body).toBeInstanceOf(FormData);

    expect(result).toEqual({ success: true, hasFace: true });
  });

  it('네트워크 에러면 실패 처리한다', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network'));
    vi.stubGlobal('fetch', fetchMock);

    const file = new File(['x'], 'face.png', { type: 'image/png' });
    const result = await validateFacePhoto(file);

    expect(result.success).toBe(false);
    expect(result.hasFace).toBe(false);
    expect(result.alertMessage).toContain('네트워크');
  });

  it('HTTP 오류면 실패 처리한다', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('fail', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);

    const file = new File(['x'], 'face.png', { type: 'image/png' });
    const result = await validateFacePhoto(file);

    expect(result.success).toBe(false);
    expect(result.hasFace).toBe(false);
  });

  it('응답 형식이 다르면 실패 처리한다', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: 'yes', hasFace: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const file = new File(['x'], 'face.png', { type: 'image/png' });
    const result = await validateFacePhoto(file);

    expect(result.success).toBe(false);
    expect(result.hasFace).toBe(false);
    expect(result.alertMessage).toContain('형식');
  });
});
