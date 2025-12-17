import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePersonStore } from '@/entities/person';
import { Step, useStepStore } from '@/entities/step';
import { ExpressionSelectView } from './expression-select-view';

beforeEach(() => {
  usePersonStore.getState().reset();
  useStepStore.getState().reset();
});

describe('ExpressionSelectView', () => {
  it('등록된 인물 목록이 렌더링된다', () => {
    usePersonStore.setState({
      initialized: true,
      activePersonId: 'p2',
      persons: [
        {
          id: 'p1',
          color: 'BLUE',
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
          }
        },
        {
          id: 'p2',
          color: 'PURPLE',
          facePhoto: null,
          facePhotoUrl: null,
          transform: {
            x: 0.6,
            y: 0.6,
            scale: 1,
            rotation: 0,
            imageScale: 1.5,
            imageOffsetX: 0,
            imageOffsetY: 0
          }
        }
      ]
    });

    render(<ExpressionSelectView />);

    expect(screen.getByText('등록된 인물')).toBeInTheDocument();
    expect(screen.getByText('인물 1')).toBeInTheDocument();
    expect(screen.getByText('인물 2')).toBeInTheDocument();
  });

  it('다음 버튼 클릭 시 nextStep을 호출한다', async () => {
    const user = userEvent.setup();
    const nextStep = vi.fn();
    useStepStore.setState({ nextStep });

    render(<ExpressionSelectView />);

    await user.click(screen.getByRole('button', { name: '결제하기' }));
    expect(nextStep).toHaveBeenCalledWith(Step.PAYMENT, 'EXPRESSION 완료');
  });
});
