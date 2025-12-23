import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStepStore } from '@/entities/step';
import { GenerateImagePage } from './generate-image-page';

vi.mock('@/features/generate-image', () => ({
  GenerateImageView: () => <div data-testid="generate-image-view" />
}));

beforeEach(() => {
  useStepStore.getState().reset();
});

describe('GenerateImagePage', () => {
  it('헤더 타이틀이 렌더링된다', () => {
    render(<GenerateImagePage />);

    expect(screen.getByText('이미지를 만들 준비가 됐어요')).toBeInTheDocument();
  });
});
