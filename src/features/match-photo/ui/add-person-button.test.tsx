import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AddPersonButton } from './add-person-button';

describe('AddPersonButton', () => {
  it('canAdd=true면 활성화되고 클릭 시 onAdd를 호출한다', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<AddPersonButton canAdd={true} onAdd={onAdd} />);

    const button = screen.getByRole('button', { name: '사람 추가' });
    expect(button).toBeEnabled();

    await user.click(button);
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('canAdd=false면 비활성화된다', () => {
    render(<AddPersonButton canAdd={false} onAdd={() => {}} />);
    expect(screen.getByRole('button', { name: '사람 추가' })).toBeDisabled();
  });
});
