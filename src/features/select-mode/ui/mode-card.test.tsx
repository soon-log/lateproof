/**
 * ModeCard — Unit Tests
 */

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Camera, MapPin } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { ModeCard } from './mode-card';

describe('ModeCard', () => {
  it('renders with title and description', () => {
    render(
      <ModeCard
        icon={Camera}
        title="사진으로 만들기"
        description="내가 찍은 사진에 자연스럽게 인물을 추가해요"
        onClick={() => {}}
      />
    );

    expect(screen.getByText('사진으로 만들기')).toBeInTheDocument();
    expect(screen.getByText('내가 찍은 사진에 자연스럽게 인물을 추가해요')).toBeInTheDocument();
  });

  it('renders badge when provided', () => {
    render(
      <ModeCard
        icon={Camera}
        title="사진으로 만들기"
        description="테스트 설명"
        badge={<span data-testid="badge">추천</span>}
        onClick={() => {}}
      />
    );

    expect(screen.getByTestId('badge')).toBeInTheDocument();
    expect(screen.getByText('추천')).toBeInTheDocument();
  });

  it('shows selected state when isSelected is true', () => {
    render(
      <ModeCard
        icon={Camera}
        title="사진으로 만들기"
        description="테스트 설명"
        onClick={() => {}}
        isSelected={true}
      />
    );

    expect(screen.getByText('선택됨')).toBeInTheDocument();
  });

  it('does not show selected state when isSelected is false', () => {
    render(
      <ModeCard
        icon={Camera}
        title="사진으로 만들기"
        description="테스트 설명"
        onClick={() => {}}
        isSelected={false}
      />
    );

    expect(screen.queryByText('선택됨')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <ModeCard
        icon={Camera}
        title="사진으로 만들기"
        description="테스트 설명"
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button', { name: '사진으로 만들기 선택' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders different icons correctly', () => {
    const { rerender } = render(
      <ModeCard
        icon={Camera}
        title="사진으로 만들기"
        description="테스트 설명"
        onClick={() => {}}
      />
    );

    // Camera icon should be rendered
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(
      <ModeCard icon={MapPin} title="장소로 만들기" description="테스트 설명" onClick={() => {}} />
    );

    // MapPin icon should be rendered
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies correct styles for selected state', () => {
    const { rerender } = render(
      <ModeCard
        icon={Camera}
        title="사진으로 만들기"
        description="테스트 설명"
        onClick={() => {}}
        isSelected={false}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-neutral-200');

    rerender(
      <ModeCard
        icon={Camera}
        title="사진으로 만들기"
        description="테스트 설명"
        onClick={() => {}}
        isSelected={true}
      />
    );

    expect(button).toHaveClass('border-brand-500');
  });
});
