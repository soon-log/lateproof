import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Person } from '@/entities/person';
import { PersonColor } from '@/entities/person';
import { PersonListPanel } from './person-list-panel';

function createPerson(id: string, overrides: Partial<Person> = {}): Person {
  const { expression, ...rest } = overrides;
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
    ...rest,
    expression: expression ?? null
  };
}

describe('PersonListPanel', () => {
  it('초기화/추가/선택 이벤트가 동작한다', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    const onAddPerson = vi.fn();
    const onSelectPerson = vi.fn();

    const persons = [createPerson('p1'), createPerson('p2', { color: PersonColor.PURPLE })];

    render(
      <PersonListPanel
        persons={persons}
        activePersonId="p1"
        canAddPerson={true}
        canRemovePerson={true}
        onSelectPerson={onSelectPerson}
        onAddPerson={onAddPerson}
        onRemovePerson={() => {}}
        onUploadPhoto={() => {}}
        onReset={onReset}
      />
    );

    expect(screen.getByText('(2/5명)')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '초기화' }));
    expect(onReset).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: '사람 추가' }));
    expect(onAddPerson).toHaveBeenCalledTimes(1);

    const uploadLabels = screen.getAllByText('업로드');
    const firstUploadLabel = uploadLabels[0];
    if (!firstUploadLabel) {
      throw new Error('업로드 라벨이 최소 1개 존재해야 합니다.');
    }
    await user.click(firstUploadLabel);
    expect(onSelectPerson).toHaveBeenCalledWith('p1');
  });

  it('삭제/업로드 이벤트가 동작한다', async () => {
    const user = userEvent.setup();
    const onRemovePerson = vi.fn();
    const onUploadPhoto = vi.fn();

    const persons = [createPerson('p1'), createPerson('p2', { color: PersonColor.PURPLE })];

    const { container } = render(
      <PersonListPanel
        persons={persons}
        activePersonId="p1"
        canAddPerson={true}
        canRemovePerson={true}
        onSelectPerson={() => {}}
        onAddPerson={() => {}}
        onRemovePerson={onRemovePerson}
        onUploadPhoto={onUploadPhoto}
        onReset={() => {}}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: '삭제' });
    const firstDeleteButton = deleteButtons[0];
    if (!firstDeleteButton) {
      throw new Error('삭제 버튼이 최소 1개 존재해야 합니다.');
    }
    await user.click(firstDeleteButton);
    expect(onRemovePerson).toHaveBeenCalledWith('p1');

    const uploadButtons = screen.getAllByRole('button', { name: '사진 업로드' });
    const firstUploadButton = uploadButtons[0];
    if (!firstUploadButton) {
      throw new Error('사진 업로드 버튼이 최소 1개 존재해야 합니다.');
    }
    await user.click(firstUploadButton);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement | null;
    expect(input).not.toBeNull();
    if (!input) {
      throw new Error('file input이 존재해야 합니다.');
    }

    const file = new File(['x'], 'face.png', { type: 'image/png' });
    await user.upload(input, file);

    expect(onUploadPhoto).toHaveBeenCalledTimes(1);
    expect(onUploadPhoto).toHaveBeenCalledWith('p1', file);
  });
});
