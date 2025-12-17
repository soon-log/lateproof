import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PhotoPreview } from './photo-preview';

describe('PhotoPreview', () => {
  it('이미지와 다시 선택 버튼이 렌더링된다', () => {
    render(<PhotoPreview previewUrl="https://example.com/photo.png" onRemove={() => {}} />);

    const image = screen.getByRole('img', { name: '업로드된 사진 미리보기' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/photo.png');

    expect(screen.getByRole('button', { name: '다시 선택' })).toBeInTheDocument();
  });

  it('다시 선택 클릭 시 onRemove를 호출한다', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(<PhotoPreview previewUrl="https://example.com/photo.png" onRemove={onRemove} />);
    await user.click(screen.getByRole('button', { name: '다시 선택' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
