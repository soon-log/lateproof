import { describe, expect, it } from 'vitest';
import { toNanobananaInput } from './to-nanobanana-input';
import type { Person } from './types';
import { PersonColor } from './types';

function createPerson(overrides: Partial<Person> = {}): Person {
  const { expression, ...rest } = overrides;
  return {
    id: 'p1',
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
    ...rest,
    expression: expression ?? null
  };
}

describe('toNanobananaInput', () => {
  it('베이스 이미지와 얼굴 사진 파일을 분리한다', () => {
    const baseImageFile = new File(['base'], 'base.png', { type: 'image/png' });
    const facePhoto = new File(['face'], 'face.png', { type: 'image/png' });

    const result = toNanobananaInput(
      [createPerson({ id: 'p1', facePhoto }), createPerson({ id: 'p2', facePhoto: null })],
      baseImageFile
    );

    expect(result.baseImageFile).toBe(baseImageFile);
    expect(result.referenceImageFiles).toHaveLength(1);
    expect(result.referenceImageFiles[0]).toBe(facePhoto);
  });

  it('베이스 이미지가 없으면 null로 반환한다', () => {
    const result = toNanobananaInput([createPerson({ id: 'p1' })]);

    expect(result.baseImageFile).toBeNull();
    expect(result.referenceImageFiles).toHaveLength(0);
  });
});
