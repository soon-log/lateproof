import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Mode, Step, useStepStore } from '@/entities/step';
import { SelectModePage } from './select-mode-page';

describe('SelectModePage', () => {
  it('초기에는 다음으로 버튼이 비활성화다', () => {
    useStepStore.getState().reset();

    render(<SelectModePage />);
    expect(screen.getByRole('button', { name: '다음으로' })).toBeDisabled();
  });

  it('모드를 선택하고 다음으로를 누르면 Store가 업데이트된다', async () => {
    const user = userEvent.setup();

    useStepStore.getState().reset();
    render(<SelectModePage />);

    await user.click(screen.getByRole('button', { name: '사진으로 만들기 선택' }));
    const nextButton = screen.getByRole('button', { name: '다음으로' });
    expect(nextButton).not.toBeDisabled();

    await user.click(nextButton);

    expect(useStepStore.getState().mode).toBe(Mode.PHOTO);
    expect(useStepStore.getState().currentStep).toBe(Step.UPLOAD);
  });
});
