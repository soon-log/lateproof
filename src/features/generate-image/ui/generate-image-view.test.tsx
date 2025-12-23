import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Person } from '@/entities/person';
import { PersonColor, usePersonStore } from '@/entities/person';
import { usePhotoStore } from '@/entities/photo';
import type { GenerateImagePayload } from '../api/nanobanana-client';
import type { useGenerateImage } from '../model/use-generate-image';
import { GenerateImageView } from './generate-image-view';

function createPerson(id: string, overrides: Partial<Person> = {}): Person {
  return {
    id,
    color: PersonColor.BLUE,
    facePhoto: null,
    facePhotoUrl: null,
    transform: {
      x: 0.2,
      y: 0.7,
      scale: 1,
      rotation: 0,
      imageScale: 1.5,
      imageOffsetX: 0,
      imageOffsetY: 0
    },
    expression: null,
    ...overrides
  };
}

beforeEach(() => {
  usePersonStore.getState().reset();
  usePhotoStore.getState().clear();
});

describe('GenerateImageView', () => {
  it('생성 버튼 클릭 시 generate가 호출된다', async () => {
    const user = userEvent.setup();
    const baseImageFile = new File(['base'], 'base.png', { type: 'image/png' });
    const facePhoto = new File(['face'], 'face.png', { type: 'image/png' });

    usePersonStore.setState({
      initialized: true,
      activePersonId: 'p1',
      persons: [createPerson('p1', { facePhoto })]
    });
    usePhotoStore.setState({ file: baseImageFile });

    type Generate = ReturnType<typeof useGenerateImage>['generate'];

    const generateMock = vi.fn(async (_payload: GenerateImagePayload) => undefined);
    const resetMock = vi.fn();

    const controller: ReturnType<typeof useGenerateImage> = {
      status: 'idle',
      images: [],
      error: null,
      generate: generateMock as Generate,
      reset: resetMock
    };

    render(<GenerateImageView controller={controller} />);

    await user.click(screen.getByRole('button', { name: '이미지 생성하기' }));

    expect(generateMock).toHaveBeenCalledTimes(1);
    const payload = generateMock.mock.calls[0]?.[0] as GenerateImagePayload | undefined;
    if (!payload) throw new Error('payload가 필요합니다.');

    expect(payload.baseImageFile).toBe(baseImageFile);
    expect(payload.referenceImageFiles).toHaveLength(1);
    expect(payload.prompt).toContain('Negative Prompt');
  });
});
