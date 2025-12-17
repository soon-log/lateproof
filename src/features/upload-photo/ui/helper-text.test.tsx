import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HelperText } from './helper-text';

describe('HelperText', () => {
  it('팁 텍스트가 렌더링된다', () => {
    render(<HelperText />);

    expect(screen.getByText('💡 좋은 사진을 선택하는 팁')).toBeInTheDocument();
    expect(screen.getByText('• 배경이 깔끔하고 잘 나온 사진이 좋아요')).toBeInTheDocument();
    expect(screen.getByText('• 인물을 추가할 공간이 있는 사진을 선택해주세요')).toBeInTheDocument();
    expect(screen.getByText('• 너무 어둡거나 흐린 사진은 피해주세요')).toBeInTheDocument();
  });

  it('className을 병합한다', () => {
    const { container } = render(<HelperText className="mt-4" />);
    expect(container.firstChild).toHaveClass('mt-4');
  });
});
