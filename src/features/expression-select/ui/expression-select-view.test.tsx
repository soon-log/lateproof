import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Person } from '@/entities/person';
import { PersonColor, usePersonStore } from '@/entities/person';
import { usePhotoStore } from '@/entities/photo';
import { Step, useStepStore } from '@/entities/step';
import { ExpressionSelectView } from './expression-select-view';

// emoji-picker-react 모킹
vi.mock('emoji-picker-react', () => ({
  default: ({ onEmojiClick }: { onEmojiClick: (data: { emoji: string }) => void }) => (
    <div data-testid="emoji-picker">
      <button
        type="button"
        onClick={() => onEmojiClick({ emoji: '😄' })}
        aria-label="이모티콘 😄 선택"
      >
        😄
      </button>
    </div>
  ),
  EmojiStyle: { APPLE: 'apple' }
}));

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
  useStepStore.getState().reset();
});

describe('ExpressionSelectView', () => {
  it('인물 버튼 목록이 렌더링된다', () => {
    usePersonStore.setState({
      initialized: true,
      activePersonId: 'p1',
      persons: [createPerson('p1'), createPerson('p2', { color: PersonColor.PURPLE })]
    });

    render(<ExpressionSelectView />);

    expect(screen.getByText('인물 1')).toBeInTheDocument();
    expect(screen.getByText('인물 2')).toBeInTheDocument();
  });

  it('초기 상태에서는 안내 문구가 표시된다', () => {
    usePersonStore.setState({
      initialized: true,
      activePersonId: null,
      persons: [createPerson('p1')]
    });

    render(<ExpressionSelectView />);

    expect(screen.getByText('표정을 선택해보세요')).toBeInTheDocument();
    expect(screen.getByText(/위에서 인물을 클릭하면/)).toBeInTheDocument();
  });

  it('인물 버튼 클릭 시 표정 선택 UI가 표시된다', async () => {
    const user = userEvent.setup();
    usePersonStore.setState({
      initialized: true,
      activePersonId: null,
      persons: [createPerson('p1')]
    });

    render(<ExpressionSelectView />);

    await user.click(screen.getByRole('button', { name: '인물 1 선택' }));

    await waitFor(() => {
      expect(screen.getByText('인물 1의 표정 선택')).toBeInTheDocument();
    });
  });

  it('emoji picker에서 이모티콘 클릭 시 setExpression이 호출된다', async () => {
    const user = userEvent.setup();
    const setExpression = vi.fn();
    usePersonStore.setState({
      initialized: true,
      activePersonId: null,
      persons: [createPerson('p1')],
      setExpression
    });

    render(<ExpressionSelectView />);

    // 인물 선택
    await user.click(screen.getByRole('button', { name: '인물 1 선택' }));
    // emoji picker가 렌더링될 때까지 대기
    await waitFor(() => {
      expect(screen.getByTestId('emoji-picker')).toBeInTheDocument();
    });

    // 이모티콘 클릭
    await user.click(screen.getByRole('button', { name: '이모티콘 😄 선택' }));

    expect(setExpression).toHaveBeenCalledWith('p1', '😄');
  });

  it('다음 버튼 클릭 시 nextStep을 호출한다', async () => {
    const user = userEvent.setup();
    const nextStep = vi.fn();
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    usePersonStore.setState({
      initialized: true,
      activePersonId: null,
      persons: [createPerson('p1')]
    });
    useStepStore.setState({ nextStep });

    render(<ExpressionSelectView />);

    await user.click(screen.getByRole('button', { name: '결제하기' }));
    expect(logSpy).toHaveBeenCalled();
    expect(nextStep).toHaveBeenCalledWith(Step.PAYMENT, 'EXPRESSION 완료');
    logSpy.mockRestore();
  });

  it('인물 버튼에 선택된 표정 이모티콘이 배지로 표시된다', () => {
    usePersonStore.setState({
      initialized: true,
      activePersonId: null,
      persons: [createPerson('p1', { expression: '😄' })]
    });

    render(<ExpressionSelectView />);

    // 인물 버튼에 표정 이모티콘이 배지로 표시됨
    expect(screen.getByText('😄')).toBeInTheDocument();
  });
});
