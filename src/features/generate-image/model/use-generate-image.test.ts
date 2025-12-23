import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { requestNanobananaGenerate } from '../api/nanobanana-client';
import { useGenerateImage } from './use-generate-image';

vi.mock('../api/nanobanana-client', () => ({
  requestNanobananaGenerate: vi.fn()
}));

describe('useGenerateImage', () => {
  it('성공 응답이면 images와 status를 갱신한다', async () => {
    const mocked = vi.mocked(requestNanobananaGenerate);
    mocked.mockResolvedValue({
      success: true,
      images: [{ id: 'img-1', dataBase64: 'base64', mimeType: 'image/png' }]
    });

    const { result } = renderHook(() => useGenerateImage());

    await act(async () => {
      await result.current.generate({
        model: 'gemini-2.5-flash-image',
        prompt: 'test prompt'
      });
    });

    expect(result.current.status).toBe('success');
    expect(result.current.images).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('실패 응답이면 error 상태로 전환한다', async () => {
    const mocked = vi.mocked(requestNanobananaGenerate);
    mocked.mockResolvedValue({
      success: false,
      error: { type: 'api', message: 'fail' }
    });

    const { result } = renderHook(() => useGenerateImage());

    await act(async () => {
      await result.current.generate({
        model: 'gemini-3-pro-image-preview',
        prompt: 'test prompt'
      });
    });

    expect(result.current.status).toBe('error');
    expect(result.current.images).toHaveLength(0);
    expect(result.current.error?.message).toBe('fail');
  });

  it('reset은 상태를 초기화한다', async () => {
    const mocked = vi.mocked(requestNanobananaGenerate);
    mocked.mockResolvedValue({
      success: true,
      images: [{ id: 'img-1', dataBase64: 'base64', mimeType: 'image/png' }]
    });

    const { result } = renderHook(() => useGenerateImage());

    await act(async () => {
      await result.current.generate({
        model: 'gemini-2.5-flash-image',
        prompt: 'test prompt'
      });
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.images).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });
});
