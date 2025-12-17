import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Person } from '@/entities/person';
import { PersonColor } from '@/entities/person';
import { ImageCanvas } from './image-canvas';

vi.mock('./person-marker', () => ({
  PersonMarker: ({ person, onSelect }: { person: Person; onSelect: () => void }) => (
    <button type="button" data-testid={`marker-${person.id}`} onClick={onSelect}>
      marker-{person.id}
    </button>
  )
}));

function createPerson(id: string): Person {
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
    expression: null
  };
}

describe('ImageCanvas', () => {
  it('persons가 없으면 안내 오버레이가 보인다', () => {
    render(
      <ImageCanvas
        baseImageUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+hHgAHggJ/Pm1H4QAAAABJRU5ErkJggg=="
        persons={[]}
        activePersonId={null}
        onPositionChange={() => {}}
        onScaleChange={() => {}}
        onRotationChange={() => {}}
        onImageOffsetChange={() => {}}
        onImageScaleChange={() => {}}
        onMarkerSelect={() => {}}
      />
    );

    expect(screen.getByText('마커가 없습니다')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '베이스 이미지' })).toBeInTheDocument();
  });

  it('마커 클릭 시 onMarkerSelect를 호출한다', async () => {
    const user = userEvent.setup();
    const onMarkerSelect = vi.fn();
    const persons = [createPerson('p1'), createPerson('p2')];

    render(
      <ImageCanvas
        baseImageUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+hHgAHggJ/Pm1H4QAAAABJRU5ErkJggg=="
        persons={persons}
        activePersonId="p2"
        onPositionChange={() => {}}
        onScaleChange={() => {}}
        onRotationChange={() => {}}
        onImageOffsetChange={() => {}}
        onImageScaleChange={() => {}}
        onMarkerSelect={onMarkerSelect}
      />
    );

    await user.click(screen.getByTestId('marker-p1'));
    expect(onMarkerSelect).toHaveBeenCalledWith('p1');
  });
});
