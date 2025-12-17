import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Person } from '@/entities/person';
import { PersonColor } from '@/entities/person';
import { PersonButton } from './person-button';

function createPerson(overrides: Partial<Person> = {}): Person {
  return {
    id: 'person_1',
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

describe('PersonButton', () => {
  it('기본 상태에서는 업로드 라벨이 보이고, 선택 클릭 시 onSelect를 호출한다', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <PersonButton
        person={createPerson()}
        isActive={false}
        canDelete={false}
        onSelect={onSelect}
        onDelete={() => {}}
        onUploadClick={() => {}}
      />
    );

    expect(screen.getByText('업로드')).toBeInTheDocument();

    await user.click(screen.getByText('업로드'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('사진 업로드 버튼 클릭 시 onUploadClick만 호출한다', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onUploadClick = vi.fn();

    render(
      <PersonButton
        person={createPerson()}
        isActive={false}
        canDelete={false}
        onSelect={onSelect}
        onDelete={() => {}}
        onUploadClick={onUploadClick}
      />
    );

    await user.click(screen.getByRole('button', { name: '사진 업로드' }));
    expect(onUploadClick).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('canDelete=true면 삭제 버튼이 보이고, 클릭 시 onDelete를 호출한다', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <PersonButton
        person={createPerson()}
        isActive={false}
        canDelete={true}
        onSelect={() => {}}
        onDelete={onDelete}
        onUploadClick={() => {}}
      />
    );

    await user.click(screen.getByRole('button', { name: '삭제' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('facePhotoUrl이 있으면 교체 라벨이 보인다', () => {
    render(
      <PersonButton
        person={createPerson({
          facePhotoUrl:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+hHgAHggJ/Pm1H4QAAAABJRU5ErkJggg=='
        })}
        isActive={false}
        canDelete={false}
        onSelect={() => {}}
        onDelete={() => {}}
        onUploadClick={() => {}}
      />
    );

    expect(screen.getByText('교체')).toBeInTheDocument();
  });
});
