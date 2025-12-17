import { describe, expect, it, vi } from 'vitest';
import { exportMatchStepDataForAI, formatMatchStepDataAsPrompt } from './export-for-ai';
import type { Person } from './types';
import { PersonColor } from './types';

function createPerson(overrides: Partial<Person> = {}): Person {
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
    ...overrides
  };
}

describe('export-for-ai', () => {
  it('exportMatchStepDataForAI는 MATCH Step 데이터를 변환한다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));

    const base = new File(['base'], 'base.png', { type: 'image/png' });
    const face = new File(['face'], 'face.png', { type: 'image/png' });

    const data = exportMatchStepDataForAI(
      [
        createPerson({
          id: 'p1',
          facePhoto: face,
          transform: {
            x: 0.3,
            y: 0.6,
            scale: 1.5,
            rotation: 45,
            imageScale: 1.2,
            imageOffsetX: 10,
            imageOffsetY: -5
          }
        })
      ],
      base
    );

    expect(data.stepName).toBe('MATCH');
    expect(data.hasBaseImage).toBe(true);
    expect(data.baseImageFileName).toBe('base.png');
    expect(data.totalPersonCount).toBe(1);
    expect(data.personsWithFacePhotoCount).toBe(1);
    expect(data.markerBaseSizePx).toBe(60);
    expect(data.generatedAt).toBe('2025-01-01T00:00:00.000Z');

    const p1 = data.persons[0];
    if (!p1) {
      throw new Error('persons[0]가 존재해야 합니다.');
    }
    expect(p1.index).toBe(1);
    expect(p1.actualMarkerSizePx).toBe(90);
    expect(p1.rotationDegrees).toBe(45);
    expect(p1.faceImageScale).toBe(1.2);
    expect(p1.faceImageOffsetXPercent).toBe(10);
    expect(p1.faceImageOffsetYPercent).toBe(-5);
    expect(p1.hasFacePhoto).toBe(true);
    expect(p1.facePhotoFileName).toBe('face.png');

    vi.useRealTimers();
  });

  it('formatMatchStepDataAsPrompt는 사람이 읽기 쉬운 텍스트를 생성한다', () => {
    const base = new File(['base'], 'base.png', { type: 'image/png' });
    const data = exportMatchStepDataForAI([createPerson({ id: 'p1' })], base);
    const text = formatMatchStepDataAsPrompt(data);

    expect(text).toContain('[인물 배치 정보]');
    expect(text).toContain('총 1명의 인물이 배치되어 있습니다.');
    expect(text).toContain('인물 1:');
    expect(text).toContain('얼굴 사진: 미업로드');
  });
});
