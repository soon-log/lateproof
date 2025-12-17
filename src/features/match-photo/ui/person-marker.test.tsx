import { fireEvent, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { RefObject } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { Person } from '@/entities/person';
import { PersonColor } from '@/entities/person';
import { PersonMarker } from './person-marker';

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

describe('PersonMarker', () => {
  it('클릭 시 onSelect를 호출한다', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    const containerRef = {
      current: document.createElement('div')
    } as RefObject<HTMLDivElement>;

    const { container } = render(
      <PersonMarker
        person={createPerson()}
        isActive={false}
        containerRef={containerRef}
        onPositionChange={() => {}}
        onScaleChange={() => {}}
        onRotationChange={() => {}}
        onImageOffsetChange={() => {}}
        onImageScaleChange={() => {}}
        onSelect={onSelect}
      />
    );

    const markerRoot = container.querySelector('div.absolute.touch-none') as HTMLDivElement | null;
    expect(markerRoot).not.toBeNull();
    if (!markerRoot) {
      throw new Error('markerRoot가 존재해야 합니다.');
    }

    await user.click(markerRoot);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('Active 상태에서 wheel 이벤트로 onScaleChange를 호출한다', () => {
    const onScaleChange = vi.fn();
    const containerRef = {
      current: document.createElement('div')
    } as RefObject<HTMLDivElement>;

    const { container } = render(
      <PersonMarker
        person={createPerson()}
        isActive={true}
        containerRef={containerRef}
        onPositionChange={() => {}}
        onScaleChange={onScaleChange}
        onRotationChange={() => {}}
        onImageOffsetChange={() => {}}
        onImageScaleChange={() => {}}
        onSelect={() => {}}
      />
    );

    const markerRoot = container.querySelector('div.absolute.touch-none') as HTMLDivElement | null;
    expect(markerRoot).not.toBeNull();
    if (!markerRoot) {
      throw new Error('markerRoot가 존재해야 합니다.');
    }

    fireEvent.wheel(markerRoot, { deltaY: -100 });
    expect(onScaleChange).toHaveBeenCalledWith(1.1);
  });

  it('Active 상태에서 핸들이 렌더링된다', () => {
    const containerRef = {
      current: document.createElement('div')
    } as RefObject<HTMLDivElement>;

    const { container } = render(
      <PersonMarker
        person={createPerson({
          facePhotoUrl:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+hHgAHggJ/Pm1H4QAAAABJRU5ErkJggg=='
        })}
        isActive={true}
        containerRef={containerRef}
        onPositionChange={() => {}}
        onScaleChange={() => {}}
        onRotationChange={() => {}}
        onImageOffsetChange={() => {}}
        onImageScaleChange={() => {}}
        onSelect={() => {}}
      />
    );

    expect(container.querySelector('[data-action="rotate"]')).toBeTruthy();
    expect(container.querySelector('[data-action="scale"]')).toBeTruthy();
    expect(container.querySelector('[data-action="offset"]')).toBeTruthy();
  });

  it('Active + 얼굴 사진 상태에서 +/- 버튼으로 onImageScaleChange를 호출한다', async () => {
    const user = userEvent.setup();
    const onImageScaleChange = vi.fn();

    const containerRef = {
      current: document.createElement('div')
    } as RefObject<HTMLDivElement>;

    const { container } = render(
      <PersonMarker
        person={createPerson({
          facePhotoUrl: 'blob:mock',
          transform: { ...createPerson().transform, imageScale: 1.5 }
        })}
        isActive={true}
        containerRef={containerRef}
        onPositionChange={() => {}}
        onScaleChange={() => {}}
        onRotationChange={() => {}}
        onImageOffsetChange={() => {}}
        onImageScaleChange={onImageScaleChange}
        onSelect={() => {}}
      />
    );

    const zoomIn = container.querySelector(
      '[data-action="image-zoom-in"]'
    ) as HTMLButtonElement | null;
    const zoomOut = container.querySelector(
      '[data-action="image-zoom-out"]'
    ) as HTMLButtonElement | null;
    expect(zoomIn).toBeTruthy();
    expect(zoomOut).toBeTruthy();

    if (!zoomIn || !zoomOut) return;

    await user.click(zoomIn);
    expect(onImageScaleChange).toHaveBeenCalledWith(1.6);

    await user.click(zoomOut);
    expect(onImageScaleChange).toHaveBeenCalledWith(1.4);
  });
});
