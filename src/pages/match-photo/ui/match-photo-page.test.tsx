import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePersonStore } from '@/entities/person';
import { Step, useStepStore } from '@/entities/step';
import { MatchPhotoPage } from './match-photo-page';

vi.mock('@/features/match-photo', () => ({
  MatchPhotoView: () => <div data-testid="match-photo-view" />
}));

beforeEach(() => {
  useStepStore.getState().reset();
  usePersonStore.getState().reset();
});

describe('MatchPhotoPage', () => {
  it('렌더링 시 StepHeader 타이틀이 보인다', () => {
    render(<MatchPhotoPage />);
    expect(screen.getByText('인물을 배치해주세요')).toBeInTheDocument();
  });

  it('뒤로가기 클릭 시 인물 설정이 reset된다', async () => {
    const user = userEvent.setup();

    usePersonStore.setState({
      initialized: true,
      activePersonId: 'p1',
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
        }
      ]
    });

    useStepStore.setState({
      currentStep: Step.MATCH,
      history: [
        {
          from: Step.UPLOAD,
          to: Step.MATCH,
          timestamp: new Date().toISOString(),
          reason: 'test'
        }
      ]
    });

    render(<MatchPhotoPage />);

    await user.click(screen.getByRole('button', { name: '이전으로' }));

    expect(usePersonStore.getState().persons).toHaveLength(0);
    expect(usePersonStore.getState().initialized).toBe(false);
    expect(usePersonStore.getState().activePersonId).toBeNull();
  });
});
