import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Step, useStepStore } from '@/entities/step';
import { StepHeader } from './step-header';

describe('StepHeader', () => {
  it('selectCanGoBack이 false면 이전으로 버튼이 보이지 않는다', () => {
    useStepStore.getState().reset();

    render(<StepHeader title="제목" description="설명" />);
    expect(screen.queryByRole('button', { name: '이전으로' })).not.toBeInTheDocument();
  });

  it('selectCanGoBack이 true면 이전으로 버튼이 보이고, 클릭 시 prevStep이 수행된다', async () => {
    const user = userEvent.setup();

    useStepStore.getState().reset();
    useStepStore.setState({
      currentStep: Step.UPLOAD,
      history: [
        {
          from: Step.SELECT_MODE,
          to: Step.UPLOAD,
          timestamp: new Date().toISOString(),
          reason: 'test'
        }
      ]
    });

    render(<StepHeader title="제목" description="설명" />);

    const backButton = screen.getByRole('button', { name: '이전으로' });
    await user.click(backButton);

    expect(useStepStore.getState().currentStep).toBe(Step.SELECT_MODE);
    expect(useStepStore.getState().history).toHaveLength(0);
  });
});
