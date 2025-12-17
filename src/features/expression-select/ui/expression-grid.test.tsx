import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ExpressionGrid } from './expression-grid';

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
      <button
        type="button"
        onClick={() => onEmojiClick({ emoji: '😢' })}
        aria-label="이모티콘 😢 선택"
      >
        😢
      </button>
    </div>
  ),
  EmojiStyle: { APPLE: 'apple' }
}));

describe('ExpressionGrid', () => {
  it('Emoji Picker가 렌더링된다', () => {
    render(
      <ExpressionGrid
        selectedExpression={null}
        onSelect={vi.fn()}
        onReset={vi.fn()}
        personIndex={0}
      />
    );

    expect(screen.getByTestId('emoji-picker')).toBeInTheDocument();
  });

  it('이모티콘 클릭 시 onSelect가 호출된다', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <ExpressionGrid
        selectedExpression={null}
        onSelect={onSelect}
        onReset={vi.fn()}
        personIndex={0}
      />
    );

    await user.click(screen.getByRole('button', { name: '이모티콘 😄 선택' }));
    expect(onSelect).toHaveBeenCalledWith('😄');
  });

  it('선택된 표정이 미리보기에 표시된다', () => {
    render(
      <ExpressionGrid
        selectedExpression="😢"
        onSelect={vi.fn()}
        onReset={vi.fn()}
        personIndex={0}
      />
    );

    // 미리보기 영역에 이모티콘이 표시됨 (text-4xl 클래스)
    const emojiElements = screen.getAllByText('😢');
    expect(emojiElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('선택됨')).toBeInTheDocument();
  });

  it('초기화 버튼 클릭 시 onReset이 호출된다', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(
      <ExpressionGrid
        selectedExpression="😄"
        onSelect={vi.fn()}
        onReset={onReset}
        personIndex={0}
      />
    );

    await user.click(screen.getByRole('button', { name: /초기화/i }));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('표정이 선택되지 않은 경우 초기화 버튼이 비활성화된다', () => {
    render(
      <ExpressionGrid
        selectedExpression={null}
        onSelect={vi.fn()}
        onReset={vi.fn()}
        personIndex={0}
      />
    );

    expect(screen.getByRole('button', { name: /초기화/i })).toBeDisabled();
  });

  it('인물 번호가 헤더에 표시된다', () => {
    render(
      <ExpressionGrid
        selectedExpression={null}
        onSelect={vi.fn()}
        onReset={vi.fn()}
        personIndex={2}
      />
    );

    expect(screen.getByText('인물 3의 표정 선택')).toBeInTheDocument();
  });
});
