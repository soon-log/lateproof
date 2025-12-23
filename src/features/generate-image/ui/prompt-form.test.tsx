import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PromptForm } from './prompt-form';

const baseProps = {
  prompt: 'test prompt',
  model: 'gemini-2.5-flash-image',
  status: 'idle',
  isLoading: false,
  baseImageLabel: '베이스 이미지: 있음',
  referenceImageLabel: '참조 이미지: 1장',
  onPromptChange: vi.fn(),
  onModelChange: vi.fn(),
  onSubmit: vi.fn()
} as const;

describe('PromptForm', () => {
  it('입력 정보가 렌더링된다', () => {
    render(<PromptForm {...baseProps} />);

    expect(screen.getByText('프롬프트 준비')).toBeInTheDocument();
    expect(screen.getByText('베이스 이미지: 있음')).toBeInTheDocument();
    expect(screen.getByText('참조 이미지: 1장')).toBeInTheDocument();
  });

  it('프롬프트 입력 시 onPromptChange가 호출된다', async () => {
    const user = userEvent.setup();
    const onPromptChange = vi.fn();
    render(<PromptForm {...baseProps} onPromptChange={onPromptChange} />);

    const textarea = screen.getByLabelText('프롬프트 내용');
    await user.clear(textarea);
    await user.type(textarea, 'updated');

    expect(onPromptChange).toHaveBeenCalled();
  });

  it('제출 시 onSubmit이 호출된다', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PromptForm {...baseProps} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: '이미지 생성하기' }));

    expect(onSubmit).toHaveBeenCalled();
  });
});
