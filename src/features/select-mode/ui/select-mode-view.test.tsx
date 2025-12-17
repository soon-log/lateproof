import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Mode } from '@/entities/step';
import { SelectModeView } from './select-mode-view';

describe('SelectModeView', () => {
  it('사진 카드 클릭 시 setSelectedMode(Mode.PHOTO)를 호출한다', async () => {
    const user = userEvent.setup();
    const setSelectedMode = vi.fn();

    render(<SelectModeView selectedMode={null} setSelectedMode={setSelectedMode} />);

    await user.click(screen.getByRole('button', { name: '사진으로 만들기 선택' }));
    expect(setSelectedMode).toHaveBeenCalledWith(Mode.PHOTO);
  });

  it('장소 카드 클릭 시 setSelectedMode(Mode.MAP)를 호출한다', async () => {
    const user = userEvent.setup();
    const setSelectedMode = vi.fn();

    render(<SelectModeView selectedMode={null} setSelectedMode={setSelectedMode} />);

    await user.click(screen.getByRole('button', { name: '장소로 만들기 선택' }));
    expect(setSelectedMode).toHaveBeenCalledWith(Mode.MAP);
  });

  it('selectedMode가 PHOTO면 선택됨 표시가 노출된다', () => {
    render(<SelectModeView selectedMode={Mode.PHOTO} setSelectedMode={() => {}} />);
    expect(screen.getByText('선택됨')).toBeInTheDocument();
  });
});
