import { describe, expect, it } from 'vitest';
import { buildNanobananaPrompt } from './nanobanana-prompt';
import type { Person } from './types';
import { PersonColor } from './types';

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
      imageOffsetX: 10,
      imageOffsetY: -5
    },
    expression: null,
    ...overrides
  };
}

describe('buildNanobananaPrompt', () => {
  it('콘솔 출력 포맷과 필수 섹션을 포함한다', () => {
    const baseImageFile = new File(['dummy'], 'base.png', { type: 'image/png' });
    const persons = [createPerson('p1', { expression: '😄' })];

    const result = buildNanobananaPrompt({ persons, baseImageFile });

    expect(result.consoleOutput).toContain('=== NANOBANANA_PROMPT_START ===');
    expect(result.consoleOutput).toContain('--- PROMPT ---');
    expect(result.consoleOutput).toContain('--- NEGATIVE_PROMPT ---');
    expect(result.consoleOutput).toContain('=== NANOBANANA_PROMPT_END ===');

    expect(result.prompt).toContain('Add exactly 1 additional person');
    expect(result.prompt).toContain('Do NOT crop, resize, stretch, zoom');
    expect(result.prompt).toContain('Do NOT face-swap existing people');
    expect(result.prompt).toContain('Composition & placement (must follow):');
    expect(result.prompt).toContain('Facial expressions (must follow):');
    expect(result.prompt).toContain('Person 1');
    expect(result.prompt).toContain('smiling, happy (😄)');
  });

  it('negative prompt에 크롭/프레임/face swap 관련 억제어를 포함한다', () => {
    const persons = [createPerson('p1')];
    const result = buildNanobananaPrompt({ persons, baseImageFile: null });

    expect(result.negativePrompt).toContain('cropped');
    expect(result.negativePrompt).toContain('frame');
    expect(result.negativePrompt).toContain('rounded corners');
    expect(result.negativePrompt).toContain('face swap');
  });

  it('알 수 없는 이모티콘은 과도한 해석 없이 표현한다', () => {
    const persons = [createPerson('p1', { expression: '🫠' })];
    const result = buildNanobananaPrompt({ persons, baseImageFile: null });

    expect(result.prompt).toContain('matching the emoji expression (🫠)');
  });

  it('회전 각도는 -180~180 기준으로 시계/반시계 방향을 요약한다', () => {
    const base = createPerson('p1');
    const persons = [createPerson('p1', { transform: { ...base.transform, rotation: 350 } })];
    const result = buildNanobananaPrompt({ persons, baseImageFile: null });

    expect(result.prompt).toContain('rotation counterclockwise ~10°');
  });
});
