import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Person } from '@/entities/person';
import { PersonColor } from '@/entities/person';
import { ExpressionPersonButton } from './expression-person-button';

function createPerson(overrides: Partial<Person> = {}): Person {
  return {
    id: 'person-1',
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

describe('ExpressionPersonButton', () => {
  it('인물 번호가 렌더링된다', () => {
    render(
      <ExpressionPersonButton
        person={createPerson()}
        index={0}
        isActive={false}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText('인물 1')).toBeInTheDocument();
  });

  it('클릭 시 onSelect가 호출된다', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <ExpressionPersonButton
        person={createPerson()}
        index={0}
        isActive={false}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByRole('button', { name: '인물 1 선택' }));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('active 상태일 때 시각적으로 구분된다', () => {
    render(
      <ExpressionPersonButton
        person={createPerson()}
        index={0}
        isActive={true}
        onSelect={vi.fn()}
      />
    );

    const button = screen.getByRole('button', { name: '인물 1 선택' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button.className).toContain('ring-2');
  });

  it('표정이 선택된 경우 이모티콘이 표시된다', () => {
    render(
      <ExpressionPersonButton
        person={createPerson({ expression: '😄' })}
        index={0}
        isActive={false}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText('😄')).toBeInTheDocument();
  });

  it('얼굴 사진이 있는 경우 이미지가 표시된다', () => {
    render(
      <ExpressionPersonButton
        person={createPerson({ facePhotoUrl: 'blob:test-url' })}
        index={2}
        isActive={false}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByAltText('인물 3')).toBeInTheDocument();
  });
});
